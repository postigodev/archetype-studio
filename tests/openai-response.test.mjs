import test from "node:test";
import assert from "node:assert/strict";

import { extractOpenAiOutputText } from "../apps/cli/dist/commands/generate.js";

test("extractOpenAiOutputText supports SDK-style output_text", () => {
  assert.equal(
    extractOpenAiOutputText({
      output_text: "{\"hook\":\"What kind of texter are you?\"}"
    }),
    "{\"hook\":\"What kind of texter are you?\"}"
  );
});

test("extractOpenAiOutputText supports REST Responses output array", () => {
  assert.equal(
    extractOpenAiOutputText({
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: "{\"hook\":\"What kind of texter are you?\"}"
            }
          ]
        }
      ]
    }),
    "{\"hook\":\"What kind of texter are you?\"}"
  );
});
