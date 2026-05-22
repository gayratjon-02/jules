import type { ApiErrorCode } from "@/lib/enums";
import type { IParsedDocument, IQualityReport } from "@/lib/interfaces";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export type DocumentRouteData = {
  parsed: IParsedDocument;
  report: IQualityReport;
};
