import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { AppointmentEditForm } from "./appointment-edit-form";

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apptId = parseInt(id, 10);

  if (isNaN(apptId)) notFound();

  const [appt, doctors, patients] = await Promise.all([
    prisma.appointment.findUnique({ where: { appointmentNumber: apptId } }),
    prisma.doctor.findMany({ select: { licenseNumber: true, name: true }, orderBy: { name: "asc" } }),
    prisma.patient.findMany({ select: { idNumber: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!appt) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <Link href="/appointments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת התורים
      </Link>
      <div>
        <h1 className="text-2xl font-bold">עריכת תור</h1>
        <p className="text-sm text-muted-foreground mt-0.5">עדכן את פרטי התור</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <AppointmentEditForm
          appointmentNumber={appt.appointmentNumber}
          appointmentDate={appt.appointmentDate}
          reason={appt.reason}
          doctorLicense={appt.doctorLicense}
          patientId={appt.patientId}
          doctors={doctors}
          patients={patients}
        />
      </div>
    </div>
  );
}
