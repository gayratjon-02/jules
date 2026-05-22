"use client";

import { CheckIcon, UploadCloudIcon } from "@/lib/components/icons";
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
  if (isUploading) return "bg-indigo-500";
  return "bg-indigo-600 hover:bg-indigo-700";
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
      className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 ease-out hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm ${colorClass}`}
    >
      <ButtonIcon isUploading={isUploading} isSuccess={isSuccess} />
      <span>{label}</span>
    </button>
  );
}

interface ButtonIconProps {
  isUploading: boolean;
  isSuccess: boolean;
}

function ButtonIcon({ isUploading, isSuccess }: ButtonIconProps) {
  if (isUploading) {
    return (
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      />
    );
  }
  if (isSuccess) {
    return <CheckIcon className="h-4 w-4" />;
  }
  return <UploadCloudIcon className="h-4 w-4" />;
}
