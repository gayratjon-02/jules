import type { docs_v1 } from "googleapis";
import {
  DocsStyleType,
  ErrorMessage,
  HtmlTag,
  ParserPattern,
} from "@/lib/enums";
import type {
  IImage,
  ILink,
  IParsedDocument,
} from "@/lib/interfaces";
import type { RawDocumentContent } from "@/lib/types";

const EMPTY = "";
const NEWLINE = "\n";
const TRAILING_NEWLINE_REGEX = /\n$/;
const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;

const HTML_ESCAPE_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&#39;"],
];

const STYLE_TO_TAG: Partial<Record<DocsStyleType, HtmlTag>> = {
  [DocsStyleType.TITLE]: HtmlTag.H1,
  [DocsStyleType.SUBTITLE]: HtmlTag.H2,
  [DocsStyleType.HEADING_1]: HtmlTag.H1,
  [DocsStyleType.HEADING_2]: HtmlTag.H2,
  [DocsStyleType.HEADING_3]: HtmlTag.H3,
  [DocsStyleType.HEADING_4]: HtmlTag.H4,
  [DocsStyleType.HEADING_5]: HtmlTag.H5,
  [DocsStyleType.HEADING_6]: HtmlTag.H6,
  [DocsStyleType.NORMAL_TEXT]: HtmlTag.P,
};

const TITLE_STYLES: ReadonlySet<DocsStyleType> = new Set([
  DocsStyleType.TITLE,
  DocsStyleType.HEADING_1,
]);

const GOOGLE_DRIVE_DOMAINS: readonly ParserPattern[] = [
  ParserPattern.GOOGLE_DRIVE_DOMAIN,
  ParserPattern.GOOGLE_USERCONTENT_DOMAIN,
];

const PRODUCT_URL_PATTERNS: readonly ParserPattern[] = [
  ParserPattern.PRODUCT_URL_SEGMENT,
  ParserPattern.PRODUCTS_URL_SEGMENT,
  ParserPattern.SHOP_URL_SEGMENT,
  ParserPattern.P_URL_SEGMENT,
  ParserPattern.ITEM_URL_SEGMENT,
];

interface MetaExtraction {
  metaTitle: string;
  metaDescription: string;
  metaParagraphIndices: ReadonlySet<number>;
}

type InlineObjectMap = Record<string, docs_v1.Schema$InlineObject>;

export class ParserService {
  parse(raw: RawDocumentContent): IParsedDocument {
    try {
      const content = raw.body?.content ?? [];
      const inlineObjects: InlineObjectMap = raw.inlineObjects ?? {};

      const meta = this.extractMeta(content);
      const title = this.extractTitle(content, meta.metaParagraphIndices);
      const html = this.buildHtml(content, inlineObjects, meta.metaParagraphIndices);
      const images = this.extractImages(inlineObjects);
      const links = this.extractLinks(content);

      return {
        article: {
          title,
          html,
          metaTitle: meta.metaTitle,
          metaDescription: meta.metaDescription,
        },
        images,
        links,
      };
    } catch (error) {
      throw new Error(ErrorMessage.DOC_PARSE_FAILED, { cause: error });
    }
  }

  private extractMeta(
    content: docs_v1.Schema$StructuralElement[],
  ): MetaExtraction {
    let metaTitle = EMPTY;
    let metaDescription = EMPTY;
    const metaParagraphIndices = new Set<number>();

    content.forEach((element, index) => {
      const text = this.getParagraphText(element.paragraph);
      if (!text) return;

      const lower = text.toLowerCase().trimStart();

      if (lower.startsWith(ParserPattern.META_TITLE_PREFIX)) {
        metaTitle = this.stripPrefix(text, ParserPattern.META_TITLE_PREFIX);
        metaParagraphIndices.add(index);
        return;
      }

      if (lower.startsWith(ParserPattern.META_DESC_PREFIX)) {
        metaDescription = this.stripPrefix(text, ParserPattern.META_DESC_PREFIX);
        metaParagraphIndices.add(index);
      }
    });

    return { metaTitle, metaDescription, metaParagraphIndices };
  }

  private extractTitle(
    content: docs_v1.Schema$StructuralElement[],
    metaParagraphIndices: ReadonlySet<number>,
  ): string {
    for (let i = 0; i < content.length; i++) {
      if (metaParagraphIndices.has(i)) continue;
      const paragraph = content[i].paragraph;
      if (!paragraph) continue;

      const style = paragraph.paragraphStyle?.namedStyleType as DocsStyleType | undefined;
      if (style && TITLE_STYLES.has(style)) {
        return this.getParagraphText(paragraph).trim();
      }
    }
    return EMPTY;
  }

  private buildHtml(
    content: docs_v1.Schema$StructuralElement[],
    inlineObjects: InlineObjectMap,
    metaParagraphIndices: ReadonlySet<number>,
  ): string {
    const parts: string[] = [];

    content.forEach((element, index) => {
      if (metaParagraphIndices.has(index)) return;

      const paragraph = element.paragraph;
      if (!paragraph) return;

      const rendered = this.renderParagraph(paragraph, inlineObjects);
      if (rendered) parts.push(rendered);
    });

    return parts.join(NEWLINE);
  }

  private renderParagraph(
    paragraph: docs_v1.Schema$Paragraph,
    inlineObjects: InlineObjectMap,
  ): string {
    const style = paragraph.paragraphStyle?.namedStyleType as DocsStyleType | undefined;
    const tag = (style && STYLE_TO_TAG[style]) ?? HtmlTag.P;

    const inner = (paragraph.elements ?? [])
      .map((element) => this.renderElement(element, inlineObjects))
      .join(EMPTY)
      .trim();

    if (!inner) return EMPTY;

    return `<${tag}>${inner}</${tag}>`;
  }

  private renderElement(
    element: docs_v1.Schema$ParagraphElement,
    inlineObjects: InlineObjectMap,
  ): string {
    if (element.textRun) {
      return this.renderTextRun(element.textRun);
    }
    if (element.inlineObjectElement) {
      return this.renderInlineObject(element.inlineObjectElement, inlineObjects);
    }
    return EMPTY;
  }

  private renderTextRun(textRun: docs_v1.Schema$TextRun): string {
    const raw = (textRun.content ?? EMPTY).replace(TRAILING_NEWLINE_REGEX, EMPTY);
    if (!raw) return EMPTY;

    const escaped = this.escapeHtml(raw);
    const linkUrl = textRun.textStyle?.link?.url;

    if (linkUrl) {
      return `<${HtmlTag.A} href="${this.escapeHtml(linkUrl)}">${escaped}</${HtmlTag.A}>`;
    }

    return escaped;
  }

  private renderInlineObject(
    element: docs_v1.Schema$InlineObjectElement,
    inlineObjects: InlineObjectMap,
  ): string {
    const id = element.inlineObjectId;
    if (!id) return EMPTY;

    const embedded = inlineObjects[id]?.inlineObjectProperties?.embeddedObject;
    const src = embedded?.imageProperties?.contentUri;
    if (!src) return EMPTY;

    const alt = embedded?.title ?? embedded?.description ?? EMPTY;
    return `<${HtmlTag.IMG} src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" />`;
  }

  private extractImages(inlineObjects: InlineObjectMap): IImage[] {
    const images: IImage[] = [];

    for (const id of Object.keys(inlineObjects)) {
      const embedded = inlineObjects[id]?.inlineObjectProperties?.embeddedObject;
      const src = embedded?.imageProperties?.contentUri;
      if (!src) continue;

      const alt = embedded?.title ?? embedded?.description ?? EMPTY;
      images.push({
        src,
        alt,
        hasAltText: alt.trim().length > 0,
        isGoogleDriveHosted: this.isGoogleDriveUrl(src),
      });
    }

    return images;
  }

  private extractLinks(content: docs_v1.Schema$StructuralElement[]): ILink[] {
    const links: ILink[] = [];

    for (const element of content) {
      const paragraph = element.paragraph;
      if (!paragraph) continue;

      for (const paragraphElement of paragraph.elements ?? []) {
        const textRun = paragraphElement.textRun;
        const url = textRun?.textStyle?.link?.url;
        if (!url) continue;

        const anchorText = (textRun?.content ?? EMPTY)
          .replace(TRAILING_NEWLINE_REGEX, EMPTY)
          .trim();

        links.push({
          href: url,
          anchorText,
          isExternal: HTTP_PROTOCOL_REGEX.test(url),
          isProductLink: this.isProductUrl(url),
        });
      }
    }

    return links;
  }

  private getParagraphText(paragraph?: docs_v1.Schema$Paragraph): string {
    if (!paragraph) return EMPTY;
    return (paragraph.elements ?? [])
      .map((element) => element.textRun?.content ?? EMPTY)
      .join(EMPTY)
      .replace(TRAILING_NEWLINE_REGEX, EMPTY);
  }

  private stripPrefix(text: string, prefix: ParserPattern): string {
    const trimmed = text.trimStart();
    return trimmed.substring(prefix.length).trim();
  }

  private isGoogleDriveUrl(url: string): boolean {
    const lower = url.toLowerCase();
    return GOOGLE_DRIVE_DOMAINS.some((domain) => lower.includes(domain));
  }

  private isProductUrl(url: string): boolean {
    const lower = url.toLowerCase();
    return PRODUCT_URL_PATTERNS.some((pattern) => lower.includes(pattern));
  }

  private escapeHtml(input: string): string {
    return HTML_ESCAPE_RULES.reduce(
      (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
      input,
    );
  }
}
