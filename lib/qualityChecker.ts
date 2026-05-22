import type { ParsedArticle, QualityIssue, QualityReport } from "@/types";

// Runs a set of editorial / SEO checks against a parsed article and returns
// a normalized report.

export function checkArticle(article: ParsedArticle): QualityReport {
  // TODO: implement checks — title length, missing meta description,
  // heading hierarchy, alt-text coverage, broken/external link ratio, etc.
  const issues: QualityIssue[] = [];
  void article;

  return {
    score: 100,
    issues,
  };
}
