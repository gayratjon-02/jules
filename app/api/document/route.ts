import { NextResponse } from "next/server";
import { ApiErrorCode, ErrorMessage } from "@/lib/enums";
import type { IParsedDocument, IQualityReport } from "@/lib/interfaces";
import type { ApiResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export interface DocumentRouteData {
  document: IParsedDocument;
  quality: IQualityReport;
}

export async function GET(
  _request: Request,
): Promise<NextResponse<ApiResponse<DocumentRouteData>>> {
  const response: ApiResponse<DocumentRouteData> = {
    ok: false,
    error: {
      code: ApiErrorCode.NOT_IMPLEMENTED,
      message: ErrorMessage.NOT_IMPLEMENTED,
    },
  };

  return NextResponse.json(response, { status: 501 });
}
