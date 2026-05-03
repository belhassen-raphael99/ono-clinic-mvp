"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { toast } from "sonner";
import { AppointmentCreateSchema, type AppointmentCreateInput } from "@/lib/schemas/appointment";
import { createAppointment } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Doctor { licenseNumber: string; name: string; }
interface Patient { idNumber: string; name: string; }

interface Props {
  doctors: Doctor[];
  patients: Patient[];
}

export function AppointmentForm({ doctors, patients }: Props) {
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useForm<AppointmentCreateInput>({
      resolver: standardSchemaResolver(AppointmentCreateSchema) as any,
      defaultValues: { appointmentDate: undefined, reason: "", doctorLicense: "", patientId: "" },
    });

  const onSubmit = async (data: AppointmentCreateInput) => {
    const result = await createAppointment(data);
    if (!result.success) {
      if (result.fieldErrors?.appointmentDate)
        setError("appointmentDate", { message: result.fieldErrors.appointmentDate[0] });
      if (result.fieldErrors?.doctorLicense)
        setError("doctorLicense", { message: result.fieldErrors.doctorLicense[0] });
      if (result.fieldErrors?.patientId)
        setError("patientId", { message: result.fieldErrors.patientId[0] });
      if (result.fieldErrors?.reason)
        setError("reason", { message: result.fieldErrors.reason[0] });
      if (!result.fieldErrors) setError("root", { message: result.error });
      return;
    }
    toast.success("תור נקבע בהצלחה");
    router.push("/appointments");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errors.root && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="doctorLicense">רופא</Label>
        <select
          id="doctorLicense"
          aria-invalid={!!errors.doctorLicense}
          {...register("doctorLicense")}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errors.doctorLicense && "border-destructive",
          )}
        >
          <option value="">בחר רופא…</option>
          {doctors.map((d) => (
            <option key={d.licenseNumber} value={d.licenseNumber}>
              {d.name} ({d.licenseNumber})
            </option>
          ))}
        </select>
        {errors.doctorLicense && (
          <p role="alert" className="text-xs text-destructive">{errors.doctorLicense.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="patientId">מטופל</Label>
        <select
          id="patientId"
          aria-invalid={!!errors.patientId}
          {...register("patientId")}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errors.patientId && "border-destructive",
          )}
        >
          <option value="">בחר מטופל…</option>
          {patients.map((p) => (
            <option key={p.idNumber} value={p.idNumber}>
              {p.name} ({p.idNumber})
            </option>
          ))}
        </select>
        {errors.patientId && (
          <p role="alert" className="text-xs text-destructive">{errors.patientId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="appointmentDate">תאריך ושעה</Label>
        <Input
          id="appointmentDate"
          type="datetime-local"
          dir="ltr"
          className="text-left"
          aria-invalid={!!errors.appointmentDate}
          {...register("appointmentDate")}
        />
        {errors.appointmentDate && (
          <p role="alert" className="text-xs text-destructive">{errors.appointmentDate.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reason">סיבת הביקור</Label>
        <Input
          id="reason"
          placeholder="לדוגמה: בדיקת דם שגרתית"
          aria-invalid={!!errors.reason}
          {...register("reason")}
        />
        {errors.reason && (
          <p role="alert" className="text-xs text-destructive">{errors.reason.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "שומר..." : "קבע תור"}</Button>
        <Link href="/appointments" className={cn(buttonVariants({ variant: "outline" }))} tabIndex={isSubmitting ? -1 : 0}>
          ביטול
        </Link>
      </div>
    </form>
  );
}
