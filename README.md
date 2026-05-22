# Scalerrs Article Quality Checker

> A senior-level full-stack solution to the Scalerrs developer challenge. Takes any Google Doc URL, runs a multi-stage parsing and quality-analysis pipeline, and produces a WordPress-ready HTML export.

## Overview

The writing team at Scalerrs publishes hundreds of articles each month. Editors currently spend significant manual effort verifying that each article meets quality standards before publishing.

This tool automates that review. Paste any Google Doc URL, and within seconds the app fetches the source document, parses it into structured data, runs eight independent quality checks, and renders three side-by-side panels: the rendered article, a quality report, and a SEO metadata export. The "Upload to WordPress" button simulates the final publishing step end-to-end.

## Demo

- Live: `[Vercel link — added after deploy]`
- Repository: https://github.com/gayratjon-02/jules

## Quick Start

```bash
git clone https://github.com/gayratjon-02/jules
cd jules
npm install
cp .env.example .env.local   # fill in service-account credentials
npm run dev
```

Open http://localhost:3000, paste a Google Doc URL, click **Analyze**.

## How It Works

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Google Doc URL   │ -> │ GoogleDocsService│ -> │  ParserService   │ -> │QualityChecker    │
│ (user input)     │    │ (JWT, Docs API)  │    │ (Doc JSON → IDoc)│    │ (8 checks)       │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
                                                                                  │
                                                                                  v
                       ┌──────────────────────────────────────────────────────┐
                       │  ApiResponse<{ parsed, report }>  ->  React UI       │
                       └──────────────────────────────────────────────────────┘
```

1. User submits a Google Doc URL via the `DocUrlInput` component.
2. `useDocument` hook calls `GET /api/document?docId=...`
3. The route handler instantiates three services and orchestrates the pipeline.
4. `GoogleDocsService` authenticates with a JWT (service account) and fetches the raw Google Docs schema.
5. `ParserService` walks the schema and produces `IParsedDocument` (article, images, links).
6. `QualityCheckerService` runs eight independent checks and returns `IQualityReport`.
7. UI renders three panels and a footer with the simulated upload button.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + @tailwindcss/typography
- **Google APIs:** googleapis (Docs v1, Drive v3)
- **Auth:** JWT service-account flow
- **Deployment target:** Vercel

## Architecture

The project enforces a strict layered architecture. Every string lives in an enum, every shape lives in an interface or type, and every responsibility lives in its own class or hook.

```
lib/
├── enums/              ← all strings & constants (messages, errors, limits, http, etc.)
├── types/              ← primitives & API response shapes
├── interfaces/         ← object contracts (IArticle, IImage, ILink, IQualityCheck, ...)
├── googleDocs/         ← GoogleDocsService — JWT auth + Docs v1 fetch
├── googleDrive/        ← GoogleDriveService — Drive v3 stream for image proxy
├── parser/             ← ParserService — Google Docs schema → IParsedDocument
├── qualityChecker/     ← QualityCheckerService — IParsedDocument → IQualityReport
├── hooks/              ← useDocument, useUpload (React data hooks)
├── utils/              ← extractDocId, slugify, downloadHtml
└── components/         ← sectional UI (ArticlePreview, QualityPanel, MetaPanel, ...)

components/
└── ArticleCheckerScreen/  ← screen-level orchestrator (state, layout, footer)

app/
├── page.tsx                  ← renders <ArticleCheckerScreen />
├── layout.tsx                ← Inter font, global CSS
└── api/
    ├── document/route.ts     ← GET — fetch + parse + check pipeline
    ├── upload/route.ts       ← POST — simulated WordPress publish
    └── image-proxy/route.ts  ← GET — streams Drive images through the server
```

### Strict conventions

- **No string literals in business logic.** Every user-visible label, error, and pattern is referenced via an enum (`UiLabel`, `ErrorMessage`, `QualityMessage`, `ParserPattern`, etc.).
- **No magic numbers.** Thresholds live in `limits.enum.ts` (`ImageLimit`, `LinkLimit`, `ParagraphLimit`); HTTP statuses in `httpStatus.enum.ts`.
- **Interfaces use the `I` prefix** (`IArticle`, `IQualityCheck`, `IParsedDocument`).
- **Services are classes with a single public method.** Helpers are private.
- **Components are folder-based** with an `index.ts` barrel re-export.
- **Screen vs. sectional split.** Page-level components live in `/components/`; reusable parts live in `/lib/components/`.

## Quality Checks

The `QualityCheckerService` produces eight independent checks. Each returns an `IQualityCheck` with a `Severity` (PASS / WARNING / FAIL).

| # | Check | Validates | Threshold |
|---|-------|-----------|-----------|
| 1 | Image count | Article has the expected number of images | 1 ≤ count ≤ 20 |
| 2 | Image hosting | All images served from Google Drive | 100% Drive-hosted |
| 3 | Image alt tags | Every image has non-empty alt text | All images covered |
| 4 | Product link count | Article has the expected number of product links | 2 ≤ count ≤ 50 |
| 5 | Article title | A title heading is present | Non-empty |
| 6 | Meta title | "Meta Title:" field is present | Non-empty |
| 7 | Meta description | "Meta Description:" field is present | Non-empty |
| 8 | Article body | Body has at least the minimum paragraph count | ≥ 5 paragraphs |

The report aggregates totals (`totalPassed`, `totalWarnings`, `totalFailed`) and a single `overallPassed` flag.

## Parser Highlights

The Scalerrs workflow embeds images as **Drive links inside the doc**, not as embedded media. `ParserService` recognizes this pattern:

- Detects anchor text matching `^IMAGE\s*\d+$` (case-insensitive)
- Detects links pointing at `drive.google.com/file/...`
- Extracts the Drive file ID from any of `/file/d/{id}`, `?id={id}`, `/d/{id}`
- Pairs each image link with the next `Alt tag: "..."` line in the document
- Rewrites the `src` to `/api/image-proxy?fileId={id}` so the browser can render it
- Keeps the original Drive viewer URL clickable via a wrapping `<a target="_blank">`

The parser also walks paragraph styles (`TITLE`, `HEADING_1..6`, `NORMAL_TEXT`) and maps them to the corresponding HTML tags, escapes user content, and preserves textRun links inline.

## Image Proxy

Drive files are typically private. The `image-proxy` route solves this by streaming images through the server with the service account's credentials:

1. Client requests `<img src="/api/image-proxy?fileId=...">`
2. Route validates the file ID against `^[a-zA-Z0-9_-]+$`
3. `GoogleDriveService` fetches metadata for the `mimeType`, then opens a media stream
4. The stream is piped to the response with the correct `Content-Type` and a one-hour `Cache-Control`
5. If the Drive call fails (file not shared with the service account), the route returns a 502 and the React `ArticlePreview` swaps the broken image for an `ImageFallback` card that links to the Drive viewer

## WordPress Export

The MetaPanel exposes two export actions:
- **Copy HTML** — copies the article body to the clipboard
- **Download HTML** — saves a complete HTML5 document with meta title, meta description, and body; filename is the article title slugified (e.g. `ultimate-guide-to-premium-wireless-headphones.html`)

The downloaded file is ready to paste into the WordPress block editor or to feed into the WP REST API.

## API Reference

### `GET /api/document?docId={id}`

Returns the parsed document and quality report.

**Success:**
```json
{
  "success": true,
  "data": {
    "parsed": { "article": {...}, "images": [...], "links": [...] },
    "report": { "checks": [...], "totalPassed": 8, "totalFailed": 0, "overallPassed": true }
  }
}
```

**Errors:** `400 DOC_ID_REQUIRED | DOC_ID_INVALID_FORMAT`, `500 AUTH_CONFIG_MISSING | DOC_PARSE_FAILED`, `502 DOC_FETCH_FAILED`

### `POST /api/upload`

Simulates a WordPress publish. Body: `{ article: IArticle }`. Returns `{ uploadId, uploadedAt, destination, article: { title, metaTitle } }` after an 800 ms delay.

### `GET /api/image-proxy?fileId={driveFileId}`

Streams a Google Drive image through the server with proper `Content-Type` and caching headers.

## Environment Variables

| Name | Required | Description |
|------|----------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Service-account email with Docs + Drive read scopes |
| `GOOGLE_PRIVATE_KEY` | Yes | PEM private key (escape newlines as `\n` if quoting) |

Both APIs must be enabled in the Google Cloud project: **Google Docs API** and **Google Drive API**.

## Design Decisions

**Next.js over a split frontend/backend?** Scalerrs's stack is Next.js + Vercel. Keeping it in one project means one deploy target, one type-safe boundary between client and server, and zero extra infra.

**Enum-driven strings?** Strict separation of presentation, logic, and configuration. When a copywriter wants to tweak "Meta title is missing" to "Add a meta title", they touch one enum entry, not a dozen JSX files. It also enables future i18n with minimal refactor.

**Service classes with a single public method?** Each service has exactly one responsibility (fetch, parse, check). The pipeline in `route.ts` is then four lines and reads top-to-bottom.

**Why not embed images directly?** Drive's standard share URLs aren't directly embeddable in `<img>` tags when the file isn't world-public. Streaming through `/api/image-proxy` works for any sharing setting that includes the service account and degrades gracefully via `ImageFallback` for files we can't access.

**Why no DB?** Out of scope for this assessment. In production, every analysis would be persisted (see Future Features).

## Future Features

A list of well-scoped enhancements that could be built on top of this foundation, grouped by area.

### Publishing integrations
- **Real WordPress REST API integration** — replace the simulated upload with `POST /wp-json/wp/v2/posts`, plus per-client auth, category/tag selection, scheduled publish, and a draft toggle
- **Shopify Articles API** — many Scalerrs clients run ecommerce blogs on Shopify; the same parsed `IArticle` shape can target `POST /admin/api/articles.json`
- **Webflow CMS** — write to a Webflow collection item using the CMS API
- **Bulk publishing** — accept a Drive folder URL and process every doc inside

### Deeper quality checks
- **Readability score** — Flesch-Kincaid grade level and reading-ease score per article
- **Keyword density** — verify the target keyword appears at the right frequency without overstuffing
- **Internal-linking suggestions** — given a list of the client's published articles, suggest in-context internal links the writer missed
- **Broken-link checker** — HEAD-request every outbound URL and fail the report on 4xx/5xx
- **Spelling and grammar** — feed paragraphs to an LLM with editorial guidelines and surface diffs as suggestions
- **Image dimensions and weight** — read the Drive metadata and warn on oversized images that would slow page load
- **Duplicate-content detection** — fingerprint paragraphs and compare against the writer's past submissions

### Workflow and collaboration
- **Multi-user accounts** — writer / editor / publisher roles, each seeing the queue at their stage
- **Approval pipeline** — writer submits → editor reviews → publisher uploads, with revision history attached to each check
- **Comments per check** — let an editor leave a note explaining why a check was overridden
- **Slack / Notion notifications** — when a doc passes review, post to the client channel

### AI assistance
- **Auto-generated meta title and description** — generate from article body when missing
- **Auto-suggested alt text** — vision LLM proposes alt text for images that don't have one
- **Tone-of-voice consistency** — compare new article against the client's brand guide and flag drift
- **FAQ schema generation** — parse FAQ sections and output JSON-LD ready to paste into WordPress

### Infrastructure
- **Queue-based processing** — for bulk runs, push jobs to BullMQ / Redis and stream results via SSE
- **Persistent history** — Postgres table of every analyzed article with full quality report; surface trends per writer
- **Webhooks on Drive changes** — Drive's `changes.watch` triggers a re-analysis when a doc is updated
- **Response caching** — same doc, same revision → serve cached report

### Analytics
- **Trend dashboard** — pass-rate over time per writer and per client
- **Failure-pattern report** — "85% of articles fail the alt-tag check" → tells editors where to focus training
- **Time-saved metric** — assume manual review takes X minutes; estimated hours saved per month

## Repository Layout

```
.
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── document/
│   │   ├── upload/
│   │   └── image-proxy/
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Screen-level components
│   └── ArticleCheckerScreen/
├── lib/
│   ├── enums/              # All constants
│   ├── types/              # API + primitive types
│   ├── interfaces/         # Object contracts
│   ├── googleDocs/         # GoogleDocsService
│   ├── googleDrive/        # GoogleDriveService
│   ├── parser/             # ParserService
│   ├── qualityChecker/     # QualityCheckerService
│   ├── hooks/              # useDocument, useUpload
│   ├── utils/              # extractDocId, slugify, downloadHtml
│   └── components/         # Sectional UI + icons
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Author

Gayratjon Rakhmataliyev — built for the Scalerrs developer challenge, May 2026.
