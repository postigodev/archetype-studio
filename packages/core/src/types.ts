export type Mode = "mainstream";

export interface GenerationRequest {
  topic: string;
  mode: Mode;
  audience?: string;
  templateId?: string;
  visualPack?: string;
  visualDirectionId?: string;
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
  visualDirectionId: string;
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
  visualDirectionId: string;
  width: number;
  height: number;
  slides: RenderPlanSlide[];
}

export interface RenderMeta {
  runId: string;
  postId: string;
  templateId: string;
  visualPack: string;
  visualDirectionId: string;
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

export type TypographyStyle = "serif" | "grotesk" | "display" | "mono" | "mixed";

export type AssetStyle =
  | "photo-collage"
  | "stickers"
  | "illustration"
  | "ui-fragments"
  | "symbols"
  | "texture-only";

export type LayoutEnergy = "clean" | "dense" | "chaotic" | "minimal" | "poster";

export interface VisualDirectionConfig {
  id: string;
  label: string;
  palette: {
    background: string;
    panel: string;
    accent: string;
    ink: string;
    muted: string;
  };
  typographyStyle: TypographyStyle;
  assetStyle: AssetStyle;
  layoutEnergy: LayoutEnergy;
  moodTags: string[];
  assetPackIds: string[];
}

export type AssetKind = "texture" | "sticker" | "symbol" | "ui-fragment" | "photo-card";

export interface AssetConfig {
  id: string;
  label: string;
  kind: AssetKind;
  path: string;
  tags: string[];
  svg: string;
}

export interface AssetPackConfig {
  id: string;
  label: string;
  style: AssetStyle;
  assets: AssetConfig[];
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
