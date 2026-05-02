/**
 * Discriminated union returned by every Server Action.
 *
 * Callers narrow on `success`:
 *
 *   const result = await createDoctor(input);
 *   if (!result.success) return { error: result.error };
 *   // TS knows result.data is the Doctor here
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
