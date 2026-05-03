import { Users, Stethoscope, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const now = new Date();

  const [doctorCount, patientCount, totalAppointments, upcomingAppointments] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.appointment.findMany({
      where: { appointmentDate: { gte: now } },
      include: { doctor: true, patient: true },
      orderBy: { appointmentDate: "asc" },
      take: 5,
    }),
  ]);

  return { doctorCount, patientCount, totalAppointments, upcomingAppointments };
}

const fmt = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function DashboardPage() {
  const { doctorCount, patientCount, totalAppointments, upcomingAppointments } =
    await getDashboardData();

  const stats = [
    { label: "רופאים", value: doctorCount,        icon: Stethoscope, href: "/doctors"      },
    { label: "מטופלים", value: patientCount,       icon: Users,       href: "/patients"     },
    { label: "סה\"כ תורים", value: totalAppointments, icon: CalendarDays, href: "/appointments" },
    { label: "תורים קרובים", value: upcomingAppointments.length, icon: Clock, href: "/appointments" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">לוח בקרה</h1>
        <p className="text-sm text-muted-foreground mt-0.5">סיכום נתוני המרפאה</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}
            className="rounded-xl border border-border bg-card p-5 shadow-card hover:bg-muted/20 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <span className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-base">5 התורים הקרובים</h2>
          <Link href="/appointments/new" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
            תור חדש
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">אין תורים קרובים</p>
        ) : (
          <ul className="divide-y divide-border">
            {upcomingAppointments.map((appt) => (
              <li key={appt.appointmentNumber}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{appt.patient.name}</p>
                  <p className="text-xs text-muted-foreground">ד"ר {appt.doctor.name} · {appt.reason}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ms-4" dir="ltr">
                  {fmt.format(appt.appointmentDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
