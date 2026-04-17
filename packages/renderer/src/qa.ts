import type {
  PostSpec,
  RenderMeta,
  RenderPlan,
  RenderQaReport
} from "@archetype-studio/core";
import type { RenderDiagnostics } from "./playwright.js";

export function runRenderQa(
  postSpec: PostSpec,
  renderPlan: RenderPlan,
  meta: RenderMeta,
  slideDiagnostics: Array<{ index: number; diagnostics: RenderDiagnostics }> = []
): RenderQaReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (meta.width !== renderPlan.width || meta.height !== renderPlan.height) {
    errors.push(
      `Render metadata dimensions (${meta.width}x${meta.height}) do not match render plan (${renderPlan.width}x${renderPlan.height}).`
    );
  }

  if (meta.slideCount !== renderPlan.slides.length) {
    errors.push(
      `Render metadata slide count (${meta.slideCount}) does not match render plan (${renderPlan.slides.length}).`
    );
  }

  if (renderPlan.slides.length < 3) {
    errors.push(`Expected at least 3 slides, received ${renderPlan.slides.length}.`);
  }

  for (const slide of renderPlan.slides) {
    if (slide.title.trim().length === 0) {
      errors.push(`Slide "${slide.id}" is missing a title.`);
    }

    if (slide.kind !== "cta" && slide.body.length === 0) {
      errors.push(`Slide "${slide.id}" has no body content.`);
    }

    if (slide.title.length > 120) {
      errors.push(`Slide "${slide.id}" title is too long (${slide.title.length}/120).`);
    }

    if (slide.body.length > 6) {
      errors.push(`Slide "${slide.id}" has too many body lines (${slide.body.length}/6).`);
    }

    for (const line of slide.body) {
      if (line.length > 140) {
        errors.push(
          `Slide "${slide.id}" contains an oversized body line (${line.length}/140).`
        );
      }
    }

    if (slide.imageSlots.some((slot) => slot.trim().length === 0)) {
      errors.push(`Slide "${slide.id}" contains an empty image slot reference.`);
    }
  }

  if (!postSpec.caption) {
    warnings.push("Caption export is empty.");
  }

  if (!postSpec.cta) {
    warnings.push("CTA was inferred rather than supplied by generation.");
  }

  const archetypeSlides = renderPlan.slides.filter((slide) => slide.kind === "archetype");

  if (archetypeSlides.length !== postSpec.archetypes.length) {
    errors.push(
      `Archetype slide count (${archetypeSlides.length}) does not match PostSpec archetype count (${postSpec.archetypes.length}).`
    );
  }

  for (const slide of slideDiagnostics) {
    if (slide.diagnostics.hasOverflow) {
      errors.push(
        `Slide ${slide.index} has DOM overflow or out-of-bounds content.`
      );
    }

    if (slide.diagnostics.outOfBoundsElements.length > 0) {
      errors.push(
        `Slide ${slide.index} has out-of-bounds elements: ${slide.diagnostics.outOfBoundsElements.join(", ")}.`
      );
    }

    if (slide.diagnostics.renderedAssetCount === 0) {
      warnings.push(`Slide ${slide.index} rendered without decorative assets.`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}
