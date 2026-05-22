import { NextResponse } from "next/server";
import { fetchDocumentAsHtml } from "@/lib/googleDocs";
import { parseArticle } from "@/lib/parser";
import { checkArticle } from "@/lib/qualityChecker";
import type { DocumentResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  // TODO: read `id` from the query string, fall back to GOOGLE_DOC_ID,
  // pipe through fetch → parse → quality check and return DocumentResponse.
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("id") ?? process.env.GOOGLE_DOC_ID ?? "";

  void fetchDocumentAsHtml;
  void parseArticle;
  void checkArticle;

  const payload: DocumentResponse | { error: string } = {
    error: `document route not implemented (requested id: ${documentId || "none"})`,
  };

  return NextResponse.json(payload, { status: 501 });
}
