# Workspace

## Overview

FlipIQ CSM Dashboard — a full-stack monorepo for Ramy's morning review of Acquisition Associates (AAs) using the FlipIQ real estate platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (Replit built-in)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (all FlipIQ routes)
│   └── flipiq-dashboard/   # React dashboard (Ramy's morning view)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## FlipIQ Domain

### Organizations (Tenants)
Real orgs from production data: Acquired, Command, DBTM, Dev Command, Diversified Capital Partners, Flip IQ, Hegemark, STJ

### Users (Acquisition Associates)
60 real AAs across all organizations, loaded from Tenant_Performance spreadsheet data (Jan 17 – Mar 20, 2026).

### Health Scoring
- **green**: avg_calls >= 3/day AND checkin_rate >= 80% AND avg_offers >= 0.5/day
- **yellow**: avg_calls >= 1/day AND checkin_rate >= 60%
- **orange**: checkin_rate >= 30% OR avg_calls >= 0.3/day
- **red**: very low/no activity

## Database Schema

Key tables:
- `organizations` — tenants/companies
- `users` — acquisition associates, with health/priority/phase
- `daily_stats` — one row per user per day (calls, texts, emails, offers, etc.)
- `coaching_emails` — AI-generated emails Claude writes each morning
- `email_history` — 3-strike tracking per user
- `task_completions` — Ramy's manual actions (called, texted, notified AM, etc.)
- `user_gaps`, `user_events`, `user_category_scores` — 3-Track event system
- `events` — 62 reference events across 7 categories
- `event_categories` — plan/find/comm/prop/analysis/offers/tools

## API Routes

All routes under `/api/`:
- `GET /dashboard` — main dashboard (users + today emails + tasks)
- `GET /users` — list all active users
- `GET /users/:id` — user detail (with events, categories, gaps, tasks)
- `PATCH /users/:id` — update health/priority/agenda/goals
- `GET /emails?date=&status=` — list coaching emails
- `POST /emails` — create coaching email
- `POST /emails/:id/forward` — mark forwarded
- `PATCH /emails/:id/status` — update status
- `GET /tasks?date=` — list task completions
- `POST /tasks` — log Ramy's task
- `GET /leaderboard?startDate=&endDate=` — ranked stats
- `GET /claude/read-all` — all data for Claude's morning processing
- `POST /claude/update-health` — Claude writes back health scores + gaps

## Claude Integration

Claude calls `/api/claude/read-all` at 5 AM to read all user data, then:
- Analyzes 3-Track scoring, health, gaps
- Calls `POST /api/emails` to write coaching emails
- Calls `POST /api/claude/update-health` to update health/priority/agenda

## Dashboard Pages

1. **Dashboard** (`/`) — user card grid, sorted by priority (1=most critical). Health filter tabs.
2. **Coaching Emails** (`/emails`) — today's draft emails, forward/skip actions
3. **Leaderboard** (`/leaderboard`) — ranked table with call/offer/acquisition stats
4. **User Detail** (slide panel) — full breakdown per AA with events, categories, gaps, tasks

## Migrations / Schema

In development, use Drizzle Kit push:
```bash
pnpm --filter @workspace/db run push
```

Data was loaded from: `attached_assets/Tenant_Performance_(1)_1774135413810.xlsx` (3,780 rows, Jan 17–Mar 20 2026)
