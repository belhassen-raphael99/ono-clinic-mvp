"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PatientUpdateSchema, type PatientUpdateInput } from "@/lib/schemas/patient";
import { updatePatient, deletePatient } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props { idNumber: string; name: string; phone: string; appointmentCount: number; }

export function PatientEditForm({ idNumber, name, phone, appointmentCount }: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<PatientUpdateInput>({
    resolver: standardSchemaResolver(PatientUpdateSchema),
    defaultValues: { idNumber, name, phone },
  });

  const onSubmit = async (data: PatientUpdateInput) => {
    const result = await updatePatient(data);
    if (!result.success) {
      if (result.fieldErrors?.name) setError("name", { message: result.fieldErrors.name[0] });
      if (result.fieldErrors?.phone) setError("phone", { message: result.fieldErrors.phone[0] });
      if (!result.fieldErrors) setError("root", { message: result.error });
      return;
    }
    toast.success("פרטי המטופל עודכנו בהצלחה");
    router.push("/patients");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePatient(idNumber);
    setIsDeleting(false);
    if (!result.success) { toast.error(result.error); setDeleteOpen(false); return; }
    toast.success("המטופל נמחק בהצלחה");
    router.push("/patients");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{errors.root.message}</p>
        )}

        <div className="space-y-1.5">
          <Label>תעודת זהות</Label>
          <Input value={idNumber} disabled dir="ltr" className="text-left bg-muted/50" />
          <input type="hidden" {...register("idNumber")} />
          <p className="text-xs text-muted-foreground">תעודת הזהות אינה ניתנת לשינוי</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">שם המטופל</Label>
          <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name && <p role="alert" className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">טלפון</Label>
          <Input id="phone" dir="ltr" className="text-left" inputMode="tel" aria-invalid={!!errors.phone} {...register("phone")} />
          {errors.phone && <p role="alert" className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "שומר..." : "שמור שינויים"}</Button>
            <Link href="/patients" className={cn(buttonVariants({ variant: "outline" }))} tabIndex={isSubmitting ? -1 : 0}>ביטול</Link>
          </div>
          <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />מחק מטופל
          </Button>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{appointmentCount > 0 ? "לא ניתן למחוק מטופל" : "מחיקת מטופל"}</DialogTitle>
            <DialogDescription>
              {appointmentCount > 0
                ? `למטופל זה יש ${appointmentCount} תורים רשומים. יש למחוק תחילה את כל התורים.`
                : "האם אתה בטוח שברצונך למחוק את המטופל? פעולה זו אינה הפיכה."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>ביטול</Button>
            {appointmentCount === 0 && (
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "מוחק..." : "מחק לצמיתות"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
