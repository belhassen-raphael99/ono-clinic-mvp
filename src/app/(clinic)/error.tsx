"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ClinicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ClinicError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-xl font-bold">אירעה שגיאה</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error.message || "משהו השתבש. אנא נסה שוב."}
      </p>
      <Button onClick={reset} variant="outline">נסה שוב</Button>
    </div>
  );
}
