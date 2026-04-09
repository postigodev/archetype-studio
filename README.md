# Archetype Studio

A modular AI-assisted content engine for generating Instagram-style archetype posts across multiple editorial modes: mainstream, smart, political-historical, experimental, and niche verticals.

---

## What this is

This project is a **semi-automated content production system**.

It is not an autonomous social media bot.
Its job is to:

1. generate structured post ideas and archetypes,
2. validate them against strict layout constraints,
3. match them with visual assets,
4. render deterministic slides,
5. export final assets for manual review and posting.

The core principle is:

* **AI for language and ideation**
* **code for validation, layout, rendering, and repeatability**

That split is what keeps the system usable.

---

## Core goals

* Produce repeatable multi-slide social posts in a fixed visual format
* Support multiple editorial modes without rebuilding the pipeline
* Prevent broken layouts, overflow, and cut-off content
* Let AI generate copy without trusting it to control rendering
* Keep the workflow deterministic enough for batch production
* Preserve a recognizable editorial signature

---

## Editorial modes

All content runs through the same engine, but with different mode configurations.

### 1. Mainstream

Broad, low-friction content.

Examples:

* what kind of boy are you
* what kind of friend are you in the gc
* what kind of texter are you

### 2. Smart

Accessible but more conceptually sharp.

Examples:

* what kind of overthinker are you
* which academic aura do you have
* what kind of reader are you

### 3. Political-Historical

Harder-edged editorial identity.

Examples:

* what kind of revolutionary are you
* which empire logic are you trapped in
* what kind of political operator are you

### 4. Experimental

Format and concept R&D.

Examples:

* which contradiction are you
* what kind of collapse aesthetic do you have
* which failed future are you living in

### 5. Niche Vertical

Specific domains like music, bands, philosophy, programming, psychology, and history.

Examples:

* which programming language are you
* what kind of shoegaze listener are you
* which philosopher would annoy you most

---

## Recommended stack

### Language and runtime

* **TypeScript**
* **Node.js**

### Core app layer

* **Next.js** for internal dashboard/editor UI
* **Node scripts / API routes** for orchestration

### AI layer

* **OpenAI API** for structured generation, rewriting, and classification

### Validation and schemas

* **Zod** for runtime validation of AI outputs and configs

### Rendering

* **HTML/CSS templates** for deterministic layout
* **Playwright** for rendering templates to PNG
* **Sharp** for image resizing, compositing, format conversion, and export cleanup

### Storage

* **PostgreSQL** with **Prisma** if you want persistence early
* or start with **JSON + local folders** for v1

### Queue / jobs

* optional **BullMQ + Redis** if you later want batch rendering or async generation

### Assets

* local structured asset packs
* curated PNG/illustration sets
* optional generated transparent assets

### Deployment

* local-first for v1
* later deploy dashboard/API to **Vercel** or another Node-friendly platform
* keep renderer and heavy asset ops in a worker if needed

---

## Why this stack

This project is fundamentally a **layout-and-editorial control problem**, not a pure model problem.

The biggest failure mode is not weak text generation. It is:

* cut-off text
* unbalanced slides
* inconsistent assets
* style drift
* brittle automation

That is why the rendering layer should be deterministic and code-driven.

### Why not build around Canva automation?

Because browser-controlled design automation is fragile.
It depends on UI structure, selectors, and changing product behavior.
Canva can still be used as a manual finishing layer, but it should not be the core production engine.

### Why not build a neural network?

Because the system bottleneck is not low-level prediction. It is:

* ideation
* structure
* editorial filtering
* layout safety
* consistency

A custom neural network is premature here. A better path is:

* structured generation
* retrieval of prior good posts
* analytics feedback
* later, ranking/scoring models if needed

---

## High-level architecture

```text
Topic Intake
   ↓
Mode Router
   ↓
AI Generation (structured JSON)
   ↓
Validation / Constraint Enforcement
   ↓
Asset Matching
   ↓
Template Selection
   ↓
Rendering (HTML/CSS → Playwright → PNG)
   ↓
Quality Checks
   ↓
Export Package
   ↓
Manual Review and Posting
```

---

## System components

### 1. Topic intake

Responsible for collecting raw post ideas.

Sources may include:

* manual input
* CSV / spreadsheet import
* AI-generated topic lists
* trend-inspired seeds
* niche reference lists
* historical / political / music / philosophy topic banks

Example input:

```json
{
  "topic": "which programming language are you",
  "requestedMode": "niche"
}
```

---

### 2. Mode router

Maps a topic into an editorial mode and applies corresponding generation rules.

It decides:

* tone range
* seriousness
* irony tolerance
* reference density
* jargon tolerance
* default visual pack
* slide density limits

This should be rule-based first, with optional AI assistance later.

---

### 3. AI generation layer

Uses the model to generate structured post content.

The model should never return freeform text as the final internal format.
It should return strict JSON.

Example responsibilities:

* generate title hook
* generate archetype names
* generate bullet points
* generate caption variants
* classify niche intensity / controversy / accessibility

---

### 4. Validation layer

This is one of the most important parts of the entire system.

It enforces hard constraints like:

* max title length
* max archetypes per post
* max bullet count
* max bullet length
* total words per slide
* no empty fields
* no duplicate archetypes
* no archetypes that are semantically too similar
* no unsupported visual references

This layer protects the renderer from unstable model output.

---

### 5. Asset matching layer

Maps content to local visual assets.

Example responsibilities:

* choose character pack
* choose icon/symbol set
* choose background accents
* choose palette preset
* match archetype mood to illustration tags

This should be deterministic as much as possible.

Do not depend on live Google image scraping as a primary asset source.
Use curated local packs.

---

### 6. Template system

Contains reusable layout templates.

Examples:

* cover slide
* 2x2 archetype grid slide
* 2-column list slide
* CTA slide
* quote or reference slide

Each template should define:

* canvas size
* text boxes
* image slots
* font rules
* overflow behavior
* safe areas

---

### 7. Rendering engine

Renders the final slides.

Recommended flow:

* populate HTML template with validated content
* render in fixed viewport with Playwright
* export PNG
* optionally post-process with Sharp

This is better than handing layout decisions to a visual editor at runtime.

---

### 8. Quality check layer

Programmatic QA before export is finalized.

Checks may include:

* text overflow detection
* image clipping detection where possible
* empty asset slot detection
* contrast / visibility checks
* missing font fallback checks
* export dimension verification

---

### 9. Export package

Each generated post should export as a structured bundle.

Example:

```text
output/
  post-001/
    meta.json
    caption.txt
    slide-1.png
    slide-2.png
    slide-3.png
    review.md
```

---

### 10. Manual review and posting

Posting should remain manual in v1.

Why:

* protects quality
* lets you reject bad outputs
* prevents accidental brand drift
* gives you final editorial control

Full auto-posting can be considered later, but should not be the default starting point.

---

## Data model

### PostSpec

```ts
export type Mode =
  | "mainstream"
  | "smart"
  | "political_historical"
  | "experimental"
  | "niche";

export interface PostSpec {
  id: string;
  topic: string;
  mode: Mode;
  audience?: string;
  hook: string;
  archetypes: Archetype[];
  caption?: string;
  cta?: string;
  tags?: string[];
  riskFlags?: string[];
  visualPack?: string;
  templateId?: string;
}
```

### Archetype

```ts
export interface Archetype {
  id: string;
  name: string;
  bullets: string[];
  mood?: string;
  visualKeywords?: string[];
  referenceSource?: string;
  intensityScore?: number;
}
```

### ModeConfig

```ts
export interface ModeConfig {
  mode: Mode;
  minArchetypes: number;
  maxArchetypes: number;
  minBulletsPerArchetype: number;
  maxBulletsPerArchetype: number;
  maxTitleChars: number;
  maxArchetypeNameChars: number;
  maxBulletChars: number;
  maxJargonScore: number;
  maxNicheScore: number;
  defaultTemplateId: string;
  defaultVisualPack: string;
  seriousnessRange: [number, number];
  ironyRange: [number, number];
}
```

---

## Suggested folder structure

```text
archetype-engine/
  apps/
    studio/
      src/
        app/
        components/
        lib/
  packages/
    core/
      src/
        generation/
        validation/
        routing/
        scoring/
        assets/
        templates/
        types/
    renderer/
      src/
        html/
        playwright/
        sharp/
    config/
      src/
        modes/
        templates/
        visual-packs/
  assets/
    characters/
    icons/
    backgrounds/
    textures/
    fonts/
  prompts/
    generation/
    rewriting/
    captions/
    classification/
  scripts/
    generate-post.ts
    render-post.ts
    batch-generate.ts
  output/
  prisma/
    schema.prisma
  docs/
    architecture.md
    prompts.md
    modes.md
    templates.md
  README.md
  package.json
  pnpm-workspace.yaml
  turbo.json
```

---

## Suggested repo structure strategy

Use a **monorepo** if you expect to have:

* internal dashboard UI
* shared type system
* reusable renderer package
* config packages
* generation scripts

Recommended tooling:

* **pnpm workspaces**
* optional **Turborepo**

If you want the lightest possible v1, a single app repo is also fine. But if you already know this will grow, monorepo is cleaner.

---

## Suggested development phases

### Phase 1 — Core engine

Build the smallest viable pipeline.

Goals:

* generate one post from one topic
* validate JSON
* render 3 slides
* export PNGs and caption

Deliverables:

* one mode config
* one visual pack
* one template family
* one CLI command

### Phase 2 — Multi-mode support

Add all editorial modes.

Goals:

* mode router
* mode configs
* separate prompt strategies by mode
* multiple template presets

### Phase 3 — Asset system

Build structured asset packs.

Goals:

* archetype-to-asset mapping
* mood tags
* consistent visual language

### Phase 4 — Internal studio UI

Build a human-in-the-loop editor.

Goals:

* topic input
* preview
* re-generate button
* edit copy before render
* export bundle

### Phase 5 — Analytics and feedback

Track what works.

Goals:

* store topic/mode/output metadata
* track engagement metrics manually or semi-manually
* compare performance by mode, density, and hook type

### Phase 6 — Retrieval and ranking

Use previous successful posts as memory.

Goals:

* retrieve similar strong posts
* rank candidate outputs
* score for clarity / novelty / likely performance

---

## AI agent workflow

If coding this with an AI agent, split the work into bounded modules.

### Good agent tasks

* generate Zod schemas from interfaces
* scaffold route handlers
* write prompt templates
* implement JSON validation
* implement rendering scripts
* build HTML templates
* add tests for validators
* generate config files for modes and template presets

### Bad agent tasks to leave unbounded

* inventing product architecture from scratch every turn
* choosing visual rules without constraints
* creating prompts without schema targets
* controlling final editorial decisions in political content

### Best way to use the agent

Treat the agent as a **bounded implementer**, not as the owner of the system.

Give it:

* exact file targets
* exact interfaces
* exact responsibilities
* exact acceptance criteria

Example:

```text
Create packages/core/src/validation/postSpec.ts.
Implement Zod schemas for PostSpec, Archetype, and ModeConfig.
Reject duplicate archetype names.
Reject bullets longer than configured limits.
Return typed parse helpers.
Add Vitest tests.
```

That is the right granularity.

---

## Prompting strategy

Use separate prompt templates by mode.

### Shared prompt requirements

* always return JSON only
* no markdown
* no extra commentary
* respect exact schema
* generate distinct archetypes
* avoid overlap
* keep bullets compact and vivid

### Mode-specific controls

#### Mainstream

* highly relatable
* low jargon
* emotionally familiar

#### Smart

* sharper wording
* still accessible
* avoid essay-like density

#### Political-Historical

* conceptually coherent
* historically grounded when relevant
* avoid moralizing vagueness
* compress politics into social types, not lectures

#### Experimental

* allow abstraction and weirdness
* still maintain readable archetypes

#### Niche

* use domain vocabulary carefully
* keep enough context for non-experts to follow

---

## Example generation contract

```json
{
  "hook": "What kind of programmer are you?",
  "archetypes": [
    {
      "name": "Type System Loyalist",
      "bullets": [
        "catches bugs before they happen",
        "trusts structure more than vibes",
        "argues with unsafe code on principle",
        "secretly enjoys strictness"
      ],
      "mood": "precise",
      "visualKeywords": ["formal", "clean", "blue"]
    }
  ],
  "caption": "Some of you are writing JavaScript like it is a cry for help.",
  "cta": "Comment your type"
}
```

---

## Validation rules worth enforcing early

* reject repeated bullet text
* reject archetypes with very similar names
* reject outputs with weak contrast between categories
* reject total text density above template threshold
* reject title hooks that exceed safe layout length
* reject politically/historically vague outputs in political mode
* reject unsupported asset references

---

## Rendering strategy details

### Why HTML/CSS

Because it gives you:

* template flexibility
* precise control
* easy inspection
* easy testing
* no dependence on external editor UX

### Why Playwright

Because it gives you:

* consistent rendering environment
* fixed viewport screenshots
* automation-friendly exports
* repeatable results

### Why Sharp

Because it helps with:

* image normalization
* cropping
* transparent asset handling
* final export cleanup
* assembling thumbnails or preview composites

---

## Asset strategy

Do this:

* build curated packs
* tag assets by mood/style/domain
* normalize dimensions/backgrounds
* keep usage deterministic

Avoid this as a core dependency:

* raw Google image scraping
* inconsistent public PNGs
* random style mixtures
* brittle licensing situations

A good internal asset schema might include:

* id
* file path
* mode compatibility
* mood tags
* style tags
* palette tags
* safe crop metadata

---

## Persistence strategy

### Simple v1

Use files only:

* configs in JSON/TS
* outputs in folders
* prompts in markdown/txt

### Scaled version

Use PostgreSQL when you need:

* topic history
* post versioning
* review states
* analytics records
* asset metadata
* user/team workflows

---

## Analytics layer

You do not need a neural network first.
You need a feedback loop.

Track:

* topic
* mode
* post date
* template used
* visual pack used
* likes
* comments
* saves
* shares
* whether it was mainstream / smart / political / niche / experimental

Then answer:

* which modes perform best
* which hooks get saves vs likes
* whether niche posts build stronger retention
* whether political posts narrow or strengthen audience

Later you can add scoring or ranking models.
Not first.

---

## Security and operational notes

* keep API keys server-side only
* do not expose raw AI prompts in public client bundles
* sanitize generated text before rendering
* log validation failures
* log generation inputs/outputs for debugging
* keep asset packs versioned

---

## Testing strategy

### Unit tests

* mode router
* Zod validators
* asset matching logic
* caption generation helpers

### Snapshot tests

* rendered HTML structure
* exported slide previews for template regression

### Manual QA

* overflow
* clipping
* balance
* readability
* conceptual coherence

---

## Suggested initial commands

```bash
pnpm install
pnpm dev
pnpm generate:post
pnpm render:post
pnpm batch:generate
```

---

## Best repo name

Recommended repo title:

# `archetype-engine`

Why this is the best default:

* broad enough for all your modes
* not locked to Instagram
* not locked to quizzes only
* sounds like a system, not a gimmick
* leaves room for political, philosophical, musical, and niche content

Other good options:

* `mode-engine`
* `signal-carousel`
* `editorial-engine`
* `archetype-studio`
* `massformat`

But `archetype-engine` is the cleanest.

---

## Should the repo be public?

### Recommendation

Start **private**, then make a cleaned-up public version later.

### Why private first

Because early on you will likely have:

* messy prompts
* temporary assets
* half-working templates
* experiments you may not want exposed
* possible copyright/licensing uncertainty in asset sourcing
* hardcoded assumptions that are fine for you but not for outsiders

### When public makes sense

Make it public when:

* the architecture is coherent
* the asset story is clean
* secrets are removed
* prompts are intentional
* the repo teaches something real
* it reflects well on your engineering taste

### Best strategy

* build in private
* refactor and sanitize
* publish later as a polished portfolio/open-source system

That gives you both speed and reputation value.

---

## Final recommendation

Build this as:

* **one modular engine**
* **multiple editorial modes**
* **AI-assisted generation**
* **deterministic rendering**
* **manual posting**
* **analytics-informed iteration**

Do not build it as a fully autonomous social media bot.
Do not build a neural network first.
Do not make browser-controlled Canva automation the foundation.

Build the machine that produces good artifacts first.
Then optimize scale.

---

## Suggested first milestone

Implement a v1 that can:

* take one topic
* choose one mode
* generate structured JSON
* validate it
* render 3 slides
* export a caption and PNG carousel

If that works reliably, the rest becomes an expansion problem rather than a reinvention problem.
