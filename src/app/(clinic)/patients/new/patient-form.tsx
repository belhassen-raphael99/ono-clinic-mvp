"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { toast } from "sonner";
import { PatientCreateSchema, type PatientCreateInput } from "@/lib/schemas/patient";
import { createPatient } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PatientForm() {
  const router = useRouter();

  const {
    register, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm<PatientCreateInput>({
    resolver: standardSchemaResolver(PatientCreateSchema),
    defaultValues: { idNumber: "", name: "", phone: "" },
  });

  const onSubmit = async (data: PatientCreateInput) => {
    const result = await createPatient(data);
    if (!result.success) {
      if (result.fieldErrors?.idNumber) setError("idNumber", { message: result.fieldErrors.idNumber[0] });
      if (result.fieldErrors?.name) setError("name", { message: result.fieldErrors.name[0] });
      if (result.fieldErrors?.phone) setError("phone", { message: result.fieldErrors.phone[0] });
      if (!result.fieldErrors) setError("root", { message: result.error });
      return;
    }
    toast.success("מטופל נוסף בהצלחה");
    router.push("/patients");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errors.root && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">שם המטופל</Label>
        <Input id="name" placeholder="לדוגמה: יעל ישראלי" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p role="alert" className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="idNumber">תעודת זהות</Label>
        <Input id="idNumber" dir="ltr" className="text-left" inputMode="numeric" maxLength={9}
          placeholder="123456782" aria-invalid={!!errors.idNumber} aria-describedby="id-hint" {...register("idNumber")} />
        <p id="id-hint" className="text-xs text-muted-foreground">9 ספרות כולל ספרת ביקורת</p>
        {errors.idNumber && <p role="alert" className="text-xs text-destructive">{errors.idNumber.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">טלפון</Label>
        <Input id="phone" dir="ltr" className="text-left" inputMode="tel" placeholder="052-1234567"
          aria-invalid={!!errors.phone} aria-describedby="phone-hint" {...register("phone")} />
        <p id="phone-hint" className="text-xs text-muted-foreground">פורמט ישראלי: 05X-XXXXXXX</p>
        {errors.phone && <p role="alert" className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "שומר..." : "שמור מטופל"}</Button>
        <Link href="/patients" className={cn(buttonVariants({ variant: "outline" }))} tabIndex={isSubmitting ? -1 : 0}>
          ביטול
        </Link>
      </div>
    </form>
  );
}
