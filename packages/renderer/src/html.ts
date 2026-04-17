import {
  getAssetPacksForVisualDirection,
  getVisualDirectionConfig
} from "@archetype-studio/config";
import type { RenderPlanSlide } from "@archetype-studio/core";

export function buildSlideHtml(
  width: number,
  height: number,
  slide: RenderPlanSlide,
  visualDirectionId = "soft-sticker-board"
): string {
  const direction = getVisualDirectionConfig(visualDirectionId);
  const assets = getAssetPacksForVisualDirection(visualDirectionId).flatMap(
    (pack) => pack.assets
  );
  const palette = direction.palette;
  const typography = getTypography(direction.typographyStyle);
  const energy = getEnergyClass(direction.layoutEnergy);
  const bodyItems = slide.body
    .map(
      (line) =>
        `<li class="body-line"><span class="body-copy">${escapeHtml(line)}</span></li>`
    )
    .join("");
  const slotBadges = slide.imageSlots
    .map((slot) => `<span class="slot">${escapeHtml(slot)}</span>`)
    .join("");
  const assetElements = assets
    .slice(0, 4)
    .map(
      (asset, index) =>
        `<img class="asset asset-${index + 1}" src="${svgToDataUri(asset.svg)}" alt="${escapeHtml(asset.label)}" style="${getAssetPlacement(index)}" />`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        --bg: ${palette.background};
        --panel: ${palette.panel};
        --accent: ${palette.accent};
        --ink: ${palette.ink};
        --muted: ${palette.muted};
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        font-family: ${typography.display};
        background:
          ${getBackgroundTexture(direction.assetStyle)},
          var(--bg);
        color: var(--ink);
      }

      body {
        padding: 48px;
      }

      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        gap: ${energy.gap}px;
        background:
          radial-gradient(circle at top right, rgba(255,255,255,0.45), transparent 30%),
          linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0)),
          var(--panel);
        border: 2px solid rgba(0, 0, 0, 0.05);
        border-radius: ${energy.radius}px;
        padding: ${energy.padding};
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }

      .asset {
        position: absolute;
        z-index: 0;
        width: 150px;
        height: 150px;
        object-fit: contain;
        opacity: 0.88;
        filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.16));
        pointer-events: none;
      }

      .eyebrow,
      .title,
      .content,
      .footer {
        position: relative;
        z-index: 1;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        justify-self: start;
        border-radius: 999px;
        padding: 10px 18px;
        background: var(--accent);
        color: white;
        font: 700 20px/1.1 Arial, sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .title {
        margin: 0;
        max-width: 860px;
        font-family: ${typography.display};
        font-size: ${slide.kind === "cover" ? energy.coverTitle : slide.kind === "cta" ? energy.ctaTitle : energy.slideTitle}px;
        line-height: 0.96;
        letter-spacing: -0.04em;
      }

      .content {
        display: grid;
        grid-template-columns: ${slide.kind === "archetype" ? "1fr 220px" : "1fr"};
        gap: 32px;
        align-items: start;
        min-height: 0;
      }

      .body {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 18px;
      }

      .body-line {
        display: grid;
        grid-template-columns: 18px 1fr;
        gap: 14px;
        align-items: start;
      }

      .body-line::before {
        content: "";
        width: 12px;
        height: 12px;
        margin-top: 12px;
        border-radius: 999px;
        background: var(--accent);
      }

      .body-copy {
        display: block;
        font: 500 ${energy.bodySize}px/1.18 ${typography.body};
        color: var(--muted);
      }

      .art {
        min-height: 220px;
        border-radius: 24px;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0)),
          ${getArtTexture(direction.assetStyle)},
          linear-gradient(160deg, var(--accent), rgba(255,255,255,0.1));
        border: 1px solid rgba(0,0,0,0.05);
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .art::after {
        content: "${escapeCssContent(direction.assetStyle)}";
        color: rgba(255,255,255,0.88);
        font: 700 24px/1 Arial, sans-serif;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: end;
      }

      .slots {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .slot {
        display: inline-flex;
        align-items: center;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        padding: 8px 12px;
        font: 600 16px/1 Arial, sans-serif;
        color: var(--muted);
        background: rgba(255,255,255,0.45);
      }

      .signature {
        font: 700 18px/1 Arial, sans-serif;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
    </style>
  </head>
  <body>
    <main class="frame" data-kind="${escapeHtml(slide.kind)}" data-direction="${escapeHtml(direction.id)}">
      ${assetElements}
      <div class="eyebrow">${escapeHtml(direction.label)}</div>
      <h1 class="title">${escapeHtml(slide.title)}</h1>
      <section class="content">
        <ul class="body">${bodyItems}</ul>
        ${slide.kind === "archetype" ? '<aside class="art"></aside>' : ""}
      </section>
      <footer class="footer">
        <div class="slots">${slotBadges}</div>
        <div class="signature">Archetype Studio</div>
      </footer>
    </main>
  </body>
</html>`;
}

function getTypography(style: string): { display: string; body: string } {
  switch (style) {
    case "mono":
      return { display: '"Courier New", monospace', body: '"Courier New", monospace' };
    case "grotesk":
      return { display: 'Arial Black, Arial, sans-serif', body: 'Arial, sans-serif' };
    case "display":
      return { display: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', body: 'Arial, sans-serif' };
    case "mixed":
      return { display: 'Georgia, "Times New Roman", serif', body: 'Arial, sans-serif' };
    case "serif":
    default:
      return { display: 'Georgia, "Times New Roman", serif', body: 'Arial, sans-serif' };
  }
}

function getEnergyClass(style: string): {
  gap: number;
  radius: number;
  padding: string;
  coverTitle: number;
  ctaTitle: number;
  slideTitle: number;
  bodySize: number;
} {
  switch (style) {
    case "chaotic":
      return { gap: 22, radius: 18, padding: "36px 38px 34px", coverTitle: 78, ctaTitle: 66, slideTitle: 58, bodySize: 31 };
    case "dense":
      return { gap: 18, radius: 8, padding: "34px 36px 32px", coverTitle: 68, ctaTitle: 58, slideTitle: 52, bodySize: 28 };
    case "minimal":
      return { gap: 36, radius: 4, padding: "54px 56px 48px", coverTitle: 70, ctaTitle: 58, slideTitle: 50, bodySize: 30 };
    case "poster":
      return { gap: 24, radius: 0, padding: "42px 46px 38px", coverTitle: 86, ctaTitle: 72, slideTitle: 64, bodySize: 32 };
    case "clean":
    default:
      return { gap: 28, radius: 32, padding: "40px 44px 36px", coverTitle: 74, ctaTitle: 62, slideTitle: 56, bodySize: 32 };
  }
}

function getBackgroundTexture(assetStyle: string): string {
  switch (assetStyle) {
    case "ui-fragments":
      return "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)";
    case "photo-collage":
      return "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.42), transparent 18%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.10), transparent 22%)";
    case "symbols":
      return "repeating-linear-gradient(0deg, rgba(0,0,0,0.035), rgba(0,0,0,0.035) 1px, transparent 1px, transparent 24px)";
    case "texture-only":
      return "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)";
    case "stickers":
    default:
      return "radial-gradient(circle at 10% 15%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.32), transparent 16%)";
  }
}

function getArtTexture(assetStyle: string): string {
  switch (assetStyle) {
    case "ui-fragments":
      return "linear-gradient(90deg, rgba(255,255,255,0.26) 12%, transparent 12% 22%, rgba(255,255,255,0.16) 22% 42%, transparent 42%)";
    case "photo-collage":
      return "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.48), transparent 24%)";
    case "symbols":
      return "repeating-linear-gradient(45deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18) 8px, transparent 8px, transparent 18px)";
    default:
      return "radial-gradient(circle at 45% 40%, rgba(255,255,255,0.35), transparent 26%)";
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeCssContent(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function getAssetPlacement(index: number): string {
  const placements = [
    "right: 34px; top: 34px; transform: rotate(8deg);",
    "left: 38px; bottom: 86px; transform: rotate(-10deg) scale(0.9);",
    "right: 86px; bottom: 38px; transform: rotate(14deg) scale(0.72);",
    "left: 42%; top: 34px; transform: rotate(-6deg) scale(0.68);"
  ];

  return placements[index] ?? placements[0];
}
