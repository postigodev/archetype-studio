import { runGenerateCommand } from "./commands/generate.js";
import { runRenderCommand } from "./commands/render.js";
import { runWorkflowCommand } from "./commands/run.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help") {
    printUsage();
    process.exitCode = 0;
    return;
  }

  if (command !== "generate" && command !== "render" && command !== "run") {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const exitCode =
      command === "generate"
        ? await runGenerateCommand(parseGenerateArgs(args.slice(1)))
        : command === "render"
          ? await runRenderCommand(parseRenderArgs(args.slice(1)))
          : await runWorkflowCommand(parseRunArgs(args.slice(1)));
    process.exitCode = exitCode;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown CLI error";
    console.error(message);
    process.exitCode = 1;
  }
}

function parseGenerateArgs(args: string[]) {
  const result: {
    cwd: string;
    topic?: string;
    inputPath?: string;
    audience?: string;
    mode?: "mainstream";
    runId?: string;
    mock?: boolean;
    mockVariant?: "valid" | "invalid";
  } = {
    cwd: process.cwd()
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--input") {
      result.inputPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--mode") {
      result.mode = args[index + 1] as "mainstream";
      index += 1;
      continue;
    }

    if (arg === "--audience") {
      result.audience = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--run-id") {
      result.runId = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--mock") {
      result.mock = true;
      continue;
    }

    if (arg === "--mock-variant") {
      const variant = args[index + 1];

      if (variant !== "valid" && variant !== "invalid") {
        throw new Error(`Unsupported mock variant: ${variant}`);
      }

      result.mockVariant = variant;
      index += 1;
      continue;
    }

    if (!arg.startsWith("--") && !result.topic) {
      result.topic = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return result;
}

function parseRenderArgs(args: string[]) {
  const result: {
    cwd: string;
    runId?: string;
    postSpecPath?: string;
    qaVariant?: "normal" | "invalid";
  } = {
    cwd: process.cwd()
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--run-id") {
      result.runId = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--post-spec") {
      result.postSpecPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--qa-variant") {
      const variant = args[index + 1];

      if (variant !== "normal" && variant !== "invalid") {
        throw new Error(`Unsupported QA variant: ${variant}`);
      }

      result.qaVariant = variant;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return result;
}

function printUsage(): void {
  console.log("Usage:");
  console.log("  archetype-studio generate <topic> [--mode mainstream] [--audience <value>] [--run-id <id>] [--mock] [--mock-variant valid|invalid]");
  console.log("  archetype-studio generate --input <path> [--run-id <id>] [--mock] [--mock-variant valid|invalid]");
  console.log("  archetype-studio render --run-id <id> [--qa-variant normal|invalid]");
  console.log("  archetype-studio render --post-spec <path> [--qa-variant normal|invalid]");
  console.log("  archetype-studio run <topic> [--mode mainstream] [--audience <value>] [--run-id <id>] [--mock] [--mock-variant valid|invalid] [--qa-variant normal|invalid]");
  console.log("  archetype-studio run --input <path> [--run-id <id>] [--mock] [--mock-variant valid|invalid] [--qa-variant normal|invalid]");
}

function parseRunArgs(args: string[]) {
  const result: {
    cwd: string;
    topic?: string;
    inputPath?: string;
    audience?: string;
    mode?: "mainstream";
    runId?: string;
    mock?: boolean;
    mockVariant?: "valid" | "invalid";
    qaVariant?: "normal" | "invalid";
  } = {
    cwd: process.cwd()
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--input") {
      result.inputPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--mode") {
      result.mode = args[index + 1] as "mainstream";
      index += 1;
      continue;
    }

    if (arg === "--audience") {
      result.audience = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--run-id") {
      result.runId = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--mock") {
      result.mock = true;
      continue;
    }

    if (arg === "--mock-variant") {
      const variant = args[index + 1];

      if (variant !== "valid" && variant !== "invalid") {
        throw new Error(`Unsupported mock variant: ${variant}`);
      }

      result.mockVariant = variant;
      index += 1;
      continue;
    }

    if (arg === "--qa-variant") {
      const variant = args[index + 1];

      if (variant !== "normal" && variant !== "invalid") {
        throw new Error(`Unsupported QA variant: ${variant}`);
      }

      result.qaVariant = variant;
      index += 1;
      continue;
    }

    if (!arg.startsWith("--") && !result.topic) {
      result.topic = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return result;
}

void main();
