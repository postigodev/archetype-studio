import type { PostSpec, RenderMeta, RenderPlan } from "@archetype-studio/core";

import { buildSlideHtml } from "./html.js";
import { renderHtmlToPng, type RenderDiagnostics } from "./playwright.js";

export interface RenderedSlide {
  index: number;
  fileName: string;
  bytes: Uint8Array;
  diagnostics: RenderDiagnostics;
}

export interface RenderBundleResult {
  caption: string;
  meta: RenderMeta;
  review: string;
  slides: RenderedSlide[];
}

export async function renderBundle(
  postSpec: PostSpec,
  renderPlan: RenderPlan
): Promise<RenderBundleResult> {
  const slides = await Promise.all(
    renderPlan.slides.map(async (slide, index) => {
      const rendered = await renderHtmlToPng(
        buildSlideHtml(
          renderPlan.width,
          renderPlan.height,
          slide,
          renderPlan.visualDirectionId
        ),
        renderPlan.width,
        renderPlan.height
      );

      return {
        index: index + 1,
        fileName: `slide-${index + 1}.png`,
        bytes: rendered.bytes,
        diagnostics: rendered.diagnostics
      };
    })
  );

  const meta: RenderMeta = {
    runId: renderPlan.runId,
    postId: renderPlan.postId,
    templateId: renderPlan.templateId,
    visualPack: renderPlan.visualPack,
    visualDirectionId: renderPlan.visualDirectionId,
    width: renderPlan.width,
    height: renderPlan.height,
    slideCount: slides.length,
    generatedAt: new Date().toISOString()
  };

  return {
    caption: postSpec.caption ?? "",
    meta,
    review: buildReview(postSpec, renderPlan),
    slides
  };
}

function buildReview(postSpec: PostSpec, renderPlan: RenderPlan): string {
  const lines = [
    "# Render Review",
    "",
    `- Topic: ${postSpec.topic}`,
    `- Mode: ${postSpec.mode}`,
    `- Template: ${renderPlan.templateId}`,
    `- Visual Pack: ${renderPlan.visualPack}`,
    `- Slide Count: ${renderPlan.slides.length}`,
    "",
    "## Slide Checklist",
    ...renderPlan.slides.flatMap((slide, index) => [
      `- Slide ${index + 1}: ${slide.kind} / ${slide.title}`,
      `  Body lines: ${slide.body.length}`,
      `  Image slots: ${slide.imageSlots.join(", ") || "none"}`
    ])
  ];

  return `${lines.join("\n")}\n`;
}
