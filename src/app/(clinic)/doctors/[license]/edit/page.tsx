import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { DoctorEditForm } from "./doctor-edit-form";

interface Props {
  params: Promise<{ license: string }>;
}

export default async function EditDoctorPage({ params }: Props) {
  const { license } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: { licenseNumber: license },
    include: { _count: { select: { appointments: true } } },
  });

  if (!doctor) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת הרופאים
      </Link>

      <div>
        <h1 className="text-2xl font-bold">עריכת רופא</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{doctor.name}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <DoctorEditForm
          licenseNumber={doctor.licenseNumber}
          name={doctor.name}
          appointmentCount={doctor._count.appointments}
        />
      </div>
    </div>
  );
}
