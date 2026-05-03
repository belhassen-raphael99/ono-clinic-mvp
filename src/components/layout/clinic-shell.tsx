"use client";

import { useState } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

/**
 * Client wrapper that owns the mobile-drawer open/close state.
 * The parent layout (Server Component) passes {children} as a slot —
 * children remain server-rendered; only the shell itself is client-side.
 */
export function ClinicShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppHeader onMenuClick={() => setDrawerOpen(true)} />
      <AppSidebar
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />
      {/* pt-14 clears the fixed header; md:ms-64 clears the fixed sidebar (ms = margin-inline-start = right margin in RTL) */}
      <main className="pt-14 min-h-screen md:ms-64">
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}
