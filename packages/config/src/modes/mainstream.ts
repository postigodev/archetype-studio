import type { ModeConfig } from "@archetype-studio/core";

export const mainstreamModeConfig: ModeConfig = {
  mode: "mainstream",
  minArchetypes: 3,
  maxArchetypes: 6,
  minBulletsPerArchetype: 3,
  maxBulletsPerArchetype: 4,
  maxTitleChars: 80,
  maxArchetypeNameChars: 32,
  maxBulletChars: 120,
  maxCaptionChars: 180,
  maxCtaChars: 48,
  defaultTemplateId: "default-carousel",
  defaultVisualPack: "starter-pack"
};
