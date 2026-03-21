import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const users = await db.execute(sql`
      SELECT
        u.id, u.name, u.email, u.phase, u.day_number, u.start_date,
        u.health, u.priority_score,
        u.goals_calls_per_day, u.goals_offers_per_day, u.goals_contacts_per_day,
        u.discussion_agenda, u.active,
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
      WHERE u.active = true
      ORDER BY u.priority_score ASC, u.health ASC
    `);

    const emails = await db.execute(sql`
      SELECT * FROM coaching_emails
      WHERE email_date = CURRENT_DATE
      ORDER BY created_at DESC
    `);

    const tasks = await db.execute(sql`
      SELECT * FROM task_completions
      WHERE task_date = CURRENT_DATE
      ORDER BY completed_at DESC
    `);

    res.json({
      users: users.rows,
      emails: emails.rows,
      tasks: tasks.rows,
      date: today,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch dashboard");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;
