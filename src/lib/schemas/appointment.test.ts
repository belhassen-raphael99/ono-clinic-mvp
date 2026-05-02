import { describe, it, expect } from "vitest";
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
} from "./appointment";

const futureISO = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const pastISO = () => new Date(Date.now() - 60 * 1000).toISOString();

const validInput = () => ({
  appointmentDate: futureISO(),
  reason: "בדיקה שגרתית",
  doctorLicense: "12345",
  patientId: "123456782",
});

describe("AppointmentCreateSchema", () => {
  it("accepts a valid future appointment", () => {
    expect(AppointmentCreateSchema.safeParse(validInput()).success).toBe(true);
  });

  it("rejects past dates", () => {
    expect(
      AppointmentCreateSchema.safeParse({
        ...validInput(),
        appointmentDate: pastISO(),
      }).success,
    ).toBe(false);
  });

  it("rejects empty reason", () => {
    expect(
      AppointmentCreateSchema.safeParse({ ...validInput(), reason: "" })
        .success,
    ).toBe(false);
  });

  it("rejects reason over 500 chars", () => {
    expect(
      AppointmentCreateSchema.safeParse({
        ...validInput(),
        reason: "x".repeat(501),
      }).success,
    ).toBe(false);
  });

  it("rejects invalid doctor license", () => {
    expect(
      AppointmentCreateSchema.safeParse({
        ...validInput(),
        doctorLicense: "abc12",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid patient ID checksum", () => {
    expect(
      AppointmentCreateSchema.safeParse({
        ...validInput(),
        patientId: "111111111",
      }).success,
    ).toBe(false);
  });

  it("coerces ISO string to Date", () => {
    const result = AppointmentCreateSchema.safeParse(validInput());
    if (result.success) {
      expect(result.data.appointmentDate).toBeInstanceOf(Date);
    }
  });
});

describe("AppointmentUpdateSchema", () => {
  const validUpdate = () => ({ ...validInput(), appointmentNumber: 42 });

  it("accepts a valid update with appointmentNumber", () => {
    expect(AppointmentUpdateSchema.safeParse(validUpdate()).success).toBe(true);
  });

  it("rejects negative appointmentNumber", () => {
    expect(
      AppointmentUpdateSchema.safeParse({
        ...validUpdate(),
        appointmentNumber: -1,
      }).success,
    ).toBe(false);
  });

  it("rejects zero appointmentNumber", () => {
    expect(
      AppointmentUpdateSchema.safeParse({
        ...validUpdate(),
        appointmentNumber: 0,
      }).success,
    ).toBe(false);
  });

  it("rejects non-integer appointmentNumber", () => {
    expect(
      AppointmentUpdateSchema.safeParse({
        ...validUpdate(),
        appointmentNumber: 1.5,
      }).success,
    ).toBe(false);
  });

  it("coerces appointmentNumber from string", () => {
    const result = AppointmentUpdateSchema.safeParse({
      ...validUpdate(),
      appointmentNumber: "42",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.appointmentNumber).toBe("number");
      expect(result.data.appointmentNumber).toBe(42);
    }
  });
});
