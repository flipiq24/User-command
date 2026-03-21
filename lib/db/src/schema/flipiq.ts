import { pgTable, serial, text, integer, boolean, timestamp, date, unique, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain"),
  principal: text("principal"),
  am_name: text("am_name").notNull(),
  am_email: text("am_email"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  org_id: integer("org_id").references(() => organizations.id),
  phase: integer("phase").notNull().default(1),
  day_number: integer("day_number").notNull().default(1),
  start_date: date("start_date").notNull().default(sql`CURRENT_DATE`),
  health: text("health").notNull().default("red"),
  priority_score: integer("priority_score").notNull().default(1),
  goals_calls_per_day: integer("goals_calls_per_day").default(30),
  goals_offers_per_day: integer("goals_offers_per_day").default(3),
  goals_contacts_per_day: integer("goals_contacts_per_day").default(50),
  discussion_agenda: text("discussion_agenda"),
  active: boolean("active").default(true),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  stat_date: date("stat_date").notNull().default(sql`CURRENT_DATE`),
  texts: integer("texts").default(0),
  emails: integer("emails").default(0),
  calls: integer("calls").default(0),
  calls_connected: integer("calls_connected").default(0),
  new_relationships: integer("new_relationships").default(0),
  upgraded: integer("upgraded").default(0),
  priority_high: integer("priority_high").default(0),
  priority_warm: integer("priority_warm").default(0),
  opened_new: integer("opened_new").default(0),
  reopened: integer("reopened").default(0),
  offers_sent: integer("offers_sent").default(0),
  offers_terms: integer("offers_terms").default(0),
  offers_contracts: integer("offers_contracts").default(0),
  negotiations: integer("negotiations").default(0),
  accepted: integer("accepted").default(0),
  acquired: integer("acquired").default(0),
  total_minutes: integer("total_minutes").default(0),
  piq_minutes: integer("piq_minutes").default(0),
  comps_minutes: integer("comps_minutes").default(0),
  ia_minutes: integer("ia_minutes").default(0),
  offer_minutes: integer("offer_minutes").default(0),
  agents_minutes: integer("agents_minutes").default(0),
  source_mls: integer("source_mls").default(0),
  source_direct_mail: integer("source_direct_mail").default(0),
  source_cold_call: integer("source_cold_call").default(0),
  source_referral: integer("source_referral").default(0),
  checkin_completed: boolean("checkin_completed").default(false),
  checkin_time: timestamp("checkin_time", { withTimezone: true }),
  blocker_text: text("blocker_text"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (t) => [unique().on(t.user_id, t.stat_date)]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event_number: integer("event_number").notNull(),
  category: text("category").notNull(),
  action: text("action").notNull(),
  category_name: text("category_name"),
  phase_number: integer("phase_number"),
  where_happens: text("where_happens"),
  frequency: text("frequency"),
  priority_level: text("priority_level"),
  trigger_needed: boolean("trigger_needed").default(false),
  activates_for: text("activates_for"),
  trigger_frequency: text("trigger_frequency"),
  no_triggers_after: boolean("no_triggers_after").default(false),
});

export const eventCategories = pgTable("event_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  display_order: integer("display_order").notNull(),
});

export const userEvents = pgTable("user_events", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  event_id: integer("event_id").references(() => events.id, { onDelete: "cascade" }),
  first_used: timestamp("first_used", { withTimezone: true }),
  use_count: integer("use_count").default(0),
  last_used: timestamp("last_used", { withTimezone: true }),
  status: text("status").default("missing"),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => [unique().on(t.user_id, t.event_id)]);

export const userCategoryScores = pgTable("user_category_scores", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  category_slug: text("category_slug").references(() => eventCategories.slug),
  score: integer("score").default(0),
  active_count: integer("active_count").default(0),
  missing_count: integer("missing_count").default(0),
  total_count: integer("total_count").default(0),
  total_uses: integer("total_uses").default(0),
  first_any: timestamp("first_any", { withTimezone: true }),
  last_any: timestamp("last_any", { withTimezone: true }),
  computed_at: timestamp("computed_at", { withTimezone: true }).defaultNow(),
}, (t) => [unique().on(t.user_id, t.category_slug)]);

export const coachingEmails = pgTable("coaching_emails", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  email_date: date("email_date").notNull().default(sql`CURRENT_DATE`),
  to_name: text("to_name").notNull(),
  to_email: text("to_email"),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  is_escalation: boolean("is_escalation").default(false),
  escalation_to: text("escalation_to"),
  video_included: text("video_included"),
  root_cause: text("root_cause"),
  status: text("status").default("draft"),
  forwarded_at: timestamp("forwarded_at", { withTimezone: true }),
  forwarded_by: text("forwarded_by"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const emailHistory = pgTable("email_history", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  emails_sent: integer("emails_sent").default(0),
  last_email_date: date("last_email_date"),
  last_response_date: date("last_response_date"),
  has_responded: boolean("has_responded").default(false),
  escalated_to_am: boolean("escalated_to_am").default(false),
  escalated_at: timestamp("escalated_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => [unique().on(t.user_id)]);

export const taskCompletions = pgTable("task_completions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  task_date: date("task_date").notNull().default(sql`CURRENT_DATE`),
  action_type: text("action_type").notNull(),
  notes: text("notes"),
  completed_at: timestamp("completed_at", { withTimezone: true }).defaultNow(),
  completed_by: text("completed_by").default("Ramy"),
});

export const userGaps = pgTable("user_gaps", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  gap_text: text("gap_text").notNull(),
  gap_type: text("gap_type"),
  detected_at: timestamp("detected_at", { withTimezone: true }).defaultNow(),
});

export const triggerLog = pgTable("trigger_log", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  trigger_type: text("trigger_type").notNull(),
  trigger_condition: text("trigger_condition").notNull(),
  action_taken: text("action_taken"),
  fired_at: timestamp("fired_at", { withTimezone: true }).defaultNow(),
});
