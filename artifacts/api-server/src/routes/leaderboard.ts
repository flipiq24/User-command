import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const end = endDate ?? new Date().toISOString().split("T")[0];

    const result = await db.execute(sql`
      SELECT
        u.id, u.name, u.health, u.phase, u.day_number,
        o.name AS org_name,
        COALESCE(SUM(ds.texts), 0) AS total_texts,
        COALESCE(SUM(ds.emails), 0) AS total_emails,
        COALESCE(SUM(ds.calls), 0) AS total_calls,
        COALESCE(SUM(ds.calls_connected), 0) AS total_calls_connected,
        COALESCE(SUM(ds.new_relationships), 0) AS total_new_rel,
        COALESCE(SUM(ds.upgraded), 0) AS total_upgraded,
        COALESCE(SUM(ds.opened_new), 0) AS total_opened,
        COALESCE(SUM(ds.offers_sent), 0) AS total_offers,
        COALESCE(SUM(ds.negotiations), 0) AS total_negotiations,
        COALESCE(SUM(ds.accepted), 0) AS total_accepted,
        COALESCE(SUM(ds.acquired), 0) AS total_acquired,
        COALESCE(SUM(ds.total_minutes), 0) AS total_minutes
      FROM users u
      LEFT JOIN organizations o ON u.org_id = o.id
      LEFT JOIN daily_stats ds ON u.id = ds.user_id
        AND ds.stat_date >= ${start}
        AND ds.stat_date <= ${end}
      WHERE u.active = true
      GROUP BY u.id, u.name, u.health, u.phase, u.day_number, o.name
      ORDER BY total_calls DESC
    `);

    res.json(result.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to get leaderboard");
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

export default router;
