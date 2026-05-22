import { NextResponse } from "next/server";
import { ApiErrorCode, ErrorMessage, HttpStatus } from "@/lib/enums";
import type { ApiResponse, UploadRouteData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  _request: Request,
): Promise<NextResponse<ApiResponse<UploadRouteData>>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ApiErrorCode.NOT_IMPLEMENTED,
        message: ErrorMessage.NOT_IMPLEMENTED,
      },
    },
    { status: HttpStatus.NOT_IMPLEMENTED },
  );
}
