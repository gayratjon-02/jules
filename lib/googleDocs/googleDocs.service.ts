import { ErrorMessage } from "@/lib/enums";
import type { DocumentId, RawDocumentContent } from "@/lib/types";

export class GoogleDocsService {
  async fetchDocument(_documentId: DocumentId): Promise<RawDocumentContent> {
    throw new Error(ErrorMessage.NOT_IMPLEMENTED);
  }

  async fetchDocumentAsHtml(_documentId: DocumentId): Promise<RawDocumentContent> {
    throw new Error(ErrorMessage.NOT_IMPLEMENTED);
  }
}
