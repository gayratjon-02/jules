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
const REGEX_CASE_INSENSITIVE_FLAG = "i";
const TRAILING_NEWLINE_REGEX = /\n$/;
const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;
const IMAGE_ANCHOR_REGEX = new RegExp(
  ParserPattern.IMAGE_ANCHOR_PATTERN,
  REGEX_CASE_INSENSITIVE_FLAG,
);
const ALT_TAG_REGEX = new RegExp(
  ParserPattern.ALT_TAG_PATTERN,
  REGEX_CASE_INSENSITIVE_FLAG,
);

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

const DRIVE_FILE_ID_REGEXES: readonly RegExp[] = [
  new RegExp(ParserPattern.DRIVE_FILE_ID_FILE_PATH_PATTERN),
  new RegExp(ParserPattern.DRIVE_FILE_ID_QUERY_PATTERN),
  new RegExp(ParserPattern.DRIVE_FILE_ID_D_PATH_PATTERN),
];

interface MetaExtraction {
  metaTitle: string;
  metaDescription: string;
  metaParagraphIndices: ReadonlySet<number>;
}

interface ImageLinkInfo {
  src: string;
  originalUrl: string;
  driveFileId: string | null;
  alt: string;
  altParagraphIndex: number | null;
}

interface SoleLinkInfo {
  url: string;
  anchorText: string;
}

type InlineObjectMap = Record<string, docs_v1.Schema$InlineObject>;
type ImageLinkMap = ReadonlyMap<number, ImageLinkInfo>;

export class ParserService {
  parse(raw: RawDocumentContent): IParsedDocument {
    try {
      const content = raw.body?.content ?? [];
      const inlineObjects: InlineObjectMap = raw.inlineObjects ?? {};

      const meta = this.extractMeta(content);
      const imageLinks = this.detectImageLinks(content, meta.metaParagraphIndices);
      const altTagIndices = this.collectAltTagIndices(imageLinks);

      const htmlSkip = this.union(meta.metaParagraphIndices, altTagIndices);
      const titleSkip = this.union(htmlSkip, new Set(imageLinks.keys()));

      const title = this.extractTitle(content, titleSkip);
      const html = this.buildHtml(content, inlineObjects, htmlSkip, imageLinks);
      const images = this.extractImages(inlineObjects, imageLinks);
      const links = this.extractLinks(content, imageLinks);

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

  private detectImageLinks(
    content: docs_v1.Schema$StructuralElement[],
    metaIndices: ReadonlySet<number>,
  ): ImageLinkMap {
    const result = new Map<number, ImageLinkInfo>();

    content.forEach((element, index) => {
      if (metaIndices.has(index)) return;

      const paragraph = element.paragraph;
      if (!paragraph) return;

      const imageLink = this.findImageLinkInParagraph(paragraph);
      if (!imageLink) return;

      const { alt, altParagraphIndex } = this.findAltTag(content, index);

      const driveFileId = this.extractDriveFileId(imageLink.url);
      const src = driveFileId
        ? this.toDriveThumbnailUrl(driveFileId)
        : imageLink.url;

      result.set(index, {
        src,
        originalUrl: imageLink.url,
        driveFileId,
        alt,
        altParagraphIndex,
      });
    });

    return result;
  }

  private findImageLinkInParagraph(
    paragraph: docs_v1.Schema$Paragraph,
  ): SoleLinkInfo | null {
    for (const element of paragraph.elements ?? []) {
      const textRun = element.textRun;
      if (!textRun) continue;

      const url = textRun.textStyle?.link?.url;
      if (!url) continue;

      const anchorText = (textRun.content ?? EMPTY)
        .replace(TRAILING_NEWLINE_REGEX, EMPTY)
        .trim();

      if (IMAGE_ANCHOR_REGEX.test(anchorText) || this.isGoogleDriveFileUrl(url)) {
        return { url, anchorText };
      }
    }
    return null;
  }

  private findAltTag(
    content: docs_v1.Schema$StructuralElement[],
    paragraphIndex: number,
  ): { alt: string; altParagraphIndex: number | null } {
    const currentText = this.getParagraphText(content[paragraphIndex]?.paragraph);
    const currentMatch = currentText.match(ALT_TAG_REGEX);
    if (currentMatch?.[1]) {
      return { alt: currentMatch[1].trim(), altParagraphIndex: null };
    }

    const nextIndex = paragraphIndex + 1;
    if (nextIndex >= content.length) {
      return { alt: EMPTY, altParagraphIndex: null };
    }

    const nextText = this.getParagraphText(content[nextIndex]?.paragraph);
    const nextMatch = nextText.match(ALT_TAG_REGEX);
    if (nextMatch?.[1]) {
      return { alt: nextMatch[1].trim(), altParagraphIndex: nextIndex };
    }

    return { alt: EMPTY, altParagraphIndex: null };
  }

  private collectAltTagIndices(imageLinks: ImageLinkMap): ReadonlySet<number> {
    const indices = new Set<number>();
    for (const info of imageLinks.values()) {
      if (info.altParagraphIndex !== null) {
        indices.add(info.altParagraphIndex);
      }
    }
    return indices;
  }

  private extractTitle(
    content: docs_v1.Schema$StructuralElement[],
    skipIndices: ReadonlySet<number>,
  ): string {
    for (let i = 0; i < content.length; i++) {
      if (skipIndices.has(i)) continue;
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
    skipIndices: ReadonlySet<number>,
    imageLinks: ImageLinkMap,
  ): string {
    const parts: string[] = [];

    content.forEach((element, index) => {
      if (skipIndices.has(index)) return;

      const paragraph = element.paragraph;
      if (!paragraph) return;

      const imageLink = imageLinks.get(index);
      if (imageLink) {
        parts.push(this.renderImageLink(imageLink));
        return;
      }

      const rendered = this.renderParagraph(paragraph, inlineObjects);
      if (rendered) parts.push(rendered);
    });

    return parts.join(NEWLINE);
  }

  private renderImageLink(info: ImageLinkInfo): string {
    const imgTag = `<${HtmlTag.IMG} src="${this.escapeHtml(info.src)}" alt="${this.escapeHtml(info.alt)}" loading="lazy" />`;
    return `<${HtmlTag.A} href="${this.escapeHtml(info.originalUrl)}" target="_blank" rel="noopener noreferrer">${imgTag}</${HtmlTag.A}>`;
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
    return `<${HtmlTag.IMG} src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" loading="lazy" />`;
  }

  private extractImages(
    inlineObjects: InlineObjectMap,
    imageLinks: ImageLinkMap,
  ): IImage[] {
    const images: IImage[] = [];

    for (const id of Object.keys(inlineObjects)) {
      const embedded = inlineObjects[id]?.inlineObjectProperties?.embeddedObject;
      const src = embedded?.imageProperties?.contentUri;
      if (!src) continue;

      const alt = embedded?.title ?? embedded?.description ?? EMPTY;
      images.push({
        src,
        originalUrl: src,
        driveFileId: null,
        alt,
        hasAltText: alt.trim().length > 0,
        isGoogleDriveHosted: this.isGoogleDriveUrl(src),
      });
    }

    for (const info of imageLinks.values()) {
      images.push({
        src: info.src,
        originalUrl: info.originalUrl,
        driveFileId: info.driveFileId,
        alt: info.alt,
        hasAltText: info.alt.trim().length > 0,
        isGoogleDriveHosted: true,
      });
    }

    return images;
  }

  private extractLinks(
    content: docs_v1.Schema$StructuralElement[],
    imageLinks: ImageLinkMap,
  ): ILink[] {
    const imageLinkUrls = new Set<string>();
    for (const info of imageLinks.values()) {
      imageLinkUrls.add(info.originalUrl);
    }

    const links: ILink[] = [];

    for (const element of content) {
      const paragraph = element.paragraph;
      if (!paragraph) continue;

      for (const paragraphElement of paragraph.elements ?? []) {
        const textRun = paragraphElement.textRun;
        const url = textRun?.textStyle?.link?.url;
        if (!url) continue;
        if (imageLinkUrls.has(url)) continue;

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

  private isGoogleDriveFileUrl(url: string): boolean {
    const lower = url.toLowerCase();
    return (
      lower.includes(ParserPattern.GOOGLE_DRIVE_DOMAIN) &&
      lower.includes(ParserPattern.GOOGLE_DRIVE_FILE_PATH)
    );
  }

  private extractDriveFileId(url: string): string | null {
    for (const regex of DRIVE_FILE_ID_REGEXES) {
      const match = url.match(regex);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  private toDriveThumbnailUrl(fileId: string): string {
    return ParserPattern.DRIVE_THUMBNAIL_URL_TEMPLATE.replace(
      ParserPattern.DRIVE_THUMBNAIL_PLACEHOLDER,
      fileId,
    );
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

  private union(a: ReadonlySet<number>, b: ReadonlySet<number>): ReadonlySet<number> {
    const merged = new Set<number>(a);
    for (const value of b) {
      merged.add(value);
    }
    return merged;
  }
}
