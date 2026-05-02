import { z } from "zod";
import {
  isValidTeudatZehut,
  isValidIsraeliPhone,
} from "@/lib/validators";

const basePatient = z.object({
  idNumber: z
    .string()
    .refine(isValidTeudatZehut, "תעודת זהות לא תקינה (כולל ספרת ביקורת)"),
  name: z
    .string()
    .trim()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(100, "שם לא יכול לעלות על 100 תווים"),
  phone: z
    .string()
    .trim()
    .refine(isValidIsraeliPhone, "מספר טלפון לא תקין (פורמט ישראלי)"),
});

export const PatientCreateSchema = basePatient;
export const PatientUpdateSchema = basePatient;

export type PatientCreateInput = z.infer<typeof PatientCreateSchema>;
export type PatientUpdateInput = z.infer<typeof PatientUpdateSchema>;
