"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// Zod 4 implements Standard Schema v1 — use standard-schema resolver, not zodResolver
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { DoctorCreateSchema, type DoctorCreateInput } from "@/lib/schemas/doctor";
import { createDoctor } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function DoctorForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DoctorCreateInput>({
    resolver: standardSchemaResolver(DoctorCreateSchema),
    defaultValues: { licenseNumber: "", name: "" },
  });

  const onSubmit = async (data: DoctorCreateInput) => {
    const result = await createDoctor(data);

    if (!result.success) {
      // Map server field errors back onto the form
      if (result.fieldErrors?.licenseNumber) {
        setError("licenseNumber", { message: result.fieldErrors.licenseNumber[0] });
      }
      if (result.fieldErrors?.name) {
        setError("name", { message: result.fieldErrors.name[0] });
      }
      // Generic root error (no matching field) shown via the name field fallback
      if (!result.fieldErrors) {
        setError("root", { message: result.error });
      }
      return;
    }

    // Success — navigate to list; force-dynamic ensures fresh fetch
    router.push("/doctors");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Root-level server error (e.g. DB outage) */}
      {errors.root && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      {/* שם הרופא */}
      <div className="space-y-1.5">
        <Label htmlFor="name">שם הרופא</Label>
        <Input
          id="name"
          placeholder='לדוגמה: ד"ר נועה לוי'
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-destructive mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* מספר רישיון */}
      <div className="space-y-1.5">
        <Label htmlFor="licenseNumber">מספר רישיון</Label>
        <Input
          id="licenseNumber"
          // Numbers are always LTR — override inherited RTL direction
          dir="ltr"
          className="text-left"
          inputMode="numeric"
          maxLength={5}
          placeholder="12345"
          aria-invalid={!!errors.licenseNumber}
          aria-describedby="license-hint"
          {...register("licenseNumber")}
        />
        <p id="license-hint" className="text-xs text-muted-foreground">
          5 ספרות בדיוק
        </p>
        {errors.licenseNumber && (
          <p role="alert" className="text-xs text-destructive">
            {errors.licenseNumber.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמור רופא"}
        </Button>
        <Link
          href="/doctors"
          className={cn(buttonVariants({ variant: "outline" }), "pointer-events-auto")}
          tabIndex={isSubmitting ? -1 : 0}
          aria-disabled={isSubmitting}
        >
          ביטול
        </Link>
      </div>
    </form>
  );
}
