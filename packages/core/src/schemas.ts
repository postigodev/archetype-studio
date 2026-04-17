import { z } from "zod";

export const modeSchema = z.literal("mainstream");

export const generationRequestSchema = z.object({
  topic: z.string().min(1),
  mode: modeSchema,
  audience: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  visualPack: z.string().min(1).optional(),
  visualDirectionId: z.string().min(1).optional()
});

export const rawArchetypeSchema = z.object({
  name: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  mood: z.string().min(1).optional(),
  visualKeywords: z.array(z.string().min(1)).optional(),
  referenceSource: z.string().min(1).optional(),
  intensityScore: z.number().finite().optional()
});

export const rawModelOutputSchema = z.object({
  hook: z.string().min(1),
  namingFrame: z.string().min(1),
  archetypes: z.array(rawArchetypeSchema).min(1),
  caption: z.string().min(1).optional(),
  cta: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional()
});

export const archetypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  mood: z.string().min(1).optional(),
  visualKeywords: z.array(z.string().min(1)).optional(),
  referenceSource: z.string().min(1).optional(),
  intensityScore: z.number().finite().optional()
});

export const postSpecSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  mode: modeSchema,
  audience: z.string().min(1).optional(),
  hook: z.string().min(1),
  namingFrame: z.string().min(1),
  archetypes: z.array(archetypeSchema).min(1),
  caption: z.string().min(1).optional(),
  cta: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
  riskFlags: z.array(z.string().min(1)).optional(),
  visualPack: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  visualDirectionId: z.string().min(1)
});

export const modeConfigSchema = z.object({
  mode: modeSchema,
  minArchetypes: z.number().int().positive(),
  maxArchetypes: z.number().int().positive(),
  minBulletsPerArchetype: z.number().int().positive(),
  maxBulletsPerArchetype: z.number().int().positive(),
  maxTitleChars: z.number().int().positive(),
  maxArchetypeNameChars: z.number().int().positive(),
  maxBulletChars: z.number().int().positive(),
  maxCaptionChars: z.number().int().positive(),
  maxCtaChars: z.number().int().positive(),
  defaultTemplateId: z.string().min(1),
  defaultVisualPack: z.string().min(1)
});

export const renderPlanSlideSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["cover", "archetype", "cta"]),
  title: z.string().min(1),
  body: z.array(z.string()),
  imageSlots: z.array(z.string())
});

export const renderPlanSchema = z.object({
  runId: z.string().min(1),
  postId: z.string().min(1),
  templateId: z.string().min(1),
  visualPack: z.string().min(1),
  visualDirectionId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  slides: z.array(renderPlanSlideSchema).min(1)
});

export const renderMetaSchema = z.object({
  runId: z.string().min(1),
  postId: z.string().min(1),
  templateId: z.string().min(1),
  visualPack: z.string().min(1),
  visualDirectionId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  slideCount: z.number().int().positive(),
  generatedAt: z.string().min(1)
});

export const renderQaReportSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string())
});

export const templateConfigSchema = z.object({
  id: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  supportedModes: z.array(modeSchema).min(1),
  slideKinds: z.array(z.enum(["cover", "archetype", "cta"])).min(1)
});

export const visualPackConfigSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  supportedModes: z.array(modeSchema).min(1),
  assetSlots: z.array(z.string().min(1))
});

export const generationReportSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string())
});
