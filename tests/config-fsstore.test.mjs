import test from "node:test";
import assert from "node:assert/strict";

import {
  getModeConfig,
  getTemplateConfig,
  getVisualPackConfig
} from "../packages/config/dist/index.js";
import { getRunPaths } from "../packages/fs-store/dist/index.js";

test("config lookups resolve the v1 defaults", () => {
  const modeConfig = getModeConfig("mainstream");
  const template = getTemplateConfig(modeConfig.defaultTemplateId);
  const visualPack = getVisualPackConfig(modeConfig.defaultVisualPack);

  assert.equal(modeConfig.maxArchetypes, 4);
  assert.equal(template.width, 1080);
  assert.equal(visualPack.id, "starter-pack");
});

test("run path helpers produce deterministic artifact locations", () => {
  const paths = getRunPaths("C:\\workspace\\archetype-studio", "run-123");

  assert.equal(
    paths.postSpecFile,
    "C:\\workspace\\archetype-studio\\runs\\run-123\\post-spec.json"
  );
  assert.equal(
    paths.slideFile(2),
    "C:\\workspace\\archetype-studio\\runs\\run-123\\render\\slide-2.png"
  );
  assert.equal(
    paths.qaReportFile,
    "C:\\workspace\\archetype-studio\\runs\\run-123\\qa-report.json"
  );
});
