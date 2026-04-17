import type {
  GenerationRequest,
  AssetPackConfig,
  Mode,
  ModeConfig,
  TemplateConfig,
  VisualDirectionConfig,
  VisualPackConfig
} from "@archetype-studio/core";

import { assetPacks } from "./asset-packs/packs.js";
import { mainstreamModeConfig } from "./modes/mainstream.js";
import { defaultCarouselTemplate } from "./templates/defaultCarousel.js";
import {
  getVisualDirectionConfig,
  selectVisualDirection
} from "./visual-directions/selectVisualDirection.js";
import { visualDirections } from "./visual-directions/directions.js";
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

export function resolveVisualDirection(
  request: GenerationRequest
): VisualDirectionConfig {
  return selectVisualDirection(request);
}

export { getVisualDirectionConfig };

export function listVisualDirectionConfigs(): VisualDirectionConfig[] {
  return visualDirections;
}

export function getAssetPackConfig(assetPackId: string): AssetPackConfig {
  const assetPack = assetPacks.find((pack) => pack.id === assetPackId);

  if (!assetPack) {
    throw new Error(`Unknown asset pack: ${assetPackId}`);
  }

  return assetPack;
}

export function listAssetPackConfigs(): AssetPackConfig[] {
  return assetPacks;
}

export function getAssetPacksForVisualDirection(
  visualDirectionId: string
): AssetPackConfig[] {
  const direction = getVisualDirectionConfig(visualDirectionId);
  return direction.assetPackIds.map(getAssetPackConfig);
}
