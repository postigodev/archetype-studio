import { access } from "node:fs/promises";

import playwright from "playwright-core";

const { chromium } = playwright;

const WINDOWS_BROWSER_CANDIDATES = [
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
];

export interface RenderDiagnostics {
  hasOverflow: boolean;
  frameScrollWidth: number;
  frameClientWidth: number;
  frameScrollHeight: number;
  frameClientHeight: number;
  outOfBoundsElements: string[];
  renderedAssetCount: number;
}

export interface RenderedHtml {
  bytes: Uint8Array;
  diagnostics: RenderDiagnostics;
}

export async function renderHtmlToPng(
  html: string,
  width: number,
  height: number
): Promise<RenderedHtml> {
  const executablePath = await resolveBrowserExecutable();
  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  try {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1
    });

    await page.setContent(html, { waitUntil: "load" });
    const diagnostics = await page.evaluate(() => {
      const frame = document.querySelector<HTMLElement>(".frame");

      if (!frame) {
        return {
          hasOverflow: true,
          frameScrollWidth: 0,
          frameClientWidth: 0,
          frameScrollHeight: 0,
          frameClientHeight: 0,
          outOfBoundsElements: ["missing .frame"],
          renderedAssetCount: 0
        };
      }

      const frameRect = frame.getBoundingClientRect();
      const measuredElements = [...document.querySelectorAll<HTMLElement>(
        ".eyebrow, .title, .content, .footer"
      )];
      const outOfBoundsElements = measuredElements
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return (
            rect.left < frameRect.left ||
            rect.right > frameRect.right ||
            rect.top < frameRect.top ||
            rect.bottom > frameRect.bottom
          );
        })
        .map((element) => element.className);

      const hasOverflow =
        frame.scrollWidth > frame.clientWidth ||
        frame.scrollHeight > frame.clientHeight ||
        outOfBoundsElements.length > 0;

      return {
        hasOverflow,
        frameScrollWidth: frame.scrollWidth,
        frameClientWidth: frame.clientWidth,
        frameScrollHeight: frame.scrollHeight,
        frameClientHeight: frame.clientHeight,
        outOfBoundsElements,
        renderedAssetCount: document.querySelectorAll(".asset").length
      };
    });

    const screenshot = await page.screenshot({
      type: "png"
    });

    return {
      bytes: screenshot,
      diagnostics
    };
  } finally {
    await browser.close();
  }
}

async function resolveBrowserExecutable(): Promise<string> {
  if (process.env.PLAYWRIGHT_BROWSER_PATH) {
    return process.env.PLAYWRIGHT_BROWSER_PATH;
  }

  for (const candidate of WINDOWS_BROWSER_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(
    "No local Chromium-based browser found. Set PLAYWRIGHT_BROWSER_PATH to a Chrome or Edge executable."
  );
}
