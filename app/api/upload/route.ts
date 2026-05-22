import { NextResponse } from "next/server";
import { ApiErrorCode, ErrorMessage } from "@/lib/enums";
import type { ApiResponse, DocumentId } from "@/lib/types";

export const dynamic = "force-dynamic";

export interface UploadRouteData {
  documentId: DocumentId;
}

export async function POST(
  _request: Request,
): Promise<NextResponse<ApiResponse<UploadRouteData>>> {
  const response: ApiResponse<UploadRouteData> = {
    ok: false,
    error: {
      code: ApiErrorCode.NOT_IMPLEMENTED,
      message: ErrorMessage.NOT_IMPLEMENTED,
    },
  };

  return NextResponse.json(response, { status: 501 });
}
