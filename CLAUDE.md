# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tablet-first math learning app for Japanese Grade 1 students (小学1年生). Bilingual UI (Japanese + Vietnamese). Monorepo with a Next.js frontend and a Laravel backend.

---

## Commands

### Frontend (`frontend/`)

**Requires Node.js ≥ 20.9.0.** The repo uses nvm — run `nvm use 22` before any npm commands.

```bash
cd frontend
nvm use 22
npm run dev        # dev server on :3000
npm run build      # production build (also runs TypeScript check)
```

There are no frontend tests. TypeScript errors surface only during `npm run build`.

### Backend (`backend/`)

The dev environment uses **SQLite** (not MySQL). The `.env` in the repo points at MySQL/Sail — for local dev without Docker, override it:

```bash
cd backend
php artisan serve          # API on :8000
php artisan migrate        # run migrations against SQLite
php artisan migrate:fresh  # wipe and re-run
php artisan tinker         # REPL
php artisan test           # PHPUnit (no tests written yet)
```

To run with Docker/Sail (MySQL):
```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
```

---

## Architecture

### Data flow

```
Browser (tablet PWA)
  └─ Next.js :3000  ──fetch──►  Laravel API :8000  ──►  SQLite / MySQL
```

`frontend/.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:8000`. Backend CORS is hardcoded to `http://localhost:3000` in `config/cors.php`.

### Frontend structure

| Path | Purpose |
|------|---------|
| `src/app/` | App Router pages: `/`, `/lesson/number-sense`, `/lesson/mental-math`, `/lesson/story-math`, `/daily` |
| `src/components/` | Shared UI: `NumberPad`, `AnswerFeedback`, `ObjectDisplay`, `StoryCard`, `StoryIllustration`, `CountdownTimer`, `ResultScreen` |
| `src/lib/api.ts` | All HTTP calls; exports `api.children`, `api.progress`, `api.sessions`, and a standalone `saveSession()` |
| `src/lib/questions/` | Stateless question generators: `numberSense.ts`, `mentalMath.ts`, `dailyChallenge.ts` |
| `src/hooks/` | `useDifficultyAdapter` — tracks correct/wrong streaks and auto-adjusts difficulty level |
| `src/data/stories.ts` | 22 static bilingual story problems |

Path alias `@/*` maps to `src/*`.

**Important:** `frontend/AGENTS.md` warns that Next.js 16 (used here) has breaking API changes from prior versions. Before modifying Next.js-specific code, consult `node_modules/next/dist/docs/`.

### Backend structure

| Path | Purpose |
|------|---------|
| `routes/api.php` | All routes — no auth middleware on any endpoint |
| `app/Http/Controllers/Api/` | `ChildController`, `SessionController`, `ProgressController` |
| `app/Models/` | `Child`, `LearningSession` (table: `learning_sessions`), `Answer`, `Progress`, `User` |

### Key business logic

**Stars (SessionController):** Calculated per-session and stored as the child's best score for that module. Never decreases: 100% → 3★, ≥70% → 2★, ≥40% → 1★, else 0★.

**Streak (SessionController):** Only the `daily` module updates `progress.streak`. Logic uses a fixed `$yesterday = Carbon::today()->subDay()` variable (not inline) to avoid Carbon mutation bugs.

**Daily Challenge seeding:** `dailyChallenge.ts` uses a linear-congruential PRNG seeded from `YYYYMMDD` so the same 10 questions appear all day regardless of reload.

**`DEMO_CHILD_ID = 1`:** All four lesson pages hardcode `child_id: 1`. This is MVP scaffolding — there is no auth or child-selection flow yet.

### Database schema

```
children:         id, name, avatar
learning_sessions: id, child_id, module, score, total, duration
answers:          id, session_id, question_type, difficulty, given_answer, is_correct, time_spent_ms
progress:         id, child_id, module, stars, streak, last_played_at
```

`module` values: `number-sense`, `mental-math`, `story-math`, `daily`.

### State management

- **React Query** (`@tanstack/react-query`) — server state; `staleTime` on progress queries is 1 minute.
- **Zustand** — installed but not yet used; reserved for future client state.
- Each lesson page manages its own local question/score/answer state and calls `api.sessions.save()` on completion.
