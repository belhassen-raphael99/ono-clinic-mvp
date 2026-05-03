"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { AppointmentUpdateSchema } from "@/lib/schemas/appointment";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

async function hasConflict(doctorLicense: string, date: Date, excludeId: number): Promise<boolean> {
  const WINDOW_MS = 30 * 60 * 1000;
  const from = new Date(date.getTime() - WINDOW_MS);
  const to   = new Date(date.getTime() + WINDOW_MS);

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorLicense,
      appointmentDate: { gte: from, lte: to },
      NOT: { appointmentNumber: excludeId },
    },
    select: { appointmentNumber: true },
  });

  return conflict !== null;
}

export async function updateAppointment(
  input: unknown,
): Promise<ActionResult<{ appointmentNumber: number }>> {
  const v = validate(AppointmentUpdateSchema, input);
  if (!v.success) return v;

  const conflict = await hasConflict(
    v.data.doctorLicense,
    v.data.appointmentDate,
    v.data.appointmentNumber,
  );
  if (conflict) {
    return {
      success: false,
      error: "קיים תור לרופא זה בטווח של 30 דקות מהשעה הנבחרת",
      fieldErrors: { appointmentDate: ["קיים תור לרופא זה בטווח של 30 דקות"] },
    };
  }

  try {
    await prisma.appointment.update({
      where: { appointmentNumber: v.data.appointmentNumber },
      data: {
        appointmentDate: v.data.appointmentDate,
        reason: v.data.reason,
        doctorLicense: v.data.doctorLicense,
        patientId: v.data.patientId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { success: false, error: "התור לא נמצא" };
    }
    console.error("[updateAppointment]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { success: true, data: { appointmentNumber: v.data.appointmentNumber } };
}

export async function deleteAppointment(appointmentNumber: number): Promise<ActionResult> {
  try {
    await prisma.appointment.delete({ where: { appointmentNumber } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { success: false, error: "התור לא נמצא" };
    }
    console.error("[deleteAppointment]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
