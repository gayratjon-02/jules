import { QualityCheckItem } from "@/lib/components/QualityCheckItem";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IQualityReport } from "@/lib/interfaces";

interface QualityPanelProps {
  report: IQualityReport;
}

export function QualityPanel({ report }: QualityPanelProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {UiLabel.QUALITY_PANEL_TITLE}
        </h2>
        <span className="text-xs text-gray-600">
          {report.totalPassed} {UiLabel.QUALITY_SUMMARY_PASSED} ·{" "}
          {report.totalWarnings} {UiLabel.QUALITY_SUMMARY_WARNINGS} ·{" "}
          {report.totalFailed} {UiLabel.QUALITY_SUMMARY_FAILED}
        </span>
      </header>
      {report.checks.length > 0 ? (
        <ul className="space-y-3">
          {report.checks.map((check) => (
            <QualityCheckItem key={check.id} check={check} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{InfoMessage.NO_ISSUES_FOUND}</p>
      )}
    </section>
  );
}
