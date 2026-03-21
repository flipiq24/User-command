import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { users, userGaps, coachingEmails, emailHistory } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/claude/read-all", async (req, res) => {
  try {
    const usersResult = await db.execute(sql`
      SELECT
        u.id, u.name, u.email, u.phase, u.day_number, u.start_date,
        u.health, u.priority_score,
        u.goals_calls_per_day, u.goals_offers_per_day, u.goals_contacts_per_day,
        u.discussion_agenda, u.active,
        o.name AS org_name, o.am_name, o.am_email,
        ds.texts AS today_texts, ds.emails AS today_emails, ds.calls AS today_calls,
        ds.calls_connected AS today_calls_connected,
        ds.new_relationships AS today_new_rel, ds.upgraded AS today_upgraded,
        ds.opened_new AS today_opened, ds.offers_sent AS today_offers,
        ds.negotiations AS today_negot, ds.accepted AS today_accepted,
        ds.acquired AS today_acquired, ds.total_minutes AS today_minutes,
        ds.checkin_completed AS today_checkin,
        yd.calls AS yesterday_calls, yd.offers_sent AS yesterday_offers,
        eh.emails_sent AS coaching_emails_sent,
        eh.has_responded AS coaching_responded, eh.escalated_to_am
      FROM users u
      LEFT JOIN organizations o ON u.org_id = o.id
      LEFT JOIN daily_stats ds ON u.id = ds.user_id AND ds.stat_date = CURRENT_DATE
      LEFT JOIN daily_stats yd ON u.id = yd.user_id AND yd.stat_date = CURRENT_DATE - INTERVAL '1 day'
      LEFT JOIN email_history eh ON u.id = eh.user_id
      WHERE u.active = true
      ORDER BY u.priority_score ASC
    `);

    const eventsResult = await db.execute(sql`
      SELECT
        ue.id, ue.user_id, ue.event_id, ue.first_used, ue.use_count, ue.last_used, ue.status,
        e.event_number, e.action, e.category, e.priority_level
      FROM user_events ue
      JOIN events e ON ue.event_id = e.id
      ORDER BY ue.user_id, e.event_number
    `);

    const gapsResult = await db.execute(sql`SELECT * FROM user_gaps ORDER BY user_id`);

    const categoriesResult = await db.execute(sql`SELECT * FROM user_category_scores ORDER BY user_id`);

    res.json({
      users: usersResult.rows,
      events: eventsResult.rows,
      gaps: gapsResult.rows,
      categories: categoriesResult.rows,
      date: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Claude read-all failed");
    res.status(500).json({ error: "Failed to read all data" });
  }
});

router.post("/claude/update-health", async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "updates must be an array" });
    }

    for (const u of updates) {
      const { user_id, health, priority_score, discussion_agenda, gaps } = u;

      const userUpdates: Record<string, unknown> = { updated_at: new Date() };
      if (health) userUpdates.health = health;
      if (priority_score !== undefined) userUpdates.priority_score = priority_score;
      if (discussion_agenda !== undefined) userUpdates.discussion_agenda = discussion_agenda;

      await db.update(users).set(userUpdates).where(eq(users.id, user_id));

      if (Array.isArray(gaps)) {
        await db.delete(userGaps).where(eq(userGaps.user_id, user_id));
        if (gaps.length > 0) {
          await db.insert(userGaps).values(
            gaps.map((g: string) => ({ user_id, gap_text: g }))
          );
        }
      }
    }

    res.json({ success: true, message: `Updated ${updates.length} users` });
  } catch (err) {
    req.log.error({ err }, "Claude update-health failed");
    res.status(500).json({ error: "Failed to update health" });
  }
});

export default router;
