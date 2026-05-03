"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems, type NavItem } from "./nav-items";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Single nav link ─────────────────────────────────────────────────────────

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

// ─── Shared nav list (used in both desktop + mobile) ─────────────────────────

function NavList({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          // match exact route or any sub-route (e.g. /doctors/new)
          active={
            pathname === item.href ||
            pathname.startsWith(item.href + "/")
          }
          onClick={onClose}
        />
      ))}
    </nav>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface AppSidebarProps {
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

export function AppSidebar({ drawerOpen, onDrawerClose }: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — fixed, right side (start-0 = right in RTL) */}
      <aside className="hidden md:flex fixed top-14 start-0 bottom-0 w-64 flex-col bg-sidebar border-e border-sidebar-border z-30">
        <NavList />
      </aside>

      {/* Mobile: backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40"
          onClick={onDrawerClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile: drawer panel — slides in from the right */}
      {drawerOpen && (
        <aside
          className="fixed top-0 start-0 bottom-0 w-72 z-50 flex flex-col bg-sidebar border-e border-sidebar-border md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="תפריט ניווט"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
            <span className="font-bold text-primary text-base">מרפאה אונו</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDrawerClose}
              aria-label="סגור תפריט"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <NavList onClose={onDrawerClose} />
        </aside>
      )}
    </>
  );
}
