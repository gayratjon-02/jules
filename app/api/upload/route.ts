import { NextResponse } from "next/server";
import type { UploadResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse<UploadResponse>> {
  // TODO: accept multipart/form-data, push the file to Drive (or local
  // storage), and return the resulting document id.
  void request;

  return NextResponse.json(
    {
      ok: false,
      error: "upload route not implemented",
    },
    { status: 501 },
  );
}
