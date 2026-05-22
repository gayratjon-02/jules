"use client";

import { useState } from "react";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";

interface MetaPanelProps {
  article: IArticle;
}

const COPY_FEEDBACK_TIMEOUT_MS = 2000;

export function MetaPanel({ article }: MetaPanelProps) {
  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(article.html);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {UiLabel.META_PANEL_TITLE}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {UiLabel.META_TITLE}
          </h3>
          <p className="mt-1 text-sm text-gray-900">
            {article.metaTitle || InfoMessage.EMPTY_META}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {UiLabel.META_DESCRIPTION}
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            {article.metaDescription || InfoMessage.EMPTY_META}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {UiLabel.ARTICLE_HTML}
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
            >
              {copied ? UiLabel.COPIED : UiLabel.COPY_HTML}
            </button>
          </div>
          <pre className="max-h-64 overflow-auto rounded-md border border-gray-100 bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
            {article.html}
          </pre>
        </div>
      </div>
    </section>
  );
}
