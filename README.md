# scalerrs-assessment

Small Next.js 14 app that pulls a Google Doc, renders it as an article preview,
and runs editorial / SEO checks against it.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- `googleapis` for fetching the source document
- `cheerio` for parsing the exported HTML

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Google service account values
npm run dev
```

Then open http://localhost:3000.

## Environment variables

| Name | Description |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email with read access to the doc |
| `GOOGLE_PRIVATE_KEY` | Private key for the service account (newlines as `\n`) |
| `GOOGLE_DOC_ID` | Default Google Doc id to load |

## Project layout

```
app/
  page.tsx          # main UI
  layout.tsx
  api/
    document/       # GET parsed article + quality report
    upload/         # POST a new document
lib/
  googleDocs.ts     # Google Docs / Drive client
  parser.ts         # HTML → ParsedArticle
  qualityChecker.ts # ParsedArticle → QualityReport
components/         # ArticlePreview, MetaPanel, QualityPanel, UploadButton
types/              # shared TypeScript types
```
