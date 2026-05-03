// Force server-side rendering on every request — data changes after mutations.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDoctors() {
  return prisma.doctor.findMany({
    // _count compiles to a single lateral subquery — no N+1
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });
}

type DoctorRow = Awaited<ReturnType<typeof getDoctors>>[number];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">רופאים</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {doctors.length === 0
              ? "אין רופאים עדיין"
              : `${doctors.length} רופאים במערכת`}
          </p>
        </div>
        {/* Base UI Button has no asChild — apply styles to Link directly */}
        <Link href="/doctors/new" className={cn(buttonVariants(), "gap-1.5")}>
          <UserPlus className="h-4 w-4" />
          הוסף רופא
        </Link>
      </div>

      {doctors.length === 0 ? <EmptyDoctors /> : <DoctorsTable doctors={doctors} />}
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────

function DoctorsTable({ doctors }: { doctors: DoctorRow[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>שם הרופא</TableHead>
            <TableHead>מספר רישיון</TableHead>
            <TableHead className="text-center">תורים</TableHead>
            <TableHead className="text-center w-28">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <DoctorRowItem key={doctor.licenseNumber} doctor={doctor} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DoctorRowItem({ doctor }: { doctor: DoctorRow }) {
  const hasAppointments = doctor._count.appointments > 0;

  return (
    <TableRow>
      <TableCell className="font-medium">{doctor.name}</TableCell>
      <TableCell>
        {/* .num: renders numerals LTR inside RTL text */}
        <span className="num text-sm text-muted-foreground">
          {doctor.licenseNumber}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span className="num text-sm">{doctor._count.appointments}</span>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/doctors/${doctor.licenseNumber}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label={`ערוך את ${doctor.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          {/* Delete wired in Step 13; disabled when appointments exist (ON DELETE RESTRICT) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive-soft hover:text-destructive"
            aria-label={`מחק את ${doctor.name}`}
            disabled={hasAppointments}
            title={
              hasAppointments
                ? "לא ניתן למחוק רופא שיש לו תורים"
                : "מחק רופא"
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyDoctors() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center gap-4">
      <p className="text-muted-foreground text-sm">
        עדיין לא נוספו רופאים למערכת.
      </p>
      <Link
        href="/doctors/new"
        className={buttonVariants({ variant: "outline" })}
      >
        הוסף רופא ראשון
      </Link>
    </div>
  );
}
