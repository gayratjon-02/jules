"use client";

import { type FormEvent, useState } from "react";
import { LinkIcon, XIcon } from "@/lib/components/icons";
import { UiLabel } from "@/lib/enums";
import { extractDocIdFromUrl } from "@/lib/utils";

interface DocUrlInputProps {
  onSubmit: (docId: string) => void;
  onReset: () => void;
  isLoading: boolean;
  currentDocId: string | null;
}

export function DocUrlInput({
  onSubmit,
  onReset,
  isLoading,
  currentDocId,
}: DocUrlInputProps) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const docId = extractDocIdFromUrl(value);
    if (!docId) {
      setError(UiLabel.INVALID_URL_ERROR);
      return;
    }
    setError(null);
    onSubmit(docId);
  }

  function handleClearInput(): void {
    setValue("");
    setError(null);
  }

  function handleResetAll(): void {
    setValue("");
    setError(null);
    onReset();
  }

  return (
    <div className="mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
      >
        <LinkIcon className="ml-2 h-4 w-4 flex-none text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={UiLabel.DOC_URL_PLACEHOLDER}
          disabled={isLoading}
          className="flex-1 bg-transparent px-1 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClearInput}
            disabled={isLoading}
            aria-label={UiLabel.CLEAR}
            className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : null}
          <span>{UiLabel.ANALYZE_BUTTON}</span>
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}

      {currentDocId ? (
        <button
          type="button"
          onClick={handleResetAll}
          disabled={isLoading}
          className="mt-2 text-xs font-medium text-slate-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {UiLabel.CLEAR}
        </button>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  );
}
