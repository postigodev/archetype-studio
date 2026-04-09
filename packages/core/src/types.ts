export type Mode = "mainstream";

export interface GenerationRequest {
  topic: string;
  mode: Mode;
  audience?: string;
  templateId?: string;
  visualPack?: string;
}

export interface GenerationPrompt {
  system: string;
  user: string;
}

export interface Archetype {
  id: string;
  name: string;
  bullets: string[];
  mood?: string;
  visualKeywords?: string[];
  referenceSource?: string;
  intensityScore?: number;
}

export interface RawModelOutput {
  hook: string;
  archetypes: Array<{
    name: string;
    bullets: string[];
    mood?: string;
    visualKeywords?: string[];
    referenceSource?: string;
    intensityScore?: number;
  }>;
  caption?: string;
  cta?: string;
  tags?: string[];
}

export interface PostSpec {
  id: string;
  topic: string;
  mode: Mode;
  audience?: string;
  hook: string;
  archetypes: Archetype[];
  caption?: string;
  cta?: string;
  tags?: string[];
  riskFlags?: string[];
  visualPack?: string;
  templateId?: string;
}

export interface RenderPlanSlide {
  id: string;
  kind: "cover" | "archetype" | "cta";
  title: string;
  body: string[];
  imageSlots: string[];
}

export interface RenderPlan {
  runId: string;
  postId: string;
  templateId: string;
  visualPack: string;
  width: number;
  height: number;
  slides: RenderPlanSlide[];
}

export interface RenderMeta {
  runId: string;
  postId: string;
  templateId: string;
  visualPack: string;
  width: number;
  height: number;
  slideCount: number;
  generatedAt: string;
}

export interface RenderQaReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface ModeConfig {
  mode: Mode;
  minArchetypes: number;
  maxArchetypes: number;
  minBulletsPerArchetype: number;
  maxBulletsPerArchetype: number;
  maxTitleChars: number;
  maxArchetypeNameChars: number;
  maxBulletChars: number;
  maxCaptionChars: number;
  maxCtaChars: number;
  defaultTemplateId: string;
  defaultVisualPack: string;
}

export interface TemplateConfig {
  id: string;
  width: number;
  height: number;
  supportedModes: Mode[];
  slideKinds: Array<RenderPlanSlide["kind"]>;
}

export interface VisualPackConfig {
  id: string;
  label: string;
  supportedModes: Mode[];
  assetSlots: string[];
}

export interface GenerationReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface ModelGenerationResult {
  rawText: string;
  responseId?: string;
}

export interface GeneratePostSpecResult {
  report: GenerationReport;
  rawModelOutput?: RawModelOutput;
  postSpec?: PostSpec;
}
