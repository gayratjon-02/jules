const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const TRIM_HYPHENS_REGEX = /^-+|-+$/g;

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(TRIM_HYPHENS_REGEX, "");
}
