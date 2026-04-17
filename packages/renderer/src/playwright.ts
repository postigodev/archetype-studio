import { access } from "node:fs/promises";

import playwright from "playwright-core";

const { chromium } = playwright;

const WINDOWS_BROWSER_CANDIDATES = [
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
];

export async function renderHtmlToPng(
  html: string,
  width: number,
  height: number
): Promise<Uint8Array> {
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

    const screenshot = await page.screenshot({
      type: "png"
    });

    return screenshot;
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
