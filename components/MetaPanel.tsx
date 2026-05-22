import type { ArticleMeta } from "@/types";

interface MetaPanelProps {
  meta?: ArticleMeta;
}

export default function MetaPanel({ meta }: MetaPanelProps) {
  // TODO: render slug, word count, reading time, and editable title/description.
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-foreground/70">
        Meta
      </h2>
      {meta ? (
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-foreground/60">Title</dt>
            <dd className="font-medium">{meta.title || "—"}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Slug</dt>
            <dd className="font-mono text-xs">{meta.slug || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Words</span>
            <span>{meta.wordCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Reading time</span>
            <span>{meta.readingTimeMinutes} min</span>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-foreground/60">No document loaded.</p>
      )}
    </section>
  );
}
