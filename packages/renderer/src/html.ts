import type { RenderPlanSlide } from "@archetype-studio/core";

export function buildSlideHtml(
  width: number,
  height: number,
  slide: RenderPlanSlide
): string {
  const palette = getSlidePalette(slide.kind);
  const bodyItems = slide.body
    .map(
      (line) =>
        `<li class="body-line"><span class="body-copy">${escapeHtml(line)}</span></li>`
    )
    .join("");
  const slotBadges = slide.imageSlots
    .map((slot) => `<span class="slot">${escapeHtml(slot)}</span>`)
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
        font-family: Georgia, "Times New Roman", serif;
        background: var(--bg);
        color: var(--ink);
      }

      body {
        padding: 48px;
      }

      .frame {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        gap: 28px;
        background:
          radial-gradient(circle at top right, rgba(255,255,255,0.45), transparent 30%),
          linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0)),
          var(--panel);
        border: 2px solid rgba(0, 0, 0, 0.05);
        border-radius: 32px;
        padding: 40px 44px 36px;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
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
        font-size: ${slide.kind === "cover" ? 74 : slide.kind === "cta" ? 62 : 56}px;
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
        font: 500 32px/1.18 Arial, sans-serif;
        color: var(--muted);
      }

      .art {
        min-height: 220px;
        border-radius: 24px;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0)),
          linear-gradient(160deg, var(--accent), rgba(255,255,255,0.1));
        border: 1px solid rgba(0,0,0,0.05);
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .art::after {
        content: "${escapeCssContent(slide.kind)}";
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
    <main class="frame" data-kind="${escapeHtml(slide.kind)}">
      <div class="eyebrow">${escapeHtml(slide.kind)}</div>
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

function getSlidePalette(kind: RenderPlanSlide["kind"]) {
  switch (kind) {
    case "cover":
      return {
        background: "#f2e7da",
        panel: "#fffaf3",
        accent: "#cb5a37",
        ink: "#241d1a",
        muted: "#5f5956"
      };
    case "archetype":
      return {
        background: "#dfeaf2",
        panel: "#f7fbfd",
        accent: "#2d76a7",
        ink: "#1d2832",
        muted: "#566473"
      };
    case "cta":
      return {
        background: "#efe4d8",
        panel: "#fff9f1",
        accent: "#3a8069",
        ink: "#233129",
        muted: "#5f665c"
      };
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
