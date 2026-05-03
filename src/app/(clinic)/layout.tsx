import { ClinicShell } from "@/components/layout/clinic-shell";

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClinicShell>{children}</ClinicShell>;
}
