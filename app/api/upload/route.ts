import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ApiErrorCode,
  ErrorMessage,
  HttpStatus,
  UploadDestination,
  UploadTiming,
} from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";
import type { ApiResponse, UploadRouteData } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UploadPayload = { article: IArticle };

function isValidUploadPayload(body: unknown): body is UploadPayload {
  if (!body || typeof body !== "object") return false;
  const candidate = body as { article?: unknown };
  if (!candidate.article || typeof candidate.article !== "object") return false;
  const article = candidate.article as Record<string, unknown>;
  return (
    typeof article.title === "string" &&
    typeof article.html === "string" &&
    typeof article.metaTitle === "string" &&
    typeof article.metaDescription === "string"
  );
}

function delay(ms: UploadTiming): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function invalidPayloadResponse(): NextResponse<ApiResponse<UploadRouteData>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ApiErrorCode.UPLOAD_PAYLOAD_INVALID,
        message: ErrorMessage.UPLOAD_PAYLOAD_INVALID,
      },
    },
    { status: HttpStatus.BAD_REQUEST },
  );
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<UploadRouteData>>> {
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return invalidPayloadResponse();
  }

  if (!isValidUploadPayload(parsedBody)) {
    return invalidPayloadResponse();
  }

  await delay(UploadTiming.SIMULATED_DELAY_MS);

  const { article } = parsedBody;

  return NextResponse.json(
    {
      success: true,
      data: {
        uploadId: randomUUID(),
        uploadedAt: new Date().toISOString(),
        destination: UploadDestination.WORDPRESS_SIMULATED,
        article: {
          title: article.title,
          metaTitle: article.metaTitle,
        },
      },
    },
    { status: HttpStatus.OK },
  );
}
