import path from "node:path";

import { buildRenderPlan, renderBundle, runRenderQa } from "@archetype-studio/renderer";
import {
  getRunPaths,
  initializeRunArtifacts,
  readPostSpec,
  writeBinaryFile,
  writeJsonFile,
  writeTextFile
} from "@archetype-studio/fs-store";
import { postSpecSchema } from "@archetype-studio/core";

export interface RenderCommandOptions {
  cwd: string;
  runId?: string;
  postSpecPath?: string;
  qaVariant?: "normal" | "invalid";
}

export async function runRenderCommand(
  options: RenderCommandOptions
): Promise<number> {
  const resolved = resolveRenderInputs(options);
  const runPaths = await initializeRunArtifacts(options.cwd, resolved.runId);
  const postSpec = await readPostSpec(resolved.postSpecPath);
  const parseResult = postSpecSchema.safeParse(postSpec);

  if (!parseResult.success) {
    console.error("Render input failed PostSpec schema validation.");
    console.error(`Run root: ${runPaths.root}`);
    return 1;
  }

  const renderPlan = buildRenderPlan(resolved.runId, parseResult.data);
  const bundle = await renderBundle(parseResult.data, renderPlan);
  const meta =
    options.qaVariant === "invalid"
      ? { ...bundle.meta, slideCount: bundle.meta.slideCount - 1 }
      : bundle.meta;
  const qaReport = runRenderQa(parseResult.data, renderPlan, meta);

  await writeJsonFile(runPaths.renderPlanFile, renderPlan);
  await writeTextFile(runPaths.captionFile, bundle.caption);
  await writeJsonFile(runPaths.metaFile, meta);
  await writeTextFile(runPaths.reviewFile, bundle.review);
  await writeJsonFile(runPaths.qaReportFile, qaReport);

  for (const slide of bundle.slides) {
    await writeBinaryFile(runPaths.slideFile(slide.index), slide.bytes);
  }

  if (!qaReport.ok) {
    console.error("Render QA failed.");
    console.error(`Run root: ${runPaths.root}`);
    return 1;
  }

  console.log("Render completed successfully.");
  console.log(`Run ID: ${resolved.runId}`);
  console.log(`Run root: ${runPaths.root}`);
  console.log(`Render plan: ${runPaths.renderPlanFile}`);
  console.log(`Slides exported: ${bundle.slides.length}`);
  console.log(`QA report: ${runPaths.qaReportFile}`);

  return 0;
}

function resolveRenderInputs(options: RenderCommandOptions): {
  runId: string;
  postSpecPath: string;
} {
  if (options.runId) {
    const runPaths = getRunPaths(options.cwd, options.runId);
    return {
      runId: options.runId,
      postSpecPath: runPaths.postSpecFile
    };
  }

  if (options.postSpecPath) {
    const resolvedPath = path.resolve(options.cwd, options.postSpecPath);
    const runId = inferRunIdFromPath(resolvedPath);

    return {
      runId,
      postSpecPath: resolvedPath
    };
  }

  throw new Error("Either --run-id or --post-spec is required.");
}

function inferRunIdFromPath(postSpecPath: string): string {
  const parts = postSpecPath.split(path.sep);
  const runsIndex = parts.lastIndexOf("runs");

  if (runsIndex >= 0 && parts.length > runsIndex + 1) {
    return parts[runsIndex + 1];
  }

  return "manual-render";
}
