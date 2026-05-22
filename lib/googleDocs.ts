import { google, type docs_v1 } from "googleapis";

// Thin wrapper around the Google Docs / Drive APIs used by this project.
// Real implementation will live behind these exported helpers.

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY env var",
    );
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
}

export async function fetchDocument(
  documentId: string = process.env.GOOGLE_DOC_ID ?? "",
): Promise<docs_v1.Schema$Document> {
  // TODO: implement — call docs.documents.get and return the raw payload.
  void documentId;
  void getServiceAccountAuth;
  throw new Error("fetchDocument: not implemented");
}

export async function fetchDocumentAsHtml(
  documentId: string = process.env.GOOGLE_DOC_ID ?? "",
): Promise<string> {
  // TODO: implement — use Drive `files.export` with mimeType "text/html".
  void documentId;
  throw new Error("fetchDocumentAsHtml: not implemented");
}
