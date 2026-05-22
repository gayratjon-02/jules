"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
} from "@/lib/components/icons";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";
import { downloadArticleAsHtml } from "@/lib/utils";

interface MetaPanelProps {
  article: IArticle;
}

const FEEDBACK_TIMEOUT_MS = 2000;

export function MetaPanel({ article }: MetaPanelProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(article.html);
    setCopied(true);
    window.setTimeout(() => setCopied(false), FEEDBACK_TIMEOUT_MS);
  }

  function handleDownload(): void {
    downloadArticleAsHtml(article);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), FEEDBACK_TIMEOUT_MS);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          {UiLabel.SEO_METADATA_TITLE}
        </h2>
      </header>

      <div className="space-y-5 px-6 py-5">
        <MetaField label={UiLabel.META_TITLE} value={article.metaTitle} />
        <MetaField label={UiLabel.META_DESCRIPTION} value={article.metaDescription} />

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {UiLabel.ARTICLE_HTML}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
                {copied ? UiLabel.COPIED : UiLabel.COPY_HTML}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {downloaded ? (
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <DownloadIcon className="h-3.5 w-3.5" />
                )}
                {downloaded ? UiLabel.DOWNLOADED : UiLabel.DOWNLOAD_HTML}
              </button>
            </div>
          </div>
          <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            {article.html}
          </pre>
        </div>
      </div>
    </section>
  );
}

interface MetaFieldProps {
  label: UiLabel;
  value: string;
}

function MetaField({ label, value }: MetaFieldProps) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <p className="mt-1 text-sm text-slate-900">
        {value || InfoMessage.EMPTY_META}
      </p>
    </div>
  );
}
