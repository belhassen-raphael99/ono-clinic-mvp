import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DoctorForm } from "./doctor-form";

export default function NewDoctorPage() {
  return (
    <div className="max-w-lg space-y-6">
      {/* Back link — ChevronRight points toward the start (right) in RTL = "back" */}
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת הרופאים
      </Link>

      <div>
        <h1 className="text-2xl font-bold">הוסף רופא</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          הזן את פרטי הרופא החדש
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <DoctorForm />
      </div>
    </div>
  );
}
