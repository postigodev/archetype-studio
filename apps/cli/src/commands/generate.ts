import { readFile } from "node:fs/promises";
import path from "node:path";

import { getModeConfig } from "@archetype-studio/config";
import {
  buildPrompt,
  createPostSpec,
  generationRequestSchema,
  parseModelOutput,
  type GenerationPrompt,
  type GenerationRequest,
  type ModelGenerationResult,
  type Mode
} from "@archetype-studio/core";
import {
  createRunId,
  initializeRunArtifacts,
  writeJsonFile
} from "@archetype-studio/fs-store";

export interface GenerateCommandOptions {
  cwd: string;
  topic?: string;
  inputPath?: string;
  mode?: Mode;
  audience?: string;
  runId?: string;
  mock?: boolean;
  mockVariant?: "valid" | "invalid";
}

export async function runGenerateCommand(
  options: GenerateCommandOptions
): Promise<number> {
  const request = await loadGenerationRequest(options);
  const modeConfig = getModeConfig(request.mode);
  const prompt = buildPrompt(request, modeConfig);
  const runId = options.runId ?? createRunId();
  const runPaths = await initializeRunArtifacts(options.cwd, runId);

  await writeJsonFile(runPaths.inputFile, request);

  let modelResult: ModelGenerationResult;

  try {
    modelResult = await generateModelOutput(prompt, {
      topic: request.topic,
      mock: options.mock ?? false,
      mockVariant: options.mockVariant ?? "valid"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";

    await writeJsonFile(runPaths.generationReportFile, {
      ok: false,
      errors: [message],
      warnings: []
    });

    console.error(`Generation failed: ${message}`);
    console.error(`Run root: ${runPaths.root}`);
    return 1;
  }

  await writeJsonFile(runPaths.rawGenerationFile, {
    rawText: modelResult.rawText,
    responseId: modelResult.responseId
  });

  const parsedOutput = parseModelOutput(modelResult.rawText);

  if (!parsedOutput.ok) {
    await writeJsonFile(runPaths.generationReportFile, {
      ok: false,
      errors: parsedOutput.errors,
      warnings: []
    });

    console.error("Generation failed validation.");
    console.error(`Run root: ${runPaths.root}`);
    return 1;
  }

  const generationResult = createPostSpec(request, parsedOutput.data, modeConfig);
  await writeJsonFile(runPaths.generationReportFile, generationResult.report);

  if (!generationResult.report.ok || !generationResult.postSpec) {
    console.error("Generation did not produce a valid PostSpec.");
    console.error(`Run root: ${runPaths.root}`);
    return 1;
  }

  await writeJsonFile(runPaths.postSpecFile, generationResult.postSpec);

  console.log("Generation completed successfully.");
  console.log(`Run ID: ${runId}`);
  console.log(`Run root: ${runPaths.root}`);
  console.log(`PostSpec: ${runPaths.postSpecFile}`);
  console.log(`Report: ${runPaths.generationReportFile}`);

  return 0;
}

async function loadGenerationRequest(
  options: GenerateCommandOptions
): Promise<GenerationRequest> {
  if (options.inputPath) {
    const inputFile = path.resolve(options.cwd, options.inputPath);
    const rawContents = await readFile(inputFile, "utf8");
    const parsedJson = JSON.parse(rawContents) as unknown;
    const result = generationRequestSchema.safeParse(parsedJson);

    if (!result.success) {
      throw new Error(
        `Input file failed schema validation: ${result.error.issues
          .map((issue) => issue.message)
          .join(", ")}`
      );
    }

    return result.data;
  }

  if (!options.topic) {
    throw new Error("A topic or --input file is required.");
  }

  return {
    topic: options.topic,
    mode: options.mode ?? "mainstream",
    audience: options.audience
  };
}

async function generateModelOutput(
  prompt: GenerationPrompt,
  options: { topic: string; mock: boolean; mockVariant: "valid" | "invalid" }
): Promise<ModelGenerationResult> {
  if (options.mock) {
    return {
      rawText: JSON.stringify(
        options.mockVariant === "invalid"
          ? buildInvalidMockOutput(options.topic)
          : buildMockOutput(options.topic),
        null,
        2
      ),
      responseId: "mock-response"
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required unless --mock is used.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: prompt.system }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt.user }]
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as {
    id?: string;
    output_text?: string;
  };

  if (!payload.output_text) {
    throw new Error("OpenAI response did not include output_text.");
  }

  return {
    rawText: payload.output_text,
    responseId: payload.id
  };
}

function buildMockOutput(topic: string) {
  return {
    hook: toHook(topic),
    archetypes: [
      {
        name: "Double Texter",
        bullets: [
          "sends the follow-up before the panic settles",
          "treats silence like a systems alert",
          "would rather risk embarrassment than ambiguity"
        ],
        mood: "urgent",
        visualKeywords: ["phone", "blue", "spark"]
      },
      {
        name: "Paragraph Crafter",
        bullets: [
          "writes messages with a beginning, middle, and thesis",
          "cannot send a one-word reply without irony damage",
          "turns every update into a miniature essay"
        ],
        mood: "earnest",
        visualKeywords: ["notes", "warm", "grid"]
      },
      {
        name: "Ghost Mode Minimalist",
        bullets: [
          "answers eventually and acts like time is fake",
          "communicates mostly through timing and implication",
          "believes brevity is a complete emotional vocabulary"
        ],
        mood: "detached",
        visualKeywords: ["shadow", "gray", "quiet"]
      }
    ],
    caption: "Your texting style has already become lore in at least three group chats.",
    cta: "Comment your type",
    tags: ["mainstream", "texting", "archetypes"]
  };
}

function buildInvalidMockOutput(topic: string) {
  return {
    hook: `${toHook(topic)} ${"x".repeat(90)}`,
    archetypes: [
      {
        name: "Double Texter",
        bullets: [
          "sends the follow-up before the panic settles",
          "sends the follow-up before the panic settles",
          "would rather risk embarrassment than ambiguity"
        ]
      },
      {
        name: "double texter",
        bullets: [
          "sends the follow-up before the panic settles",
          "communicates mostly through timing and implication",
          "believes brevity is a complete emotional vocabulary"
        ]
      }
    ],
    caption: "c".repeat(220),
    cta: "This call to action is intentionally much too long for the configured limit",
    tags: ["invalid"]
  };
}

function toHook(topic: string): string {
  const normalized = topic.trim();
  return normalized.endsWith("?") ? normalized : `${capitalize(normalized)}?`;
}

function capitalize(input: string): string {
  if (input.length === 0) {
    return input;
  }

  return `${input[0].toUpperCase()}${input.slice(1)}`;
}
