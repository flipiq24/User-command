import pg from "pg";

const STAGES = [
  "Initial Contact",
  "Backup",
  "Offer Terms Sent",
  "Contract Submitted",
  "In Negotiations",
  "Offer Accepted",
  "Acquired",
];

const SOURCES = ["MLS", "Off Market"];
const INTENTS = ["Flip", "Wholesale", "Portfolio"];
const PTYPES = ["STD", "SPAY", "NOD", "REO", "PRO", "AUC", "TRUS", "TPA", "HUD", "BK", "FORC", "CONS"];
const STREETS = ["Oak", "Maple", "Cedar", "Pine", "Elm", "Birch", "Walnut", "Spruce", "Ash", "Cherry", "Willow", "Sycamore", "Magnolia", "Poplar", "Hickory"];
const SUFFIXES = ["St", "Ave", "Dr", "Ln", "Blvd", "Ct", "Way", "Rd", "Pl", "Cir"];
const CITIES = ["Phoenix, AZ", "Mesa, AZ", "Scottsdale, AZ", "Tempe, AZ", "Chandler, AZ", "Gilbert, AZ", "Glendale, AZ", "Peoria, AZ", "Surprise, AZ", "Goodyear, AZ"];

const INVOICE_STATUSES = ["need_to_invoice", "invoiced", "payment_received"];

function seed(i: number): number {
  return ((i * 7919 + 104729) % 2147483647) / 2147483647;
}

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const usersResult = await pool.query("SELECT id, org_id FROM users WHERE active = true ORDER BY id");
    const users = usersResult.rows;

    if (users.length === 0) {
      console.log("No users found. Seed users first.");
      return;
    }

    await pool.query("DELETE FROM deals");
    console.log("Cleared existing deals.");

    const TARGET = 280;
    const dealsPerUser = Math.ceil(TARGET / users.length);
    let dealId = 1;
    const values: string[] = [];

    for (const user of users) {
      const userDeals = Math.max(8, Math.min(20, dealsPerUser + Math.floor(seed(user.id * 37) * 8) - 4));

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

        const contractDay = Math.max(1, Math.min(28, Math.floor(1 + s9 * 20)));
        const contractMonth = (stg === "Acquired" || stg === "Offer Accepted") ? (s9 < 0.7 ? 2 : 3) : 3;
        const contractDate = `2026-${String(contractMonth).padStart(2, "0")}-${String(contractDay).padStart(2, "0")}`;

        const offerAccDay = Math.max(1, Math.min(28, contractDay + 3 + Math.floor(s10 * 10)));
        const offerAccMonth = offerAccDay > 28 ? Math.min(contractMonth + 1, 6) : contractMonth;
        const offerAccDayAdj = offerAccDay > 28 ? offerAccDay - 28 : offerAccDay;
        const offerAcceptedDate = (stg === "Offer Accepted" || stg === "Acquired")
          ? `2026-${String(offerAccMonth).padStart(2, "0")}-${String(offerAccDayAdj).padStart(2, "0")}`
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

        const esc = (v: string | null) => v === null ? "NULL" : `'${v.replace(/'/g, "''")}'`;

        values.push(`(${user.id}, ${user.org_id}, ${esc(addr)}, NULL, ${esc(src)}, ${esc(intent)}, ${esc(stg)}, ${price}, ${projProfit}, ${comm}, ${esc(commType)}, ${esc(estCloseDate)}, ${esc(actualCloseDate)}, ${esc(contractDate)}, ${esc(offerAcceptedDate)}, ${daysInStage}, ${esc(pt)}, ${successFee}, ${esc(invoiceStatus)}, ${esc(invoicedDate)}, ${esc(paymentReceivedDate)})`);

        dealId++;
      }
    }

    const insertSQL = `
      INSERT INTO deals (user_id, org_id, address, thumbnail_url, source, intent, stage, price, projected_profit, commission, commission_type, expected_close_date, actual_close_date, contract_date, offer_accepted_date, days_in_stage, property_type, success_fee, invoice_status, invoiced_date, payment_received_date)
      VALUES ${values.join(",\n")}
    `;

    await pool.query(insertSQL);
    console.log(`Seeded ${values.length} deals for ${users.length} users.`);

    const counts = await pool.query("SELECT stage, count(*) as cnt FROM deals GROUP BY stage ORDER BY stage");
    console.log("\nDeals by stage:");
    for (const row of counts.rows) {
      console.log(`  ${row.stage}: ${row.cnt}`);
    }

    const invoiceCounts = await pool.query("SELECT invoice_status, count(*) as cnt, sum(success_fee) as total_fee FROM deals GROUP BY invoice_status ORDER BY invoice_status");
    console.log("\nInvoice summary:");
    for (const row of invoiceCounts.rows) {
      console.log(`  ${row.invoice_status}: ${row.cnt} deals, $${row.total_fee} in fees`);
    }
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
