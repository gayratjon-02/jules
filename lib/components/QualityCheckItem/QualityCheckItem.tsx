import { CheckIcon, WarningIcon, XIcon } from "@/lib/components/icons";
import { Severity } from "@/lib/enums";
import type { IQualityCheck } from "@/lib/interfaces";

interface QualityCheckItemProps {
  check: IQualityCheck;
}

interface SeverityStyle {
  bg: string;
  text: string;
  Icon: (props: { className?: string }) => JSX.Element;
}

const SEVERITY_STYLES: Record<Severity, SeverityStyle> = {
  [Severity.PASS]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    Icon: CheckIcon,
  },
  [Severity.WARNING]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    Icon: WarningIcon,
  },
  [Severity.FAIL]: {
    bg: "bg-red-100",
    text: "text-red-700",
    Icon: XIcon,
  },
};

export function QualityCheckItem({ check }: QualityCheckItemProps) {
  const style = SEVERITY_STYLES[check.severity];
  const Icon = style.Icon;

  return (
    <li className="flex items-start gap-3 border-b border-slate-100 px-3 py-3 transition last:border-b-0 hover:bg-slate-50">
      <span
        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full ${style.bg} ${style.text}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{check.label}</p>
        <p className="mt-0.5 text-sm text-slate-500">{check.message}</p>
      </div>
    </li>
  );
}
