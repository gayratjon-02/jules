"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ApiErrorCode,
  ApiQueryParam,
  ApiRoute,
  ErrorMessage,
  FetchErrorName,
} from "@/lib/enums";
import type {
  ApiError,
  ApiResponse,
  DocumentRouteData,
} from "@/lib/types";

interface UseDocumentResult {
  data: DocumentRouteData | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

function buildUrl(docId: string | undefined): string {
  if (!docId) return ApiRoute.DOCUMENT;
  return `${ApiRoute.DOCUMENT}?${ApiQueryParam.DOC_ID}=${encodeURIComponent(docId)}`;
}

export function useDocument(docId?: string): UseDocumentResult {
  const [data, setData] = useState<DocumentRouteData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(buildUrl(docId), {
          signal: controller.signal,
        });
        const body = (await response.json()) as ApiResponse<DocumentRouteData>;

        if (controller.signal.aborted) return;

        if (body.success) {
          setData(body.data);
          setError(null);
        } else {
          setData(null);
          setError(body.error);
        }
      } catch (err) {
        if (err instanceof Error && err.name === FetchErrorName.ABORT) return;
        setData(null);
        setError({
          code: ApiErrorCode.UNKNOWN_ERROR,
          message: ErrorMessage.UNKNOWN_ERROR,
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [refreshIndex, docId]);

  const refetch = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  return { data, isLoading, error, refetch };
}
