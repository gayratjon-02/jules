import { google, type docs_v1 } from "googleapis";
import {
  ErrorMessage,
  GoogleApiVersion,
  GoogleEnvVar,
  GoogleScope,
} from "@/lib/enums";
import type { DocumentId, RawDocumentContent } from "@/lib/types";

const PRIVATE_KEY_NEWLINE_PATTERN = /\\n/g;
const PRIVATE_KEY_NEWLINE_REPLACEMENT = "\n";

export class GoogleDocsService {
  private readonly docs: docs_v1.Docs;

  constructor() {
    const email = process.env[GoogleEnvVar.SERVICE_ACCOUNT_EMAIL];
    const rawPrivateKey = process.env[GoogleEnvVar.PRIVATE_KEY];

    if (!email || !rawPrivateKey) {
      throw new Error(ErrorMessage.AUTH_CONFIG_MISSING);
    }

    const privateKey = rawPrivateKey.replace(
      PRIVATE_KEY_NEWLINE_PATTERN,
      PRIVATE_KEY_NEWLINE_REPLACEMENT,
    );

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: [GoogleScope.DOCUMENTS_READONLY],
    });

    this.docs = google.docs({ version: GoogleApiVersion.DOCS_V1, auth });
  }

  async fetchDocument(docId: DocumentId): Promise<RawDocumentContent> {
    if (!docId) {
      throw new Error(ErrorMessage.DOC_ID_REQUIRED);
    }

    let response;
    try {
      response = await this.docs.documents.get({ documentId: docId });
    } catch (error) {
      throw new Error(ErrorMessage.DOC_FETCH_FAILED, { cause: error });
    }

    if (!response.data) {
      throw new Error(ErrorMessage.DOC_FETCH_FAILED);
    }

    return response.data;
  }
}
