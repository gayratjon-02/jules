export enum GoogleScope {
  DOCUMENTS_READONLY = "https://www.googleapis.com/auth/documents.readonly",
  DRIVE_READONLY = "https://www.googleapis.com/auth/drive.readonly",
}

export enum GoogleApiVersion {
  DOCS_V1 = "v1",
  DRIVE_V3 = "v3",
}

export enum GoogleEnvVar {
  SERVICE_ACCOUNT_EMAIL = "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  PRIVATE_KEY = "GOOGLE_PRIVATE_KEY",
  DOC_ID = "GOOGLE_DOC_ID",
}

export enum GoogleDriveQueryAlt {
  MEDIA = "media",
}

export enum GoogleDriveField {
  MIME_TYPE = "mimeType",
}

export enum GoogleResponseType {
  STREAM = "stream",
}
