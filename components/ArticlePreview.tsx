import type { ParsedArticle } from "@/types";

interface ArticlePreviewProps {
  article?: ParsedArticle;
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  // TODO: render `article.html` inside a styled prose container once the
  // parser pipeline is wired up.
  return (
    <section className="rounded-lg border border-foreground/10 bg-white/40 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Article preview</h2>
      {article ? (
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      ) : (
        <p className="text-sm text-foreground/60">
          Load a document to see the rendered article here.
        </p>
      )}
    </section>
  );
}
