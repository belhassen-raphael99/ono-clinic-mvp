"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 h-14 z-40 flex items-center justify-between px-4 bg-background/95 backdrop-blur border-b border-border">
      {/* Start side (RIGHT in RTL): hamburger on mobile + brand name */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="פתח תפריט"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold text-primary text-base select-none">
          מרפאה אונו
        </span>
      </div>

      {/* End side (LEFT in RTL): theme toggle */}
      <ThemeToggle />
    </header>
  );
}
