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

  const result = createPostSpec(request, rawModelOutput, getModeConfig("mainstream"));

  assert.equal(result.report.ok, true);
  assert.ok(result.postSpec);
  assert.equal(result.postSpec.archetypes.length, 3);
  assert.equal(result.postSpec.templateId, "default-carousel");
});

test("createPostSpec rejects invalid generation payloads with readable errors", async () => {
  const request = await readJson("./fixtures/generation-request.json");
  const rawModelOutput = await readJson("./fixtures/raw-model-output-invalid.json");

  const result = createPostSpec(request, rawModelOutput, getModeConfig("mainstream"));

  assert.equal(result.report.ok, false);
  assert.match(result.report.errors.join("\n"), /Expected at least 3 archetypes/);
  assert.match(result.report.errors.join("\n"), /Duplicate archetype name detected/);
  assert.match(result.report.errors.join("\n"), /Repeated bullet detected/);
});
