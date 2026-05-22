import { InfoMessage } from "@/lib/enums";
import type { IArticle } from "@/lib/interfaces";

interface ArticlePreviewProps {
  article: IArticle;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {article.title || InfoMessage.EMPTY_META}
        </h2>
      </header>
      <div
        className="prose prose-sm max-w-none px-6 py-6 prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-md"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </article>
  );
}
