import { LinkIcon } from "@/lib/components/icons";
import { UiLabel } from "@/lib/enums";

export function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <LinkIcon className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-lg font-semibold text-slate-900">
        {UiLabel.EMPTY_STATE_TITLE}
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {UiLabel.EMPTY_STATE_DESCRIPTION}
      </p>
    </div>
  );
}
