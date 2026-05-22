import { Severity } from "@/lib/enums";
import type { IQualityCheck } from "@/lib/interfaces";

interface QualityCheckItemProps {
  check: IQualityCheck;
}

const severityClass: Record<Severity, string> = {
  [Severity.INFO]: "bg-blue-100 text-blue-700",
  [Severity.WARNING]: "bg-amber-100 text-amber-700",
  [Severity.ERROR]: "bg-red-100 text-red-700",
};

export function QualityCheckItem({ check }: QualityCheckItemProps) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span
        className={`mt-0.5 rounded px-2 py-0.5 text-xs font-medium uppercase ${severityClass[check.severity]}`}
      >
        {check.severity}
      </span>
      <span className="text-foreground/80">{check.message}</span>
    </li>
  );
}
