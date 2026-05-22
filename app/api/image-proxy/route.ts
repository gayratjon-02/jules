import { NextResponse } from "next/server";
import {
  ApiErrorCode,
  ApiQueryParam,
  CacheControl,
  ErrorMessage,
  HttpHeader,
  HttpStatus,
} from "@/lib/enums";
import { GoogleDriveService } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";

const FILE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

interface ProxyError {
  code: ApiErrorCode;
  message: string;
}

function jsonError(error: ProxyError, status: HttpStatus): NextResponse {
  return NextResponse.json({ success: false, error }, { status });
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get(ApiQueryParam.FILE_ID);

  if (!fileId || !FILE_ID_PATTERN.test(fileId)) {
    return jsonError(
      {
        code: ApiErrorCode.IMAGE_PROXY_INVALID_ID,
        message: ErrorMessage.IMAGE_PROXY_INVALID_ID,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  try {
    const driveService = new GoogleDriveService();
    const { stream, mimeType } = await driveService.fetchFile(fileId);

    return new Response(stream, {
      status: HttpStatus.OK,
      headers: {
        [HttpHeader.CONTENT_TYPE]: mimeType,
        [HttpHeader.CACHE_CONTROL]: CacheControl.IMAGE_CACHE,
      },
    });
  } catch {
    return jsonError(
      {
        code: ApiErrorCode.IMAGE_PROXY_FETCH_FAILED,
        message: ErrorMessage.IMAGE_PROXY_FETCH_FAILED,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}
