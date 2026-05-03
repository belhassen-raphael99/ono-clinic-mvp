export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

async function getPatients() {
  return prisma.patient.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { name: "asc" },
  });
}

type PatientRow = Awaited<ReturnType<typeof getPatients>>[number];

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">מטופלים</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {patients.length === 0 ? "אין מטופלים עדיין" : `${patients.length} מטופלים במערכת`}
          </p>
        </div>
        <Link href="/patients/new" className={cn(buttonVariants(), "gap-1.5")}>
          <UserPlus className="h-4 w-4" />
          הוסף מטופל
        </Link>
      </div>

      {patients.length === 0 ? (
        <EmptyPatients />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>שם המטופל</TableHead>
                <TableHead>תעודת זהות</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead className="text-center">תורים</TableHead>
                <TableHead className="text-center w-28">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => <PatientRowItem key={p.idNumber} patient={p} />)}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function PatientRowItem({ patient }: { patient: PatientRow }) {
  const hasAppointments = patient._count.appointments > 0;
  return (
    <TableRow>
      <TableCell className="font-medium">{patient.name}</TableCell>
      <TableCell><span className="num text-sm text-muted-foreground">{patient.idNumber}</span></TableCell>
      <TableCell><span className="num text-sm">{patient.phone}</span></TableCell>
      <TableCell className="text-center"><span className="num text-sm">{patient._count.appointments}</span></TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/patients/${patient.idNumber}/edit`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label={`ערוך את ${patient.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Button
            variant="ghost" size="icon"
            className="text-destructive hover:bg-destructive-soft hover:text-destructive"
            aria-label={`מחק את ${patient.name}`}
            disabled={hasAppointments}
            title={hasAppointments ? "לא ניתן למחוק מטופל שיש לו תורים" : "מחק מטופל"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function EmptyPatients() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center gap-4">
      <p className="text-muted-foreground text-sm">עדיין לא נוספו מטופלים למערכת.</p>
      <Link href="/patients/new" className={buttonVariants({ variant: "outline" })}>הוסף מטופל ראשון</Link>
    </div>
  );
}
