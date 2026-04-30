import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">מערכת ניהול מרפאה</h1>
        <p className="text-lg text-muted-foreground">
          פרויקט גמר · ניהול ועיצוב בסיסי נתונים
        </p>
      </header>

      <section className="bg-card shadow-card rounded-xl p-8 max-w-xl w-full space-y-6">
        <h2 className="text-xl font-semibold">בדיקת תצורה — שלב 3</h2>

        <ul className="space-y-3 text-base">
          <li>✓ עברית RTL מתבצעת כראוי</li>
          <li>✓ גופן Heebo נטען מ־next/font (ממופה ל־--font-sans)</li>
          <li>✓ מערכת shadcn/ui מותקנת עם 13 רכיבי ליבה</li>
          <li>✓ צבעי המערכת ממופים לאסימוני shadcn (teal, paper, ink)</li>
          <li>
            ✓ מספרים בכיוון LTR בתוך טקסט עברי:
            <span className="num font-medium mx-2">12345</span>
            <span className="num font-medium mx-2">123456789</span>
            <span className="num font-medium mx-2">28/04/2026</span>
          </li>
        </ul>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button size="lg">כפתור ראשי</Button>
          <Button size="lg" variant="outline">כפתור משני</Button>
          <Button size="lg" variant="ghost">כפתור שקוף</Button>
          <Button size="lg" variant="destructive">מחיקה</Button>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        דף בדיקה זמני — יוחלף בדשבורד בשלב 16
      </p>
    </main>
  );
}
