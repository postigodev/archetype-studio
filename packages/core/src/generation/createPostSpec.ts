import { parseWithSchema } from "../parse.js";
import { postSpecSchema } from "../schemas.js";
import type {
  GeneratePostSpecResult,
  GenerationRequest,
  ModeConfig,
  PostSpec,
  RawModelOutput
} from "../types.js";
import { validatePostSpec } from "../validation/validatePostSpec.js";

export function createPostSpec(
  request: GenerationRequest,
  rawModelOutput: RawModelOutput,
  modeConfig: ModeConfig,
  visualDirectionId: string
): GeneratePostSpecResult {
  const candidate: PostSpec = {
    id: slugify(request.topic),
    topic: request.topic,
    mode: request.mode,
    audience: request.audience,
    hook: rawModelOutput.hook,
    namingFrame: rawModelOutput.namingFrame,
    archetypes: rawModelOutput.archetypes.map((archetype, index) => ({
      id: `${slugify(archetype.name)}-${index + 1}`,
      name: archetype.name,
      bullets: archetype.bullets,
      mood: archetype.mood,
      visualKeywords: archetype.visualKeywords,
      referenceSource: archetype.referenceSource,
      intensityScore: archetype.intensityScore
    })),
    caption: rawModelOutput.caption,
    cta: rawModelOutput.cta,
    tags: rawModelOutput.tags,
    templateId: request.templateId ?? modeConfig.defaultTemplateId,
    visualPack: request.visualPack ?? modeConfig.defaultVisualPack,
    visualDirectionId
  };

  const validation = parseWithSchema(postSpecSchema, candidate);

  if (!validation.ok) {
    return {
      report: {
        ok: false,
        errors: validation.errors,
        warnings: []
      },
      rawModelOutput
    };
  }

  const report = validatePostSpec(validation.data, modeConfig);

  if (!report.ok) {
    return {
      report,
      rawModelOutput
    };
  }

  return {
    report,
    rawModelOutput,
    postSpec: validation.data
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
