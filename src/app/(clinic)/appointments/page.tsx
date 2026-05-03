import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AppointmentRow } from "./appointment-row";

export const dynamic = "force-dynamic";

async function getAppointments() {
  return prisma.appointment.findMany({
    include: { doctor: true, patient: true },
    orderBy: { appointmentDate: "asc" },
  });
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">תורים</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{appointments.length} תורים</p>
        </div>
        <Link href="/appointments/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="h-4 w-4" />
          תור חדש
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">אין תורים עדיין.</p>
          <Link href="/appointments/new" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
            הוסף תור ראשון
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-start font-medium">תאריך ושעה</th>
                  <th className="px-4 py-3 text-start font-medium">רופא</th>
                  <th className="px-4 py-3 text-start font-medium">מטופל</th>
                  <th className="px-4 py-3 text-start font-medium">סיבה</th>
                  <th className="px-4 py-3 text-start font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((appt) => (
                  <AppointmentRow key={appt.appointmentNumber} appointment={appt} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
