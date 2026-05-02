import { describe, it, expect } from "vitest";
import { DoctorCreateSchema } from "./doctor";

describe("DoctorCreateSchema", () => {
  const valid = { licenseNumber: "12345", name: 'ד"ר נועה לוי' };

  it("accepts a valid doctor", () => {
    expect(DoctorCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects 4-digit license", () => {
    expect(
      DoctorCreateSchema.safeParse({ ...valid, licenseNumber: "1234" }).success,
    ).toBe(false);
  });

  it("rejects 6-digit license", () => {
    expect(
      DoctorCreateSchema.safeParse({ ...valid, licenseNumber: "123456" })
        .success,
    ).toBe(false);
  });

  it("rejects non-numeric license", () => {
    expect(
      DoctorCreateSchema.safeParse({ ...valid, licenseNumber: "abcde" })
        .success,
    ).toBe(false);
  });

  it("rejects single-character name", () => {
    expect(
      DoctorCreateSchema.safeParse({ ...valid, name: "ל" }).success,
    ).toBe(false);
  });

  it("rejects 101-character name", () => {
    expect(
      DoctorCreateSchema.safeParse({ ...valid, name: "א".repeat(101) }).success,
    ).toBe(false);
  });

  it("trims whitespace from name", () => {
    const result = DoctorCreateSchema.safeParse({
      ...valid,
      name: '  ד"ר רון  ',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('ד"ר רון');
  });
});
