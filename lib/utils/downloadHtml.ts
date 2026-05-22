import {
  FileExtension,
  HtmlTemplate,
  MimeType,
  UiLabel,
} from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";
import { slugify } from "./slugify";

const HTML_ESCAPE_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/&/g, "&amp;"],
  [/"/g, "&quot;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
];

function escapeHtmlAttribute(input: string): string {
  return HTML_ESCAPE_RULES.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    input,
  );
}

function buildHtmlDocument(article: IArticle): string {
  const titleText = article.metaTitle || article.title;
  return HtmlTemplate.DOCUMENT.replace(
    HtmlTemplate.TITLE_PLACEHOLDER,
    escapeHtmlAttribute(titleText),
  )
    .replace(
      HtmlTemplate.DESCRIPTION_PLACEHOLDER,
      escapeHtmlAttribute(article.metaDescription),
    )
    .replace(HtmlTemplate.BODY_PLACEHOLDER, article.html);
}

function resolveFilename(article: IArticle): string {
  const slug = slugify(article.title);
  return slug ? `${slug}${FileExtension.HTML}` : UiLabel.HTML_FALLBACK_FILENAME;
}

export function downloadArticleAsHtml(article: IArticle): void {
  const document = buildHtmlDocument(article);
  const filename = resolveFilename(article);
  const blob = new Blob([document], { type: MimeType.HTML });
  const url = URL.createObjectURL(blob);

  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
