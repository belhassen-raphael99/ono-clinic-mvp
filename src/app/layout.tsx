import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "מערכת ניהול מרפאה",
  description:
    "מערכת לניהול תורים, רופאים ומטופלים — פרויקט גמר בקורס ניהול ועיצוב בסיסי נתונים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={cn("h-full antialiased", heebo.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
