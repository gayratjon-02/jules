export enum SuccessMessage {
  DOCUMENT_LOADED = "Document loaded successfully",
  DOCUMENT_UPLOADED = "Document uploaded successfully",
  QUALITY_CHECK_PASSED = "Quality check passed",
}

export enum InfoMessage {
  LOADING_DOCUMENT = "Loading document…",
  NO_DOCUMENT_LOADED = "No document loaded yet",
  NO_ISSUES_FOUND = "No quality issues found",
  EMPTY_META = "—",
}

export enum UiLabel {
  APP_TITLE = "Scalerrs Assessment",
  APP_SUBTITLE = "Preview a Google Doc as an article and inspect its quality signals.",
  ARTICLE_PREVIEW_TITLE = "Article preview",
  META_PANEL_TITLE = "Meta",
  QUALITY_PANEL_TITLE = "Quality",
  META_FIELD_TITLE = "Title",
  META_FIELD_DESCRIPTION = "Description",
  UPLOAD_BUTTON_IDLE = "Upload document",
  UPLOAD_BUTTON_BUSY = "Uploading…",
  QUALITY_SUMMARY_PASSED = "passed",
  QUALITY_SUMMARY_WARNINGS = "warnings",
  QUALITY_SUMMARY_FAILED = "failed",
  QUALITY_CHECK_IMAGE_COUNT = "Image count",
  QUALITY_CHECK_IMAGE_HOSTING = "Image hosting",
  QUALITY_CHECK_IMAGE_ALT_TAGS = "Image alt tags",
  QUALITY_CHECK_LINK_COUNT = "Product link count",
  QUALITY_CHECK_ARTICLE_TITLE = "Article title",
  QUALITY_CHECK_META_TITLE = "Meta title",
  QUALITY_CHECK_META_DESCRIPTION = "Meta description",
  QUALITY_CHECK_ARTICLE_HTML = "Article body",
}
