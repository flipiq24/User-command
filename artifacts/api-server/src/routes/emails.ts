import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { coachingEmails, emailHistory } from "@workspace/db";
import { sql, eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/emails", async (req, res) => {
  try {
    const { date, status } = req.query;
    const targetDate = date ?? new Date().toISOString().split("T")[0];

    let query = sql`
      SELECT ce.*, u.name AS user_name, u.email AS user_email_addr
      FROM coaching_emails ce
      JOIN users u ON ce.user_id = u.id
      WHERE ce.email_date = ${targetDate}
    `;

    if (status) {
      query = sql`
        SELECT ce.*, u.name AS user_name, u.email AS user_email_addr
        FROM coaching_emails ce
        JOIN users u ON ce.user_id = u.id
        WHERE ce.email_date = ${targetDate} AND ce.status = ${status}
        ORDER BY ce.created_at DESC
      `;
    } else {
      query = sql`
        SELECT ce.*, u.name AS user_name, u.email AS user_email_addr
        FROM coaching_emails ce
        JOIN users u ON ce.user_id = u.id
        WHERE ce.email_date = ${targetDate}
        ORDER BY ce.created_at DESC
      `;
    }

    const result = await db.execute(query);
    res.json(result.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list emails");
    res.status(500).json({ error: "Failed to list emails" });
  }
});

router.post("/emails", async (req, res) => {
  try {
    const { user_id, to_name, to_email, subject, body, is_escalation, escalation_to, video_included, root_cause } = req.body;

    if (!user_id || !to_name || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields: user_id, to_name, subject, body" });
    }

    const result = await db.insert(coachingEmails).values({
      user_id,
      to_name,
      to_email,
      subject,
      body,
      is_escalation: is_escalation ?? false,
      escalation_to,
      video_included,
      root_cause,
      status: "draft",
    }).returning();

    await db.execute(sql`
      INSERT INTO email_history (user_id, emails_sent, last_email_date)
      VALUES (${user_id}, 1, CURRENT_DATE)
      ON CONFLICT (user_id)
      DO UPDATE SET
        emails_sent = email_history.emails_sent + 1,
        last_email_date = CURRENT_DATE,
        updated_at = NOW()
    `);

    res.status(201).json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create email");
    res.status(500).json({ error: "Failed to create email" });
  }
});

router.post("/emails/:id/forward", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid email ID" });

  try {
    const result = await db.update(coachingEmails)
      .set({
        status: "forwarded",
        forwarded_at: new Date(),
        forwarded_by: "Ramy",
      })
      .where(eq(coachingEmails.id, id))
      .returning();

    if (result.length === 0) return res.status(404).json({ error: "Email not found" });
    res.json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to forward email");
    res.status(500).json({ error: "Failed to forward email" });
  }
});

router.patch("/emails/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid email ID" });

  const { status } = req.body;
  const validStatuses = ["draft", "reviewed", "forwarded", "skipped"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updates: Record<string, unknown> = { status };
    if (status === "forwarded") {
      updates.forwarded_at = new Date();
      updates.forwarded_by = "Ramy";
    }

    const result = await db.update(coachingEmails)
      .set(updates)
      .where(eq(coachingEmails.id, id))
      .returning();

    if (result.length === 0) return res.status(404).json({ error: "Email not found" });
    res.json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update email status");
    res.status(500).json({ error: "Failed to update email status" });
  }
});

export default router;
