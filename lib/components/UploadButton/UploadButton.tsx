"use client";

import { UiLabel } from "@/lib/enums";

interface UploadButtonProps {
  onClick: () => void;
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  disabled: boolean;
}

function resolveLabel(
  isUploading: boolean,
  isSuccess: boolean,
  isError: boolean,
): UiLabel {
  if (isUploading) return UiLabel.UPLOADING;
  if (isSuccess) return UiLabel.UPLOADED;
  if (isError) return UiLabel.UPLOAD_FAILED_LABEL;
  return UiLabel.UPLOAD_TO_WORDPRESS;
}

function resolveColorClass(
  isUploading: boolean,
  isSuccess: boolean,
  isError: boolean,
): string {
  if (isSuccess) return "bg-emerald-600 hover:bg-emerald-700";
  if (isError) return "bg-red-600 hover:bg-red-700";
  if (isUploading) return "bg-blue-500";
  return "bg-blue-600 hover:bg-blue-700";
}

export function UploadButton({
  onClick,
  isUploading,
  isSuccess,
  isError,
  disabled,
}: UploadButtonProps) {
  const label = resolveLabel(isUploading, isSuccess, isError);
  const colorClass = resolveColorClass(isUploading, isSuccess, isError);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isUploading}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${colorClass}`}
    >
      {isUploading ? <Spinner /> : null}
      {isSuccess && !isUploading ? <CheckIcon /> : null}
      <span>{label}</span>
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.586l7.29-7.296a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
