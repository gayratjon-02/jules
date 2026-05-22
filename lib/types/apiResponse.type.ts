import type { ApiErrorCode } from "@/lib/enums";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
};

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
