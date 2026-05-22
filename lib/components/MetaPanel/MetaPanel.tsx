import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";

interface MetaPanelProps {
  article?: IArticle;
}

export function MetaPanel({ article }: MetaPanelProps) {
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-foreground/70">
        {UiLabel.META_PANEL_TITLE}
      </h2>
      {article ? (
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-foreground/60">{UiLabel.META_FIELD_TITLE}</dt>
            <dd className="font-medium">{article.metaTitle || InfoMessage.EMPTY_META}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">{UiLabel.META_FIELD_DESCRIPTION}</dt>
            <dd className="text-foreground/80">
              {article.metaDescription || InfoMessage.EMPTY_META}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-foreground/60">{InfoMessage.NO_DOCUMENT_LOADED}</p>
      )}
    </section>
  );
}
