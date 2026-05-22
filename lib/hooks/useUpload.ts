"use client";

import { useCallback, useState } from "react";
import {
  ApiErrorCode,
  ApiRoute,
  ErrorMessage,
  HttpHeader,
  HttpMethod,
  MimeType,
} from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";
import type {
  ApiError,
  ApiResponse,
  UploadRouteData,
} from "@/lib/types";

interface UseUploadResult {
  upload: (article: IArticle) => Promise<void>;
  reset: () => void;
  isUploading: boolean;
  uploadError: ApiError | null;
  uploadResult: UploadRouteData | null;
}

export function useUpload(): UseUploadResult {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<ApiError | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadRouteData | null>(null);

  const reset = useCallback((): void => {
    setIsUploading(false);
    setUploadError(null);
    setUploadResult(null);
  }, []);

  const upload = useCallback(async (article: IArticle): Promise<void> => {
    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const response = await fetch(ApiRoute.UPLOAD, {
        method: HttpMethod.POST,
        headers: { [HttpHeader.CONTENT_TYPE]: MimeType.JSON },
        body: JSON.stringify({ article }),
      });
      const body = (await response.json()) as ApiResponse<UploadRouteData>;

      if (body.success) {
        setUploadResult(body.data);
      } else {
        setUploadError(body.error);
      }
    } catch {
      setUploadError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: ErrorMessage.UNKNOWN_ERROR,
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, reset, isUploading, uploadError, uploadResult };
}
