# Archetype Studio

A CLI-first content engine for generating archetype carousel posts with AI-assisted copy, strict validation, coherent visual directions, local asset packs, and deterministic Playwright rendering.

Archetype Studio is not an autonomous posting bot. It produces reviewable export bundles that a human can inspect, edit, reject, or post manually.

## What it does

Archetype Studio turns a topic like:

```text
what kind of texter are you
```

into a structured post bundle:

```text
runs/<run-id>/
  input.json
  raw-generation.json
  generation-report.json
  post-spec.json
  render-plan.json
  qa-report.json
  meta.json
  caption.txt
  review.md
  render/
    slide-1.png
    slide-2.png
    ...
```

The core split is simple:

- AI generates language and concepts.
- TypeScript validates structure, constraints, and editorial rules.
- HTML/CSS plus Playwright renders deterministic PNG slides.
- QA checks catch unsafe output before manual review.

> [!NOTE]
> The MVP is intentionally local-first and CLI-first. A dashboard/editor UI can be added later on top of the same packages.

## Features

- `generate`, `render`, and `run` CLI commands
- Topic-string input and JSON-file input
- OpenAI Responses API integration
- Mock generation for local demos without API calls
- Zod-backed validation for model output and persisted specs
- Coherent naming frames, so outputs use characters, figures, symbols, concepts, or metaphors instead of generic labels
- Automatic visual direction selection with `--visual-direction` override
- Local SVG asset packs mapped to visual directions
- Playwright-based PNG rendering
- Render QA reports with DOM overflow diagnostics
- Filesystem-only persistence under `runs/`
- Node test coverage for core validation, config, rendering, and OpenAI response parsing

## Quickstart

Install dependencies:

```bash
corepack pnpm install --no-frozen-lockfile
```

Build the workspace:

```bash
corepack pnpm build
```

Run tests:

```bash
corepack pnpm test
```

Run a full mock demo:

```bash
node --enable-source-maps apps/cli/dist/index.js run "what kind of texter are you" --mock --run-id demo-texter
```

Open the generated PNGs in:

```text
runs/demo-texter/render/
```

## Live generation

Set your OpenAI API key in the shell before running the live path:

```powershell
$env:OPENAI_API_KEY="your-key-here"
node --enable-source-maps apps/cli/dist/index.js run "what kind of texter are you" --run-id real-texter
```

The key is read from `process.env.OPENAI_API_KEY`. Do not commit `.env` files or API keys.

## CLI

Generate only:

```bash
node --enable-source-maps apps/cli/dist/index.js generate "what kind of texter are you" --mock
```

Generate from a JSON request:

```bash
node --enable-source-maps apps/cli/dist/index.js generate --input examples/generate-request.json --mock
```

Render a generated run:

```bash
node --enable-source-maps apps/cli/dist/index.js render --run-id demo-texter
```

Run generation and rendering together:

```bash
node --enable-source-maps apps/cli/dist/index.js run "which programming language are you" --mock --visual-direction terminal-core --run-id demo-terminal
```

Useful flags:

- `--mock`: use local fixture-style generation instead of OpenAI
- `--run-id <id>`: write output to a stable run folder
- `--input <path>`: read a generation request JSON file
- `--visual-direction <id>`: override automatic visual direction selection
- `--qa-variant invalid`: intentionally trigger render QA failure for testing

## Visual directions

Each post gets one visual direction. That direction controls palette, typography, layout energy, asset style, and asset packs across all slides in the post.

Current directions:

- `messy-phone-collage`
- `academic-margins`
- `terminal-core`
- `dreamy-music-mag`
- `soft-sticker-board`

If no direction is passed, the system chooses one from the topic and optional audience. For example, texting and group-chat topics route to `messy-phone-collage`; programming topics route to `terminal-core`.

## Naming frames

The generator avoids hard generic labels like:

```text
The Strategist
The Visionary
The Activist
Ghoster
Overthinker
```

Instead, each post chooses a coherent `namingFrame`.

Examples:

- Texting topic: `cats`, with names like `Orange Cat`, `Siamese Cat`, `Black Cat`
- Revolutionary topic: `revolutionary figures`, with names like `Trotsky`, `Rosa Luxemburg`, `Greta Thunberg`
- Programming topic: `terminal spirits`, `browser tabs`, `programming languages`, or another coherent frame

This keeps the output more editorial, less personality-test boilerplate.

## Architecture

```text
Topic input
  -> mode/config resolution
  -> visual direction resolution
  -> AI generation or mock generation
  -> JSON parsing
  -> PostSpec validation
  -> RenderPlan creation
  -> HTML/CSS template rendering
  -> Playwright PNG export
  -> QA report
  -> manual review bundle
```

Package layout:

```text
apps/
  cli/                 CLI commands and orchestration
packages/
  core/                types, schemas, parsing, generation contracts, validation
  config/              modes, templates, visual directions, asset packs
  fs-store/            run folders and artifact IO helpers
  renderer/            render plans, HTML templates, Playwright, QA
assets/
  packs/               local SVG assets used by visual directions
tests/                 Node test runner coverage
docs/superpowers/      design and implementation planning docs
```

## Data contract

The central artifact is `post-spec.json`.

Rendering never consumes raw model output directly. Generation must pass through parsing and validation before the renderer sees it.

Simplified shape:

```ts
interface PostSpec {
  id: string;
  topic: string;
  mode: "mainstream";
  hook: string;
  namingFrame: string;
  archetypes: Array<{
    id: string;
    name: string;
    bullets: string[];
    mood?: string;
    visualKeywords?: string[];
  }>;
  caption?: string;
  cta?: string;
  templateId?: string;
  visualPack?: string;
  visualDirectionId: string;
}
```

## Quality gates

Generation validation rejects:

- malformed JSON
- missing required fields
- duplicate archetype names
- repeated bullets
- generic hard-archetype names
- copy that exceeds layout-safe length limits
- archetype names that are too similar

Render QA checks:

- slide count and metadata consistency
- missing slide content
- oversized text lines
- empty asset slots
- DOM overflow and out-of-bounds rendered content

## Project status

The MVP is functional and ready to publish as a local-first prototype.

What is included:

- CLI pipeline
- local persistence
- OpenAI integration
- mock demo path
- HTML/CSS plus Playwright renderer
- visual directions and local asset packs
- automated tests

What is not included yet:

- dashboard/editor UI
- production asset library
- analytics feedback loop
- auto-posting
- hosted deployment

## Development

Common commands:

```bash
corepack pnpm install --no-frozen-lockfile
corepack pnpm build
corepack pnpm test
```

Before publishing or pushing a milestone:

```bash
corepack pnpm test
git status --short
```

Expected before GitHub publish:

- tests pass
- worktree is clean
- no secrets are committed
- generated folders like `runs/`, `dist/`, and `node_modules/` remain ignored
