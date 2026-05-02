import { describe, it, expect } from "vitest";
import { isValidIsraeliPhone } from "./phone-il";

describe("isValidIsraeliPhone", () => {
  describe("valid phone numbers", () => {
    it.each([
      "054-1234567",      // mobile with dash
      "0541234567",        // mobile, no dash
      "+972541234567",     // international, no dashes
      "+972-54-1234567",   // international with dashes
      "02-1234567",        // landline (Jerusalem)
      "031234567",         // landline (Tel Aviv), no dash
      "077-1234567",       // VoIP
      "050 123 4567",      // mobile with spaces
    ])("accepts %s", (phone) => {
      expect(isValidIsraeliPhone(phone)).toBe(true);
    });
  });

  describe("invalid phone numbers", () => {
    it.each([
      "",                  // empty
      "12345",             // too short
      "0541234",           // too short (8 digits)
      "054123456789",      // too long (12 digits)
      "ABC1234567",        // letters
      "1541234567",        // doesn't start with 0
      "+1234567890",       // foreign country code
    ])("rejects %s", (phone) => {
      expect(isValidIsraeliPhone(phone)).toBe(false);
    });
  });
});
