@AGENTS.md

# Ono Clinic MVP — Project Memory

Medical clinic appointment management system. Academic project for Ono Academic College, Database Design & Management course (Semester B 2026, Prof. Yael Levy-Mimun). Final deliverable is a publicly deployed CRUD app on Vercel.

## Tech stack (locked)

- **Framework**: Next.js 16.2.4 (App Router) + React 19.2.4
- **Language**: TypeScript 5.9.3 (strict mode)
- **DB**: Neon Postgres (free tier, HTTP driver) + Prisma ORM
- **Styling**: Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- **UI primitives**: shadcn/ui (added in step 3)
- **Forms**: React Hook Form + Zod (shared client/server validation)
- **Fonts**: Heebo via `next/font/google` (Hebrew RTL UI)
- **Toasts**: Sonner (added in MVP2)
- **Date**: `date-fns` + `date-fns-tz` (display in `Asia/Jerusalem`, store UTC)
- **Pkg manager**: pnpm 10.33.2
- **Deploy**: Vercel (free tier)
- **VCS**: GitHub repo `belhassen-raphael99/ono-clinic-mvp` (public)

## Domain model (locked, enforced at DB level)

```
DOCTOR        license_number (PK, 5 digits) | name
PATIENT       id_number (PK, 9-digit Israeli Teudat Zehut + checksum) | name | phone (Israeli format)
APPOINTMENT   appointment_number (PK, autoincrement) | appointment_date (UTC) | reason
              FK doctor_license  → DOCTOR  (onDelete: Restrict)
              FK patient_id      → PATIENT (onDelete: Restrict)
```

**Hard rules** enforced in Server Actions:
- All appointments are **future-dated only** (including edit flow)
- **No double-booking**: 30-min half-open interval check on both doctor AND patient
- Delete a Doctor or Patient is **blocked** when any appointment references them (FK Restrict + friendly Hebrew message)

## Working agreements

This project follows a 6-role workflow (PM / UX / ARCH / DEV / QA / SEC). Currently in **DEV** role, executing one numbered step at a time.

- **Never batch steps.** One step → commit → push → next step.
- **Every step ends with**: `git add . && git commit -m "[stepN] description" && git push`
- **Every commit message** uses `[stepN]` prefix.
- **Verification report** is mandatory after each step: what was built, how to test it, commit hash, what's next.
- **No code, file, or command** is generated without explicit "go" approval for that specific step.
- **Free tier only** (Neon free, Vercel free, GitHub free).
- **No authentication required** in MVP scope.
- **No in-memory state, no localStorage** — real DB persistence only.

## Current state

- **Step 1 ✓ COMPLETE** — Project initialized: Next.js 16, TypeScript strict, Tailwind v4, ESLint, App Router, src/, Turbopack dev. Pushed to GitHub.
- **Step 2** (next) — Configure Hebrew RTL: `<html dir="rtl" lang="he">`, Heebo font, RTL-safe Tailwind utilities.

## Where things are

| Path | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout (RTL config goes here in step 2) |
| `src/app/page.tsx` | Dashboard (rebuilt in step 16) |
| `src/app/globals.css` | Tailwind v4 directives + custom RTL utilities |
| `prisma/schema.prisma` | Schema (added in step 4) |
| `src/lib/db.ts` | Prisma client singleton (added in step 4) |
| `src/lib/validators/` | Israeli ID/phone/license validators with unit tests (step 5) |
| `ux-preview.html` | Standalone design mockup (committee-facing artifact) |

## Roadmap (26 steps total)

MVP1 = steps 1–18 (core functional + deployed). MVP2 = steps 19–26 (polish + hardening).

See conversation history for the full numbered list.

## Notes for future me

- Next.js 16 has breaking changes from older training data — the AGENTS.md warning is real. Consult `node_modules/next/dist/docs/` before writing new App Router patterns.
- Tailwind v4 moved away from `tailwind.config.ts` — the design tokens live inside `globals.css` via `@theme`.
- The ERD column names use `snake_case` at the DB level but `camelCase` in Prisma model fields (mapped via `@map(...)`).
- Hebrew text is the UI; English is the codebase. Comments and identifiers are English. UI strings are Hebrew.
