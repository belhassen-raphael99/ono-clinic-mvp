"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h2 className="text-2xl font-bold">אירעה שגיאה</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "משהו השתבש."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 font-mono" dir="ltr">
          Error digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md border border-border hover:bg-muted/20 transition-colors"
      >
        נסה שוב
      </button>
    </div>
  );
}
