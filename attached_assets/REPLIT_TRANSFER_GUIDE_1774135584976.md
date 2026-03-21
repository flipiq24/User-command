# FlipIQ CSM Dashboard - Replit Transfer Guide

## What You're Building

A React/Vite dashboard connected to Supabase (Postgres database) with an API endpoint that Claude calls every morning at 5 AM to read user data and generate coaching emails.

**Three pieces:**
1. **Frontend** - React dashboard (the V9 prototype, already built)
2. **Database** - Supabase tables storing users, events, coaching history, task completions
3. **API** - Edge functions that Claude calls to read data and write coaching emails

---

## STEP 1: Create Replit Project

1. Go to replit.com
2. Create new Repl → Template: **React (Vite)**
3. Name it: `flipiq-csm-dashboard`
4. Copy the contents of `flipiq-dashboard-v9.jsx` into `src/App.jsx`
5. Install dependencies:

```bash
npm install @supabase/supabase-js
```

---

## STEP 2: Create Supabase Project

1. Go to supabase.com → New Project
2. Name: `flipiq-csm`
3. Region: West US (closest to Pacific Time)
4. Save the **Project URL** and **anon key** - you'll need both

---

## STEP 3: Run This SQL in Supabase SQL Editor

Copy this entire block into the Supabase SQL Editor and run it:

```sql
-- =====================================================
-- FLIPIQ CSM DASHBOARD - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Organizations
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  principal TEXT,
  am_name TEXT NOT NULL,
  am_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Acquisition Associates)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  org_id INTEGER REFERENCES organizations(id),
  phase INTEGER NOT NULL DEFAULT 1 CHECK (phase IN (1, 2, 3)),
  day_number INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  health TEXT NOT NULL DEFAULT 'red' CHECK (health IN ('red', 'orange', 'yellow', 'green')),
  priority_score INTEGER NOT NULL DEFAULT 1 CHECK (priority_score BETWEEN 1 AND 4),
  goals_calls_per_day INTEGER DEFAULT 30,
  goals_offers_per_day INTEGER DEFAULT 3,
  goals_contacts_per_day INTEGER DEFAULT 50,
  discussion_agenda TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Stats (one row per user per day - matches My Stats)
CREATE TABLE daily_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Communication
  texts INTEGER DEFAULT 0,
  emails INTEGER DEFAULT 0,
  calls INTEGER DEFAULT 0,
  calls_connected INTEGER DEFAULT 0,
  -- Relationships
  new_relationships INTEGER DEFAULT 0,
  upgraded INTEGER DEFAULT 0,
  priority_high INTEGER DEFAULT 0,
  priority_warm INTEGER DEFAULT 0,
  -- Deal Pipeline
  opened_new INTEGER DEFAULT 0,
  reopened INTEGER DEFAULT 0,
  offers_sent INTEGER DEFAULT 0,
  offers_terms INTEGER DEFAULT 0,
  offers_contracts INTEGER DEFAULT 0,
  negotiations INTEGER DEFAULT 0,
  accepted INTEGER DEFAULT 0,
  acquired INTEGER DEFAULT 0,
  -- Time (minutes)
  total_minutes INTEGER DEFAULT 0,
  piq_minutes INTEGER DEFAULT 0,
  comps_minutes INTEGER DEFAULT 0,
  ia_minutes INTEGER DEFAULT 0,
  offer_minutes INTEGER DEFAULT 0,
  agents_minutes INTEGER DEFAULT 0,
  -- Deal Sources
  source_mls INTEGER DEFAULT 0,
  source_direct_mail INTEGER DEFAULT 0,
  source_cold_call INTEGER DEFAULT 0,
  source_referral INTEGER DEFAULT 0,
  -- Check-in
  checkin_completed BOOLEAN DEFAULT false,
  checkin_time TIMESTAMPTZ,
  blocker_text TEXT,
  -- Computed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

-- 61 Events (reference table)
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  action TEXT NOT NULL,
  category_name TEXT,
  phase_number INTEGER,
  where_happens TEXT,
  frequency TEXT,
  priority_level TEXT,
  trigger_needed BOOLEAN DEFAULT false,
  activates_for TEXT,
  trigger_frequency TEXT,
  no_triggers_after BOOLEAN DEFAULT false
);

-- 7 Categories (reference table)
CREATE TABLE event_categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

INSERT INTO event_categories (slug, name, display_order) VALUES
  ('plan', 'Today''s Plan', 1),
  ('find', 'Find Deals', 2),
  ('comm', 'Communication', 3),
  ('prop', 'Property Actions', 4),
  ('analysis', 'Analysis', 5),
  ('offers', 'Offers', 6),
  ('tools', 'Tools & Reporting', 7);

-- User Event Tracking (3-Track per event per user)
CREATE TABLE user_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  first_used TIMESTAMPTZ,
  use_count INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'gap', 'cooling', 'active')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Category Scores (computed daily, 3-Track per category per user)
CREATE TABLE user_category_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_slug TEXT REFERENCES event_categories(slug),
  score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 3),
  active_count INTEGER DEFAULT 0,
  missing_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  total_uses INTEGER DEFAULT 0,
  first_any TIMESTAMPTZ,
  last_any TIMESTAMPTZ,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_slug)
);

-- Coaching Emails (every email the system generates)
CREATE TABLE coaching_emails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email_date DATE NOT NULL DEFAULT CURRENT_DATE,
  to_name TEXT NOT NULL,
  to_email TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_escalation BOOLEAN DEFAULT false,
  escalation_to TEXT,
  video_included TEXT,
  root_cause TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'forwarded', 'skipped')),
  forwarded_at TIMESTAMPTZ,
  forwarded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Send History (tracks the 3-strike rule)
CREATE TABLE email_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  emails_sent INTEGER DEFAULT 0,
  last_email_date DATE,
  last_response_date DATE,
  has_responded BOOLEAN DEFAULT false,
  escalated_to_am BOOLEAN DEFAULT false,
  escalated_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task Completions (Ramy's check-offs)
CREATE TABLE task_completions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  action_type TEXT NOT NULL CHECK (action_type IN ('call', 'text', 'email', 'notify_am', 'walkthrough', 'other')),
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_by TEXT DEFAULT 'Ramy'
);

-- Feature Gaps (current gaps per user, refreshed daily)
CREATE TABLE user_gaps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  gap_text TEXT NOT NULL,
  gap_type TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers Log (what triggered, when, for whom)
CREATE TABLE trigger_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  action_taken TEXT,
  fired_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, stat_date);
CREATE INDEX idx_user_events_user ON user_events(user_id);
CREATE INDEX idx_coaching_emails_user_date ON coaching_emails(user_id, email_date);
CREATE INDEX idx_task_completions_date ON task_completions(task_date);
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_health ON users(health);
CREATE INDEX idx_users_phase ON users(phase);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read everything (Ramy + Claude API)
CREATE POLICY "Allow read" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow read" ON users FOR SELECT USING (true);
CREATE POLICY "Allow read" ON daily_stats FOR SELECT USING (true);
CREATE POLICY "Allow read" ON user_events FOR SELECT USING (true);
CREATE POLICY "Allow read" ON coaching_emails FOR SELECT USING (true);
CREATE POLICY "Allow read" ON task_completions FOR SELECT USING (true);

-- Allow insert/update for service role (Claude API + data import)
CREATE POLICY "Allow write" ON daily_stats FOR ALL USING (true);
CREATE POLICY "Allow write" ON user_events FOR ALL USING (true);
CREATE POLICY "Allow write" ON coaching_emails FOR ALL USING (true);
CREATE POLICY "Allow write" ON task_completions FOR ALL USING (true);
CREATE POLICY "Allow write" ON user_gaps FOR ALL USING (true);
CREATE POLICY "Allow write" ON email_history FOR ALL USING (true);
CREATE POLICY "Allow write" ON trigger_log FOR ALL USING (true);

-- =====================================================
-- VIEWS for Claude and Dashboard
-- =====================================================

-- Dashboard overview: one row per user with everything Claude needs
CREATE VIEW user_dashboard AS
SELECT
  u.id,
  u.name,
  u.email,
  u.phase,
  u.day_number,
  u.health,
  u.priority_score,
  u.goals_calls_per_day,
  u.goals_offers_per_day,
  u.goals_contacts_per_day,
  u.discussion_agenda,
  o.name AS org_name,
  o.am_name,
  o.am_email,
  -- Today's stats
  ds.texts AS today_texts,
  ds.emails AS today_emails,
  ds.calls AS today_calls,
  ds.calls_connected AS today_calls_connected,
  ds.new_relationships AS today_new_rel,
  ds.upgraded AS today_upgraded,
  ds.opened_new AS today_opened,
  ds.reopened AS today_reopened,
  ds.offers_sent AS today_offers,
  ds.negotiations AS today_negot,
  ds.accepted AS today_accepted,
  ds.acquired AS today_acquired,
  ds.total_minutes AS today_minutes,
  ds.checkin_completed AS today_checkin,
  -- Yesterday's stats
  yd.texts AS yesterday_texts,
  yd.emails AS yesterday_emails,
  yd.calls AS yesterday_calls,
  yd.offers_sent AS yesterday_offers,
  yd.opened_new AS yesterday_opened,
  -- Email history
  eh.emails_sent AS coaching_emails_sent,
  eh.has_responded AS coaching_responded,
  eh.escalated_to_am
FROM users u
JOIN organizations o ON u.org_id = o.id
LEFT JOIN daily_stats ds ON u.id = ds.user_id AND ds.stat_date = CURRENT_DATE
LEFT JOIN daily_stats yd ON u.id = yd.user_id AND yd.stat_date = CURRENT_DATE - 1
LEFT JOIN email_history eh ON u.id = eh.user_id
WHERE u.active = true;

-- Leaderboard view with cumulative stats
CREATE VIEW leaderboard AS
SELECT
  u.id,
  u.name,
  u.health,
  u.phase,
  u.day_number,
  o.name AS org_name,
  COALESCE(SUM(ds.texts), 0) AS total_texts,
  COALESCE(SUM(ds.emails), 0) AS total_emails,
  COALESCE(SUM(ds.calls), 0) AS total_calls,
  COALESCE(SUM(ds.calls_connected), 0) AS total_calls_connected,
  COALESCE(SUM(ds.new_relationships), 0) AS total_new_rel,
  COALESCE(SUM(ds.upgraded), 0) AS total_upgraded,
  COALESCE(SUM(ds.opened_new), 0) AS total_opened,
  COALESCE(SUM(ds.reopened), 0) AS total_reopened,
  COALESCE(SUM(ds.offers_sent), 0) AS total_offers,
  COALESCE(SUM(ds.offers_terms), 0) AS total_offers_terms,
  COALESCE(SUM(ds.offers_contracts), 0) AS total_offers_contracts,
  COALESCE(SUM(ds.negotiations), 0) AS total_negot,
  COALESCE(SUM(ds.accepted), 0) AS total_accepted,
  COALESCE(SUM(ds.acquired), 0) AS total_acquired,
  COALESCE(SUM(ds.total_minutes), 0) AS total_minutes
FROM users u
JOIN organizations o ON u.org_id = o.id
LEFT JOIN daily_stats ds ON u.id = ds.user_id
WHERE u.active = true
GROUP BY u.id, u.name, u.health, u.phase, u.day_number, o.name;
```

---

## STEP 4: Seed Initial Data

Run this after the schema to populate orgs and test users:

```sql
-- Organizations
INSERT INTO organizations (name, domain, principal, am_name, am_email) VALUES
  ('Coko Homes', 'cokohomes.com', 'Jonathan Carbajal', 'Gregory Patterson', 'gregory@cokohomes.com'),
  ('Hegemark Property Group', 'hegemarkpropertygroup.co', 'Eric Lau', 'Jeffrey Kuo', 'jeffrey@hegemarkpropertygroup.co'),
  ('TD Realty', 'tdrealty.net', 'Owner', 'Matt Carmean', 'matt@tdrealty.net'),
  ('STJ Investments', 'stjinvestmentsllc.pro', 'Sergio Tafolla', 'Andruw Tafolla', 'andruw@stjinvestmentsllc.pro'),
  ('Fair Close', 'fairclose.net', 'Owner', 'Tony Fletcher', 'tony@fairclose.net');

-- Seed the 61 events from the spreadsheet
INSERT INTO events (event_number, category, action, phase_number, priority_level, trigger_needed) VALUES
  (1, 'plan', 'iQ Check-In', 1, 'Critical', true),
  (2, 'plan', 'Report blockers', 1, 'Standard', false),
  (3, 'plan', 'Open Deal Review', 1, 'Critical', true),
  (4, 'plan', 'Review Critical Calls', 1, 'Critical', true),
  (5, 'plan', 'No Properties in priorities', 1, 'Critical', true),
  (6, 'plan', 'Review High Priority', 1, 'Critical', true),
  (7, 'plan', 'Review Medium Priority', 1, 'Critical', true),
  (8, 'plan', 'Review Low Priority', 1, 'Critical', true),
  (9, 'plan', 'Process New Deals', 1, 'Critical', true),
  (10, 'plan', 'Open Daily Outreach', 1, 'Critical', true),
  (11, 'plan', 'Call from Outreach list', 1, 'Critical', true),
  (12, 'plan', 'Open My Active Deals', 1, 'Critical', true),
  (13, 'find', 'Open MLS Hot Deals', 2, 'Critical', false),
  (14, 'find', 'Filter MLS Hot Deals', 2, 'Critical', false),
  (15, 'find', 'Open MLS Search', 2, 'Critical', false),
  (16, 'find', 'Apply MLS Search filters', 2, 'Standard', false),
  (17, 'find', 'Save a filter', 2, 'Standard', false),
  (18, 'find', 'Open Agent Search', 3, 'Critical', false),
  (19, 'find', 'Search/filter agents', 3, 'Critical', true),
  (20, 'find', 'Open Agent Profile', 3, 'Critical', true),
  (21, 'find', 'Open Campaigns', 2, 'Critical', true),
  (22, 'find', 'Select a campaign', 2, 'Critical', true),
  (23, 'find', 'Send campaign', 2, 'Critical', true),
  (24, 'comm', 'Call agent (single)', 1, 'Critical', true),
  (25, 'comm', 'Text agent (single)', 1, 'Critical', true),
  (26, 'comm', 'Email agent (single)', 1, 'Critical', true),
  (27, 'comm', 'Text Voicemail', 1, 'Standard', false),
  (28, 'comm', 'AI Connect', 1, 'Critical', true),
  (29, 'comm', 'Bulk Call', 2, 'Critical', true),
  (30, 'comm', 'Bulk Text', 2, 'Critical', true),
  (31, 'comm', 'Bulk Email', 2, 'Critical', true),
  (32, 'comm', 'Bulk Text Voicemail', 2, 'Standard', false),
  (33, 'comm', 'Bulk AI Connect', 2, 'Standard', false),
  (34, 'prop', 'Add a Note', 1, 'Standard', true),
  (35, 'prop', 'View Tax Data', 1, 'Critical', true),
  (36, 'prop', 'View Activity history', 1, 'Critical', true),
  (37, 'prop', 'Create Reminder', 1, 'Critical', true),
  (38, 'prop', 'View AI Report', 1, 'Critical', true),
  (39, 'prop', 'Property Check-In', 1, 'Critical', false),
  (40, 'prop', 'Change Offer Status', 1, 'Critical', true),
  (41, 'prop', 'Change Priority', 1, 'Critical', true),
  (42, 'prop', 'Add a Property', 1, 'Critical', true),
  (43, 'prop', 'Set To Do', 1, 'Critical', true),
  (44, 'prop', 'Add to Favorites', 1, 'Standard', false),
  (45, 'prop', 'Filter by Agent Deals', 1, 'Critical', true),
  (46, 'prop', 'Set Follow-Up', 1, 'Critical', true),
  (47, 'analysis', 'Open PIQ Detail', 1, 'Critical', true),
  (48, 'analysis', 'View Comps Map', 1, 'Critical', true),
  (49, 'analysis', 'View Comps Matrix', 1, 'Critical', true),
  (50, 'analysis', 'View Comps List', 1, 'Critical', true),
  (51, 'analysis', 'Run Investment Analysis', 1, 'Critical', true),
  (52, 'offers', 'Send Offer Terms', 1, 'Critical', true),
  (53, 'offers', 'Submit Contract', 1, 'Critical', true),
  (54, 'offers', 'Update Negotiation', 1, 'Critical', true),
  (55, 'offers', 'Review offer count vs goal', 1, 'Critical', true),
  (56, 'tools', 'Open My Stats', 1, 'Standard', true),
  (57, 'tools', 'Open DispoPro', 1, 'Standard', true),
  (58, 'tools', 'Open Quick Links', 1, 'Standard', false),
  (59, 'tools', 'Login', 1, 'Critical', true),
  (60, 'tools', 'Script Practice', 1, 'Standard', false),
  (61, 'tools', 'Post-call feedback', 1, 'Standard', false),
  (62, 'tools', 'End-of-Day Stats', 1, 'Standard', true);
```

---

## STEP 5: Create Supabase Edge Function for Claude API

In Supabase Dashboard > Edge Functions, create a function called `claude-daily`:

```typescript
// supabase/functions/claude-daily/index.ts
// Claude calls this endpoint every morning at 5 AM

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  // GET /claude-daily?action=read_all
  // Returns all user data for Claude to process
  if (action === 'read_all') {
    const { data: users, error } = await supabase
      .from('user_dashboard')
      .select('*')

    const { data: events } = await supabase
      .from('user_events')
      .select('*, events(action, category, priority_level)')

    const { data: gaps } = await supabase
      .from('user_gaps')
      .select('*')

    const { data: categories } = await supabase
      .from('user_category_scores')
      .select('*')

    return new Response(
      JSON.stringify({ users, events, gaps, categories, date: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // POST /claude-daily?action=write_email
  // Claude writes a coaching email
  if (action === 'write_email' && req.method === 'POST') {
    const body = await req.json()
    const { user_id, to_name, to_email, subject, body: emailBody,
            is_escalation, escalation_to, video_included, root_cause } = body

    const { data, error } = await supabase
      .from('coaching_emails')
      .insert({
        user_id, to_name, to_email, subject, body: emailBody,
        is_escalation, escalation_to, video_included, root_cause,
        status: 'draft'
      })
      .select()

    // Update email history
    await supabase.rpc('increment_email_count', { p_user_id: user_id })

    return new Response(
      JSON.stringify({ success: true, email: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // POST /claude-daily?action=update_health
  // Claude updates user health scores after analysis
  if (action === 'update_health' && req.method === 'POST') {
    const body = await req.json()
    const { updates } = body // Array of { user_id, health, priority_score, discussion_agenda, gaps }

    for (const u of updates) {
      await supabase
        .from('users')
        .update({
          health: u.health,
          priority_score: u.priority_score,
          discussion_agenda: u.discussion_agenda,
          updated_at: new Date().toISOString()
        })
        .eq('id', u.user_id)

      // Replace gaps
      await supabase.from('user_gaps').delete().eq('user_id', u.user_id)
      if (u.gaps && u.gaps.length > 0) {
        await supabase.from('user_gaps').insert(
          u.gaps.map(g => ({ user_id: u.user_id, gap_text: g }))
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Unknown action. Use: read_all, write_email, update_health' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
```

Also create this helper function in SQL:

```sql
-- Helper for 3-strike tracking
CREATE OR REPLACE FUNCTION increment_email_count(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO email_history (user_id, emails_sent, last_email_date)
  VALUES (p_user_id, 1, CURRENT_DATE)
  ON CONFLICT (user_id)
  DO UPDATE SET
    emails_sent = email_history.emails_sent + 1,
    last_email_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for the upsert
ALTER TABLE email_history ADD CONSTRAINT email_history_user_unique UNIQUE (user_id);
```

---

## STEP 6: Connect Frontend to Supabase

In your Replit project, create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all dashboard data
export async function fetchDashboard() {
  const { data: users } = await supabase
    .from('user_dashboard')
    .select('*')
    .order('priority_score', { ascending: true })

  const { data: categories } = await supabase
    .from('user_category_scores')
    .select('*')

  const { data: emails } = await supabase
    .from('coaching_emails')
    .select('*')
    .eq('email_date', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })

  const { data: tasks } = await supabase
    .from('task_completions')
    .select('*')
    .eq('task_date', new Date().toISOString().split('T')[0])

  return { users, categories, emails, tasks }
}

// Fetch leaderboard with date range
export async function fetchLeaderboard(startDate, endDate) {
  const { data } = await supabase
    .from('daily_stats')
    .select('*, users(name, health, phase, day_number, org_id, organizations(name))')
    .gte('stat_date', startDate)
    .lte('stat_date', endDate)

  return data
}

// Fetch user detail with events
export async function fetchUserDetail(userId) {
  const { data: user } = await supabase
    .from('user_dashboard')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: events } = await supabase
    .from('user_events')
    .select('*, events(event_number, action, category, priority_level)')
    .eq('user_id', userId)

  const { data: categories } = await supabase
    .from('user_category_scores')
    .select('*')
    .eq('user_id', userId)

  const { data: gaps } = await supabase
    .from('user_gaps')
    .select('*')
    .eq('user_id', userId)

  return { user, events, categories, gaps }
}

// Complete a task
export async function completeTask(userId, actionType, notes) {
  const { data } = await supabase
    .from('task_completions')
    .insert({
      user_id: userId,
      action_type: actionType,
      notes: notes,
      completed_by: 'Ramy'
    })
    .select()

  return data
}

// Forward an email (update status)
export async function forwardEmail(emailId) {
  const { data } = await supabase
    .from('coaching_emails')
    .update({
      status: 'forwarded',
      forwarded_at: new Date().toISOString(),
      forwarded_by: 'Ramy'
    })
    .eq('id', emailId)
    .select()

  return data
}
```

---

## STEP 7: Add Environment Variables in Replit

In your Replit project, go to Secrets (lock icon) and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## STEP 8: Claude API Integration

Claude calls the Supabase Edge Function. Here's what the Claude preset prompt references:

**Endpoint:** `https://your-project.supabase.co/functions/v1/claude-daily`

**Claude's daily workflow (5 AM):**

1. `GET ?action=read_all` - Read all user data
2. For each user, apply:
   - 3-Track scoring (Section 6.6)
   - Root cause analysis (Section 13.5)
   - Email logic rules (Section 12)
   - Health scoring (Section 6.9)
3. `POST ?action=update_health` - Write health scores, gaps, agendas
4. `POST ?action=write_email` - Write one coaching email per user (if needed)
5. AgentMail sends the emails to Ramy's dashboard for review

**Authentication:** Pass the Supabase service role key in the Authorization header:
```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

---

## STEP 9: Data Import from COMMAND

Nate builds a nightly Lambda (following COM-274 pattern) that:

1. Queries both data sources (IDX schema + Public/Dialpad/SYS schema)
2. Computes 3-Track values for all 61 events per user
3. Writes to Supabase via the REST API:
   - `daily_stats` table (one row per user per day)
   - `user_events` table (3-Track per event per user)
   - `user_category_scores` table (computed from user_events)

**Supabase REST API for data import:**
```
POST https://your-project.supabase.co/rest/v1/daily_stats
Authorization: Bearer SERVICE_ROLE_KEY
apikey: SERVICE_ROLE_KEY
Content-Type: application/json
Prefer: resolution=merge-duplicates

{ "user_id": 1, "stat_date": "2026-03-21", "texts": 5, "calls": 8, ... }
```

---

## Architecture Summary

```
COMMAND Database (IDX + Public/Dialpad/SYS)
    |
    | Nightly Lambda (5:00 AM) - extends COM-274 pattern
    v
Supabase (Postgres)
    |
    |--- Claude reads via Edge Function (5:10 AM)
    |       |
    |       |--- Applies 3-Track scoring
    |       |--- Generates coaching emails
    |       |--- Writes health scores + emails back to Supabase
    |       |
    |       v
    |    AgentMail sends to Ramy
    |
    |--- React Dashboard reads via Supabase JS client
            |
            |--- Ramy reviews at 5:30 AM
            |--- Forwards emails
            |--- Checks off tasks with notes
            |--- Drills into heat map
```

---

## Replit AI Prompt

When you open Replit, paste this to Replit AI:

> Build a React/Vite dashboard connected to Supabase. The JSX prototype is in src/App.jsx (flipiq-dashboard-v9). Replace all mock data arrays (U, UR, USERS) with Supabase queries using the supabase.js helper in src/lib/supabase.js. Keep the exact same UI, components, filter logic, and styling. Add loading states. The Supabase schema has these tables: users, organizations, daily_stats, user_events, user_category_scores, coaching_emails, task_completions, user_gaps, email_history. Use the user_dashboard view for the main data. Use the leaderboard view for the leaderboard tab. Fetch user_events joined with events table for the heat map. Write task completions and email forwards back to Supabase. Do not change the visual design - white backgrounds, orange #F97316 accent, no dark themes.
