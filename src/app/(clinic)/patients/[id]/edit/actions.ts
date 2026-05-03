"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PatientUpdateSchema } from "@/lib/schemas/patient";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

export async function updatePatient(input: unknown): Promise<ActionResult<{ idNumber: string }>> {
  const v = validate(PatientUpdateSchema, input);
  if (!v.success) return v;

  try {
    await prisma.patient.update({
      where: { idNumber: v.data.idNumber },
      data: { name: v.data.name, phone: v.data.phone },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { success: false, error: "המטופל לא נמצא" };
    }
    console.error("[updatePatient]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/patients");
  return { success: true, data: { idNumber: v.data.idNumber } };
}

export async function deletePatient(idNumber: string): Promise<ActionResult> {
  const count = await prisma.appointment.count({ where: { patientId: idNumber } });
  if (count > 0) {
    return { success: false, error: `לא ניתן למחוק מטופל שיש לו ${count} תורים` };
  }

  try {
    await prisma.patient.delete({ where: { idNumber } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { success: false, error: "המטופל לא נמצא" };
    }
    console.error("[deletePatient]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/patients");
  return { success: true, data: undefined };
}
