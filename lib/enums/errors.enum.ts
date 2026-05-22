export enum ErrorMessage {
  MISSING_GOOGLE_CREDENTIALS = "Missing Google service account credentials",
  MISSING_DOCUMENT_ID = "Document id is required",
  DOCUMENT_FETCH_FAILED = "Failed to fetch document",
  DOCUMENT_PARSE_FAILED = "Failed to parse document",
  UPLOAD_FAILED = "Failed to upload document",
  NOT_IMPLEMENTED = "Not implemented yet",
}

export enum ApiErrorCode {
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  MISSING_DOCUMENT_ID = "MISSING_DOCUMENT_ID",
  MISSING_GOOGLE_CREDENTIALS = "MISSING_GOOGLE_CREDENTIALS",
  DOCUMENT_FETCH_FAILED = "DOCUMENT_FETCH_FAILED",
  DOCUMENT_PARSE_FAILED = "DOCUMENT_PARSE_FAILED",
  UPLOAD_FAILED = "UPLOAD_FAILED",
}
