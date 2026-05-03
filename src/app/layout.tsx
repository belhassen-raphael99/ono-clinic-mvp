import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes injects class/style on <html>
    // before React hydrates, which would cause a mismatch without this prop.
    <html
      lang="he"
      dir="rtl"
      className={cn("h-full antialiased", heebo.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
