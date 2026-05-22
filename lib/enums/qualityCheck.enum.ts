export enum QualityCheckId {
  IMAGE_COUNT = "IMAGE_COUNT",
  IMAGE_HOSTING = "IMAGE_HOSTING",
  IMAGE_ALT_TAGS = "IMAGE_ALT_TAGS",
  LINK_COUNT = "LINK_COUNT",
  ARTICLE_TITLE = "ARTICLE_TITLE",
  META_TITLE = "META_TITLE",
  META_DESCRIPTION = "META_DESCRIPTION",
  ARTICLE_HTML = "ARTICLE_HTML",
}

export enum QualityMessage {
  IMAGE_COUNT_PASS = "{count} images in expected range",
  IMAGE_COUNT_TOO_FEW = "Only {count} images — minimum is {min}",
  IMAGE_COUNT_TOO_MANY = "{count} images — recommended maximum is {max}",

  IMAGE_HOSTING_PASS = "All images hosted on Google Drive",
  IMAGE_HOSTING_FAIL = "{count} image(s) not hosted on Google Drive",

  IMAGE_ALT_PASS = "All images have alt text",
  IMAGE_ALT_FAIL = "{count} image(s) missing alt text",

  LINK_COUNT_PASS = "{count} product links in expected range",
  LINK_COUNT_TOO_FEW = "Only {count} product links — minimum is {min}",
  LINK_COUNT_TOO_MANY = "{count} product links — recommended maximum is {max}",

  ARTICLE_TITLE_PASS = "Article title is set",
  ARTICLE_TITLE_FAIL = "Article title is missing",

  META_TITLE_PASS = "Meta title is set",
  META_TITLE_FAIL = "Meta title is missing",

  META_DESCRIPTION_PASS = "Meta description is set",
  META_DESCRIPTION_FAIL = "Meta description is missing",

  ARTICLE_HTML_PASS = "Article body has {count} paragraphs",
  ARTICLE_HTML_FAIL = "Article body has only {count} paragraphs — minimum is {min}",
}
