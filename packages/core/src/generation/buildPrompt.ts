import type { GenerationPrompt, GenerationRequest, ModeConfig } from "../types.js";

export function buildPrompt(
  request: GenerationRequest,
  modeConfig: ModeConfig
): GenerationPrompt {
  return {
    system: [
      "You generate Instagram-style archetype post content.",
      "Return JSON only.",
      "Do not include markdown fences.",
      "Keep copy concise, vivid, and readable."
    ].join(" "),
    user: [
      `Mode: ${request.mode}`,
      `Topic: ${request.topic}`,
      request.audience ? `Audience: ${request.audience}` : undefined,
      `Archetypes required: ${modeConfig.minArchetypes}-${modeConfig.maxArchetypes}`,
      `Bullets per archetype: ${modeConfig.minBulletsPerArchetype}-${modeConfig.maxBulletsPerArchetype}`,
      `Max hook characters: ${modeConfig.maxTitleChars}`,
      `Max archetype name characters: ${modeConfig.maxArchetypeNameChars}`,
      `Max bullet characters: ${modeConfig.maxBulletChars}`,
      'JSON shape: {"hook": string, "archetypes": [{"name": string, "bullets": string[], "mood"?: string, "visualKeywords"?: string[]}], "caption"?: string, "cta"?: string, "tags"?: string[]}'
    ]
      .filter(Boolean)
      .join("\n")
  };
}
