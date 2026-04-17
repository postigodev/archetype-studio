import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { buildRenderPlan, renderBundle, runRenderQa } from "../packages/renderer/dist/index.js";
import { getModeConfig } from "../packages/config/dist/index.js";
import { createPostSpec } from "../packages/core/dist/generation/createPostSpec.js";

async function readJson(relativePath) {
  const contents = await readFile(new URL(relativePath, import.meta.url), "utf8");
  return JSON.parse(contents);
}

test("render bundle produces deterministic PNG-like exports and passes QA", async () => {
  const request = await readJson("./fixtures/generation-request.json");
  const rawModelOutput = await readJson("./fixtures/raw-model-output-valid.json");
  const postSpecResult = createPostSpec(
    request,
    rawModelOutput,
    getModeConfig("mainstream")
  );

  assert.equal(postSpecResult.report.ok, true);
  assert.ok(postSpecResult.postSpec);

  const renderPlan = buildRenderPlan("test-run", postSpecResult.postSpec);
  const bundle = await renderBundle(postSpecResult.postSpec, renderPlan);
  const qaReport = runRenderQa(postSpecResult.postSpec, renderPlan, bundle.meta);

  assert.equal(bundle.slides.length, 5);
  assert.deepEqual(Array.from(bundle.slides[0].bytes.slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(qaReport.ok, true);
});
