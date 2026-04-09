import type { z } from "zod";

export interface ParseSuccess<T> {
  ok: true;
  data: T;
}

export interface ParseFailure {
  ok: false;
  errors: string[];
}

export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  value: unknown
): ParseResult<T> {
  const result = schema.safeParse(value);

  if (result.success) {
    return {
      ok: true,
      data: result.data
    };
  }

  return {
    ok: false,
    errors: result.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
      return `${path}${issue.message}`;
    })
  };
}
