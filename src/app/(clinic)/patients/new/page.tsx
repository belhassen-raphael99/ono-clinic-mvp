import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PatientForm } from "./patient-form";

export default function NewPatientPage() {
  return (
    <div className="max-w-lg space-y-6">
      <Link href="/patients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="h-4 w-4 shrink-0" />
        חזרה לרשימת המטופלים
      </Link>
      <div>
        <h1 className="text-2xl font-bold">הוסף מטופל</h1>
        <p className="text-sm text-muted-foreground mt-0.5">הזן את פרטי המטופל החדש</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <PatientForm />
      </div>
    </div>
  );
}
