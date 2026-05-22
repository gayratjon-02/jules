import { ErrorMessage } from "@/lib/enums";
import type { IParsedDocument } from "@/lib/interfaces";
import type { RawDocumentContent } from "@/lib/types";

export class ParserService {
  parse(_html: RawDocumentContent): IParsedDocument {
    throw new Error(ErrorMessage.NOT_IMPLEMENTED);
  }
}
