"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { DoctorUpdateSchema } from "@/lib/schemas/doctor";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

export async function updateDoctor(
  input: unknown,
): Promise<ActionResult<{ licenseNumber: string }>> {
  const v = validate(DoctorUpdateSchema, input);
  if (!v.success) return v;

  try {
    await prisma.doctor.update({
      where: { licenseNumber: v.data.licenseNumber },
      data: { name: v.data.name },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return { success: false, error: "הרופא לא נמצא" };
    }
    console.error("[updateDoctor]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/doctors");
  return { success: true, data: { licenseNumber: v.data.licenseNumber } };
}

export async function deleteDoctor(
  licenseNumber: string,
): Promise<ActionResult> {
  // Guard: block deletion if appointments exist (mirrors ON DELETE RESTRICT)
  const appointmentCount = await prisma.appointment.count({
    where: { doctorLicense: licenseNumber },
  });
  if (appointmentCount > 0) {
    return {
      success: false,
      error: `לא ניתן למחוק רופא שיש לו ${appointmentCount} תורים`,
    };
  }

  try {
    await prisma.doctor.delete({ where: { licenseNumber } });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return { success: false, error: "הרופא לא נמצא" };
    }
    console.error("[deleteDoctor]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/doctors");
  return { success: true, data: undefined };
}
