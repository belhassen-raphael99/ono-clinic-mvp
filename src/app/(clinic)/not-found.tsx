import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ClinicNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-3xl font-bold">404</h2>
      <p className="text-sm text-muted-foreground">הדף שחיפשת לא נמצא.</p>
      <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
        חזרה ללוח בקרה
      </Link>
    </div>
  );
}
