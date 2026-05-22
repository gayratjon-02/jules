"use client";

import { ArticlePreview } from "@/lib/components/ArticlePreview";
import { AlertIcon, RefreshIcon } from "@/lib/components/icons";
import { MetaPanel } from "@/lib/components/MetaPanel";
import { QualityPanel } from "@/lib/components/QualityPanel";
import { UploadButton } from "@/lib/components/UploadButton";
import { UiLabel } from "@/lib/enums";
import { useDocument, useUpload } from "@/lib/hooks";
import type {
  ApiError,
  DocumentRouteData,
  UploadRouteData,
} from "@/lib/types";

export function ArticleCheckerScreen() {
  const { data, isLoading, error, refetch } = useDocument();
  const { upload, isUploading, uploadError, uploadResult } = useUpload();

  function handleUpload(): void {
    if (data) {
      void upload(data.parsed.article);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header isLoading={isLoading} onRefresh={refetch} />

      <main className="mx-auto max-w-7xl px-6 py-8 pb-32 lg:px-8">
        {isLoading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorCard error={error} onRetry={refetch} />
        ) : data ? (
          <ContentGrid data={data} />
        ) : null}
      </main>

      <Footer
        data={data}
        isUploading={isUploading}
        uploadError={uploadError}
        uploadResult={uploadResult}
        onUpload={handleUpload}
      />
    </div>
  );
}

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

function Header({ isLoading, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            {UiLabel.BRAND_NAME}
          </h1>
          <p className="text-xs text-slate-500">{UiLabel.APP_TAGLINE}</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshIcon className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          <span>{UiLabel.REFRESH}</span>
        </button>
      </div>
    </header>
  );
}

interface ContentGridProps {
  data: DocumentRouteData;
}

function ContentGrid({ data }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ArticlePreview parsed={data.parsed} />
      </div>
      <div className="space-y-6">
        <QualityPanel report={data.report} />
        <MetaPanel article={data.parsed.article} />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SkeletonCard lines={8} />
      </div>
      <div className="space-y-6">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}

interface SkeletonCardProps {
  lines: number;
}

function SkeletonCard({ lines }: SkeletonCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 animate-pulse rounded bg-slate-100"
            style={{ width: `${85 - (index % 4) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

interface ErrorCardProps {
  error: ApiError;
  onRetry: () => void;
}

function ErrorCard({ error, onRetry }: ErrorCardProps) {
  return (
    <div className="mx-auto mt-12 max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertIcon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {UiLabel.ERROR_TITLE}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <p className="mt-1 font-mono text-xs text-slate-400">{error.code}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        <RefreshIcon className="h-4 w-4" />
        <span>{UiLabel.RETRY}</span>
      </button>
    </div>
  );
}

interface FooterProps {
  data: DocumentRouteData | null;
  isUploading: boolean;
  uploadError: ApiError | null;
  uploadResult: UploadRouteData | null;
  onUpload: () => void;
}

function Footer({
  data,
  isUploading,
  uploadError,
  uploadResult,
  onUpload,
}: FooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <UploadFeedback uploadResult={uploadResult} uploadError={uploadError} />
        <UploadButton
          onClick={onUpload}
          isUploading={isUploading}
          isSuccess={uploadResult !== null}
          isError={uploadError !== null}
          disabled={data === null}
        />
      </div>
    </footer>
  );
}

interface UploadFeedbackProps {
  uploadResult: UploadRouteData | null;
  uploadError: ApiError | null;
}

function UploadFeedback({ uploadResult, uploadError }: UploadFeedbackProps) {
  if (uploadResult) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="font-semibold text-emerald-700">
          {uploadResult.destination}
        </span>
        <span className="text-slate-600">
          {UiLabel.UPLOADED_AT}{" "}
          <span className="font-medium text-slate-900">
            {formatTime(uploadResult.uploadedAt)}
          </span>
        </span>
        <span className="font-mono text-slate-500">
          {UiLabel.UPLOAD_ID} {uploadResult.uploadId}
        </span>
      </div>
    );
  }

  if (uploadError) {
    return <p className="text-xs text-red-600">{uploadError.message}</p>;
  }

  return <div />;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleTimeString();
}
