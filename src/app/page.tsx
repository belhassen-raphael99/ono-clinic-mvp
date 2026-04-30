export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">מערכת ניהול מרפאה</h1>
        <p className="text-lg text-muted-fg">
          פרויקט גמר · ניהול ועיצוב בסיסי נתונים
        </p>
      </header>

      <section className="bg-card shadow-card rounded-xl p-8 max-w-xl w-full space-y-6">
        <h2 className="text-xl font-semibold">בדיקת תצורה — שלב 2</h2>

        <ul className="space-y-3 text-base">
          <li>✓ עברית RTL מתבצעת כראוי</li>
          <li>✓ גופן Heebo נטען מהשרת המקומי</li>
          <li>✓ צבעי המערכת מ־Tailwind v4 מוגדרים</li>
          <li>
            ✓ מספרים בכיוון LTR בתוך טקסט עברי:
            <span className="num font-medium mx-2">12345</span>
            <span className="num font-medium mx-2">123456789</span>
            <span className="num font-medium mx-2">28/04/2026</span>
          </li>
        </ul>

        <div className="flex gap-3 pt-4 border-t border-line">
          <button
            type="button"
            className="bg-primary text-primary-fg px-5 py-2.5 rounded-lg font-medium hover:bg-primary-deep transition-colors"
          >
            כפתור ראשי
          </button>
          <button
            type="button"
            className="bg-card border border-line text-ink px-5 py-2.5 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            כפתור משני
          </button>
        </div>
      </section>

      <p className="text-xs text-muted-fg">
        דף בדיקה זמני — יוחלף בדשבורד בשלב 16
      </p>
    </main>
  );
}
