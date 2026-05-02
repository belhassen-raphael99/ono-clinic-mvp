import { describe, it, expect } from "vitest";
import { isValidMedicalLicense } from "./license";

describe("isValidMedicalLicense", () => {
  describe("valid licenses (5 digits)", () => {
    it.each(["12345", "00000", "99999", "12321"])(
      "accepts %s",
      (license) => {
        expect(isValidMedicalLicense(license)).toBe(true);
      }
    );
  });

  describe("invalid licenses", () => {
    it.each([
      "1234",     // 4 digits
      "123456",   // 6 digits
      "abcde",    // letters
      "1234a",    // mixed
      "",         // empty
      "12 34",    // contains space
      "12-34",    // contains dash
    ])("rejects %s", (license) => {
      expect(isValidMedicalLicense(license)).toBe(false);
    });
  });
});
