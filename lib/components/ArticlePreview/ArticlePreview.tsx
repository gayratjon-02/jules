import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";

interface ArticlePreviewProps {
  article?: IArticle;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">{UiLabel.ARTICLE_PREVIEW_TITLE}</h2>
      {article ? (
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      ) : (
        <p className="text-sm text-foreground/60">{InfoMessage.NO_DOCUMENT_LOADED}</p>
      )}
    </section>
  );
}
