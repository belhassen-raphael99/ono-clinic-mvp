"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DoctorUpdateSchema, type DoctorUpdateInput } from "@/lib/schemas/doctor";
import { updateDoctor, deleteDoctor } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  licenseNumber: string;
  name: string;
  appointmentCount: number;
}

export function DoctorEditForm({ licenseNumber, name, appointmentCount }: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DoctorUpdateInput>({
    resolver: standardSchemaResolver(DoctorUpdateSchema),
    defaultValues: { licenseNumber, name },
  });

  const onSubmit = async (data: DoctorUpdateInput) => {
    const result = await updateDoctor(data);
    if (!result.success) {
      if (result.fieldErrors?.name) {
        setError("name", { message: result.fieldErrors.name[0] });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }
    toast.success("פרטי הרופא עודכנו בהצלחה");
    router.push("/doctors");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteDoctor(licenseNumber);
    setIsDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      setDeleteOpen(false);
      return;
    }
    toast.success("הרופא נמחק בהצלחה");
    router.push("/doctors");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        {/* License — read-only; it's the PK and cannot change */}
        <div className="space-y-1.5">
          <Label>מספר רישיון</Label>
          <Input
            value={licenseNumber}
            disabled
            dir="ltr"
            className="text-left bg-muted/50"
          />
          <input type="hidden" {...register("licenseNumber")} />
          <p className="text-xs text-muted-foreground">מספר הרישיון אינו ניתן לשינוי</p>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">שם הרופא</Label>
          <Input
            id="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "שומר..." : "שמור שינויים"}
            </Button>
            <Link
              href="/doctors"
              className={cn(buttonVariants({ variant: "outline" }))}
              tabIndex={isSubmitting ? -1 : 0}
            >
              ביטול
            </Link>
          </div>

          {/* Delete trigger */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            מחק רופא
          </Button>
        </div>
      </form>

      {/* Delete confirmation / FK-block dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {appointmentCount > 0 ? "לא ניתן למחוק רופא" : "מחיקת רופא"}
            </DialogTitle>
            <DialogDescription>
              {appointmentCount > 0
                ? `לרופא זה יש ${appointmentCount} תורים רשומים. יש למחוק תחילה את כל התורים.`
                : `האם אתה בטוח שברצונך למחוק את הרופא? פעולה זו אינה הפיכה.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              ביטול
            </Button>
            {appointmentCount === 0 && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "מוחק..." : "מחק לצמיתות"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
