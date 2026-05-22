import { NextResponse } from "next/server";
import {
  ApiErrorCode,
  ApiQueryParam,
  ErrorMessage,
  HttpStatus,
  ParserPattern,
} from "@/lib/enums";
import { GoogleDocsService } from "@/lib/googleDocs";
import { ParserService } from "@/lib/parser";
import { QualityCheckerService } from "@/lib/qualityChecker";
import type {
  ApiResponse,
  DocumentRouteData,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DOC_ID_REGEX = new RegExp(ParserPattern.DOC_URL_RAW_ID_PATTERN);

interface ErrorMapping {
  code: ApiErrorCode;
  status: HttpStatus;
}

const DEFAULT_ERROR_MAPPING: ErrorMapping = {
  code: ApiErrorCode.UNKNOWN_ERROR,
  status: HttpStatus.INTERNAL_SERVER_ERROR,
};

const ERROR_MAPPINGS: Readonly<Partial<Record<ErrorMessage, ErrorMapping>>> = {
  [ErrorMessage.AUTH_CONFIG_MISSING]: {
    code: ApiErrorCode.AUTH_CONFIG_MISSING,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorMessage.DOC_ID_REQUIRED]: {
    code: ApiErrorCode.DOC_ID_REQUIRED,
    status: HttpStatus.BAD_REQUEST,
  },
  [ErrorMessage.DOC_ID_INVALID_FORMAT]: {
    code: ApiErrorCode.DOC_ID_INVALID_FORMAT,
    status: HttpStatus.BAD_REQUEST,
  },
  [ErrorMessage.DOC_FETCH_FAILED]: {
    code: ApiErrorCode.DOC_FETCH_FAILED,
    status: HttpStatus.BAD_GATEWAY,
  },
  [ErrorMessage.DOC_PARSE_FAILED]: {
    code: ApiErrorCode.DOC_PARSE_FAILED,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorMessage.UPLOAD_FAILED]: {
    code: ApiErrorCode.UPLOAD_FAILED,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorMessage.NOT_IMPLEMENTED]: {
    code: ApiErrorCode.NOT_IMPLEMENTED,
    status: HttpStatus.NOT_IMPLEMENTED,
  },
};

interface ResolvedError {
  mapping: ErrorMapping;
  message: ErrorMessage;
}

function resolveError(error: unknown): ResolvedError {
  if (error instanceof Error) {
    const candidate = error.message as ErrorMessage;
    const mapping = ERROR_MAPPINGS[candidate];
    if (mapping) {
      return { mapping, message: candidate };
    }
  }
  return { mapping: DEFAULT_ERROR_MAPPING, message: ErrorMessage.UNKNOWN_ERROR };
}

function resolveDocId(request: Request): string {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get(ApiQueryParam.DOC_ID);

  if (docId === null || docId.length === 0) {
    throw new Error(ErrorMessage.DOC_ID_REQUIRED);
  }

  if (!DOC_ID_REGEX.test(docId)) {
    throw new Error(ErrorMessage.DOC_ID_INVALID_FORMAT);
  }

  return docId;
}

export async function GET(
  request: Request,
): Promise<NextResponse<ApiResponse<DocumentRouteData>>> {
  try {
    const docId = resolveDocId(request);

    const googleDocs = new GoogleDocsService();
    const parser = new ParserService();
    const checker = new QualityCheckerService();

    const raw = await googleDocs.fetchDocument(docId);
    const parsed = parser.parse(raw);
    const report = checker.check(parsed);

    return NextResponse.json(
      {
        success: true,
        data: { parsed, report },
      },
      { status: HttpStatus.OK },
    );
  } catch (error) {
    const { mapping, message } = resolveError(error);
    return NextResponse.json(
      {
        success: false,
        error: { code: mapping.code, message },
      },
      { status: mapping.status },
    );
  }
}
