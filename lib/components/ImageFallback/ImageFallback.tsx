import { ImageIcon } from "@/lib/components/icons";
import { InfoMessage, UiLabel } from "@/lib/enums";

interface ImageFallbackProps {
  alt: string;
  originalUrl: string;
}

export function ImageFallback({ alt, originalUrl }: ImageFallbackProps) {
  return (
    <div className="my-6 flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
      <ImageIcon className="h-8 w-8 text-slate-400" />
      <p className="mt-2 text-sm font-medium text-slate-700">
        {UiLabel.IMAGE_FALLBACK_PREFIX}: {alt || InfoMessage.EMPTY_META}
      </p>
      {originalUrl ? (
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
        >
          {UiLabel.IMAGE_FALLBACK_VIEW}
        </a>
      ) : null}
    </div>
  );
}
