import type { GenerationPrompt, GenerationRequest, ModeConfig } from "../types.js";

export function buildPrompt(
  request: GenerationRequest,
  modeConfig: ModeConfig
): GenerationPrompt {
  return {
    system: [
      "You generate Instagram-style archetype post content.",
      "Archetype names must be metaphorical characters, real/public figures, animals, objects, places, symbols, or concepts.",
      "Do not use generic role labels like The Strategist, The Visionary, The Activist, Ghoster, Overthinker, or Leader.",
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
      `Max caption characters: ${modeConfig.maxCaptionChars}`,
      `Max CTA characters: ${modeConfig.maxCtaChars}`,
      "Choose one coherent namingFrame for the whole post.",
      "Every archetype name must belong to that same namingFrame.",
      "For a revolutionary topic, prefer concrete aligned figures or political concepts rather than generic roles. Example namingFrame: revolutionary figures. Example names: Trotsky, Rosa Luxemburg, Greta Thunberg, Toussaint Louverture.",
      "For a texting topic, use a playful metaphor set rather than direct texting roles. Example namingFrame: cats. Example names: Black Cat, Orange Cat, Siamese Cat, Alley Cat.",
      "For other topics, invent a fresh coherent frame: planets, weather systems, saints, monsters, school supplies, browser tabs, album genres, chess pieces, etc.",
      "Avoid names that start with \"The \" unless the phrase is a specific character/concept inside the namingFrame.",
      "CTA must be short, direct, and layout-safe. Good examples: \"Comment your type\", \"Drop your type\", \"Tag your group chat\".",
      "Avoid long CTA sentences or extra clauses.",
      'JSON shape: {"hook": string, "namingFrame": string, "archetypes": [{"name": string, "bullets": string[], "mood"?: string, "visualKeywords"?: string[]}], "caption"?: string, "cta"?: string, "tags"?: string[]}'
    ]
      .filter(Boolean)
      .join("\n")
  };
}
