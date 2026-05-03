import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { AppointmentForm } from "./appointment-form";

export default async function NewAppointmentPage() {
  const [doctors, patients] = await Promise.all([
    prisma.doctor.findMany({ select: { licenseNumber: true, name: true }, orderBy: { name: "asc" } }),
    prisma.patient.findMany({ select: { idNumber: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-lg space-y-6">
      <Link href="/appointments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת התורים
      </Link>
      <div>
        <h1 className="text-2xl font-bold">קבע תור</h1>
        <p className="text-sm text-muted-foreground mt-0.5">הזן פרטי התור החדש</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <AppointmentForm doctors={doctors} patients={patients} />
      </div>
    </div>
  );
}
