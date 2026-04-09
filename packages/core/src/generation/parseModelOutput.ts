import { parseWithSchema } from "../parse.js";
import { rawModelOutputSchema } from "../schemas.js";
import type { ParseResult } from "../parse.js";
import type { RawModelOutput } from "../types.js";

export function parseModelOutput(rawText: string): ParseResult<RawModelOutput> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON parse error";
    return {
      ok: false,
      errors: [`Model response was not valid JSON: ${message}`]
    };
  }

  return parseWithSchema(rawModelOutputSchema, parsed);
}
