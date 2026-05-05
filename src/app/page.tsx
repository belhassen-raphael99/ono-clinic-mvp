import Link from "next/link";
import { Stethoscope, Users, CalendarDays, Activity, ArrowLeft, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const [doctorCount, patientCount, appointmentCount] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
  ]);
  return { doctorCount, patientCount, appointmentCount };
}

export default async function WelcomePage() {
  const { doctorCount, patientCount, appointmentCount } = await getStats();

  const features = [
    {
      icon: Stethoscope,
      title: "ניהול רופאים",
      description: "הוספה, עריכה ומחיקה של רופאים. כל רופא מזוהה לפי מספר רישיון ישראלי תקף.",
      href: "/doctors",
    },
    {
      icon: Users,
      title: "ניהול מטופלים",
      description: "מאגר מטופלים מלא עם ולידציה של תעודת זהות וטלפון ישראלי.",
      href: "/patients",
    },
    {
      icon: CalendarDays,
      title: "ניהול תורים",
      description: "קביעה ועריכה של תורים עם זיהוי אוטומטי של התנגשויות בטווח 30 דקות.",
      href: "/appointments",
    },
    {
      icon: Activity,
      title: "לוח בקרה",
      description: "סקירה מהירה של סטטיסטיקת המרפאה והתורים הקרובים.",
      href: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Top bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Heart className="h-4 w-4" />
            </span>
            <span className="font-semibold">מרפאת אונו</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
          <Activity className="h-3 w-3" />
          מערכת ניהול מרפאה
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          ברוכים הבאים<br />
          <span className="bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent">
            למרפאת אונו
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          מערכת מודרנית לניהול רופאים, מטופלים ותורים. עיצוב נקי, ממשק בעברית, וביצועים מהירים — הכל במקום אחד.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            התחל עכשיו
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href="/appointments/new" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
            קבע תור חדש
          </Link>
        </div>

        {/* Live stats */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: "רופאים", value: doctorCount },
            { label: "מטופלים", value: patientCount },
            { label: "תורים", value: appointmentCount },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card px-4 py-5 shadow-card">
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">מה תוכלו לעשות במערכת</h2>
          <p className="text-muted-foreground mt-2 text-sm">ארבעה מודולים מרכזיים לניהול מלא של המרפאה</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-border bg-card p-6 shadow-card hover:bg-muted/20 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold flex items-center justify-between">
                    {title}
                    <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-muted-foreground">
          <p>פרויקט גמר — ניהול ועיצוב בסיסי נתונים · המכללה האקדמית אונו</p>
        </div>
      </footer>
    </div>
  );
}
