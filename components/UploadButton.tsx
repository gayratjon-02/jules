"use client";

import { useRef, useState } from "react";

interface UploadButtonProps {
  onUploaded?: (documentId: string) => void;
}

export default function UploadButton({ onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    // TODO: POST to /api/upload, surface progress, then call onUploaded.
    setBusy(true);
    try {
      void file;
      void onUploaded;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".docx,.html,.txt"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload document"}
      </button>
    </div>
  );
}
