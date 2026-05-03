"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppointmentUpdateSchema, type AppointmentUpdateInput } from "@/lib/schemas/appointment";
import { updateAppointment, deleteAppointment } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Doctor { licenseNumber: string; name: string; }
interface Patient { idNumber: string; name: string; }

interface Props {
  appointmentNumber: number;
  appointmentDate: Date;
  reason: string;
  doctorLicense: string;
  patientId: string;
  doctors: Doctor[];
  patients: Patient[];
}

/** Convert a Date to a value suitable for <input type="datetime-local"> */
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AppointmentEditForm({
  appointmentNumber, appointmentDate, reason, doctorLicense, patientId, doctors, patients,
}: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useForm<AppointmentUpdateInput>({
      resolver: standardSchemaResolver(AppointmentUpdateSchema) as any,
      defaultValues: {
        appointmentNumber,
        appointmentDate: appointmentDate,
        reason,
        doctorLicense,
        patientId,
      },
    });

  const onSubmit = async (data: AppointmentUpdateInput) => {
    const result = await updateAppointment(data);
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
    toast.success("התור עודכן בהצלחה");
    router.push("/appointments");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAppointment(appointmentNumber);
    setIsDeleting(false);
    if (!result.success) { toast.error(result.error); setDeleteOpen(false); return; }
    toast.success("התור נמחק בהצלחה");
    router.push("/appointments");
  };

  const selectCls = cn(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        {/* Hidden PK field */}
        <input type="hidden" {...register("appointmentNumber")} />

        <div className="space-y-1.5">
          <Label htmlFor="doctorLicense">רופא</Label>
          <select
            id="doctorLicense"
            aria-invalid={!!errors.doctorLicense}
            {...register("doctorLicense")}
            className={cn(selectCls, errors.doctorLicense && "border-destructive")}
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
            className={cn(selectCls, errors.patientId && "border-destructive")}
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
            defaultValue={toDatetimeLocal(appointmentDate)}
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
            aria-invalid={!!errors.reason}
            {...register("reason")}
          />
          {errors.reason && (
            <p role="alert" className="text-xs text-destructive">{errors.reason.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "שומר..." : "שמור שינויים"}</Button>
            <Link href="/appointments" className={cn(buttonVariants({ variant: "outline" }))} tabIndex={isSubmitting ? -1 : 0}>
              ביטול
            </Link>
          </div>
          <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />מחק תור
          </Button>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>מחיקת תור</DialogTitle>
            <DialogDescription>האם אתה בטוח שברצונך למחוק את התור? פעולה זו אינה הפיכה.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>ביטול</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "מוחק..." : "מחק לצמיתות"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
