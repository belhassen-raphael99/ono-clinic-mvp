import { describe, it, expect } from "vitest";
import { z } from "zod";
import { zodErrorToFieldErrors, validate } from "./action-helpers";

describe("zodErrorToFieldErrors", () => {
  it("flattens a single-field error", () => {
    const schema = z.object({ name: z.string().min(2, "too short") });
    const result = schema.safeParse({ name: "a" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = zodErrorToFieldErrors(result.error);
      expect(fields).toEqual({ name: ["too short"] });
    }
  });

  it("joins nested paths with dots", () => {
    const schema = z.object({
      user: z.object({ name: z.string().min(1, "required") }),
    });
    const result = schema.safeParse({ user: { name: "" } });
    if (!result.success) {
      const fields = zodErrorToFieldErrors(result.error);
      expect(fields).toEqual({ "user.name": ["required"] });
    }
  });

  it("collects multiple errors per field", () => {
    const schema = z.object({
      code: z
        .string()
        .min(5, "too short")
        .regex(/^\d+$/, "must be digits"),
    });
    const result = schema.safeParse({ code: "abc" });
    if (!result.success) {
      const fields = zodErrorToFieldErrors(result.error);
      expect(fields.code).toContain("too short");
      expect(fields.code).toContain("must be digits");
    }
  });
});

describe("validate", () => {
  const schema = z.object({ x: z.number() });

  it("returns success with typed data on valid input", () => {
    const result = validate(schema, { x: 42 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ x: 42 });
    }
  });

  it("returns failure with fieldErrors on invalid input", () => {
    const result = validate(schema, { x: "not a number" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors!.x).toBeDefined();
    }
  });

  it("returns failure with Hebrew top-level message", () => {
    const result = validate(schema, null);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/קלט/);
    }
  });
});
