import { getTemplateConfig, getVisualDirectionConfig, getVisualPackConfig } from "@archetype-studio/config";
import type { PostSpec, RenderPlan, RenderPlanSlide } from "@archetype-studio/core";

export function buildRenderPlan(runId: string, postSpec: PostSpec): RenderPlan {
  const templateId = postSpec.templateId ?? getTemplateDefaults(postSpec).templateId;
  const visualPack = postSpec.visualPack ?? getTemplateDefaults(postSpec).visualPack;
  const visualDirection = getVisualDirectionConfig(postSpec.visualDirectionId);
  const template = getTemplateConfig(templateId);
  const visualPackConfig = getVisualPackConfig(visualPack);

  const slides: RenderPlanSlide[] = [
    {
      id: `${postSpec.id}-cover`,
      kind: "cover",
      title: postSpec.hook,
      body: [postSpec.topic],
      imageSlots: visualPackConfig.assetSlots.slice(0, 1)
    },
    ...postSpec.archetypes.map((archetype) => ({
      id: archetype.id,
      kind: "archetype" as const,
      title: archetype.name,
      body: archetype.bullets,
      imageSlots: visualPackConfig.assetSlots.slice(0, 2)
    })),
    {
      id: `${postSpec.id}-cta`,
      kind: "cta",
      title: postSpec.cta ?? "Comment your type",
      body: postSpec.caption ? [postSpec.caption] : [],
      imageSlots: visualPackConfig.assetSlots.slice(-1)
    }
  ];

  return {
    runId,
    postId: postSpec.id,
    templateId: template.id,
    visualPack: visualPackConfig.id,
    visualDirectionId: visualDirection.id,
    width: template.width,
    height: template.height,
    slides
  };
}

function getTemplateDefaults(postSpec: PostSpec): {
  templateId: string;
  visualPack: string;
} {
  return {
    templateId: postSpec.templateId ?? "default-carousel",
    visualPack: postSpec.visualPack ?? "starter-pack"
  };
}
