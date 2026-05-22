import { ErrorMessage } from "@/lib/enums";
import type { IParsedDocument, IQualityReport } from "@/lib/interfaces";

export class QualityCheckerService {
  check(_document: IParsedDocument): IQualityReport {
    throw new Error(ErrorMessage.NOT_IMPLEMENTED);
  }
}
