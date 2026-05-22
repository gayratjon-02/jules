"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ImageFallback } from "@/lib/components/ImageFallback";
import { InfoMessage, UiLabel } from "@/lib/enums";
import type { IParsedDocument } from "@/lib/interfaces";

interface ArticlePreviewProps {
  parsed: IParsedDocument;
}

const PARAGRAPH_TAG_REGEX = /<p[\s>]/gi;
const STATS_SEPARATOR = "·";
const ANCHOR_TAG_NAME = "A";

export function ArticlePreview({ parsed }: ArticlePreviewProps) {
  const { article, images, links } = parsed;
  const articleRef = useRef<HTMLDivElement>(null);
  const paragraphCount = (article.html.match(PARAGRAPH_TAG_REGEX) ?? []).length;

  useEffect(() => {
    const container = articleRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll("img"));
    const mountedRoots: Root[] = [];

    const handlers = images.map((img) => {
      const onError = () => {
        const altText = img.alt || InfoMessage.EMPTY_META;
        const linkParent = img.parentElement;
        const originalUrl =
          linkParent?.tagName === ANCHOR_TAG_NAME
            ? (linkParent as HTMLAnchorElement).href
            : "";
        const target = linkParent?.tagName === ANCHOR_TAG_NAME ? linkParent : img;

        const slot = document.createElement("div");
        target.replaceWith(slot);

        const root = createRoot(slot);
        root.render(<ImageFallback alt={altText} originalUrl={originalUrl} />);
        mountedRoots.push(root);
      };

      img.addEventListener("error", onError, { once: true });
      return { img, onError };
    });

    return () => {
      handlers.forEach(({ img, onError }) => {
        img.removeEventListener("error", onError);
      });
      mountedRoots.forEach((root) => {
        queueMicrotask(() => root.unmount());
      });
    };
  }, [article.html]);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-8 py-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {article.title || InfoMessage.EMPTY_META}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            {UiLabel.STATS_PARAGRAPHS_EMOJI} {paragraphCount} {UiLabel.STATS_PARAGRAPHS}
          </span>
          <span aria-hidden="true">{STATS_SEPARATOR}</span>
          <span>
            {UiLabel.STATS_IMAGES_EMOJI} {images.length} {UiLabel.STATS_IMAGES}
          </span>
          <span aria-hidden="true">{STATS_SEPARATOR}</span>
          <span>
            {UiLabel.STATS_LINKS_EMOJI} {links.length} {UiLabel.STATS_LINKS}
          </span>
        </div>
      </header>
      <div
        ref={articleRef}
        className="prose prose-slate prose-lg max-w-none px-8 py-8 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:max-h-96 prose-img:w-auto prose-img:max-w-full prose-img:rounded-lg prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </article>
  );
}
