import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { deals } from "@workspace/db";
import { sql, eq, and, inArray, gte, lte } from "drizzle-orm";

const router: IRouter = Router();

const DEAL_STAGES = [
  "Initial Contact",
  "Backup",
  "Offer Terms Sent",
  "Contract Submitted",
  "In Negotiations",
  "Offer Accepted",
  "Acquired",
];

const STAGE_GROUPS: Record<string, string[]> = {
  qualifying: ["Initial Contact", "Backup", "Offer Terms Sent"],
  sent_offer: ["Contract Submitted", "In Negotiations"],
  offer_accepted: ["Offer Accepted"],
  acquired: ["Acquired"],
};

const SOURCES = ["MLS", "Off Market"];
const INTENTS = ["Flip", "Wholesale", "Portfolio"];

router.get("/deals", async (req, res) => {
  try {
    const conditions: any[] = [];

    if (req.query.source) {
      const sources = (req.query.source as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = sources.map(s => sql`d.source = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.intent) {
      const intents = (req.query.intent as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = intents.map(s => sql`d.intent = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.org_id) {
      conditions.push(sql`d.org_id = ${parseInt(req.query.org_id as string)}`);
    }
    if (req.query.stage) {
      const stages = (req.query.stage as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = stages.map(s => sql`d.stage = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.invoice_status) {
      const statuses = (req.query.invoice_status as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = statuses.map(s => sql`d.invoice_status = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.from_date) {
      conditions.push(sql`d.expected_close_date >= ${req.query.from_date}`);
    }
    if (req.query.to_date) {
      conditions.push(sql`d.expected_close_date <= ${req.query.to_date}`);
    }

    const whereClause = conditions.length > 0
      ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
      : sql``;

    const result = await db.execute(sql`
      SELECT
        d.*,
        u.name AS user_name,
        o.name AS org_name
      FROM deals d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN organizations o ON d.org_id = o.id
      ${whereClause}
      ORDER BY d.expected_close_date ASC, d.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list deals");
    res.status(500).json({ error: "Failed to list deals" });
  }
});

router.get("/deals/summary", async (req, res) => {
  try {
    const conditions: any[] = [];

    if (req.query.source) {
      const sources = (req.query.source as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = sources.map(s => sql`d.source = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.intent) {
      const intents = (req.query.intent as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = intents.map(s => sql`d.intent = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }
    if (req.query.org_id) {
      conditions.push(sql`d.org_id = ${parseInt(req.query.org_id as string)}`);
    }
    if (req.query.invoice_status) {
      const statuses = (req.query.invoice_status as string).split(",").map(s => s.trim()).filter(Boolean);
      const parts = statuses.map(s => sql`d.invoice_status = ${s}`);
      if (parts.length) conditions.push(sql`(${sql.join(parts, sql` OR `)})`);
    }

    const whereClause = conditions.length > 0
      ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
      : sql``;

    const result = await db.execute(sql`
      SELECT
        d.stage,
        EXTRACT(YEAR FROM d.expected_close_date)::int AS close_year,
        EXTRACT(MONTH FROM d.expected_close_date)::int AS close_month,
        d.org_id,
        o.name AS org_name,
        d.user_id,
        u.name AS user_name,
        COUNT(*)::int AS deal_count,
        COALESCE(SUM(d.price), 0)::bigint AS total_price,
        COALESCE(SUM(d.commission), 0)::bigint AS total_commission,
        COALESCE(SUM(d.projected_profit), 0)::bigint AS total_profit,
        COALESCE(SUM(d.success_fee), 0)::bigint AS total_success_fee
      FROM deals d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN organizations o ON d.org_id = o.id
      ${whereClause}
      GROUP BY d.stage, close_year, close_month, d.org_id, o.name, d.user_id, u.name
      ORDER BY close_year, close_month, d.org_id, d.user_id
    `);

    const invoiceResult = await db.execute(sql`
      SELECT
        d.invoice_status,
        COUNT(*)::int AS deal_count,
        COALESCE(SUM(d.success_fee), 0)::bigint AS total_fee
      FROM deals d
      ${whereClause}
      GROUP BY d.invoice_status
    `);

    const pastDueConditions = [...conditions, sql`d.stage != 'Acquired'`, sql`d.expected_close_date < CURRENT_DATE`];
    const pastDueWhere = sql`WHERE ${sql.join(pastDueConditions, sql` AND `)}`;

    const pastDueResult = await db.execute(sql`
      SELECT
        d.id,
        d.user_id,
        d.org_id,
        d.expected_close_date,
        CURRENT_DATE - d.expected_close_date::date AS days_overdue
      FROM deals d
      ${pastDueWhere}
    `);

    res.json({
      stages: DEAL_STAGES,
      stage_groups: STAGE_GROUPS,
      sources: SOURCES,
      intents: INTENTS,
      grid: result.rows,
      invoice_summary: invoiceResult.rows,
      past_due: pastDueResult.rows,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get deal summary");
    res.status(500).json({ error: "Failed to get deal summary" });
  }
});

router.get("/deals/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid deal ID" });

  try {
    const result = await db.execute(sql`
      SELECT
        d.*,
        u.name AS user_name,
        o.name AS org_name
      FROM deals d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN organizations o ON d.org_id = o.id
      WHERE d.id = ${id}
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get deal");
    res.status(500).json({ error: "Failed to get deal" });
  }
});

router.post("/deals", async (req, res) => {
  try {
    const {
      user_id, org_id, address, thumbnail_url, source, intent, stage,
      price, projected_profit, commission, commission_type,
      expected_close_date, actual_close_date, contract_date, offer_accepted_date,
      days_in_stage, property_type, success_fee, invoice_status,
    } = req.body;

    if (!address || !source || !intent || !stage) {
      return res.status(400).json({ error: "address, source, intent, and stage are required" });
    }

    const result = await db.insert(deals).values({
      user_id, org_id, address, thumbnail_url, source, intent, stage,
      price: price || 0,
      projected_profit: projected_profit || 0,
      commission: commission || 0,
      commission_type,
      expected_close_date, actual_close_date, contract_date, offer_accepted_date,
      days_in_stage: days_in_stage || 0,
      property_type,
      success_fee: success_fee || 0,
      invoice_status: invoice_status || "need_to_invoice",
    }).returning();

    res.status(201).json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create deal");
    res.status(500).json({ error: "Failed to create deal" });
  }
});

router.patch("/deals/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid deal ID" });

  try {
    const updates: Record<string, any> = {};
    const allowedFields = [
      "address", "thumbnail_url", "source", "intent", "stage",
      "price", "projected_profit", "commission", "commission_type",
      "expected_close_date", "actual_close_date", "contract_date", "offer_accepted_date",
      "days_in_stage", "property_type", "success_fee", "invoice_status",
      "invoiced_date", "payment_received_date",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const setClauses = Object.entries(updates).map(
      ([key, value]) => sql`${sql.identifier(key)} = ${value}`
    );
    setClauses.push(sql`updated_at = NOW()`);

    const result = await db.execute(sql`
      UPDATE deals
      SET ${sql.join(setClauses, sql`, `)}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deal not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update deal");
    res.status(500).json({ error: "Failed to update deal" });
  }
});

export default router;
