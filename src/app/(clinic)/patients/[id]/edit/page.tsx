import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { PatientEditForm } from "./patient-edit-form";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { idNumber: id },
    include: { _count: { select: { appointments: true } } },
  });

  if (!patient) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <Link href="/patients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת המטופלים
      </Link>
      <div>
        <h1 className="text-2xl font-bold">עריכת מטופל</h1>
        <p className="text-sm text-muted-foreground mt-0.5">עדכן את פרטי המטופל</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <PatientEditForm
          idNumber={patient.idNumber}
          name={patient.name}
          phone={patient.phone}
          appointmentCount={patient._count.appointments}
        />
      </div>
    </div>
  );
}
