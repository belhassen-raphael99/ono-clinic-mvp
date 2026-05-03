"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { AppointmentCreateSchema } from "@/lib/schemas/appointment";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

/** Returns true if the doctor already has an appointment within 30 min of `date`. */
async function hasConflict(doctorLicense: string, date: Date, excludeId?: number): Promise<boolean> {
  const WINDOW_MS = 30 * 60 * 1000;
  const from = new Date(date.getTime() - WINDOW_MS);
  const to   = new Date(date.getTime() + WINDOW_MS);

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorLicense,
      appointmentDate: { gte: from, lte: to },
      ...(excludeId !== undefined ? { NOT: { appointmentNumber: excludeId } } : {}),
    },
    select: { appointmentNumber: true },
  });

  return conflict !== null;
}

export async function createAppointment(
  input: unknown,
): Promise<ActionResult<{ appointmentNumber: number }>> {
  const v = validate(AppointmentCreateSchema, input);
  if (!v.success) return v;

  const conflict = await hasConflict(v.data.doctorLicense, v.data.appointmentDate);
  if (conflict) {
    return {
      success: false,
      error: "קיים תור לרופא זה בטווח של 30 דקות מהשעה הנבחרת",
      fieldErrors: { appointmentDate: ["קיים תור לרופא זה בטווח של 30 דקות"] },
    };
  }

  const appt = await prisma.appointment.create({ data: v.data });

  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { success: true, data: { appointmentNumber: appt.appointmentNumber } };
}
