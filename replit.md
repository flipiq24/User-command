# Workspace

## Overview

FlipIQ CSM Dashboard — an internal tool for Ramy (CSM Lead) to monitor Acquisition Associates (AAs) daily. Built to match the V9 prototype design exactly.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (Replit built-in)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, inline styles (V9 design), DM Sans font

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (all FlipIQ routes)
│   └── flipiq-dashboard/   # React dashboard (V9 light-theme design)
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

## Frontend (V9 Design)

The dashboard is a single-page React component with embedded data arrays and inline styles.

### Design
- Light theme: #F8FAFB background, white cards, orange #F97316 accent
- Header: "FlipIQ COMMAND / CSM Dashboard" with iQ gradient logo
- DM Sans font family
- No external component libraries (no shadcn, no Tailwind utility classes in JSX)

### Tabs
1. **Overview** — Info cards, Atomic KPI (2 deals/month/person), task list with checkboxes, WHY root cause
2. **Leaderboard** — Full stats table with medals for top 3, date range dropdown
3. **Heat map** — 7 category columns (Plan/Find/Comms/Prop/Analysis/Offers/Tools), color-coded cells, tooltips
4. **Emails** — Coaching email cards with Generate button, BECAUSE root cause, yesterday/goal stats, plus Communication Log table at bottom
5. **Email logic** — Reference table of all trigger rules across P1/P2/P3 phases
6. **User list** — Full user directory with login history (first/last/total), company, email, phone, Dialpad phone, email source/bulk configs, and contact IDs
7. **Deal dashboard** — Financial overview of all deals: clickable Source/Type/Intent filter buttons at top (toggle on/off, replaces old dropdown); 5 pipeline stage cards with inline SVG sparkline line charts; line-chart revenue forecast (March W1-W4 + Apr/May/Jun); AA-grouped deal table showing only Offer Accepted and Acquired deals with columns: AA, Company, Accepted, Accept-to-Close %, Acquired, Commission. Expandable rows show individual deal details (Address, Intent, Type, Price, Commission, Comm type, Close date, Stage). Filter states: `dlSrc`, `dlPt`, `dlInt` (all nullable toggles). Commission rules: Wholesaler = 25% profit; MLS/Off Market Flip = 0.5% price or 25% profit; MLS/Off Market Wholesale = 10% or 25% profit. Deal data generated from `genDeals()` (~280 deals scaled proportionally from AA stats).

### User Detail View
- Pipeline stage cards in header: Active Pipeline → Offers → In Negotiations → Offer Accepted → Acquired
- Each card has a donut/ring chart, value, and percentage with color coding
- Arrow connectors between cards show the deal flow progression
- Below: Communication, Deal Pipeline, and Relationships stat cards
- Root cause analysis section (WHY) when applicable
- **Feature Adoption chart**: progress ring showing adoption %, color legend (Active/Cooling/Gap/Unused), 7 horizontal stacked bars per category, "New this week" callout for recently adopted events
- Feature usage accordion with 7 categories and 61 sortable events
- **Sent Emails popup**: button next to "Send email" opens a modal showing all coaching emails sent — date, time, type badge, subject, recipient, event target badges (color-coded by status), acted/ignored tracking (green strikethrough = completed), and video per email
- **Training Milestones**: vertical timeline of 5 predefined milestones (Platform Tour, First Offer Walkthrough, Comp Analysis Training, Negotiation Coaching, Independent Workflow) with toggleable completion, hover tooltips, and completion timestamps
- **Training Notes**: timestamped note feed with input for adding training observations, reverse chronological order
- **Training Impact**: before/after comparison bars for avg daily calls and offers relative to milestone completion dates
- **AI Assistant panel** at the bottom: auto-generated summary + top 3 priorities + interactive chat

### Event-Aware Email System
- **EV mapping**: All 62 events mapped to videos, phases, and coaching tips
- **gME()**: Computes missing/gap/cooling events per AA based on phase + health
- **gEH()**: Generates email history with event targets, video, acted/ignored tracking per email
- **bE()**: Dynamic email body with PROGRESS UPDATE (completed events), TODAY'S FOCUS (3 priority events), STILL PENDING (previously sent but unused), phase-matched video, and event adoption stats
- **Email Logic tab**: Events column shows which of the 62 tracked events each rule targets; "(dynamic)" badges for rules that pick AA-specific events
- **Emails tab cards**: Show "Today's email targets" with colored badges + video reference
- **Email preview**: Shows "Event targets in this email" with status labels + video tied to top event

### Tooltips
- Comprehensive tooltips on every interactive element, label, badge, button, tab, filter, column header, legend item, and pipeline card across all tabs

### Blocked-by-Category Indicator
- `blockedCats` state keyed by `"userId_catIndex"` → note string
- `blockEdit` / `blockNote` state for modal editing
- Heat map: right-click any cell to mark as blocked; cell shows red "BLOCKED" label instead of score
- Heat map tooltip: shows blocked note when present + "Right-click to mark/edit blocked" hint
- Heat map legend: includes "Blocked" entry with striped swatch
- Overview task rows: "BLOCKED: [Category]" red badges with tooltip showing the note
- User detail header: blocked category badges (clickable to edit)
- Feature Adoption bars: striped red bar with "BLOCKED" label + dedicated edit button per category
- Blocker modal: textarea for note, Mark Blocked / Update / Unblock / Cancel buttons
- In-memory only (no API persistence yet, same pattern as tlOverrides)

### Tech Level Indicator
- 4 levels: novice (red #DC2626), traditional (yellow #EAB308), capable (green #10B981), power_user (blue #3B82F6)
- `TechDot` component: colored dot next to user name, click to open dropdown, select new level → optimistic update + PATCH to API
- Present in 4 locations: task list rows, leaderboard rows, heat map rows, user detail header
- `tlOverrides` state tracks local changes; persisted via `PATCH /api/users/:id` with `tech_level` field

### Data (Embedded)
- 5 organizations: Coko Homes, Hegemark, TD Realty, STJ Investments, Fair Close
- 21 users with full stats, health, phase, gaps, agenda, email count, tech level (tl)
- 7 event categories with 61 total events
- 3-Track scoring function (g3) generates event usage data
- Root cause logic (gc) identifies WHY behind each user's issues
- Email builder (bE) generates coaching emails or AM escalations

### Health Labels
- red = Critical, orange = Gap, yellow = Cooling, green = Healthy

### Phase Labels
- 1 = Onboarding (Days 1-7), 2 = Activation (Days 8-21), 3 = Performance (Day 22+)

### Key Functions
- `g3(health, categoryIndex, eventIndex)` — 3-Track scoring per event
- `gc(user)` — Root cause analysis (returns WHY string)
- `bE(user)` — Email builder (coaching email or AM escalation if ec >= 3)
- `vc(value, goal)` — Value color (green >= 80%, amber >= 50%, red < 50%)

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
- `deals` — deal pipeline: address, source (MLS/Off Market), intent (Flip/Wholesale/Portfolio), 7 stages (Initial Contact → Acquired), price/profit/commission, invoice tracking (need_to_invoice/invoiced/payment_received), success_fee, expected/actual close dates
- `training_milestones` — per-user milestone completions (user_id, milestone_key, completed_at, completed_by), unique on (user_id, milestone_key)
- `training_notes` — timestamped training observations (user_id, note_text, created_at, created_by)

## API Routes

All routes under `/api/`:
- `GET /dashboard` — main dashboard (users + today emails + tasks)
- `GET /users` — list all active users
- `GET /users/:id` — user detail (with events, categories, gaps, tasks)
- `PATCH /users/:id` — update health/priority/agenda/goals/tech_level
- `GET /emails?date=&status=` — list coaching emails
- `POST /emails` — create coaching email
- `POST /emails/:id/forward` — mark forwarded
- `PATCH /emails/:id/status` — update status
- `GET /tasks?date=` — list task completions
- `POST /tasks` — log Ramy's task
- `GET /leaderboard?startDate=&endDate=` — ranked stats
- `POST /ai/chat` — AI assistant chat (OpenAI via Replit proxy, input-validated)
- `GET /claude/read-all` — all data for Claude's morning processing
- `POST /claude/update-health` — Claude writes back health scores + gaps
- `GET /deals` — list deals with filters (source, intent, org_id, stage, invoice_status, from_date, to_date)
- `GET /deals/summary` — aggregated grid data + invoice summary + past-due deals
- `GET /deals/:id` — single deal detail
- `POST /deals` — create a deal
- `PATCH /deals/:id` — update deal (stage, invoice status, dates, etc.)
- `GET /users/:userId/training/milestones` — list training milestones (5 predefined milestones with completion status)
- `POST /users/:userId/training/milestones` — mark a milestone complete
- `DELETE /users/:userId/training/milestones/:key` — remove milestone completion
- `GET /users/:userId/training/notes` — list training notes (reverse chronological)
- `POST /users/:userId/training/notes` — add a training note
- `GET /users/:userId/training/impact` — before/after avg calls & offers per completed milestone

## Auto-Seed

The API server includes an auto-seed module (`artifacts/api-server/src/auto-seed.ts`) that runs on startup. It checks if the `deals` table is empty and, if so, seeds:
- 5 organizations (Coko Homes, Hegemark, TD Realty, STJ Investments, Fair Close)
- 21 users (acquisition associates) across all orgs
- ~280 deals distributed across all users with realistic stages, prices, commissions, and invoice statuses

This ensures the production database gets populated on first deploy without manual intervention.

## Claude Integration

Claude calls `/api/claude/read-all` at 5 AM to read all user data, then:
- Analyzes 3-Track scoring, health, gaps
- Calls `POST /api/emails` to write coaching emails
- Calls `POST /api/claude/update-health` to update health/priority/agenda

## Migrations / Schema

In development, use Drizzle Kit push:
```bash
pnpm --filter @workspace/db run push
```
