"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { DoctorCreateSchema } from "@/lib/schemas/doctor";
import { validate } from "@/lib/action-helpers";
import type { ActionResult } from "@/types/action-result";

export async function createDoctor(
  input: unknown,
): Promise<ActionResult<{ licenseNumber: string }>> {
  // 1. Validate — rejects malformed payloads even if client-side checks pass.
  const v = validate(DoctorCreateSchema, input);
  if (!v.success) return v;

  // 2. Persist
  try {
    await prisma.doctor.create({
      data: {
        licenseNumber: v.data.licenseNumber,
        name: v.data.name,
      },
    });
  } catch (e) {
    // P2002 = unique constraint — licenseNumber already taken.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        success: false,
        error: "מספר רישיון כבר קיים במערכת",
        fieldErrors: {
          licenseNumber: ["מספר רישיון כבר קיים במערכת"],
        },
      };
    }
    console.error("[createDoctor]", e);
    return { success: false, error: "שגיאת מסד נתונים. אנא נסה שוב." };
  }

  // 3. Invalidate list cache (no-op for force-dynamic pages, but correct for ISR later)
  revalidatePath("/doctors");

  // Note: redirect() is intentionally NOT called here.
  // Client navigates via router.push() after receiving success.
  return { success: true, data: { licenseNumber: v.data.licenseNumber } };
}
