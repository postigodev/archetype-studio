# CLI-First V1 Implementation Plan

## Overview

This plan translates the approved CLI-first v1 design into an implementation sequence.

The plan is intentionally structured to:

- establish stable package boundaries first
- get one complete happy-path pipeline working early
- add validation and rendering safeguards before expanding scope
- keep each milestone independently testable

The target outcome is a system that can:

1. accept one topic
2. generate one validated `PostSpec`
3. render a three-slide bundle
4. export artifacts for manual review and posting

## Build Order

Implementation should proceed in this order:

1. workspace and package scaffolding
2. core contracts and config
3. filesystem store and run artifact conventions
4. CLI `generate` command
5. validation hardening
6. CLI `render` command
7. render QA checks
8. convenience `run` command
9. tests and sample fixtures
10. documentation and operator ergonomics

This order ensures we prove the content contract before investing heavily in rendering polish.

## Milestone 1: Workspace Skeleton

### Goal

Create the monorepo and package layout with enough wiring to support isolated package work.

### Deliverables

- `package.json`
- `pnpm-workspace.yaml`
- base TypeScript config
- `apps/cli`
- `packages/core`
- `packages/renderer`
- `packages/config`
- `packages/fs-store`

### Tasks

- initialize workspace package boundaries
- add shared TypeScript configuration
- define package build/test/lint scripts
- set up package exports and path resolution
- create minimal README notes for package responsibilities if needed

### Acceptance Criteria

- the workspace installs successfully
- each package resolves imports cleanly
- the CLI app can import from all internal packages
- a no-op CLI command can execute successfully

## Milestone 2: Core Domain Contracts

### Goal

Make the pipeline contracts explicit before implementing behavior.

### Deliverables

- domain types for `Mode`, `GenerationRequest`, `RawModelOutput`, `PostSpec`, and `RenderPlan`
- Zod schemas for all external or AI-facing payloads
- parse helpers with typed success/error results

### Tasks

- define TypeScript interfaces in `packages/core`
- define Zod schemas for model outputs and persisted artifacts
- create parse helpers that return readable validation failures
- model one initial editorial mode in code

### Acceptance Criteria

- invalid payloads fail with structured errors
- valid payloads parse into strongly typed objects
- `PostSpec` can be serialized and deserialized safely

## Milestone 3: Config Package

### Goal

Centralize all declarative configuration needed for generation and rendering.

### Deliverables

- one v1 mode config
- one template metadata definition
- one visual-pack metadata definition
- config loaders and lookup helpers

### Tasks

- define config file format in `packages/config`
- store v1 limits such as title length, bullet count, and layout-safe copy thresholds
- define template identifiers and render assumptions
- define visual-pack metadata format even if the initial asset pack is minimal

### Acceptance Criteria

- config can be loaded without reaching into other packages
- unknown config IDs fail clearly
- defaults can be resolved from mode config alone

## Milestone 4: Filesystem Store

### Goal

Create a stable run-folder contract that every command uses.

### Deliverables

- run ID generation
- artifact read/write helpers
- folder creation helpers
- artifact path conventions for generation and render outputs

### Tasks

- define run directory layout under `runs/<run-id>/`
- implement JSON/text/binary write helpers
- implement read helpers for `input.json`, `raw-generation.json`, `post-spec.json`, and export artifacts
- ensure repeated command execution can target existing run IDs safely

### Acceptance Criteria

- every stage can read prior artifacts by run ID
- artifact names are deterministic and documented
- malformed or missing files produce readable errors

## Milestone 5: `generate` Command

### Goal

Implement the first half of the pipeline from topic input to validated `PostSpec`.

### Deliverables

- CLI argument parser
- topic string input support
- JSON input file support
- OpenAI request adapter
- prompt builder for one editorial mode
- generation artifact persistence

### Tasks

- normalize command-line input into `GenerationRequest`
- resolve mode defaults from config
- build prompt instructions that request strict JSON only
- call OpenAI and parse returned JSON
- write `input.json`, `raw-generation.json`, and `generation-report.json`
- persist `post-spec.json` only on successful validation

### Acceptance Criteria

- a valid topic produces a persisted `PostSpec`
- malformed model output fails cleanly without crashing the CLI
- intermediate artifacts are written for successful and failed generations where appropriate

## Milestone 6: Validation Hardening

### Goal

Turn validation into a real protection layer instead of a schema-only gate.

### Deliverables

- editorial validation rules
- copy density checks
- duplicate and similarity checks
- layout-safety checks based on template limits

### Tasks

- reject duplicate archetype names
- reject repeated bullet text
- reject empty required fields
- enforce max lengths from config
- add first-pass similarity rejection for overly overlapping archetypes
- add generation report messaging that explains why output was rejected

### Acceptance Criteria

- known-bad fixtures are rejected predictably
- validation failures are readable enough for prompt iteration
- renderer never receives structurally invalid or obviously unsafe copy

## Milestone 7: `render` Command

### Goal

Implement deterministic rendering from `PostSpec` to export bundle.

### Deliverables

- `RenderPlan` builder
- HTML/CSS template population
- Playwright screenshot flow
- Sharp post-processing pipeline
- caption and metadata export

### Tasks

- read `post-spec.json` by run ID or direct path
- resolve template and visual-pack metadata
- map `PostSpec` into slide-specific render data
- render slides in a fixed viewport
- export PNGs and text artifacts
- generate `meta.json` and `review.md`

### Acceptance Criteria

- a valid `PostSpec` renders a three-slide PNG bundle
- render output is deterministic across repeated runs with the same inputs
- render artifacts land in the expected run folder structure

## Milestone 8: Render QA Checks

### Goal

Catch obvious layout and export failures before outputs are considered review-ready.

### Deliverables

- overflow detection
- missing-slot detection
- export dimension checks
- basic contrast or readability guardrails where feasible

### Tasks

- add DOM- or measurement-based overflow checks during template render
- fail if required asset slots are unresolved
- verify image dimensions after export
- persist a QA report into the run folder

### Acceptance Criteria

- intentionally broken templates fail render validation
- QA failures are reported separately from generation failures
- valid bundles pass checks without manual intervention

## Milestone 9: `run` Command

### Goal

Provide a single convenience command without collapsing architectural boundaries.

### Deliverables

- `run` command that composes `generate` and `render`

### Tasks

- invoke `generate`
- stop immediately on generation failure
- invoke `render` using the generated run folder
- surface summarized output paths to the operator

### Acceptance Criteria

- `run` produces the same artifacts as invoking both stages manually
- intermediate files remain available for inspection

## Milestone 10: Tests, Fixtures, and Docs

### Goal

Make the v1 pipeline maintainable and understandable for future work.

### Deliverables

- unit tests for core parsing and validation
- config and fs-store tests
- renderer regression fixtures
- sample input files
- CLI usage documentation

### Tasks

- add fixture inputs for valid and invalid generations
- add tests for config lookup behavior
- add tests for run-folder conventions
- add at least one render regression fixture
- document example commands and expected outputs in the repo README

### Acceptance Criteria

- core validation logic has automated test coverage
- new contributors can run one example end-to-end from docs
- fixture-based regressions protect the first template family

## Suggested File Targets

These file targets are a starting point, not a rigid requirement.

```text
apps/
  cli/
    src/
      index.ts
      commands/
        generate.ts
        render.ts
        run.ts
packages/
  core/
    src/
      types.ts
      schemas.ts
      generation/
        buildPrompt.ts
        parseModelOutput.ts
      validation/
        validatePostSpec.ts
  config/
    src/
      modes/
        mainstream.ts
      templates/
        defaultCarousel.ts
      visual-packs/
        defaultPack.ts
      index.ts
  fs-store/
    src/
      runs.ts
      artifacts.ts
  renderer/
    src/
      buildRenderPlan.ts
      templates/
        carousel/
          renderHtml.ts
      playwright/
        renderSlides.ts
      qa/
        checkOverflow.ts
        checkExports.ts
      sharp/
        finalizeExports.ts
```

## Risks and Mitigations

### Risk: prompt variability breaks the pipeline

Mitigation:

- keep model output schema strict
- preserve raw outputs for debugging
- tighten validation before render

### Risk: rendering appears deterministic but hides overflow

Mitigation:

- add measurable overflow checks
- keep template-safe limits in config
- test with worst-case fixtures, not only happy-path copy

### Risk: package structure becomes ceremony without value

Mitigation:

- keep package APIs small
- avoid over-abstracting until two real use cases appear
- optimize for clear ownership, not maximum generality

## Definition of Done for V1

V1 is done when all of the following are true:

- a user can run one CLI command or the equivalent two-step flow
- the system accepts either a topic string or JSON input
- generation writes inspectable intermediate artifacts
- validation blocks unsafe or malformed outputs
- rendering exports a three-slide PNG bundle plus caption and metadata
- failures are clear about which stage broke and why
- basic automated tests protect the core contracts

## Immediate Next Implementation Move

Start with Milestones 1 through 4 together if convenient:

- scaffold workspace
- define core contracts
- define v1 config
- define filesystem artifact layout

That creates the foundation needed for both `generate` and `render` without forcing rework later.
