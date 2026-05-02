import { describe, it, expect } from "vitest";
import { PatientCreateSchema } from "./patient";

describe("PatientCreateSchema", () => {
  const valid = {
    idNumber: "123456782",
    name: "יעל ישראלי",
    phone: "054-1234567",
  };

  it("accepts a valid patient", () => {
    expect(PatientCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid Teudat Zehut checksum", () => {
    expect(
      PatientCreateSchema.safeParse({ ...valid, idNumber: "123456789" })
        .success,
    ).toBe(false);
  });

  it("rejects all-zero ID", () => {
    expect(
      PatientCreateSchema.safeParse({ ...valid, idNumber: "000000000" })
        .success,
    ).toBe(false);
  });

  it("rejects non-Israeli phone", () => {
    expect(
      PatientCreateSchema.safeParse({ ...valid, phone: "+1234567890" }).success,
    ).toBe(false);
  });

  it("accepts +972 prefix", () => {
    expect(
      PatientCreateSchema.safeParse({ ...valid, phone: "+972541234567" })
        .success,
    ).toBe(true);
  });

  it("rejects empty name", () => {
    expect(
      PatientCreateSchema.safeParse({ ...valid, name: "" }).success,
    ).toBe(false);
  });
});
