export enum ErrorMessage {
  AUTH_CONFIG_MISSING = "Google service account credentials are not configured",
  DOC_ID_REQUIRED = "Document id is required",
  DOC_FETCH_FAILED = "Failed to fetch document from Google Docs",
  DOC_PARSE_FAILED = "Failed to parse document",
  UPLOAD_FAILED = "Failed to upload document",
  UPLOAD_PAYLOAD_INVALID = "Upload payload is missing required article fields",
  IMAGE_PROXY_INVALID_ID = "Invalid Drive file id",
  IMAGE_PROXY_FETCH_FAILED = "Failed to fetch image from Google Drive",
  DOC_ID_INVALID_FORMAT = "Document id has an invalid format",
  NOT_IMPLEMENTED = "Not implemented yet",
  UNKNOWN_ERROR = "Unexpected error",
}

export enum ApiErrorCode {
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  AUTH_CONFIG_MISSING = "AUTH_CONFIG_MISSING",
  DOC_ID_REQUIRED = "DOC_ID_REQUIRED",
  DOC_FETCH_FAILED = "DOC_FETCH_FAILED",
  DOC_PARSE_FAILED = "DOC_PARSE_FAILED",
  UPLOAD_FAILED = "UPLOAD_FAILED",
  UPLOAD_PAYLOAD_INVALID = "UPLOAD_PAYLOAD_INVALID",
  IMAGE_PROXY_INVALID_ID = "IMAGE_PROXY_INVALID_ID",
  IMAGE_PROXY_FETCH_FAILED = "IMAGE_PROXY_FETCH_FAILED",
  DOC_ID_INVALID_FORMAT = "DOC_ID_INVALID_FORMAT",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
