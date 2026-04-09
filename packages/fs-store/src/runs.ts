import { randomUUID } from "node:crypto";
import path from "node:path";

export interface RunPaths {
  root: string;
  renderDir: string;
  inputFile: string;
  rawGenerationFile: string;
  postSpecFile: string;
  generationReportFile: string;
  renderPlanFile: string;
  reviewFile: string;
  metaFile: string;
  captionFile: string;
  qaReportFile: string;
  slideFile: (index: number) => string;
}

export function createRunId(): string {
  return randomUUID();
}

export function getRunPaths(baseDir: string, runId: string): RunPaths {
  const root = path.join(baseDir, "runs", runId);
  const renderDir = path.join(root, "render");

  return {
    root,
    renderDir,
    inputFile: path.join(root, "input.json"),
    rawGenerationFile: path.join(root, "raw-generation.json"),
    postSpecFile: path.join(root, "post-spec.json"),
    generationReportFile: path.join(root, "generation-report.json"),
    renderPlanFile: path.join(root, "render-plan.json"),
    reviewFile: path.join(root, "review.md"),
    metaFile: path.join(root, "meta.json"),
    captionFile: path.join(root, "caption.txt"),
    qaReportFile: path.join(root, "qa-report.json"),
    slideFile: (index: number) => path.join(renderDir, `slide-${index}.png`)
  };
}
