import { ArticlePreview } from "@/lib/components/ArticlePreview";
import { MetaPanel } from "@/lib/components/MetaPanel";
import { QualityPanel } from "@/lib/components/QualityPanel";
import { UploadButton } from "@/lib/components/UploadButton";
import { UiLabel } from "@/lib/enums";

export function ArticleCheckerScreen() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{UiLabel.APP_TITLE}</h1>
          <p className="text-sm text-foreground/60">{UiLabel.APP_SUBTITLE}</p>
        </div>
        <UploadButton />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <ArticlePreview />
        <aside className="flex flex-col gap-6">
          <MetaPanel />
          <QualityPanel />
        </aside>
      </div>
    </main>
  );
}
