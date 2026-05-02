import { z } from "zod";
import { isValidMedicalLicense } from "@/lib/validators";

const baseDoctor = z.object({
  licenseNumber: z
    .string()
    .refine(isValidMedicalLicense, "מספר רישיון חייב להכיל 5 ספרות בדיוק"),
  name: z
    .string()
    .trim()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(100, "שם לא יכול לעלות על 100 תווים"),
});

export const DoctorCreateSchema = baseDoctor;
export const DoctorUpdateSchema = baseDoctor;

export type DoctorCreateInput = z.infer<typeof DoctorCreateSchema>;
export type DoctorUpdateInput = z.infer<typeof DoctorUpdateSchema>;
