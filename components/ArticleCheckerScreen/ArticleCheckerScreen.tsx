"use client";

import { ArticlePreview } from "@/lib/components/ArticlePreview";
import { MetaPanel } from "@/lib/components/MetaPanel";
import { QualityPanel } from "@/lib/components/QualityPanel";
import { UploadButton } from "@/lib/components/UploadButton";
import { UiLabel } from "@/lib/enums";
import { useDocument, useUpload } from "@/lib/hooks";
import type { ApiError } from "@/lib/types";

export function ArticleCheckerScreen() {
  const { data, isLoading, error, refetch } = useDocument();
  const { upload, isUploading, uploadError, uploadSuccess } = useUpload();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {UiLabel.APP_TITLE}
            </h1>
            <p className="text-xs text-gray-500">{UiLabel.APP_SUBTITLE}</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UiLabel.REFRESH}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 pb-32">
        {isLoading ? (
          <LoadingView />
        ) : error ? (
          <ErrorView error={error} onRetry={refetch} />
        ) : data ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticlePreview article={data.parsed.article} />
            </div>
            <div className="space-y-6">
              <QualityPanel report={data.report} />
              <MetaPanel article={data.parsed.article} />
            </div>
          </div>
        ) : null}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-3">
          <UploadButton
            onUpload={upload}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
          />
        </div>
      </footer>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      <p className="mt-4 text-sm text-gray-600">{UiLabel.LOADING}</p>
    </div>
  );
}

interface ErrorViewProps {
  error: ApiError;
  onRetry: () => void;
}

function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
      <h2 className="text-base font-semibold text-red-900">
        {UiLabel.ERROR_TITLE}
      </h2>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <p className="mt-1 font-mono text-xs text-red-500">{error.code}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
      >
        {UiLabel.RETRY}
      </button>
    </div>
  );
}
