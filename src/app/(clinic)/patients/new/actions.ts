"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PatientCreateSchema } from "@/lib/schemas/patient";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

export async function createPatient(
  input: unknown,
): Promise<ActionResult<{ idNumber: string }>> {
  const v = validate(PatientCreateSchema, input);
  if (!v.success) return v;

  try {
    await prisma.patient.create({ data: v.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        success: false,
        error: "תעודת זהות כבר קיימת במערכת",
        fieldErrors: { idNumber: ["תעודת זהות כבר קיימת במערכת"] },
      };
    }
    console.error("[createPatient]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  revalidatePath("/patients");
  return { success: true, data: { idNumber: v.data.idNumber } };
}
