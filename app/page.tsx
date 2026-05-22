import ArticlePreview from "@/components/ArticlePreview";
import MetaPanel from "@/components/MetaPanel";
import QualityPanel from "@/components/QualityPanel";
import UploadButton from "@/components/UploadButton";

export default function Home() {
  // TODO: fetch the parsed document on the server (or via a client hook)
  // and pass it down to the panels below.
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Scalerrs Assessment</h1>
          <p className="text-sm text-foreground/60">
            Preview a Google Doc as an article and inspect its quality signals.
          </p>
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
