import { z } from "zod";
import {
  isValidMedicalLicense,
  isValidTeudatZehut,
} from "@/lib/validators";

const baseAppointment = z.object({
  // datetime-local input from the form is a string; coerce to Date.
  // Strict future: equality with `now` is also rejected.
  appointmentDate: z
    .coerce.date()
    .refine((d) => d > new Date(), "התאריך חייב להיות בעתיד"),
  reason: z
    .string()
    .trim()
    .min(1, "סיבה היא שדה חובה")
    .max(500, "סיבה לא יכולה לעלות על 500 תווים"),
  doctorLicense: z
    .string()
    .refine(isValidMedicalLicense, "מספר רישיון רופא לא תקין"),
  patientId: z
    .string()
    .refine(isValidTeudatZehut, "תעודת זהות מטופל לא תקינה"),
});

export const AppointmentCreateSchema = baseAppointment;

// Update needs the PK to identify the row (and to self-exclude during
// the 30-min conflict check in step 15).
export const AppointmentUpdateSchema = baseAppointment.extend({
  appointmentNumber: z.coerce.number().int().positive(),
});

export type AppointmentCreateInput = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof AppointmentUpdateSchema>;
