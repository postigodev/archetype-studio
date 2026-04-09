import type { Mode } from "@archetype-studio/core";
import { createRunId } from "@archetype-studio/fs-store";

import { runGenerateCommand } from "./generate.js";
import { runRenderCommand } from "./render.js";

export interface RunCommandOptions {
  cwd: string;
  topic?: string;
  inputPath?: string;
  mode?: Mode;
  audience?: string;
  runId?: string;
  mock?: boolean;
  mockVariant?: "valid" | "invalid";
  qaVariant?: "normal" | "invalid";
}

export async function runWorkflowCommand(
  options: RunCommandOptions
): Promise<number> {
  const runId = options.runId ?? createRunId();

  const generateExitCode = await runGenerateCommand({
    cwd: options.cwd,
    topic: options.topic,
    inputPath: options.inputPath,
    mode: options.mode,
    audience: options.audience,
    runId,
    mock: options.mock,
    mockVariant: options.mockVariant
  });

  if (generateExitCode !== 0) {
    return generateExitCode;
  }

  return runRenderCommand({
    cwd: options.cwd,
    runId,
    qaVariant: options.qaVariant
  });
}
