import * as cheerio from "cheerio";
import type {
  ArticleHeading,
  ArticleImage,
  ArticleLink,
  ArticleMeta,
  ParsedArticle,
} from "@/types";

const WORDS_PER_MINUTE = 220;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function parseArticle(html: string): ParsedArticle {
  // TODO: clean Google-exported HTML (drop inline styles, normalize headings,
  // unwrap container divs) and build the structured payload below.
  const $ = cheerio.load(html);

  const meta: ArticleMeta = {
    title: "",
    description: "",
    slug: "",
    wordCount: 0,
    readingTimeMinutes: 0,
  };

  const headings: ArticleHeading[] = [];
  const links: ArticleLink[] = [];
  const images: ArticleImage[] = [];

  void $;
  void slugify;
  void WORDS_PER_MINUTE;

  return {
    meta,
    html: "",
    headings,
    links,
    images,
  };
}
