import test from "node:test";
import assert from "node:assert/strict";

import { getModeConfig } from "../packages/config/dist/index.js";
import { buildPrompt } from "../packages/core/dist/generation/buildPrompt.js";

test("generation prompt includes CTA and caption layout limits", () => {
  const modeConfig = getModeConfig("mainstream");
  const prompt = buildPrompt(
    {
      topic: "what kind of texter are you",
      mode: "mainstream"
    },
    modeConfig
  );

  assert.match(prompt.user, /Max caption characters: 180/);
  assert.match(prompt.user, /Max CTA characters: 48/);
  assert.match(prompt.user, /CTA must be short, direct, and layout-safe/);
});
