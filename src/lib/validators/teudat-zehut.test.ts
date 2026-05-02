import { describe, it, expect } from "vitest";
import { isValidTeudatZehut } from "./teudat-zehut";

describe("isValidTeudatZehut", () => {
  describe("valid IDs (Luhn checksum passes)", () => {
    it.each([
      "123456782",
      "111111118",
      "222222226",
      "333333334",
      "555555556",
      "987654324",
    ])("accepts %s", (id) => {
      expect(isValidTeudatZehut(id)).toBe(true);
    });
  });

  describe("invalid IDs (Luhn checksum fails)", () => {
    it.each([
      "123456789",
      "111111111",
      "000000000",
      "987654321",
    ])("rejects %s", (id) => {
      expect(isValidTeudatZehut(id)).toBe(false);
    });
  });

  describe("malformed input", () => {
    it("rejects empty string", () => {
      expect(isValidTeudatZehut("")).toBe(false);
    });
    it("rejects more than 9 digits", () => {
      expect(isValidTeudatZehut("1234567890")).toBe(false);
    });
    it("rejects letters", () => {
      expect(isValidTeudatZehut("12345678a")).toBe(false);
    });
    it("rejects dashes", () => {
      expect(isValidTeudatZehut("123-45-6782")).toBe(false);
    });
    it("rejects spaces", () => {
      expect(isValidTeudatZehut("123 45 6782")).toBe(false);
    });
  });
});
