# FlipiQ CSM Dashboard — Complete System Documentation

## Table of Contents

1. [What This System Is](#1-what-this-system-is)
2. [Who It's For](#2-who-its-for)
3. [The Business Context](#3-the-business-context)
4. [The North Star Metric](#4-the-north-star-metric)
5. [The 21 Acquisition Associates](#5-the-21-acquisition-associates)
6. [The 5 Organizations](#6-the-5-organizations)
7. [Phase System](#7-phase-system)
8. [Health Scoring](#8-health-scoring)
9. [3-Track Event System](#9-3-track-event-system)
10. [Dashboard Tabs — Complete Breakdown](#10-dashboard-tabs--complete-breakdown)
11. [User Detail View](#11-user-detail-view)
12. [Email System](#12-email-system)
13. [Deal Dashboard](#13-deal-dashboard)
14. [Engagement Tab](#14-engagement-tab)
15. [Trigger Table](#15-trigger-table)
16. [CSD Contacts](#16-csd-contacts)
17. [Filters and Sorting](#17-filters-and-sorting)
18. [AI Assistant](#18-ai-assistant)
19. [Claude Integration](#19-claude-integration)
20. [Training System](#20-training-system)
21. [Database Schema](#21-database-schema)
22. [API Routes](#22-api-routes)
23. [Tech Stack](#23-tech-stack)
24. [Data Flow](#24-data-flow)
25. [Key Functions Reference](#25-key-functions-reference)
26. [Design System](#26-design-system)

---

## 1. What This System Is

The FlipiQ CSM Dashboard is an **internal Customer Success Management tool** built for a single user — **Ramy (CSM Lead)** — to monitor, coach, and manage **21 Acquisition Associates (AAs)** across 5 real estate investment organizations. The dashboard is Ramy's daily command center. Every morning, he opens it to see which AAs need attention, what actions to take, and which coaching emails to send.

The system is **not** a product for end users. It is an internal operations tool. The AAs never see this dashboard. They use a separate product called **FlipiQ** (note: always lowercase 'i') — a real estate acquisition platform where they make calls, send texts/emails, find deals on MLS, submit offers, and close acquisitions.

This dashboard reads data about what the AAs are doing inside FlipiQ and presents it to Ramy so he can take action.

---

## 2. Who It's For

**Primary User:** Ramy — CSM Lead at FlipiQ

**Ramy's Daily Workflow:**
1. Open the dashboard each morning
2. Review the Overview tab — see which AAs are flagged
3. Check root causes (WHY each AA is struggling)
4. Send coaching emails to struggling AAs
5. Escalate to Account Managers when needed (3-strike rule)
6. Log actions taken (called, texted, emailed, walkthrough, notified AM)
7. Monitor the leaderboard and heat map for trends
8. Review deals in the deal dashboard
9. Track engagement status of each AA

**Secondary Stakeholders:**
- **Account Managers (AMs)** — One per organization. They receive escalation emails when an AA hits 3 strikes (3 coaching emails with no improvement). AMs are:
  - Gregory Patterson (Coko Homes)
  - Jeffrey Kuo (Hegemark)
  - Matt Carmean (TD Realty)
  - Andruw Tafolla (STJ Investments)
  - Tony Fletcher (Fair Close)

---

## 3. The Business Context

FlipiQ is a real estate investment platform. The companies using it (Coko Homes, Hegemark, TD Realty, STJ Investments, Fair Close) have hired Acquisition Associates whose job is to:

1. **Find deals** — Search MLS, filter properties, find off-market opportunities
2. **Communicate** — Call agents, send texts, emails, bulk campaigns
3. **Analyze** — Run comps, investment analysis, PIQ detail views
4. **Make offers** — Submit offer terms, contracts, negotiate
5. **Close deals** — Get offers accepted, acquire properties

The entire system is designed around one question: **Is each AA on track to close 2 deals per month?**

Everything flows from that question — the health scores, the phases, the coaching emails, the triggers, the escalation paths.

---

## 4. The North Star Metric

**Atomic KPI: 2 Deals per Month per AA**

- 21 AAs x 2 deals = 42 deals/month target for the entire team
- The header shows: total deals acquired / 42, with a percentage ring
- Every tab, every metric, every email ties back to whether the AA is on pace to hit this number
- "Deals" means fully acquired properties — not offers, not negotiations, but closed acquisitions

---

## 5. The 21 Acquisition Associates

Each AA has the following data tracked in the system:

**Identity & Contact:**
- User ID (1-21), First Name, Last Name, Login ID
- Email, Phone, Company
- Dialpad Phone Number, Dialpad User ID
- Email source server (SMTP), Bulk email source, Bulk email address
- Contact ID (CRM identifier)
- Account status (Active/Inactive)

**Login Activity:**
- First login date/time
- Last login date/time
- Total number of logins (color-coded: red=0, amber=<10, green=10+)

**Performance Stats (cumulative):**
- Texts sent, Emails sent
- Calls made, Calls connected
- New relationships, Upgraded contacts
- Properties opened, Properties reopened
- Offers submitted, Negotiations, Accepted, Acquired
- Total minutes on platform
- Time breakdown: PIQ minutes, Comps minutes, IA minutes, Offer minutes, Agent minutes
- Source breakdown: MLS, Direct Mail, Cold Call, Referral
- Priority High/Warm counts
- Daily check-in status (done/not done)

**Yesterday's Stats:**
- Texts, Emails, Calls, Offers, Properties opened

**Daily Goals:**
- Calls per day target (30 for P1, 50 for P2/P3)
- Offers per day target (3 for P1, 5 for P2/P3)
- Contacts per day target (50 for all)

**Metadata:**
- Organization ID (1-5)
- Phase (1-5)
- Day number (how many days since they started)
- Health score (red/orange/yellow/green)
- Priority score (1-4)
- Gaps (text descriptions of what's wrong)
- Discussion agenda (what to talk about with this AA)
- Recommended video
- Email count (how many coaching emails sent, 0-3+)
- Tech level (novice/traditional/capable/power_user)

**The current 21 AAs (sorted by priority):**
| ID | Name | Company | Day | Phase | Health |
|----|------|---------|-----|-------|--------|
| 14 | Johnny Catala | TD Realty | 3 | Onboarding | Critical |
| 15 | Daniel Worby | TD Realty | 3 | Onboarding | Critical |
| 11 | Roman Bracamonte | Hegemark | 6 | Onboarding | Critical |
| 5 | Jesus Valdez | Coko Homes | 4 | Onboarding | Critical |
| 21 | Trevor Kelly | Fair Close | 75 | Performance | Gap |
| 4 | Duk Lim | Coko Homes | 5 | Onboarding | Gap |
| 16 | Brooke Stiner | TD Realty | 3 | Onboarding | Gap |
| 19 | Isaac Haro | STJ Investments | 7 | Onboarding | Cooling |
| 3 | Chris Dragich | Coko Homes | 14 | Activation | Cooling |
| 13 | Juan Torres | TD Realty | 10 | Activation | Cooling |
| 10 | Maxwell Irungu | Hegemark | 12 | Activation | Cooling |
| 2 | Jared Lynch | Coko Homes | 38 | Performance | Cooling |
| 7 | Shaun Alan | Coko Homes | 18 | Activation | Cooling |
| 6 | Rod Vianna | Coko Homes | 26 | Performance | Cooling |
| 12 | Elizabeth Puga | Hegemark | 15 | Activation | Cooling |
| 18 | Lauren Robles | STJ Investments | 16 | Activation | Cooling |
| 1 | Miguel Rivera | Coko Homes | 45 | Performance | Healthy |
| 8 | Michael May | Hegemark | 60 | Performance | Healthy |
| 9 | Alek Tan | Hegemark | 50 | Performance | Healthy |
| 17 | Steve Medina | STJ Investments | 40 | Performance | Healthy |
| 20 | Josh Santos | Fair Close | 90 | Performance | Healthy |

---

## 6. The 5 Organizations

| ID | Name | Account Manager |
|----|------|----------------|
| 1 | Coko Homes | Gregory Patterson |
| 2 | Hegemark | Jeffrey Kuo |
| 3 | TD Realty | Matt Carmean |
| 4 | STJ Investments | Andruw Tafolla |
| 5 | Fair Close | Tony Fletcher |

Each org has multiple AAs. Coko Homes has the most (7 AAs). Fair Close has the fewest (2 AAs).

---

## 7. Phase System

AAs progress through lifecycle phases based on how many days they've been active:

| Phase | Name | Day Range | Color | Description |
|-------|------|-----------|-------|-------------|
| 1 | Onboarding | Days 1-7 | Blue #3B82F6 | Learning the tool, setting up, making first calls |
| 2 | Activation | Days 8-21 | Amber #D97706 | Building habits — consistent calls, offers, pipeline activity |
| 3 | Performance | Day 22+ | Green #10B981 | Should be hitting targets — 2 deals/month, strong activity |
| 4 | Outlier | Anomaly | Purple #8B5CF6 | Anomalous patterns detected (see below) |
| 5 | Suspended | Manual | Red #DC2626 | Removed from active tracking |

**Outlier Detection Rules:**
An AA is flagged as Outlier if any of these are true:
- Phase 3 + 30+ days + 0 acquisitions
- Phase 3 + 45+ days + fewer than 5 offers
- 14+ days active + 0 calls ever
- Phase 3 + red health
- 60+ days active + health is not green

**Phase Override:**
Ramy can manually override any AA's phase using dropdowns throughout the dashboard. Overrides are stored in `phOverrides` state and apply everywhere (Overview, User list, CSD view, Heat map).

---

## 8. Health Scoring

Each AA has a health score that reflects their current status:

| Health | Label | Color | Background | Description |
|--------|-------|-------|------------|-------------|
| red | Critical | #DC2626 | #FEF2F2 | Inactive, never logged in, or zero activity. Needs immediate intervention. |
| orange | Gap | #EA580C | #FFF7ED | Falling behind — missing calls, low offers, or incomplete training. |
| yellow | Cooling | #D97706 | #FEF9C3 | Was active but slowing down. Watch for continued decline. |
| green | Healthy | #10B981 | #ECFDF5 | On track — meeting call, offer, and deal targets. |

Health determines:
- Which AAs appear in the task list (non-green AAs generate tasks)
- How coaching emails are written
- Event scoring (3-Track system uses health)
- Whether escalation is needed

---

## 9. 3-Track Event System

The system tracks **62 events** across **7 categories** that represent every action an AA can take in FlipiQ:

### The 7 Categories

| # | Category | Events | Description |
|---|----------|--------|-------------|
| 1 | Today's Plan | 12 | iQ Check-In, Deal Review, Priorities, Outreach, Active Deals |
| 2 | Find Deals | 11 | MLS Hot Deals, MLS Search, Agent Search, Campaigns |
| 3 | Communication | 10 | Call, Text, Email, AI Connect, Bulk actions |
| 4 | Property Actions | 13 | Notes, Tax Data, Reminders, Offer Status, Add Property, Favorites |
| 5 | Analysis | 5 | PIQ Detail, Comps Map, Comps Matrix, Comps List, Investment Analysis |
| 6 | Offers | 4 | Offer Terms, Submit Contract, Update Negotiation, Offer vs Goal |
| 7 | Tools | 7 | My Stats, DispoPro, Quick Links, Login, Script Practice, Post-call, EOD Stats |

### Event Status Levels

Each event for each AA has a status (0-3):

| Score | Status | Color | Meaning |
|-------|--------|-------|---------|
| 0 | Missing | Red #DC2626 | Never used. AA hasn't tried this at all. |
| 1 | Gap | Orange #EA580C | Used once or twice but not recently. Training gap. |
| 2 | Cooling | Amber #D97706 | Was used but activity is cooling off. |
| 3 | Active | Green #10B981 | Being used regularly. On track. |

### Category Scores

Each category gets an aggregate score (0-3) based on the average of its events:
- Score >= 2.5 → 3 (Active)
- Score >= 1.5 → 2 (Cooling)
- Score >= 0.5 → 1 (Gap)
- Score < 0.5 → 0 (Missing)

### 3-Track Scoring Function `g3(health, categoryIndex, eventIndex)`

The scoring is deterministic based on the AA's health status:
- **Red (Critical):** All events return Missing (score 0)
- **Orange (Gap):** ~50% Missing, rest split between Gap/Cooling
- **Yellow (Cooling):** ~20% Missing, 20% Gap, 30% Cooling, 30% Active
- **Green (Healthy):** ~5% Cooling, 95% Active

### Blocked Categories

Ramy can mark any category as "blocked" for an AA by right-clicking a heat map cell. This indicates a technical or operational blocker preventing the AA from using features in that category. Blocked categories show a red "BLOCKED" label with striped background in the heat map and appear as badges in the Overview and User Detail views.

---

## 10. Dashboard Tabs — Complete Breakdown

The dashboard has 9 tabs, accessed via the navigation bar:

### Tab 1: Overview

**Purpose:** Ramy's daily task list. Shows every non-healthy AA that needs attention today.

**Components:**
- **Task bar:** Shows progress (e.g., "Tasks 0/16"), search by name, percentage progress bar
- **Pending tasks:** One card per non-healthy AA, sorted by priority score
  - Priority badge (Critical/High/Medium/Low) with color coding
  - Tech level dot (click to change)
  - AA name (click to view detail)
  - Company name and day number
  - Phase dropdown (editable)
  - 3-Strike badge (if email count >= 3)
  - No Check-In badge (if daily check-in not done)
  - Calls and Offers stats with color coding vs goals
  - Email/AM button to generate coaching email
  - WHY root cause line (orange text)
  - Gap badges
  - BLOCKED category badges
- **Completed tasks:** Green checkmark, action type badge, timestamp, optional note
- **Task completion modal:** Choose action type (Phone Call, Text Message, Coaching Email, Notified AM, Scheduled Walkthrough, Other), add optional note

### Tab 2: Leaderboard

**Purpose:** Ranked performance table comparing all AAs.

**Layout:** Full-width table with grouped column headers:
- **Communication:** Texts, Emails, Calls (with connected count)
- **Relationships:** New contacts, Upgraded contacts
- **Pipeline:** Open deals, Reopened deals, R/N ratio, Offers
- **Deal Progress:** Negotiations, Accepted, Acquired

**Features:**
- Top 3 get medal icons (gold, silver, bronze)
- Click any column header to sort ascending/descending
- Click any row to view that AA's detail
- Date range dropdown (Today, Yesterday, Last 7 days, Last 30 days, This month, All time)
- Health dot and tech level dot per row
- Color-coded values (green = at/above goal, red = below)

### Tab 3: Heat Map

**Purpose:** Visual grid showing 62-event adoption across all AAs and 7 categories.

**Layout:** Grid with AA names on left, 7 category columns
- Each cell shows active/total count (e.g., "5/12")
- Cells are color-coded: Red (Missing), Orange (Gap), Amber (Cooling), Green (Active)
- Click any cell to expand and see individual events in that category for that AA
- Right-click any cell to mark as "Blocked" (adds a note explaining the blocker)

**Legend:** Miss / Gap / Cool / Active / Blocked (striped red)

**Sorting:** Click any column header (User, Phase, or any category) to sort

### Tab 4: Emails

**Purpose:** Generate and manage coaching emails for struggling AAs.

**Components:**
- **Header:** Goal description, task description, 3-Strike rule explanation
- **AA count:** How many AAs need coaching today
- **Email cards (one per non-healthy AA):**
  - Health badge, name, company, day/phase
  - 3-Strike badge if applicable
  - "Sent (N)" button showing previous email history
  - "Preview Email" / "Preview AM Email" button
  - WHY root cause
  - Today's email targets (event badges with Missing/Gap/Cooling status)
  - Video reference linked to top event target
  - Yesterday's stats and daily goals
- **Actions Taken Today:** Communication log table (Date, Time, AA, Action, Notes)
- **All Emails:** Complete email log across all AAs (sequential #, Date, Time, Subject, Type, To)

### Tab 5: Email Logic

**Purpose:** Reference table of all trigger rules that generate coaching emails.

**27 rules organized by phase:**
- P1 (Onboarding) rules: No login, Login no check-in, Can't find Deal Review, No calls, Notes never created, etc.
- P2 (Activation) rules: No daily pattern, Checklist not done, Offers=0 no comps, Feature unused 7d, etc.
- P3 (Performance) rules: Offers below target, Calls below target, 0 deals closed, Feature gone cold, etc.
- ALL phases: 3 emails 0 response → STOP emailing, escalate to AM

**Columns:** Phase, When (day/timing), Trigger condition, Email subject, Video, Events targeted, Recipient (AA/AM/both), Escalation path

### Tab 6: User List

**Purpose:** Complete user directory with login history, credentials, and contact info.

**Columns (25 total):** ID, Tracked status, First name, Last name, Phase, Engagement Start, Priority Group, Total Logins, Notes, Company, Login ID, Status, First login, Last login, Total logins, Email, Phone, Dialpad phone, Dialpad user ID, Email source, Email password, Bulk email source, Bulk email password, Bulk email address, Email password new, Bulk email password new, Contact ID

**Tracked Status:** Each AA has a tracking status:
- **Yes** (green) — Actively being monitored
- **No** (gray) — Not currently tracked
- **Pause** (amber) — Temporarily paused with from/to date range
- **Suspended** (red) — Removed from tracking with auto-dated timestamp

**CSD Contacts Toggle:** Button in header switches the table view to CSD Contact Fields (see Section 16).

**All columns are sortable** by clicking headers (ascending/descending toggle with arrow indicators).

### Tab 7: Deal Dashboard

**Purpose:** Financial overview of all deals — pipeline, revenue, and commissions.

**Components:**
- **Filter buttons** at top: Source (MLS / Off Market), Property Type (STD, SPAY, NOD, REO, etc.), Intent (Flip / Wholesale / Portfolio) — all toggle on/off
- **Pipeline stage cards:** Sent Offer Deals, Offer Accepted, Acquired — each with deal count, total value, and inline sparkline chart
- **Revenue forecast:** Line chart showing weekly/monthly projections (March W1-W4 + Apr/May/Jun)
- **AA-grouped deal table:** Shows only Offer Accepted and Acquired deals grouped by AA
  - Columns: AA, Company, Accepted count, Accept-to-Close %, Acquired count, Commission total
  - Expandable rows showing individual deal details (Address, Intent, Type, Price, Commission, Commission type, Close date, Stage)

**Commission Rules:**
- Wholesaler: 25% of projected profit
- MLS/Off Market Flip: 0.5% of price or 25% of profit
- MLS/Off Market Wholesale: 10% or 25% of profit
- Portfolio: 20% of projected profit

**Deal Data:** Generated from `genDeals()` — ~280 deals scaled proportionally from AA stats, with realistic addresses, prices ($80K-$500K), stages, and invoice statuses.

### Tab 8: Engagement

**Purpose:** Visual engagement report showing Ramy's engagement level with each AA.

**Summary cards (4):**
- At Risk (red) — No check-in, never logged in, or 7+ days inactive
- Cooling (amber) — 3+ days idle, low feature use, or paused tracking
- Engaged (green) — Active, checking in, using features
- Suspended (gray) — Tracking paused, not monitored

**Engagement Status Rules:**
- **Suspended:** Tracking status is "suspended"
- **At Risk:** No check-in OR never logged in (total logins = 0) OR 7+ days since last login
- **Cooling:** Tracking is paused OR 3+ days since login OR average category score < 1.0 OR login rate < 0.3
- **Engaged:** All other active AAs

**AA cards (grouped by status):** 2-column grid showing:
- Name (clickable to detail), Org, Day, Phase
- Engagement status badge
- Logins, Last seen, Calls, Offers
- Check-in status, Feature score (out of 3), Priority Group
- Latest CSD note (with tooltip showing full history)

### Tab 9: Trigger Table

**Purpose:** Complete reference of all 61 events and their trigger configurations.

**61 rows spanning 7 categories:**
- Today's Plan (11 triggers)
- Find Deals (8 triggers)
- Communication (11 triggers)
- Property Actions (15 triggers)
- Analysis (5 triggers)
- Offers (4 triggers)
- Tools & Reporting (7 triggers)

**Columns (14):** #, Category, Action, Category Name, Phase, Where It Happens, Frequency, Priority, Trigger (Yes/No), Activates For, Trigger Frequency, Event Name, No Triggers After, Actions

**Features:**
- Search by action or event name
- Filter by category, priority, trigger status
- Clear all filters button
- Add new trigger (modal form)
- Edit existing trigger (modal form)
- Reorder rows (up/down arrows)
- Category color-coded badges (7 colors)

---

## 11. User Detail View

Clicking any AA name opens their full detail view. This is a rich, multi-section page:

### Header
- AA name with tech level dot (clickable to change)
- Company, Day number, Phase dropdown (editable)
- Discussion agenda text
- Blocked category badges (clickable to edit)
- "Send email" button
- "Sent emails (N)" button (if previous emails exist)

### Pipeline Stage Cards (5 cards in a row)
- Active Pipeline → Offers → In Negotiations → Offer Accepted → Acquired
- Each card shows: value, max, percentage ring chart, trend direction arrow
- Mini trend line charts (SVG sparklines) with hover tooltips showing date and value
- Configurable time range: 30 days, 90 days, 6 months, 12 months

### Communication Stats
- Calls: today vs goal, connected calls
- Texts, Emails, Total minutes
- Pipeline breakdown: Open, Reopened, R/N ratio

### Root Cause Analysis
- WHY line explaining the core issue
- Root cause logic (`gc()` function):
  - No check-in? → "Check-in not done. NOTHING fires until done."
  - Zero offers + Analysis never opened? → "Zero offers BECAUSE Analysis never opened."
  - Zero offers + few calls? → "Zero offers BECAUSE not calling."
  - Low calls in P2+? → "Low calls (X/Y). Pipeline drying."
  - Campaigns cold 12d? → "Campaigns stopped. Pipeline cooling."
  - Notes empty? → "No notes. Follow-ups failing."

### Feature Adoption Chart
- Overall adoption percentage in a progress ring
- Color legend: Active (green), Cooling (amber), Gap (orange), Unused (red)
- 7 horizontal stacked bars — one per category
- "New this week" callout for recently adopted events
- Blocked categories show striped red bar with "BLOCKED" label

### Feature Usage Accordion
- 7 expandable sections (one per category)
- Each event row shows: name, first used date, use count, last used date, status badge
- Sortable by any column
- Status badges: Missing (red), Gap (orange), Cooling (amber), Active (green)
- Login lag calculation (how many days after start did they first use this feature)

### Sent Emails Popup
- Modal showing all coaching emails sent to this AA
- Columns: Date, Time, Subject, Type badge, Status
- Expandable rows showing: event targets (with acted/ignored tracking), video, recipient, full email body
- Event badges: green strikethrough = completed, colored = still pending
- Types: Coaching (orange), Onboarding (blue), Reactivation (purple), Reminder (amber), Escalation (red)

### Training Section
- **Training Milestones:** 5 predefined milestones with vertical timeline:
  1. Platform Tour
  2. First Offer Walkthrough
  3. Comp Analysis Training
  4. Negotiation Coaching
  5. Independent Workflow
  - Toggleable completion (click circle to mark done/undone)
  - Shows completion date and who completed it
  - Hover for detailed tooltip
- **Training Notes:** Timestamped text feed, reverse chronological
  - Input field to add new observations
  - Shows created by and timestamp
- **Training Impact:** Before/after comparison bars
  - Average daily calls before vs after milestone completion
  - Average daily offers before vs after milestone completion

### AI Assistant Panel
- Auto-generated summary: 2-3 sentence overview of the AA's situation
- Top 3 priorities: numbered action items for the AA
- Interactive chat: type questions, get contextual answers
- Context includes: all stats, gaps, root cause, feature usage, email history

---

## 12. Email System

### How Emails Are Generated

The `bE(user)` function generates a coaching email for each non-healthy AA. The email includes:

1. **Yesterday's Report** — Activity summary (calls, texts, emails, offers, total touches)
2. **Progress Section** — Events the AA acted on from previous emails
3. **Performance Trend** — If calls are above average, encouragement
4. **Top 3 Priorities Today** — Specific actions the AA should take
5. **Day/Phase Status** — Current position and target progress
6. **Root Cause Alert** — If applicable
7. **Today's Focus Events** — 1-3 specific FlipiQ events to start using, with status labels
8. **Still Pending** — Events from previous emails not yet acted on
9. **Video Recommendation** — Short training video tied to the top event
10. **Your Numbers** — Calls/Offers/Contacts vs targets, adoption score
11. **Signature** — Ramy | CSM Lead, FlipiQ | calendly link

### 3-Strike Escalation Rule

When an AA has received **3 or more coaching emails with no improvement** (`ec >= 3`):
- The email stops going to the AA
- Instead, it goes to the Account Manager (AM) for that organization
- Subject becomes: "ACTION NEEDED: [Name] — 3 emails, needs AM review"
- Body includes: yesterday's report, current status, events sent but not acted on, request for direct intervention

### Email Types
| Type | Color | When |
|------|-------|------|
| Coaching | Orange #F97316 | Default daily email to struggling AAs |
| Onboarding | Blue #3B82F6 | Red health AAs with many missing features |
| Reactivation | Purple #8B5CF6 | AAs with gaps or cooling features |
| Reminder | Amber #D97706 | Follow-up nudges |
| Escalation | Red #DC2626 | 3-strike → sent to AM |

### Event Targeting

The `gME(user)` function computes which events to target:
1. Finds all events relevant to the AA's current phase
2. Categorizes as: Missing (never used), Gap (used once, dropped), Cooling (usage declining)
3. Prioritizes: Missing first, then Gaps, then Cooling events previously ignored
4. Selects top 3 as today's targets
5. Attaches the most relevant training video

### Email History Tracking

Each AA's email history (`gEH()`) tracks:
- Date and time of each email
- Subject line and type
- Event targets included
- Which events were acted on (completed after email)
- Which events were ignored
- Video recommendation per email

---

## 13. Deal Dashboard

The Deal Dashboard (Tab 7) provides a complete financial view.

### Deal Data Model
Each deal has:
- Address, Source (MLS/Off Market), Intent (Flip/Wholesale/Portfolio)
- Property Type (STD, SPAY, NOD, REO, PRO, AUC, TRUS, TPA, HUD, BK, FORC, CONS)
- Stage (Initial Contact → Offer Terms Sent → Contract Submitted → In Negotiations → Backup → Offer Accepted → Acquired)
- Price ($80K-$500K), Projected Profit, Commission
- Expected/Actual close dates, Days in stage
- Success fee (15% of commission for Acquired/Offer Accepted)
- Invoice status (need_to_invoice / invoiced / payment_received)

### Pipeline Stages Shown
| Stage Group | Stages Included | Color |
|-------------|----------------|-------|
| Sent Offer Deals | Contract Submitted, In Negotiations | Orange #F97316 |
| Offer Accepted | Offer Accepted | Green #10B981 |
| Acquired | Acquired | Dark Green #059669 |

### Revenue Calculations
- Pipeline value = sum of projected profits
- Commission calculations vary by intent/source (see commission rules)
- Success fees = 15% of commission on closed deals

---

## 14. Engagement Tab

The Engagement tab provides a quick-glance view of Ramy's engagement with each AA.

### Engagement Status Logic

```
IF tracking status = "suspended" → Suspended
ELSE IF no check-in OR total logins = 0 OR 7+ days since last login → At Risk
ELSE IF tracking paused OR 3+ days since login OR avg category score < 1.0 OR login rate < 0.3 → Cooling
ELSE → Engaged
```

### Key Metrics Per Card
- Total logins (color-coded)
- Days since last login
- Total calls and offers
- Check-in status
- Feature adoption score (0-3 scale)
- Priority Group assignment
- Latest CSD note

---

## 15. Trigger Table

The Trigger Table (Tab 9) is a comprehensive reference of all 61 tracked events.

### Category Color Coding
| Category | Color |
|----------|-------|
| Today's Plan | Orange #F97316 |
| Find Deals | Blue #3B82F6 |
| Communication | Purple #8B5CF6 |
| Property Actions | Green #10B981 |
| Analysis | Sky #0EA5E9 |
| Offers | Pink #EC4899 |
| Tools & Reporting | Gray #64748B |

### Trigger Properties
Each trigger row has:
- **Category** — Which of the 7 groups
- **Action** — What the AA does in FlipiQ
- **Category Name** — Sub-classification (Daily Engagement, Property Follow Through, Agent Relationships)
- **Phase** — Which phase activates this trigger
- **Where It Happens** — Navigation path in FlipiQ
- **Frequency** — Daily, Weekly, As Needed
- **Priority** — Critical or Standard
- **Trigger Needed** — Yes/No (does this fire automated alerts)
- **Activates For** — Ongoing, 1 Month Only, Only Once, N/A
- **Trigger Frequency** — How often it should fire (Every Working Day, At Least Twice in 2 days, etc.)
- **Event Name** — System event slug
- **No Triggers After** — Whether to stop triggering after a certain point

### Editable
- Each row has an "Edit" button opening a modal form
- "Add new trigger" button at top creates a new entry
- Rows can be reordered with up/down arrows
- Filters: search text, category dropdown, priority dropdown, trigger status dropdown

---

## 16. CSD Contacts

CSD (Customer Success Data) Contacts is an inline view within the User List tab.

### Accessing CSD
Click the "CSD Contacts" button in the User List header. The table swaps to show CSD-specific columns. Click "← User List" to switch back.

### CSD Columns
| Column | Width | Description |
|--------|-------|-------------|
| # | 35px | User ID |
| First Name | 90px | First name |
| Last Name | 100px | Last name |
| Company | 120px | Organization name |
| Phase | 100px | Lifecycle phase dropdown (editable) |
| Eng. Start | 120px | Engagement start date (date picker) |
| Priority Group | 100px | Top User / Mid User / Not Engaged (dropdown) |
| Total Logins | 80px | Login count, color-coded |
| Notes | 250px | Free-text notes with history |

### CSD-Specific Fields

**Engagement Start (`csdEngStart`):** Date when the AA's active engagement began. Set per user via date picker.

**Priority Group (`csdPriGroup`):** 80/20 classification:
- **Top User** (green #10B981) — High-value, high-engagement
- **Mid User** (blue #3B82F6) — Average engagement
- **Not Engaged** (red #DC2626) — Low or no engagement

**Notes (`csdNotes`):** Array of `{text, ts}` objects:
- Click cell to open inline editor (type + Enter or click OK)
- Cell shows latest note text
- Hover shows full history (newest first) with orange timestamps
- Notes are shared across CSD view, User List, and Engagement tab

### Excluded Users
Suspended users (phase 5) are automatically excluded from the CSD view.

### Filters
All dashboard filters (org, phase, health, check-in, AA-specific) apply to the CSD view. The count updates to reflect filtered results.

---

## 17. Filters and Sorting

### Global Filters (apply across all tabs)

**Organization Filter:** Dropdown selecting one of 5 organizations or "All organizations"

**Phase Filter:** Click phase cards to toggle filter:
- Onboarding (Days 1-7)
- Activation (Days 8-21)
- Performance (Day 22+)
- Outlier (anomaly detection)

**Health Filter:** Click health cards to toggle:
- Critical (red)
- Gap (orange)
- Cooling (yellow)
- Healthy (green)

**Check-in Filter:** Click the Done/Total counter to show only AAs with incomplete check-ins

**AA-specific Filter:** Dropdown to filter to a single AA

### Tab-Specific Sorting

**User List:** Click any column header to sort ascending (▲) or descending (▼). Separate sort state (`ulSort`).

**CSD Contacts:** Same sorting mechanism with separate state (`csdSort`). Handles computed fields (phase, engStart, priGroup, notes).

**Leaderboard:** Click any stat column header to sort. Default sort: Acquired (desc) → Offers → Calls.

**Heat Map:** Sort by User name, Phase, or any category score.

**Trigger Table:** Search + filter by category, priority, trigger status.

---

## 18. AI Assistant

Each AA's detail view includes an AI-powered assistant at the bottom.

### Auto-Summary
When viewing an AA, the system automatically:
1. Builds a comprehensive context string with all AA data
2. Sends to the AI: "Give me a brief 2-3 sentence summary... then list TOP 3 things this AA needs to do TODAY"
3. Displays the result as the opening message

### Interactive Chat
- Type questions in the input field
- AI has full context about the AA: stats, gaps, root cause, feature usage, email history
- Conversation history is maintained within the session
- Previous summary is included as conversation context

### Context Data Sent to AI
The `buildCtx(user)` function constructs a comprehensive data package:
- Name, Organization, AM
- Day, Phase, Health, Priority, Email count
- Agenda, Gaps, Root cause
- Check-in status
- Full stats: Calls, Texts, Emails, Pipeline, Deals
- Yesterday's stats
- Time breakdown by feature area
- Contact sourcing breakdown
- Feature usage scores per category
- Missing categories, Gap categories
- Recommended video

### API Endpoint
`POST /api/ai/chat` — Uses OpenAI via Replit proxy. Input-validated with Zod.

---

## 19. Claude Integration

The system includes hooks for Claude (Anthropic's AI) to automate morning workflows:

### Morning Process (5 AM daily)
1. Claude calls `GET /api/claude/read-all` to read all user data
2. Analyzes 3-Track scoring, health, gaps for each AA
3. Calls `POST /api/emails` to write coaching emails
4. Calls `POST /api/claude/update-health` to update health/priority/agenda scores

### Data Available to Claude
- All 21 users with full stats
- Event usage data
- Gap analysis
- Historical email effectiveness
- Feature adoption trends

---

## 20. Training System

The Training system is per-user and accessible from the User Detail view.

### Training Milestones (5 predefined)
1. **Platform Tour** — Initial walkthrough of FlipiQ
2. **First Offer Walkthrough** — Guided first offer submission
3. **Comp Analysis Training** — Learning to use comps/analysis tools
4. **Negotiation Coaching** — Negotiation skills and workflow
5. **Independent Workflow** — Operating without hand-holding

Each milestone:
- Has a toggleable completion state (click to mark done/undone)
- Records `completed_at` timestamp and `completed_by` (default: "Ramy")
- Unique constraint per user per milestone
- Stored in `training_milestones` database table

### Training Notes
- Free-text observations about the AA's training progress
- Timestamped, attributed to creator (default: "Ramy")
- Displayed in reverse chronological order
- Stored in `training_notes` database table

### Training Impact
- Computes before/after averages for daily calls and offers
- Relative to milestone completion dates
- Displayed as side-by-side bar charts (gray = before, orange = after)

### Training API Endpoints
- `GET /users/:id/training/milestones` — List milestones with completion status
- `POST /users/:id/training/milestones` — Mark milestone complete
- `DELETE /users/:id/training/milestones/:key` — Remove completion
- `GET /users/:id/training/notes` — List notes (newest first)
- `POST /users/:id/training/notes` — Add a note
- `GET /users/:id/training/impact` — Before/after impact data

---

## 21. Database Schema

### Tables

**`organizations`**
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | Org ID |
| name | text | Company name |
| domain | text | Web domain |
| principal | text | Principal/owner |
| am_name | text | Account Manager name |
| am_email | text | AM email |

**`users`**
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | User ID |
| name | text | Full name |
| email | text | Email address |
| org_id | integer FK | Organization |
| phase | integer | 1-5 |
| day_number | integer | Days since start |
| start_date | date | When they started |
| health | text | red/orange/yellow/green |
| priority_score | integer | 1-4 |
| goals_calls_per_day | integer | Call target |
| goals_offers_per_day | integer | Offer target |
| goals_contacts_per_day | integer | Contact target |
| discussion_agenda | text | What to discuss |
| tech_level | text | novice/traditional/capable/power_user |
| active | boolean | Is active |

**`daily_stats`** (one row per user per day)
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | Which user |
| stat_date | date | Which day |
| texts, emails, calls, calls_connected | integer | Activity counts |
| new_relationships, upgraded | integer | Contact building |
| opened_new, reopened | integer | Pipeline activity |
| offers_sent, negotiations, accepted, acquired | integer | Deal progress |
| total_minutes, piq_minutes, comps_minutes, ia_minutes, offer_minutes, agents_minutes | integer | Time tracking |
| source_mls, source_direct_mail, source_cold_call, source_referral | integer | Lead sources |
| checkin_completed | boolean | Daily check-in |
| blocker_text | text | Reported blockers |

**`events`** (62 reference events)
| Column | Type | Description |
|--------|------|-------------|
| event_number | integer | Sequential number |
| category | text | Which of 7 categories |
| action | text | Event description |
| phase_number | integer | Which phase |
| priority_level | text | Critical/Standard |
| trigger_needed | boolean | Fires triggers? |
| frequency | text | Daily/Weekly/As Needed |

**`user_events`** (per user per event tracking)
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | User |
| event_id | integer FK | Event |
| first_used | timestamp | When first used |
| use_count | integer | How many times |
| last_used | timestamp | Most recent use |
| status | text | missing/gap/cooling/active |

**`user_category_scores`**
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | User |
| category_slug | text FK | Category |
| score | integer | 0-3 |
| active_count, missing_count, total_count | integer | Event counts |
| total_uses | integer | Total uses across category |

**`coaching_emails`**
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | Recipient AA |
| email_date | date | Send date |
| subject, body | text | Email content |
| is_escalation | boolean | Goes to AM? |
| root_cause | text | WHY |
| video_included | text | Training video |
| status | text | draft/sent/forwarded |

**`email_history`** (3-strike tracker)
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | User |
| emails_sent | integer | Count |
| has_responded | boolean | Did they act? |
| escalated_to_am | boolean | Hit 3 strikes? |

**`task_completions`** (Ramy's logged actions)
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | Which AA |
| task_date | date | When |
| action_type | text | call/text/email/notify_am/walkthrough/other |
| notes | text | Optional note |
| completed_by | text | Default "Ramy" |

**`deals`**
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | Which AA |
| org_id | integer FK | Which org |
| address | text | Property address |
| source | text | MLS/Off Market |
| intent | text | Flip/Wholesale/Portfolio |
| stage | text | Pipeline stage |
| price, projected_profit, commission | integer | Financials |
| commission_type | text | Percentage or flat |
| expected_close_date, actual_close_date | date | Dates |
| property_type | text | STD/SPAY/NOD/etc. |
| success_fee | integer | 15% of commission |
| invoice_status | text | need_to_invoice/invoiced/payment_received |

**`training_milestones`**
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | User |
| milestone_key | text | platform_tour/first_offer_walkthrough/etc. |
| completed_at | timestamp | When marked done |
| completed_by | text | Who marked it |

**`training_notes`**
| Column | Type | Description |
|--------|------|-------------|
| user_id | integer FK | User |
| note_text | text | The note content |
| created_at | timestamp | When added |
| created_by | text | Who added it |

**`trigger_log`**, **`user_gaps`**, **`event_categories`** — Additional supporting tables.

---

## 22. API Routes

All routes prefixed with `/api/`:

| Method | Path | Description |
|--------|------|-------------|
| GET | /dashboard | Main dashboard data |
| GET | /users | List all active users with today/yesterday stats |
| GET | /users/:id | User detail with events, categories, gaps, tasks |
| PATCH | /users/:id | Update health, priority, agenda, goals, tech_level |
| GET | /emails | List coaching emails (filter by date, status) |
| POST | /emails | Create a coaching email |
| POST | /emails/:id/forward | Mark email as forwarded |
| PATCH | /emails/:id/status | Update email status |
| GET | /tasks | List task completions (filter by date) |
| POST | /tasks | Log a completed task |
| GET | /leaderboard | Ranked stats (filter by date range) |
| POST | /ai/chat | AI assistant chat (OpenAI proxy) |
| GET | /claude/read-all | All data for Claude morning processing |
| POST | /claude/update-health | Claude writes back health scores |
| GET | /deals | List deals with filters |
| GET | /deals/summary | Aggregated grid + invoice summary |
| GET | /deals/:id | Single deal detail |
| POST | /deals | Create a deal |
| PATCH | /deals/:id | Update deal |
| GET | /users/:id/training/milestones | List training milestones |
| POST | /users/:id/training/milestones | Mark milestone complete |
| DELETE | /users/:id/training/milestones/:key | Remove milestone |
| GET | /users/:id/training/notes | List training notes |
| POST | /users/:id/training/notes | Add training note |
| GET | /users/:id/training/impact | Before/after impact data |

---

## 23. Tech Stack

| Component | Technology |
|-----------|------------|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24 |
| Package Manager | pnpm |
| TypeScript | 5.9 |
| API Framework | Express 5 |
| Database | PostgreSQL (Replit built-in) |
| ORM | Drizzle ORM |
| Validation | Zod (v4), drizzle-zod |
| Build | esbuild (CJS bundle) |
| Frontend | React + Vite |
| Styling | Inline styles (no CSS framework) |
| Font | DM Sans |
| AI | OpenAI via Replit proxy |

### Project Structure
```
artifacts-monorepo/
├── artifacts/
│   ├── api-server/           # Express API server
│   │   ├── src/
│   │   │   ├── index.ts      # Entry point, port binding
│   │   │   ├── app.ts        # Express app config
│   │   │   ├── auto-seed.ts  # Seeds DB on first run
│   │   │   └── routes/
│   │   │       ├── users.ts  # User CRUD
│   │   │       ├── emails.ts # Email management
│   │   │       ├── deals.ts  # Deal management
│   │   │       └── ...
│   └── flipiq-dashboard/     # React dashboard
│       └── src/
│           ├── App.tsx        # Main dashboard (~2500 lines)
│           └── DealGrid.tsx   # Deal dashboard component (~685 lines)
├── lib/
│   ├── db/                   # Drizzle ORM schema + connection
│   │   └── src/schema/
│   │       └── flipiq.ts     # All table definitions
│   ├── api-spec/             # OpenAPI spec
│   └── api-client-react/     # Generated React Query hooks
└── package.json
```

---

## 24. Data Flow

### Embedded Data (Frontend)
The dashboard uses **embedded data arrays** in `App.tsx` for the core dataset:
- `O` — 5 organizations
- `UL` — 21 users with login/contact details
- `UR` — 21 users with performance stats
- `U` — Computed from `UR` with 3-Track event data added
- `C` — 7 categories with 62 events
- `EV` — Event metadata (video, phases, tips)
- `EL` — 27 email logic rules
- `triggerData` — 61 trigger definitions

### Computed Data (Runtime)
- `fU` — Filtered users based on active filter selections
- `UPh` — Users with phase overrides applied
- `lb` — Sorted leaderboard
- `tasks` — Non-green AAs that need attention
- Event scores computed via `g3()` function
- Root causes computed via `gc()` function
- Emails generated via `bE()` function
- Deal data generated via `genDeals()` function

### Server Data (API)
- Training milestones and notes are stored in PostgreSQL
- User health/priority/tech_level updates persist via PATCH
- Task completions logged to database
- Coaching emails stored in database
- Deal records in database (auto-seeded on first run)

### State Management
All UI state is managed with React `useState` hooks. Key state variables:
- `flt` — Global filter selections
- `done` — Completed tasks
- `sel` — Selected user ID (detail view)
- `tab` — Active tab
- `eV` — Email preview data
- `phOverrides` — Phase override map
- `tracked` — Tracking status per user
- `csdEngStart`, `csdPriGroup`, `csdNotes` — CSD contact fields
- `blockedCats` — Blocked category notes
- `tlOverrides` — Tech level overrides
- `triggerData` — Editable trigger table data

---

## 25. Key Functions Reference

| Function | Purpose |
|----------|---------|
| `g3(health, ci, ei)` | 3-Track scoring — returns {first, count, last, st} for an event |
| `gc(user)` | Root cause analysis — returns WHY string or null |
| `bE(user)` | Email builder — generates full coaching email or AM escalation |
| `gME(user)` | Computes missing/gap/cooling events for an AA based on phase + health |
| `gEH(user)` | Generates email history with event targets and acted/ignored tracking |
| `vc(value, goal)` | Value color — green (>=80%), amber (>=50%), red (<50%) |
| `isOutlier(user)` | Checks if AA qualifies as Outlier phase |
| `getCheckIns(user)` | Computes check-in completion rate over 30 working days |
| `getWorkingDays(calDays)` | Converts calendar days to working days (5-day week) |
| `parseMarDate(str)` | Extracts day number from "Mar X" date string |
| `startDate(day)` | Computes AA's start date based on day number |
| `lagDays(userDay, firstStr)` | Computes how many days after start an event was first used |
| `genDeals(users, orgs)` | Generates ~280 realistic deals proportional to AA stats |
| `buildCtx(user)` | Builds comprehensive context string for AI assistant |

---

## 26. Design System

### Colors

**Accent:** Orange #F97316 (used for buttons, highlights, active tab indicator, brand elements)

**Phase Colors:**
- Onboarding: Blue #3B82F6
- Activation: Amber #D97706
- Performance: Green #10B981
- Outlier: Purple #8B5CF6
- Suspended: Red #DC2626

**Health Colors:**
- Critical: Red #DC2626
- Gap: Orange #EA580C
- Cooling: Amber #D97706
- Healthy: Green #10B981

**Priority Group Colors:**
- Top User: Green #10B981
- Mid User: Blue #3B82F6
- Not Engaged: Red #DC2626

**Tech Level Colors:**
- Novice: Red #DC2626
- Traditional: Yellow #EAB308
- Capable: Green #10B981
- Power User: Blue #3B82F6

### Typography
- Font: DM Sans (Google Fonts)
- System fallbacks: system-ui, sans-serif
- Header: 22px, 800 weight
- Section titles: 14-16px, 700-800 weight
- Body text: 11-12px
- Labels: 8-10px, uppercase, 700 weight

### Layout
- Background: #F8FAFB
- Cards: White #FFF with #E2E8F0 border, 8-10px border radius
- Shadows: Used sparingly on modals and tooltips
- Grid-based layouts throughout

### Tooltips
The `Tip` component provides tooltips on virtually every interactive element:
- **Dark mode (default):** Dark background #1E293B, light text, 240px wide
- **Light mode (notes):** White background, dark text, 280-420px wide, orange timestamps for note history
- Arrow pointer at bottom
- Positioned above the element, clamped to viewport

### Branding
- Always "FlipiQ" — lowercase 'i', uppercase 'Q'
- Logo: `flipiq-logo.png` in public assets (132px height)
- Tagline: "Together, We Flip Smarter"
- Header: "Customer Success Dashboard"

---

*This document reflects the FlipiQ CSM Dashboard as of its current build. All data, rules, and behaviors described are implemented and functional.*
