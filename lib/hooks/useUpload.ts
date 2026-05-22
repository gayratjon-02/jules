"use client";

import { useCallback, useState } from "react";
import {
  ApiErrorCode,
  ApiRoute,
  ErrorMessage,
  HttpMethod,
  UploadField,
} from "@/lib/enums";
import type {
  ApiError,
  ApiResponse,
  UploadRouteData,
} from "@/lib/types";

interface UseUploadResult {
  upload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadError: ApiError | null;
  uploadSuccess: boolean;
}

export function useUpload(): UseUploadResult {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<ApiError | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const upload = useCallback(async (file: File): Promise<void> => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append(UploadField.FILE, file);

      const response = await fetch(ApiRoute.UPLOAD, {
        method: HttpMethod.POST,
        body: formData,
      });
      const body = (await response.json()) as ApiResponse<UploadRouteData>;

      if (body.success) {
        setUploadSuccess(true);
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

  return { upload, isUploading, uploadError, uploadSuccess };
}
