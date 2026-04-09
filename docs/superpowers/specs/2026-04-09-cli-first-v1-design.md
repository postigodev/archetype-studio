# CLI-First V1 Design

## Overview

This spec defines the first implementation slice for Archetype Studio.

V1 will optimize for a reliable CLI-first pipeline that:

- accepts a topic as either a command-line string or a JSON input file
- generates structured content for a single editorial mode
- validates that content against schema and editorial constraints
- renders deterministic slide images from validated data
- exports a reviewable output bundle for manual posting

The primary goal is to prove the core engine, not the studio UI.

## Goals

- Prove end-to-end generation and rendering with deterministic outputs
- Keep AI limited to ideation and copy generation, not layout decisions
- Preserve inspectable intermediate artifacts for debugging and reruns
- Keep package boundaries clean enough to support a later dashboard UI
- Start with a files-only persistence model to minimize moving parts

## Non-Goals

- Multi-mode support in v1
- Dashboard or editor UI
- PostgreSQL or remote persistence
- Job queues or async workers
- Automated posting
- Live asset scraping
- Analytics, ranking, or performance feedback loops

## Architectural Direction

The approved approach is a thin CLI app over strong packages.

V1 should be organized around:

- `apps/cli`
- `packages/core`
- `packages/renderer`
- `packages/config`
- `packages/fs-store`

The central architectural rule is:

Only validated `PostSpec` artifacts may move from generation into rendering.

Raw model output is never treated as renderable state.

## Package Responsibilities

### `apps/cli`

Owns:

- command parsing
- argument normalization
- calling package APIs in the correct order
- logging and exit codes
- path selection for run folders

Does not own:

- editorial rules
- prompt design details
- validation logic
- rendering logic

### `packages/core`

Owns:

- TypeScript domain types
- Zod schemas
- input normalization
- mode-aware prompt construction
- OpenAI request/response adapters
- parsing structured JSON model output
- editorial and layout-safety validation

This package is the domain center of the system.

### `packages/renderer`

Owns:

- HTML template population
- asset slot resolution inputs
- Playwright rendering
- Sharp post-processing
- image export formatting
- visual QA checks such as overflow or missing-slot detection

This package should consume render-ready data, not prompt-related state.

### `packages/config`

Owns:

- mode definitions
- template metadata
- visual pack metadata
- fixed limits and defaults

This package should stay declarative wherever possible.

### `packages/fs-store`

Owns:

- run folder structure
- reading and writing JSON/text/image artifacts
- consistent naming conventions
- lookup helpers for intermediate and final outputs

This package exists to keep filesystem concerns out of the core engine.

## Core Contracts

The pipeline should use explicit contracts between stages.

### `GenerationRequest`

Represents normalized input into the generation stage.

Suggested fields:

- `topic`
- `mode`
- `audience?`
- `templateId?`
- `visualPack?`

This shape should be buildable from either:

- a topic string on the command line
- a JSON input file

### `RawModelOutput`

Represents the parsed JSON returned by the model before business validation.

Purpose:

- separate prompt/debugging concerns from editorial acceptance
- retain a record of what the model attempted to produce

### `PostSpec`

Represents validated canonical content for downstream use.

This is the handoff artifact from generation to rendering.

Once a `PostSpec` exists, downstream stages should not need to know:

- which prompt created it
- what the raw model payload looked like
- how input arguments were parsed

### `RenderPlan`

Represents renderer-specific resolved state derived from:

- `PostSpec`
- config
- template metadata
- asset metadata

Suggested responsibilities:

- slide ordering
- resolved template choice
- per-slide text blocks
- resolved asset paths
- export dimensions
- renderer-safe slot coordinates

This keeps rendering deterministic and easy to test.

## Runtime Flow

### Command: `generate`

Responsibilities:

1. Parse CLI args or input file
2. Normalize input into `GenerationRequest`
3. Load mode and template defaults from config
4. Build the model prompt
5. Call OpenAI
6. Parse JSON response
7. Validate schema and editorial constraints
8. Write generation artifacts to disk

Artifacts written:

- `runs/<run-id>/input.json`
- `runs/<run-id>/raw-generation.json`
- `runs/<run-id>/post-spec.json`
- `runs/<run-id>/generation-report.json`

### Command: `render`

Responsibilities:

1. Read a validated `post-spec.json`
2. Resolve template and visual pack metadata
3. Build a `RenderPlan`
4. Populate HTML/CSS templates
5. Render slides with Playwright
6. Post-process assets with Sharp if needed
7. Run visual QA checks
8. Export the review bundle

Artifacts written:

- `runs/<run-id>/render/slide-1.png`
- `runs/<run-id>/render/slide-2.png`
- `runs/<run-id>/render/slide-3.png`
- `runs/<run-id>/caption.txt`
- `runs/<run-id>/meta.json`
- `runs/<run-id>/review.md`

### Command: `run`

This is an optional convenience command that performs:

1. `generate`
2. `render`

It should still rely on the same intermediate files rather than bypassing them.

## Failure Model

Failures should be explicit, stage-specific, and debuggable.

### Input or Config Failures

Examples:

- unknown mode
- missing template
- invalid visual pack override
- missing required files

Behavior:

- fail before calling the model
- return a clear CLI error
- write diagnostic output where useful

### Generation or Validation Failures

Examples:

- malformed JSON
- duplicate archetype names
- repeated bullet text
- title too long for safe layout
- archetypes too semantically similar
- unsupported asset references

Behavior:

- preserve raw generation output
- emit a structured validation report
- fail `generate` without attempting render

### Rendering or QA Failures

Examples:

- overflow
- clipping
- missing asset slot
- export dimension mismatch
- unreadable contrast

Behavior:

- fail `render`
- keep validated `post-spec.json`
- preserve partial outputs where useful for debugging

## Filesystem Layout

Suggested top-level structure:

```text
apps/
  cli/
packages/
  core/
  renderer/
  config/
  fs-store/
assets/
prompts/
runs/
docs/
  superpowers/
    specs/
README.md
package.json
pnpm-workspace.yaml
```

The `runs/` directory should be the main operational output location in v1.

Each run folder should contain both intermediate and final artifacts so reruns are easy to reason about.

## Testing Strategy

### Unit Tests

Focus on:

- schema parsing
- mode config loading
- input normalization
- validation rules
- file path conventions

### Renderer Regression Tests

Focus on:

- generated HTML snapshots
- template data mapping
- selected rendered image regression checks where practical

### Manual QA

Required for v1:

- text readability
- overflow and clipping review
- image balance
- asset consistency
- conceptual coherence of archetypes

## Initial Scope Recommendation

The first deliverable should support:

- one editorial mode
- one template family
- one visual pack
- one end-to-end CLI workflow

The first milestone is successful if a user can:

1. supply one topic
2. generate one valid `PostSpec`
3. render a three-slide bundle
4. inspect outputs for manual approval and posting

## Design Rationale

This design intentionally biases toward:

- debuggability over automation
- deterministic rendering over generative layout
- clean contracts over fast but tangled scripting
- filesystem artifacts over hidden state

That makes v1 a proof of engine quality rather than a half-finished product shell.

If this architecture works well, the next layer of growth is straightforward:

- add more mode configs
- add more template families
- add a UI that calls the same package APIs
- add persistence only when workflow complexity actually requires it
