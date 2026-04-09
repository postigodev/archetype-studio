import { deflateSync } from "node:zlib";

import type { PostSpec, RenderMeta, RenderPlan, RenderPlanSlide } from "@archetype-studio/core";

export interface RenderedSlide {
  index: number;
  fileName: string;
  bytes: Uint8Array;
}

export interface RenderBundleResult {
  caption: string;
  meta: RenderMeta;
  review: string;
  slides: RenderedSlide[];
}

export function renderBundle(
  postSpec: PostSpec,
  renderPlan: RenderPlan
): RenderBundleResult {
  const slides = renderPlan.slides.map((slide, index) => ({
    index: index + 1,
    fileName: `slide-${index + 1}.png`,
    bytes: renderSlideToPng(renderPlan.width, renderPlan.height, slide)
  }));

  const meta: RenderMeta = {
    runId: renderPlan.runId,
    postId: renderPlan.postId,
    templateId: renderPlan.templateId,
    visualPack: renderPlan.visualPack,
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

function renderSlideToPng(
  width: number,
  height: number,
  slide: RenderPlanSlide
): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  const palette = getSlidePalette(slide.kind);

  fillRect(pixels, width, height, 0, 0, width, height, palette.background);
  fillRect(pixels, width, height, 48, 48, width - 96, height - 96, palette.panel);
  fillRect(pixels, width, height, 48, 48, width - 96, 20, palette.accent);
  fillRect(pixels, width, height, 96, 130, width - 192, 110, palette.banner);

  const bodyLineHeight = 54;
  let yOffset = 290;

  for (let index = 0; index < Math.min(slide.body.length, 6); index += 1) {
    fillRect(
      pixels,
      width,
      height,
      96,
      yOffset,
      width - 240,
      24,
      palette.textLine
    );

    fillRect(
      pixels,
      width,
      height,
      width - 124,
      yOffset - 4,
      28,
      28,
      palette.accent
    );

    yOffset += bodyLineHeight;
  }

  if (slide.kind === "archetype") {
    fillRect(pixels, width, height, width - 260, 820, 128, 128, palette.accent);
  }

  if (slide.kind === "cta") {
    fillRect(pixels, width, height, 96, height - 220, width - 192, 84, palette.accent);
  }

  return encodePng(width, height, pixels);
}

function getSlidePalette(kind: RenderPlanSlide["kind"]) {
  switch (kind) {
    case "cover":
      return {
        background: [248, 240, 229, 255],
        panel: [255, 251, 246, 255],
        accent: [216, 95, 58, 255],
        banner: [43, 42, 51, 255],
        textLine: [88, 83, 95, 255]
      } as const;
    case "archetype":
      return {
        background: [233, 241, 247, 255],
        panel: [248, 251, 253, 255],
        accent: [40, 115, 166, 255],
        banner: [36, 53, 70, 255],
        textLine: [84, 97, 112, 255]
      } as const;
    case "cta":
      return {
        background: [244, 236, 227, 255],
        panel: [255, 250, 244, 255],
        accent: [54, 125, 102, 255],
        banner: [44, 58, 49, 255],
        textLine: [94, 92, 84, 255]
      } as const;
  }
}

function fillRect(
  pixels: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  rectWidth: number,
  rectHeight: number,
  color: readonly [number, number, number, number]
): void {
  const maxX = Math.min(width, x + rectWidth);
  const maxY = Math.min(height, y + rectHeight);

  for (let currentY = Math.max(0, y); currentY < maxY; currentY += 1) {
    for (let currentX = Math.max(0, x); currentX < maxX; currentX += 1) {
      const offset = (currentY * width + currentX) * 4;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = color[3];
    }
  }
}

function encodePng(width: number, height: number, pixels: Uint8Array): Uint8Array {
  const signature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = createChunk("IHDR", createIhdrData(width, height));
  const idat = createChunk("IDAT", createIdatData(width, height, pixels));
  const iend = createChunk("IEND", new Uint8Array(0));

  return concatBytes([signature, ihdr, idat, iend]);
}

function createIhdrData(width: number, height: number): Uint8Array {
  const data = new Uint8Array(13);
  const view = new DataView(data.buffer);

  view.setUint32(0, width);
  view.setUint32(4, height);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;

  return data;
}

function createIdatData(width: number, height: number, pixels: Uint8Array): Uint8Array {
  const rowLength = width * 4 + 1;
  const raw = new Uint8Array(rowLength * height);

  for (let row = 0; row < height; row += 1) {
    const rowOffset = row * rowLength;
    raw[rowOffset] = 0;
    raw.set(
      pixels.subarray(row * width * 4, (row + 1) * width * 4),
      rowOffset + 1
    );
  }

  return deflateSync(raw);
}

function createChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);

  view.setUint32(0, data.length);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc32(concatBytes([typeBytes, data])));

  return chunk;
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }

  return output;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;

  for (let index = 0; index < data.length; index += 1) {
    crc ^= data[index];

    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
