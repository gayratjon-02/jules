"use client";

import { useRef } from "react";
import { UiLabel } from "@/lib/enums";
import type { ApiError } from "@/lib/types";

interface UploadButtonProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadError?: ApiError | null;
  uploadSuccess?: boolean;
}

const ACCEPTED_FILE_TYPES = ".docx,.html,.txt";

function resolveLabel(
  isUploading: boolean,
  uploadSuccess: boolean,
  uploadError: ApiError | null | undefined,
): UiLabel {
  if (isUploading) return UiLabel.UPLOAD_BUTTON_BUSY;
  if (uploadSuccess) return UiLabel.UPLOAD_SUCCESS;
  if (uploadError) return UiLabel.UPLOAD_FAILED;
  return UiLabel.UPLOAD_BUTTON_IDLE;
}

export function UploadButton({
  onUpload,
  isUploading,
  uploadError = null,
  uploadSuccess = false,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = resolveLabel(isUploading, uploadSuccess, uploadError);

  return (
    <div className="flex items-center gap-3">
      {uploadError ? (
        <span className="text-xs text-red-600">{uploadError.message}</span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onUpload(file);
            event.target.value = "";
          }
        }}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
    </div>
  );
}
