export enum ErrorMessage {
  AUTH_CONFIG_MISSING = "Google service account credentials are not configured",
  DOC_ID_REQUIRED = "Document id is required",
  DOC_FETCH_FAILED = "Failed to fetch document from Google Docs",
  DOC_PARSE_FAILED = "Failed to parse document",
  UPLOAD_FAILED = "Failed to upload document",
  NOT_IMPLEMENTED = "Not implemented yet",
}

export enum ApiErrorCode {
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  AUTH_CONFIG_MISSING = "AUTH_CONFIG_MISSING",
  DOC_ID_REQUIRED = "DOC_ID_REQUIRED",
  DOC_FETCH_FAILED = "DOC_FETCH_FAILED",
  DOC_PARSE_FAILED = "DOC_PARSE_FAILED",
  UPLOAD_FAILED = "UPLOAD_FAILED",
}
