"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Appointment, Doctor, Patient } from "@prisma/client";

type AppointmentWithRelations = Appointment & { doctor: Doctor; patient: Patient };

const fmt = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function AppointmentRow({ appointment }: { appointment: AppointmentWithRelations }) {
  const isPast = appointment.appointmentDate < new Date();

  return (
    <tr className={cn("transition-colors hover:bg-muted/20", isPast && "opacity-60")}>
      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs" dir="ltr">
        {fmt.format(appointment.appointmentDate)}
      </td>
      <td className="px-4 py-3">{appointment.doctor.name}</td>
      <td className="px-4 py-3">{appointment.patient.name}</td>
      <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{appointment.reason}</td>
      <td className="px-4 py-3">
        <Link
          href={`/appointments/${appointment.appointmentNumber}/edit`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-xs")}
        >
          <Pencil className="h-3 w-3" />
          ערוך
        </Link>
      </td>
    </tr>
  );
}
