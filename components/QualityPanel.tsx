import type { QualityReport } from "@/types";

interface QualityPanelProps {
  report?: QualityReport;
}

export default function QualityPanel({ report }: QualityPanelProps) {
  // TODO: render the score, severity badges, and the list of issues.
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-5 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/70">
          Quality
        </h2>
        {report ? (
          <span className="text-sm font-semibold">{report.score}/100</span>
        ) : null}
      </header>
      {report && report.issues.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {report.issues.map((issue) => (
            <li key={issue.id} className="text-foreground/80">
              {issue.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-foreground/60">
          No issues to display yet.
        </p>
      )}
    </section>
  );
}
