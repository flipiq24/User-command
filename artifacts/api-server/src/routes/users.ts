import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { users, userGaps, userEvents, userCategoryScores, taskCompletions } from "@workspace/db";
import { sql, eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/users", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT
        u.id, u.name, u.email, u.phase, u.day_number, u.start_date,
        u.health, u.priority_score,
        u.goals_calls_per_day, u.goals_offers_per_day, u.goals_contacts_per_day,
        u.discussion_agenda, u.tech_level, u.active,
        o.name AS org_name, o.am_name, o.am_email,
        ds.texts AS today_texts,
        ds.emails AS today_emails,
        ds.calls AS today_calls,
        ds.calls_connected AS today_calls_connected,
        ds.offers_sent AS today_offers,
        ds.total_minutes AS today_minutes,
        ds.checkin_completed AS today_checkin,
        yd.calls AS yesterday_calls,
        yd.offers_sent AS yesterday_offers,
        eh.emails_sent AS coaching_emails_sent,
        eh.has_responded AS coaching_responded,
        eh.escalated_to_am
      FROM users u
      LEFT JOIN organizations o ON u.org_id = o.id
      LEFT JOIN daily_stats ds ON u.id = ds.user_id AND ds.stat_date = CURRENT_DATE
      LEFT JOIN daily_stats yd ON u.id = yd.user_id AND yd.stat_date = CURRENT_DATE - INTERVAL '1 day'
      LEFT JOIN email_history eh ON u.id = eh.user_id
      WHERE u.active = true
      ORDER BY u.priority_score ASC
    `);
    res.json(result.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Failed to list users" });
  }
});

router.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const userResult = await db.execute(sql`
      SELECT
        u.id, u.name, u.email, u.phase, u.day_number, u.start_date,
        u.health, u.priority_score,
        u.goals_calls_per_day, u.goals_offers_per_day, u.goals_contacts_per_day,
        u.discussion_agenda, u.tech_level, u.active,
        o.name AS org_name, o.am_name, o.am_email,
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
        yd.calls AS yesterday_calls,
        yd.offers_sent AS yesterday_offers,
        eh.emails_sent AS coaching_emails_sent,
        eh.has_responded AS coaching_responded,
        eh.escalated_to_am
      FROM users u
      LEFT JOIN organizations o ON u.org_id = o.id
      LEFT JOIN daily_stats ds ON u.id = ds.user_id AND ds.stat_date = CURRENT_DATE
      LEFT JOIN daily_stats yd ON u.id = yd.user_id AND yd.stat_date = CURRENT_DATE - INTERVAL '1 day'
      LEFT JOIN email_history eh ON u.id = eh.user_id
      WHERE u.id = ${id}
    `);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const eventsResult = await db.execute(sql`
      SELECT
        ue.id, ue.user_id, ue.event_id, ue.first_used, ue.use_count, ue.last_used, ue.status,
        e.event_number, e.action, e.category, e.priority_level
      FROM user_events ue
      JOIN events e ON ue.event_id = e.id
      WHERE ue.user_id = ${id}
      ORDER BY e.event_number
    `);

    const categoriesResult = await db.select().from(userCategoryScores).where(eq(userCategoryScores.user_id, id));

    const gapsResult = await db.select().from(userGaps).where(eq(userGaps.user_id, id));

    const tasksResult = await db.select().from(taskCompletions)
      .where(and(
        eq(taskCompletions.user_id, id),
        sql`task_date = CURRENT_DATE`
      ))
      .orderBy(sql`completed_at DESC`);

    res.json({
      user: userResult.rows[0],
      events: eventsResult.rows,
      categories: categoriesResult,
      gaps: gapsResult,
      tasks: tasksResult,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user detail");
    res.status(500).json({ error: "Failed to get user detail" });
  }
});

router.patch("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

  const { health, priority_score, discussion_agenda, goals_calls_per_day, goals_offers_per_day, goals_contacts_per_day, tech_level } = req.body;

  try {
    const updates: Record<string, unknown> = { updated_at: new Date() };
    if (health !== undefined) updates.health = health;
    if (priority_score !== undefined) updates.priority_score = priority_score;
    if (discussion_agenda !== undefined) updates.discussion_agenda = discussion_agenda;
    if (goals_calls_per_day !== undefined) updates.goals_calls_per_day = goals_calls_per_day;
    if (goals_offers_per_day !== undefined) updates.goals_offers_per_day = goals_offers_per_day;
    if (goals_contacts_per_day !== undefined) updates.goals_contacts_per_day = goals_contacts_per_day;
    if (tech_level !== undefined) updates.tech_level = tech_level;

    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
