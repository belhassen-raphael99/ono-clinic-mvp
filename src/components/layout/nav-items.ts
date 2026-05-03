import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/doctors", label: "רופאים", icon: Stethoscope },
  { href: "/patients", label: "מטופלים", icon: Users },
  { href: "/appointments", label: "תורים", icon: CalendarDays },
];
