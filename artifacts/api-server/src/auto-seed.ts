import { db, organizations, users, deals } from "@workspace/db";
import { sql } from "drizzle-orm";

const ORGS = [
  { id: 1, name: "Coko Homes", domain: "cokohomes.com", principal: "CEO", am_name: "Gregory Patterson", am_email: "greg@cokohomes.com" },
  { id: 2, name: "Hegemark", domain: "hegemark.com", principal: "CEO", am_name: "Jeffrey Kuo", am_email: "jeff@hegemark.com" },
  { id: 3, name: "TD Realty", domain: "tdrealty.com", principal: "CEO", am_name: "Matt Carmean", am_email: "matt@tdrealty.com" },
  { id: 4, name: "STJ Investments", domain: "stjinvestments.com", principal: "CEO", am_name: "Andruw Tafolla", am_email: "andruw@stjinvestments.com" },
  { id: 5, name: "Fair Close", domain: "fairclose.com", principal: "CEO", am_name: "Tony Fletcher", am_email: "tony@fairclose.com" },
];

const USERS_DATA = [
  { id: 1, name: "Miguel Rivera", email: "miguel@cokohomes.com", org_id: 1, phase: 3, day_number: 45, health: "green", priority_score: 4 },
  { id: 2, name: "Jared Lynch", email: "jared@cokohomes.com", org_id: 1, phase: 3, day_number: 38, health: "yellow", priority_score: 3 },
  { id: 3, name: "Chris Dragich", email: "chris@cokohomes.com", org_id: 1, phase: 2, day_number: 14, health: "yellow", priority_score: 3 },
  { id: 4, name: "Duk Lim", email: "duk@cokohomes.com", org_id: 1, phase: 1, day_number: 5, health: "orange", priority_score: 2 },
  { id: 5, name: "Jesus Valdez", email: "jesus@cokohomes.com", org_id: 1, phase: 1, day_number: 4, health: "red", priority_score: 1 },
  { id: 6, name: "Rod Vianna", email: "rod@cokohomes.com", org_id: 1, phase: 3, day_number: 26, health: "yellow", priority_score: 3 },
  { id: 7, name: "Shaun Alan", email: "shaun@cokohomes.com", org_id: 1, phase: 2, day_number: 18, health: "yellow", priority_score: 3 },
  { id: 8, name: "Michael May", email: "michael@hegemark.com", org_id: 2, phase: 3, day_number: 60, health: "green", priority_score: 4 },
  { id: 9, name: "Alek Tan", email: "alek@hegemark.com", org_id: 2, phase: 3, day_number: 50, health: "green", priority_score: 4 },
  { id: 10, name: "Maxwell Irungu", email: "maxwell@hegemark.com", org_id: 2, phase: 2, day_number: 12, health: "yellow", priority_score: 3 },
  { id: 11, name: "Roman Bracamonte", email: "roman@hegemark.com", org_id: 2, phase: 1, day_number: 6, health: "red", priority_score: 1 },
  { id: 12, name: "Elizabeth Puga", email: "elizabeth@hegemark.com", org_id: 2, phase: 2, day_number: 15, health: "yellow", priority_score: 3 },
  { id: 13, name: "Juan Torres", email: "juan@tdrealty.com", org_id: 3, phase: 2, day_number: 10, health: "yellow", priority_score: 3 },
  { id: 14, name: "Johnny Catala", email: "johnny@tdrealty.com", org_id: 3, phase: 1, day_number: 3, health: "red", priority_score: 1 },
  { id: 15, name: "Daniel Worby", email: "daniel@tdrealty.com", org_id: 3, phase: 1, day_number: 3, health: "red", priority_score: 1 },
  { id: 16, name: "Brooke Stiner", email: "brooke@tdrealty.com", org_id: 3, phase: 1, day_number: 3, health: "orange", priority_score: 2 },
  { id: 17, name: "Steve Medina", email: "steve@stjinvestments.com", org_id: 4, phase: 3, day_number: 40, health: "green", priority_score: 4 },
  { id: 18, name: "Lauren Robles", email: "lauren@stjinvestments.com", org_id: 4, phase: 2, day_number: 16, health: "yellow", priority_score: 3 },
  { id: 19, name: "Isaac Haro", email: "isaac@stjinvestments.com", org_id: 4, phase: 1, day_number: 7, health: "yellow", priority_score: 2 },
  { id: 20, name: "Josh Santos", email: "josh@fairclose.com", org_id: 5, phase: 3, day_number: 90, health: "green", priority_score: 4 },
  { id: 21, name: "Trevor Kelly", email: "trevor@fairclose.com", org_id: 5, phase: 3, day_number: 75, health: "orange", priority_score: 2 },
];

const PTYPES = ["STD", "SPAY", "NOD", "REO", "PRO", "AUC", "TRUS", "TPA", "HUD", "BK", "FORC", "CONS"];
const STREETS = ["Oak", "Maple", "Cedar", "Pine", "Elm", "Birch", "Walnut", "Spruce", "Ash", "Cherry", "Willow", "Sycamore", "Magnolia", "Poplar", "Hickory"];
const SUFFIXES = ["St", "Ave", "Dr", "Ln", "Blvd", "Ct", "Way", "Rd", "Pl", "Cir"];
const CITIES = ["Phoenix, AZ", "Mesa, AZ", "Scottsdale, AZ", "Tempe, AZ", "Chandler, AZ", "Gilbert, AZ", "Glendale, AZ", "Peoria, AZ", "Surprise, AZ", "Goodyear, AZ"];

function seed(i: number): number {
  return ((i * 7919 + 104729) % 2147483647) / 2147483647;
}

export async function autoSeed() {
  try {
    const dealCount = await db.select({ cnt: sql<number>`count(*)::int` }).from(deals);
    if (dealCount[0].cnt > 0) {
      console.log(`[auto-seed] ${dealCount[0].cnt} deals already exist, skipping seed.`);
      return;
    }

    console.log("[auto-seed] No deals found, seeding database...");

    const orgCount = await db.select({ cnt: sql<number>`count(*)::int` }).from(organizations);
    if (orgCount[0].cnt === 0) {
      for (const o of ORGS) {
        await db.insert(organizations).values(o).onConflictDoNothing();
      }
      await db.execute(sql`SELECT setval(pg_get_serial_sequence('organizations', 'id'), (SELECT MAX(id) FROM organizations))`);
      console.log(`[auto-seed] Seeded ${ORGS.length} organizations.`);
    }

    const userCount = await db.select({ cnt: sql<number>`count(*)::int` }).from(users);
    if (userCount[0].cnt === 0) {
      for (const u of USERS_DATA) {
        await db.insert(users).values({
          ...u,
          active: true,
          goals_calls_per_day: 50,
          goals_offers_per_day: 5,
          goals_contacts_per_day: 50,
        }).onConflictDoNothing();
      }
      await db.execute(sql`SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users))`);
      console.log(`[auto-seed] Seeded ${USERS_DATA.length} users.`);
    }

    const activeUsers = await db.select({ id: users.id, org_id: users.org_id }).from(users);
    if (activeUsers.length === 0) {
      console.log("[auto-seed] No users found, cannot seed deals.");
      return;
    }

    let dealId = 1;
    const dealRows: any[] = [];

    for (const user of activeUsers) {
      const userDeals = Math.max(8, Math.min(20, 13 + Math.floor(seed(user.id * 37) * 8) - 4));

      for (let j = 0; j < userDeals; j++) {
        const s1 = seed(dealId * 31 + j * 17);
        const s2 = seed(dealId * 53 + j * 23);
        const s3 = seed(dealId * 71 + j * 37);
        const s4 = seed(dealId * 97 + j * 41);
        const s5 = seed(dealId * 113 + j * 43);
        const s6 = seed(dealId * 131 + j * 47);
        const s7 = seed(dealId * 149 + j * 53);
        const s8 = seed(dealId * 163 + j * 59);
        const s9 = seed(dealId * 181 + j * 67);
        const s10 = seed(dealId * 199 + j * 71);

        const src = s1 < 0.55 ? "MLS" : "Off Market";
        const pt = PTYPES[Math.floor(s2 * PTYPES.length)];
        const intent = s3 < 0.5 ? "Flip" : s3 < 0.82 ? "Wholesale" : "Portfolio";

        let stg: string;
        if (j < 2) stg = "Acquired";
        else if (j < 4) stg = "Offer Accepted";
        else if (j < 6) stg = "In Negotiations";
        else if (j < 8) stg = "Contract Submitted";
        else if (j < 10) stg = "Offer Terms Sent";
        else if (j < 12) stg = "Backup";
        else stg = "Initial Contact";

        const price = Math.round((80000 + s4 * 420000) / 1000) * 1000;
        const profitPct = 0.08 + s5 * 0.22;
        const projProfit = Math.round(price * profitPct);

        let comm: number;
        if (intent === "Flip") {
          comm = s6 < 0.5 ? Math.round(price * 0.005) : Math.round(projProfit * 0.25);
        } else if (intent === "Wholesale") {
          comm = s6 < 0.5 ? Math.round(projProfit * 0.10) : Math.round(projProfit * 0.25);
        } else {
          comm = Math.round(projProfit * 0.20);
        }

        const commType = intent === "Flip"
          ? (s6 < 0.5 ? "0.5% price" : "25% profit")
          : intent === "Wholesale"
            ? (s6 < 0.5 ? "10% profit" : "25% profit")
            : "20% profit";

        const closeMonth = stg === "Acquired" ? 3
          : stg === "Offer Accepted" ? (s7 < 0.5 ? 3 : 4)
          : stg === "In Negotiations" ? (s7 < 0.33 ? 4 : s7 < 0.66 ? 5 : 6)
          : stg === "Contract Submitted" ? (s7 < 0.3 ? 5 : s7 < 0.6 ? 6 : 7)
          : stg === "Offer Terms Sent" ? (s7 < 0.3 ? 6 : s7 < 0.6 ? 7 : 8)
          : stg === "Backup" ? (s7 < 0.4 ? 7 : 8)
          : (s7 < 0.3 ? 8 : 9);
        const closeDay = Math.max(1, Math.min(28, Math.floor(1 + s5 * 27)));
        const estCloseDate = `2026-${String(closeMonth).padStart(2, "0")}-${String(closeDay).padStart(2, "0")}`;

        const actualCloseDate = stg === "Acquired"
          ? `2026-03-${String(Math.max(1, Math.min(21, Math.floor(1 + s8 * 20)))).padStart(2, "0")}`
          : null;

        const daysInStage = stg === "Acquired" ? Math.floor(s8 * 4)
          : stg === "Offer Accepted" ? Math.floor(1 + s8 * 10)
          : stg === "In Negotiations" ? Math.floor(2 + s8 * 20)
          : stg === "Contract Submitted" ? Math.floor(1 + s8 * 14)
          : stg === "Offer Terms Sent" ? Math.floor(1 + s8 * 14)
          : stg === "Backup" ? Math.floor(1 + s8 * 30)
          : Math.floor(1 + s8 * 30);

        const successFee = (stg === "Offer Accepted" || stg === "Acquired")
          ? Math.round(500 + s9 * 4500)
          : 0;

        let invoiceStatus: string;
        if (stg === "Acquired") {
          invoiceStatus = s10 < 0.3 ? "payment_received" : s10 < 0.7 ? "invoiced" : "need_to_invoice";
        } else if (stg === "Offer Accepted") {
          invoiceStatus = s10 < 0.4 ? "invoiced" : "need_to_invoice";
        } else {
          invoiceStatus = "need_to_invoice";
        }

        const invoicedDate = (invoiceStatus === "invoiced" || invoiceStatus === "payment_received")
          ? `2026-03-${String(Math.max(1, Math.min(21, Math.floor(5 + s8 * 16)))).padStart(2, "0")}`
          : null;

        const paymentReceivedDate = invoiceStatus === "payment_received"
          ? `2026-03-${String(Math.max(1, Math.min(21, Math.floor(10 + s9 * 11)))).padStart(2, "0")}`
          : null;

        const addr = `${Math.floor(100 + s4 * 9900)} ${STREETS[Math.floor(s2 * STREETS.length)]} ${SUFFIXES[Math.floor(s3 * SUFFIXES.length)]}, ${CITIES[Math.floor(s7 * CITIES.length)]}`;

        dealRows.push({
          user_id: user.id,
          org_id: user.org_id,
          address: addr,
          source: src,
          intent,
          stage: stg,
          price,
          projected_profit: projProfit,
          commission: comm,
          commission_type: commType,
          expected_close_date: estCloseDate,
          actual_close_date: actualCloseDate,
          days_in_stage: daysInStage,
          property_type: pt,
          success_fee: successFee,
          invoice_status: invoiceStatus,
          invoiced_date: invoicedDate,
          payment_received_date: paymentReceivedDate,
        });

        dealId++;
      }
    }

    const BATCH = 50;
    for (let i = 0; i < dealRows.length; i += BATCH) {
      await db.insert(deals).values(dealRows.slice(i, i + BATCH));
    }

    console.log(`[auto-seed] Seeded ${dealRows.length} deals for ${activeUsers.length} users.`);
  } catch (err) {
    console.error("[auto-seed] Error:", err);
  }
}
