import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { getModeConfig } from "../packages/config/dist/index.js";
import { createPostSpec } from "../packages/core/dist/generation/createPostSpec.js";

async function readJson(relativePath) {
  const contents = await readFile(new URL(relativePath, import.meta.url), "utf8");
  return JSON.parse(contents);
}

test("createPostSpec accepts a valid generation payload", async () => {
  const request = await readJson("./fixtures/generation-request.json");
  const rawModelOutput = await readJson("./fixtures/raw-model-output-valid.json");

  const result = createPostSpec(
    request,
    rawModelOutput,
    getModeConfig("mainstream"),
    "messy-phone-collage"
  );

  assert.equal(result.report.ok, true);
  assert.ok(result.postSpec);
  assert.equal(result.postSpec.namingFrame, "cats");
  assert.equal(result.postSpec.archetypes.length, 3);
  assert.equal(result.postSpec.templateId, "default-carousel");
  assert.equal(result.postSpec.visualDirectionId, "messy-phone-collage");
});

test("createPostSpec rejects invalid generation payloads with readable errors", async () => {
  const request = await readJson("./fixtures/generation-request.json");
  const rawModelOutput = await readJson("./fixtures/raw-model-output-invalid.json");

  const result = createPostSpec(
    request,
    rawModelOutput,
    getModeConfig("mainstream"),
    "messy-phone-collage"
  );

  assert.equal(result.report.ok, false);
  assert.match(result.report.errors.join("\n"), /Expected at least 3 archetypes/);
  assert.match(result.report.errors.join("\n"), /Duplicate archetype name detected/);
  assert.match(result.report.errors.join("\n"), /Repeated bullet detected/);
});

test("createPostSpec rejects generic hard-archetype names", async () => {
  const request = await readJson("./fixtures/generation-request.json");
  const rawModelOutput = {
    hook: "What kind of revolutionary are you?",
    namingFrame: "revolutionary figures",
    archetypes: [
      {
        name: "The Strategist",
        bullets: ["builds the map before making noise", "moves through alliances carefully", "turns chaos into leverage"]
      },
      {
        name: "The Activist",
        bullets: ["shows up first", "keeps pressure visible", "turns consensus into motion"]
      },
      {
        name: "The Visionary",
        bullets: ["sees the future before the room does", "speaks in horizon lines", "makes compromise feel too small"]
      }
    ],
    caption: "Pick your lane.",
    cta: "Comment your type"
  };

  const result = createPostSpec(
    request,
    rawModelOutput,
    getModeConfig("mainstream"),
    "academic-margins"
  );

  assert.equal(result.report.ok, false);
  assert.match(result.report.errors.join("\n"), /too generic/);
});
