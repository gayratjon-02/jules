import { QualityCheckItem } from "@/lib/components/QualityCheckItem";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IQualityReport } from "@/lib/interfaces";

interface QualityPanelProps {
  report: IQualityReport;
}

function resolveBadgeClass(report: IQualityReport): string {
  if (report.totalFailed > 0) return "bg-red-100 text-red-700";
  if (report.totalWarnings > 0) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function QualityPanel({ report }: QualityPanelProps) {
  const totalChecks = report.checks.length;
  const badgeClass = resolveBadgeClass(report);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          {UiLabel.QUALITY_REPORT_TITLE}
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}
        >
          {report.totalPassed}/{totalChecks}
        </span>
      </header>

      <div className="flex items-center gap-5 border-b border-slate-100 px-6 py-3 text-xs">
        <StatDot color="bg-emerald-500" count={report.totalPassed} label={UiLabel.QUALITY_SUMMARY_PASSED} />
        <StatDot color="bg-amber-500" count={report.totalWarnings} label={UiLabel.QUALITY_SUMMARY_WARNINGS} />
        <StatDot color="bg-red-500" count={report.totalFailed} label={UiLabel.QUALITY_SUMMARY_FAILED} />
      </div>

      {report.checks.length > 0 ? (
        <ul className="px-3 py-2">
          {report.checks.map((check) => (
            <QualityCheckItem key={check.id} check={check} />
          ))}
        </ul>
      ) : (
        <p className="px-6 py-6 text-sm text-slate-500">{InfoMessage.NO_ISSUES_FOUND}</p>
      )}
    </section>
  );
}

interface StatDotProps {
  color: string;
  count: number;
  label: UiLabel;
}

function StatDot({ color, count, label }: StatDotProps) {
  return (
    <span className="flex items-center gap-1.5 text-slate-600">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span>
        <span className="font-medium text-slate-900">{count}</span> {label}
      </span>
    </span>
  );
}
