import { ParserPattern } from "@/lib/enums";

const REGEX_CASE_INSENSITIVE_FLAG = "i";

const DOC_URL_REGEXES: readonly RegExp[] = [
  new RegExp(ParserPattern.DOC_URL_FULL_PATTERN, REGEX_CASE_INSENSITIVE_FLAG),
  new RegExp(ParserPattern.DOC_URL_RAW_ID_PATTERN),
];

export function extractDocIdFromUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  for (const regex of DOC_URL_REGEXES) {
    const match = trimmed.match(regex);
    if (match?.[1]) return match[1];
  }

  return null;
}
