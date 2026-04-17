import test from "node:test";
import assert from "node:assert/strict";

import {
  getAssetPacksForVisualDirection,
  getModeConfig,
  getTemplateConfig,
  resolveVisualDirection,
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

test("visual directions resolve to versioned local asset packs", () => {
  const packs = getAssetPacksForVisualDirection("messy-phone-collage");
  const assetPaths = packs.flatMap((pack) => pack.assets.map((asset) => asset.path));

  assert.deepEqual(
    packs.map((pack) => pack.id),
    ["phone-ui-fragments", "emoji-stickers", "paper-textures"]
  );
  assert.ok(assetPaths.includes("assets/packs/phone-ui-fragments/phone-bubble.svg"));
});

test("visual direction selection supports automatic topic routing and manual override", () => {
  assert.equal(
    resolveVisualDirection({
      topic: "what kind of texter are you",
      mode: "mainstream"
    }).id,
    "messy-phone-collage"
  );

  assert.equal(
    resolveVisualDirection({
      topic: "what kind of texter are you",
      mode: "mainstream",
      visualDirectionId: "academic-margins"
    }).id,
    "academic-margins"
  );
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
