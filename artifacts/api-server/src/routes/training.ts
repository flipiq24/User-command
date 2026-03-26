import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { trainingMilestones, trainingNotes } from "@workspace/db";
import { sql, eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

const MILESTONE_DEFINITIONS: Record<string, { label: string; tooltip: string }> = {
  platform_tour: {
    label: "Platform Tour Complete",
    tooltip: "Full walkthrough of the FlipIQ platform — navigation, key screens, and basic workflow. Success: AA can independently log in, navigate to properties, and use search filters.",
  },
  first_offer_walkthrough: {
    label: "First Offer Walkthrough",
    tooltip: "Guided session creating and submitting a first offer. Covers comp analysis, pricing strategy, and offer letter generation. Success: AA submits a properly structured offer with correct comps.",
  },
  comp_analysis_training: {
    label: "Comp Analysis Training",
    tooltip: "Deep dive into running comparable property analyses — selecting comps, adjusting for condition, and justifying ARV. Success: AA produces accurate ARV estimates within 5% of mentor review.",
  },
  negotiation_coaching: {
    label: "Negotiation Coaching",
    tooltip: "Coaching on counter-offer strategy, seller objections, and deal structure flexibility. Success: AA demonstrates ability to handle at least 3 common objection types independently.",
  },
  independent_workflow: {
    label: "Independent Workflow Achieved",
    tooltip: "AA is operating the full acquisition workflow without daily hand-holding — sourcing, analyzing, offering, and negotiating. Success: Consistent daily activity meeting phase goals for 5+ consecutive days.",
  },
};

router.get("/users/:userId/training/milestones", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const completed = await db
      .select()
      .from(trainingMilestones)
      .where(eq(trainingMilestones.user_id, userId));

    const completedMap = new Map(completed.map((m) => [m.milestone_key, m]));

    const milestones = Object.entries(MILESTONE_DEFINITIONS).map(([key, def]) => {
      const record = completedMap.get(key);
      return {
        milestone_key: key,
        label: def.label,
        tooltip: def.tooltip,
        completed: !!record,
        completed_at: record?.completed_at ?? null,
        completed_by: record?.completed_by ?? null,
      };
    });

    res.json(milestones);
  } catch (err) {
    req.log.error({ err }, "Failed to list training milestones");
    res.status(500).json({ error: "Failed to list training milestones" });
  }
});

router.post("/users/:userId/training/milestones", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const { milestone_key } = req.body;
    if (!milestone_key || !MILESTONE_DEFINITIONS[milestone_key]) {
      return res.status(400).json({ error: "Invalid milestone_key" });
    }

    const result = await db
      .insert(trainingMilestones)
      .values({ user_id: userId, milestone_key, completed_by: "Ramy" })
      .onConflictDoUpdate({
        target: [trainingMilestones.user_id, trainingMilestones.milestone_key],
        set: { completed_at: new Date(), completed_by: "Ramy" },
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to toggle training milestone");
    res.status(500).json({ error: "Failed to toggle training milestone" });
  }
});

router.delete("/users/:userId/training/milestones/:key", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
    const { key } = req.params;

    await db
      .delete(trainingMilestones)
      .where(and(eq(trainingMilestones.user_id, userId), eq(trainingMilestones.milestone_key, key)));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to remove training milestone");
    res.status(500).json({ error: "Failed to remove training milestone" });
  }
});

router.get("/users/:userId/training/notes", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const notes = await db
      .select()
      .from(trainingNotes)
      .where(eq(trainingNotes.user_id, userId))
      .orderBy(desc(trainingNotes.created_at));

    res.json(notes);
  } catch (err) {
    req.log.error({ err }, "Failed to list training notes");
    res.status(500).json({ error: "Failed to list training notes" });
  }
});

router.post("/users/:userId/training/notes", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const { note_text } = req.body;
    if (!note_text || !note_text.trim()) {
      return res.status(400).json({ error: "note_text is required" });
    }

    const result = await db
      .insert(trainingNotes)
      .values({ user_id: userId, note_text: note_text.trim(), created_by: "Ramy" })
      .returning();

    res.status(201).json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create training note");
    res.status(500).json({ error: "Failed to create training note" });
  }
});

router.get("/users/:userId/training/impact", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const completed = await db
      .select()
      .from(trainingMilestones)
      .where(eq(trainingMilestones.user_id, userId));

    if (completed.length === 0) {
      return res.json({ milestones_completed: 0, impact: [] });
    }

    const impacts = [];
    for (const m of completed) {
      if (!m.completed_at) continue;
      const dateStr = m.completed_at.toISOString().split("T")[0];

      const beforeResult = await db.execute(sql`
        SELECT
          COALESCE(AVG(calls), 0) AS avg_calls,
          COALESCE(AVG(offers_sent), 0) AS avg_offers
        FROM daily_stats
        WHERE user_id = ${userId} AND stat_date < ${dateStr}
      `);

      const afterResult = await db.execute(sql`
        SELECT
          COALESCE(AVG(calls), 0) AS avg_calls,
          COALESCE(AVG(offers_sent), 0) AS avg_offers
        FROM daily_stats
        WHERE user_id = ${userId} AND stat_date >= ${dateStr}
      `);

      const before = beforeResult.rows[0] || { avg_calls: 0, avg_offers: 0 };
      const after = afterResult.rows[0] || { avg_calls: 0, avg_offers: 0 };

      impacts.push({
        milestone_key: m.milestone_key,
        label: MILESTONE_DEFINITIONS[m.milestone_key]?.label ?? m.milestone_key,
        completed_at: m.completed_at,
        before_avg_calls: Math.round(Number(before.avg_calls) * 10) / 10,
        after_avg_calls: Math.round(Number(after.avg_calls) * 10) / 10,
        before_avg_offers: Math.round(Number(before.avg_offers) * 10) / 10,
        after_avg_offers: Math.round(Number(after.avg_offers) * 10) / 10,
      });
    }

    res.json({ milestones_completed: completed.length, impact: impacts });
  } catch (err) {
    req.log.error({ err }, "Failed to compute training impact");
    res.status(500).json({ error: "Failed to compute training impact" });
  }
});

export default router;
