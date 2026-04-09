import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  GenerationReport,
  PostSpec,
  RenderMeta,
  RenderPlan
} from "@archetype-studio/core";

import { getRunPaths, type RunPaths } from "./runs.js";

export async function ensureRunDirectories(paths: RunPaths): Promise<void> {
  await mkdir(paths.root, { recursive: true });
  await mkdir(paths.renderDir, { recursive: true });
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeTextFile(filePath: string, value: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value, "utf8");
}

export async function writeBinaryFile(
  filePath: string,
  value: Uint8Array
): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, value);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

export async function initializeRunArtifacts(
  baseDir: string,
  runId: string
): Promise<RunPaths> {
  const paths = getRunPaths(baseDir, runId);
  await ensureRunDirectories(paths);
  return paths;
}

export async function readPostSpec(filePath: string): Promise<PostSpec> {
  return readJsonFile<PostSpec>(filePath);
}

export async function readRenderPlan(filePath: string): Promise<RenderPlan> {
  return readJsonFile<RenderPlan>(filePath);
}

export async function readGenerationReport(filePath: string): Promise<GenerationReport> {
  return readJsonFile<GenerationReport>(filePath);
}

export async function readRenderMeta(filePath: string): Promise<RenderMeta> {
  return readJsonFile<RenderMeta>(filePath);
}
