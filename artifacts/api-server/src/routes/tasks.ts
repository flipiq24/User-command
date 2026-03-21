import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { taskCompletions } from "@workspace/db";
import { sql, eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/tasks", async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ?? new Date().toISOString().split("T")[0];

    const result = await db.execute(sql`
      SELECT tc.*, u.name AS user_name
      FROM task_completions tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.task_date = ${targetDate}
      ORDER BY tc.completed_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list tasks");
    res.status(500).json({ error: "Failed to list tasks" });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const { user_id, action_type, notes } = req.body;

    const validTypes = ["call", "text", "email", "notify_am", "walkthrough", "other"];
    if (!user_id || !action_type || !validTypes.includes(action_type)) {
      return res.status(400).json({ error: "Missing or invalid fields: user_id, action_type" });
    }

    const result = await db.insert(taskCompletions).values({
      user_id,
      action_type,
      notes,
      completed_by: "Ramy",
    }).returning();

    res.status(201).json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create task");
    res.status(500).json({ error: "Failed to create task" });
  }
});

export default router;
