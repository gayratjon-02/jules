// Shared type definitions for the Scalerrs Assessment app.

export interface ArticleMeta {
  title: string;
  description: string;
  slug: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface ArticleHeading {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id: string;
}

export interface ArticleLink {
  href: string;
  text: string;
  isExternal: boolean;
}

export interface ArticleImage {
  src: string;
  alt: string;
}

export interface ParsedArticle {
  meta: ArticleMeta;
  html: string;
  headings: ArticleHeading[];
  links: ArticleLink[];
  images: ArticleImage[];
}

export type QualitySeverity = "info" | "warning" | "error";

export interface QualityIssue {
  id: string;
  severity: QualitySeverity;
  message: string;
  // TODO: extend with `location` (heading id, paragraph index, etc.)
}

export interface QualityReport {
  score: number; // 0-100
  issues: QualityIssue[];
}

export interface DocumentResponse {
  article: ParsedArticle;
  quality: QualityReport;
}

export interface UploadResponse {
  ok: boolean;
  documentId?: string;
  error?: string;
}
