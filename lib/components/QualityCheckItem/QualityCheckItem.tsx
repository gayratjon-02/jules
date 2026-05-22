import { Severity } from "@/lib/enums";
import type { IQualityCheck } from "@/lib/interfaces";

interface QualityCheckItemProps {
  check: IQualityCheck;
}

const SEVERITY_BADGE_CLASS: Record<Severity, string> = {
  [Severity.PASS]: "bg-emerald-100 text-emerald-700",
  [Severity.WARNING]: "bg-amber-100 text-amber-700",
  [Severity.FAIL]: "bg-red-100 text-red-700",
};

export function QualityCheckItem({ check }: QualityCheckItemProps) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span
        className={`mt-0.5 rounded px-2 py-0.5 text-xs font-medium uppercase ${SEVERITY_BADGE_CLASS[check.severity]}`}
      >
        {check.severity}
      </span>
      <div className="flex-1">
        <div className="font-medium text-foreground/90">{check.label}</div>
        <div className="text-foreground/70">{check.message}</div>
      </div>
    </li>
  );
}
