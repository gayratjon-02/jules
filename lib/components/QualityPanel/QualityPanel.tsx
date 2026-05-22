import { QualityCheckItem } from "@/lib/components/QualityCheckItem";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IQualityReport } from "@/lib/interfaces";

interface QualityPanelProps {
  report?: IQualityReport;
}

export function QualityPanel({ report }: QualityPanelProps) {
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-5 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/70">
          {UiLabel.QUALITY_PANEL_TITLE}
        </h2>
        {report ? (
          <span className="text-xs text-foreground/70">
            {report.totalPassed} {UiLabel.QUALITY_SUMMARY_PASSED} ·{" "}
            {report.totalWarnings} {UiLabel.QUALITY_SUMMARY_WARNINGS} ·{" "}
            {report.totalFailed} {UiLabel.QUALITY_SUMMARY_FAILED}
          </span>
        ) : null}
      </header>
      {report && report.checks.length > 0 ? (
        <ul className="space-y-3">
          {report.checks.map((check) => (
            <QualityCheckItem key={check.id} check={check} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-foreground/60">{InfoMessage.NO_ISSUES_FOUND}</p>
      )}
    </section>
  );
}
