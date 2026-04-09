import type { Mode, ModeConfig, TemplateConfig, VisualPackConfig } from "@archetype-studio/core";

import { mainstreamModeConfig } from "./modes/mainstream.js";
import { defaultCarouselTemplate } from "./templates/defaultCarousel.js";
import { starterVisualPack } from "./visual-packs/starterPack.js";

const modeConfigs: Record<Mode, ModeConfig> = {
  mainstream: mainstreamModeConfig
};

const templateConfigs: Record<string, TemplateConfig> = {
  [defaultCarouselTemplate.id]: defaultCarouselTemplate
};

const visualPackConfigs: Record<string, VisualPackConfig> = {
  [starterVisualPack.id]: starterVisualPack
};

export function getModeConfig(mode: Mode): ModeConfig {
  return modeConfigs[mode];
}

export function getTemplateConfig(templateId: string): TemplateConfig {
  const template = templateConfigs[templateId];

  if (!template) {
    throw new Error(`Unknown template config: ${templateId}`);
  }

  return template;
}

export function getVisualPackConfig(visualPackId: string): VisualPackConfig {
  const visualPack = visualPackConfigs[visualPackId];

  if (!visualPack) {
    throw new Error(`Unknown visual pack config: ${visualPackId}`);
  }

  return visualPack;
}

export function listModeConfigs(): ModeConfig[] {
  return Object.values(modeConfigs);
}

export function listTemplateConfigs(): TemplateConfig[] {
  return Object.values(templateConfigs);
}

export function listVisualPackConfigs(): VisualPackConfig[] {
  return Object.values(visualPackConfigs);
}
