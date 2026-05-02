import type { ZodError, ZodSchema } from "zod";
import type { ActionResult } from "@/types/action-result";

/**
 * Flatten a Zod validation error into a Record keyed by field path.
 * Nested paths are joined with dots (e.g. "user.address.zip").
 * Issues without a path (cross-field errors) land under "_root".
 */
export function zodErrorToFieldErrors(
  error: ZodError,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }
  return fieldErrors;
}

/**
 * Validate input against a Zod schema and return an ActionResult.
 *
 * Server Actions short-circuit on failure:
 *
 *   const v = validate(MySchema, input);
 *   if (!v.success) return v;
 *   // v.data is fully typed here
 */
export function validate<T>(
  schema: ZodSchema<T>,
  input: unknown,
): ActionResult<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "טעות בקלט. אנא בדוק את השדות.",
      fieldErrors: zodErrorToFieldErrors(result.error),
    };
  }
  return { success: true, data: result.data };
}
