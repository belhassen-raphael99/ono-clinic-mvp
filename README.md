# מערכת ניהול מרפאה — Ono Clinic MVP

פרויקט גמר בקורס **ניהול ועיצוב בסיסי נתונים**, המכללה האקדמית אונו.

**Live demo:** [ono-clinic-mvp.vercel.app](https://ono-clinic-mvp.vercel.app)

---

## תיאור הפרויקט

אפליקציית ניהול מרפאה מלאה הכוללת ניהול רופאים, מטופלים ותורים. ממשק בעברית, כיוון RTL מלא, ועיצוב רספונסיבי.

### פיצ'רים עיקריים

| מודול | פעולות |
|---|---|
| **רופאים** | הוספה, עריכה, מחיקה (חסומה אם יש תורים) |
| **מטופלים** | הוספה, עריכה, מחיקה (חסומה אם יש תורים) |
| **תורים** | קביעה, עריכה, מחיקה עם **זיהוי התנגשות 30 דקות** |
| **לוח בקרה** | ספירות + 5 תורים קרובים |

---

## ארכיטקטורה טכנית

```
Next.js 16 (App Router)
├── Server Components         ← ריצה ב-server, ללא JavaScript בצד לקוח
├── Server Actions            ← mutations ישירות ל-DB, ללא API REST
├── React Hook Form + Zod 4   ← ולידציה client + server
└── Prisma 6 + Neon Postgres  ← ORM + PostgreSQL ב-cloud
```

### מבנה הפרויקט

```
src/
├── app/
│   ├── (clinic)/              # Route group — shell + sidebar
│   │   ├── dashboard/         # לוח בקרה
│   │   ├── doctors/           # רופאים (list + new + [license]/edit)
│   │   ├── patients/          # מטופלים (list + new + [id]/edit)
│   │   └── appointments/      # תורים (list + new + [id]/edit)
│   └── layout.tsx             # Root layout: RTL + Heebo + ThemeProvider
├── components/
│   └── layout/                # ClinicShell, AppHeader, AppSidebar, ThemeToggle
└── lib/
    ├── schemas/               # Zod schemas (doctor, patient, appointment)
    ├── validators.ts          # תעודת זהות, רישיון, טלפון ישראלי
    └── action-helpers.ts      # validate() utility
```

---

## בסיס הנתונים

### ישויות

**Doctor** — רישיון רופא ישראלי (5 ספרות), שם
**Patient** — תעודת זהות (9 ספרות + ספרת ביקורת), שם, טלפון ישראלי
**Appointment** — FK ל-Doctor + Patient, תאריך (timestamptz), סיבה

### אילוצים

- `ON DELETE RESTRICT` על שני FKs של Appointment — אי אפשר למחוק רופא/מטופל עם תורים
- אינדקס מורכב `(doctor_license, appointment_date)` — מאיץ בדיקת התנגשות
- ולידציה ספרת ביקורת (לוחנית) ב-application layer

---

## התקנה מקומית

```bash
# Clone
git clone https://github.com/belhassen-raphael99/ono-clinic-mvp.git
cd ono-clinic-mvp

# Install
pnpm install

# Environment variables (.env.local)
DATABASE_URL="postgresql://..."   # Neon connection pooling URL
DIRECT_URL="postgresql://..."     # Neon direct URL (for migrations)

# Generate Prisma client + push schema
pnpm prisma generate
pnpm prisma db push

# Seed with sample data
pnpm prisma db seed

# Start dev server
pnpm dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

---

## סטאק טכנולוגי

| כלי | גרסה | שימוש |
|---|---|---|
| Next.js | 16 | App Router, Server Actions |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety (strict mode) |
| Tailwind CSS | 4 | Styling |
| Prisma | 6 | ORM |
| Neon | — | Serverless Postgres |
| Zod | 4 | Schema validation |
| React Hook Form | 7 | Form state management |
| shadcn/ui (Base UI) | — | Component library |
| Sonner | — | Toast notifications |
| next-themes | — | Dark/light mode |
| Heebo | — | Google Fonts (Hebrew) |

---

## Scripts

```bash
pnpm dev          # dev server with Turbopack
pnpm build        # production build
pnpm test         # unit tests (Vitest)
pnpm lint         # ESLint
pnpm prisma studio  # visual DB browser
```

---

*פרויקט גמר — המכללה האקדמית אונו, 2025*
