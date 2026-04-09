import type { TemplateConfig } from "@archetype-studio/core";

export const defaultCarouselTemplate: TemplateConfig = {
  id: "default-carousel",
  width: 1080,
  height: 1350,
  supportedModes: ["mainstream"],
  slideKinds: ["cover", "archetype", "cta"]
};
