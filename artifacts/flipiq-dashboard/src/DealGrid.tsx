// @ts-nocheck
import { useState, useMemo, useRef, useEffect } from "react";

function Tip({ text, children }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const enter = (e) => {
    const r = (ref.current || e.currentTarget).getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top });
    setShow(true);
  };
  return (
    <>
      <span ref={ref} onMouseEnter={enter} onMouseLeave={() => setShow(false)} style={{ cursor: "help", borderBottom: "1px dotted #CBD5E1", display: "inline" }}>
        {children}
      </span>
      {show && (
        <div style={{ position: "fixed", left: Math.max(8, Math.min(pos.x - 120, window.innerWidth - 260)), top: pos.y - 6, transform: "translateY(-100%)", width: 240, background: "#1E293B", color: "#F8FAFC", fontSize: 11, lineHeight: 1.5, padding: "8px 12px", borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 9999, pointerEvents: "none" }}>
          {text}
          <div style={{ position: "absolute", bottom: -4, left: "50%", marginLeft: -4, width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1E293B" }} />
        </div>
      )}
    </>
  );
}

const STAGE_GROUPS = [
  { key: "qualifying", label: "Qualifying Deals", stages: ["Initial Contact", "Backup", "Offer Terms Sent"], color: "#3B82F6", bg: "#EFF6FF", bc: "#BFDBFE", showRevenue: false },
  { key: "sent_offer", label: "Sent Offer Deals", stages: ["Contract Submitted", "In Negotiations"], color: "#F97316", bg: "#FFF7ED", bc: "#FED7AA", showRevenue: true },
  { key: "offer_accepted", label: "Offer Accepted", stages: ["Offer Accepted"], color: "#10B981", bg: "#ECFDF5", bc: "#A7F3D0", showRevenue: true },
  { key: "acquired", label: "Acquired", stages: ["Acquired"], color: "#059669", bg: "#D1FAE5", bc: "#6EE7B7", showRevenue: true },
];

const DL_SOURCES = ["MLS", "Off Market"];
const DL_INTENTS = ["Flip", "Wholesale", "Portfolio"];
const DL_PTYPES = ["STD", "SPAY", "NOD", "REO", "PRO", "AUC", "TRUS", "TPA", "HUD", "BK", "FORC", "CONS"];
const DL_STREETS = ["Oak","Elm","Maple","Cedar","Pine","Birch","Walnut","Cherry","Ash","Spruce","Willow","Poplar","Magnolia","Cypress","Sycamore","Redwood","Hickory","Juniper","Laurel","Holly","Ivy","Hazel","Aspen","Alder","Beech","Olive","Palm","Peach","Fig","Sage"];
const DL_SUFFIXES = ["St","Ave","Dr","Ln","Ct","Blvd","Way","Pl","Rd","Cir"];
const DL_CITIES = ["Phoenix","Scottsdale","Mesa","Tempe","Chandler","Gilbert","Glendale","Peoria","Surprise","Goodyear","Avondale","Buckeye","Tolleson","Litchfield Park"];
const NEW_STAGES = ["Initial Contact", "Backup", "Offer Terms Sent", "Contract Submitted", "In Negotiations", "Offer Accepted", "Acquired"];

function genDeals(users, orgs) {
  const deals = [];
  let did = 1;
  const TARGET = 280;
  const seed = (i) => ((i * 7919 + 104729) % 2147483647) / 2147483647;
  const rawCounts = users.map(u => (u.s?.of || 0) + (u.s?.ng || 0) + (u.s?.ac || 0) + (u.s?.aq || 0) + Math.max(0, Math.floor((u.s?.op || 0) * 0.3)));
  const rawTotal = rawCounts.reduce((a, b) => a + b, 0) || 1;
  const scale = TARGET / rawTotal;
  users.forEach((u, ui) => {
    const rawCnt = rawCounts[ui];
    if (rawCnt === 0) return;
    const cnt = Math.max(1, Math.round(rawCnt * scale));
    for (let j = 0; j < cnt; j++) {
      const s1 = seed(did * 31 + j * 17);
      const s2 = seed(did * 53 + j * 23);
      const s3 = seed(did * 71 + j * 37);
      const s4 = seed(did * 97 + j * 41);
      const s5 = seed(did * 113 + j * 43);
      const s6 = seed(did * 131 + j * 47);
      const s7 = seed(did * 149 + j * 53);
      const src = s1 < 0.55 ? "MLS" : "Off Market";
      const pt = DL_PTYPES[Math.floor(s2 * DL_PTYPES.length)];
      const intent = s3 < 0.5 ? "Flip" : s3 < 0.82 ? "Wholesale" : "Portfolio";
      const sAq = Math.max(0, Math.round((u.s?.aq || 0) * scale));
      const sAc = Math.max(0, Math.round((u.s?.ac || 0) * scale));
      const sNg = Math.max(0, Math.round((u.s?.ng || 0) * scale));
      const sOf = Math.max(0, Math.round((u.s?.of || 0) * scale));
      let stg;
      if (j < sAq) stg = "Acquired";
      else if (j < sAq + sAc) stg = "Offer Accepted";
      else if (j < sAq + sAc + sNg) stg = "In Negotiations";
      else if (j < sAq + sAc + sNg + sOf) stg = "Contract Submitted";
      else if (j < sAq + sAc + sNg + sOf + 2) stg = "Offer Terms Sent";
      else if (j < sAq + sAc + sNg + sOf + 4) stg = "Backup";
      else stg = "Initial Contact";
      const price = Math.round((80000 + s4 * 420000) / 1000) * 1000;
      const profitPct = 0.08 + s5 * 0.22;
      const projProfit = Math.round(price * profitPct);
      let comm;
      if (intent === "Flip") {
        comm = s6 < 0.5 ? Math.round(price * 0.005) : Math.round(projProfit * 0.25);
      } else if (intent === "Portfolio") {
        comm = Math.round(projProfit * 0.20);
      } else {
        comm = s6 < 0.5 ? Math.round(projProfit * 0.10) : Math.round(projProfit * 0.25);
      }
      const now = new Date();
      const closeMonth = stg === "Acquired" ? now.getMonth() : stg === "Offer Accepted" ? (s7 < 0.5 ? now.getMonth() : now.getMonth() + 1) : (now.getMonth() + 1 + Math.floor(s7 * 5));
      const closeDay = Math.floor(1 + s5 * 27);
      const closeDate = new Date(now.getFullYear(), closeMonth, closeDay);
      const addr = `${Math.floor(100 + s4 * 9900)} ${DL_STREETS[Math.floor(s2 * DL_STREETS.length)]} ${DL_SUFFIXES[Math.floor(s3 * DL_SUFFIXES.length)]}, ${DL_CITIES[Math.floor(s7 * DL_CITIES.length)]}`;
      const s8 = seed(did * 163 + j * 59);
      const daysInStage = stg === "Acquired" ? Math.floor(s8 * 4) : stg === "Offer Accepted" ? Math.floor(1 + s8 * 10) : Math.floor(1 + s8 * 30);
      const successFee = stg === "Acquired" || stg === "Offer Accepted" ? Math.round(comm * 0.15) : 0;
      const invRng = seed(did * 211 + j * 73);
      const invoiceStatus = stg !== "Acquired" ? "need_to_invoice" : invRng < 0.6 ? "need_to_invoice" : invRng < 0.85 ? "invoiced" : "payment_received";
      const org = orgs.find(o => o.id === u.org);
      deals.push({
        id: did++, user_id: u.id, org_id: u.org, address: addr, source: src,
        intent, stage: stg, price, projected_profit: projProfit, commission: comm,
        expected_close_date: closeDate.toISOString().split("T")[0],
        days_in_stage: daysInStage, property_type: pt,
        success_fee: successFee, invoice_status: invoiceStatus,
        user_name: u.n, org_name: org?.n || "Unknown",
      });
      did++;
    }
  });
  return deals;
}

const fmt$ = (v) => v >= 1000000 ? "$" + (v / 1000000).toFixed(1) + "M" : v >= 1000 ? "$" + (v / 1000).toFixed(0) + "K" : "$" + v;

const INVOICE_STATUSES = [
  { key: "need_to_invoice", label: "Need to Invoice", color: "#DC2626", bg: "#FEF2F2", bc: "#FECACA" },
  { key: "invoiced", label: "Invoiced", color: "#F97316", bg: "#FFF7ED", bc: "#FED7AA" },
  { key: "payment_received", label: "Payment Received", color: "#10B981", bg: "#ECFDF5", bc: "#A7F3D0" },
];

function getStageGroup(stage) {
  for (const sg of STAGE_GROUPS) {
    if (sg.stages.includes(stage)) return sg.key;
  }
  return "qualifying";
}

function getPastDueStatus(deal) {
  if (deal.stage === "Acquired" || !deal.expected_close_date) return null;
  const now = new Date();
  const close = new Date(deal.expected_close_date);
  const diff = Math.floor((now - close) / 86400000);
  if (diff <= 0) return null;
  return diff > 7 ? "red" : "yellow";
}

function worstStatus(statuses) {
  if (statuses.includes("red")) return "red";
  if (statuses.includes("yellow")) return "yellow";
  return null;
}

function getMonthColumns() {
  const now = new Date();
  const cols = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    cols.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      shortLabel: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return cols;
}

export default function DealGrid({ users, orgs, flt }) {
  const [dlSrc, setDlSrc] = useState([]);
  const [dlInt, setDlInt] = useState([]);
  const [invFilter, setInvFilter] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [analytics, setAnalytics] = useState(false);

  const apiBase = useMemo(() => {
    const base = import.meta.env.BASE_URL || "/";
    return base.replace(/\/$/, "").replace(/\/[^/]*$/, "") || "";
  }, []);

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockDeals = useMemo(() => genDeals(users, orgs), [users, orgs]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (dlSrc.length) params.set("source", dlSrc.join(","));
    if (dlInt.length) params.set("intent", dlInt.join(","));
    if (invFilter) params.set("invoice_status", invFilter);
    const url = `${apiBase}/api/deals${params.toString() ? "?" + params.toString() : ""}`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error("API error"); return r.json(); })
      .then(data => { if (!cancelled) { setDeals(Array.isArray(data) && data.length > 0 ? data : mockDeals); setLoading(false); } })
      .catch(() => {
        if (!cancelled) {
          let fallback = mockDeals;
          if (dlSrc.length) fallback = fallback.filter(d => dlSrc.includes(d.source));
          if (dlInt.length) fallback = fallback.filter(d => dlInt.includes(d.intent));
          if (invFilter) fallback = fallback.filter(d => d.invoice_status === invFilter);
          setDeals(fallback);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [apiBase, dlSrc, dlInt, invFilter, mockDeals]);

  const monthCols = useMemo(() => getMonthColumns(), []);

  const fIds = useMemo(() => {
    const ids = new Set();
    let u = [...users];
    if (flt.org) u = u.filter(x => x.org === flt.org);
    if (flt.phase) u = u.filter(x => x.ph === flt.phase);
    if (flt.health) u = u.filter(x => x.health === flt.health);
    u.forEach(x => ids.add(x.id));
    return ids;
  }, [users, flt]);

  const fd = useMemo(() => {
    let d = deals;
    if (fIds.size < users.length) d = d.filter(x => fIds.has(x.user_id));
    return d;
  }, [deals, fIds, users.length]);

  const invSummary = useMemo(() => {
    const summary = {};
    INVOICE_STATUSES.forEach(s => { summary[s.key] = { count: 0, total: 0 }; });
    fd.forEach(d => {
      const st = d.invoice_status || "need_to_invoice";
      if (summary[st]) {
        summary[st].count++;
        summary[st].total += (d.success_fee || 0);
      }
    });
    return summary;
  }, [fd]);

  const gridData = useMemo(() => {
    const grid = {};
    STAGE_GROUPS.forEach(sg => {
      grid[sg.key] = {};
      monthCols.forEach(mc => {
        grid[sg.key][`${mc.year}-${mc.month}`] = { count: 0, revenue: 0 };
      });
    });
    fd.forEach(d => {
      if (!d.expected_close_date) return;
      const dt = new Date(d.expected_close_date);
      const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
      const sg = getStageGroup(d.stage);
      if (grid[sg] && grid[sg][key]) {
        grid[sg][key].count++;
        grid[sg][key].revenue += (d.commission || 0);
      }
    });
    return grid;
  }, [fd, monthCols]);

  const orgGroups = useMemo(() => {
    const groups = {};
    fd.forEach(d => {
      const orgId = d.org_id || 0;
      if (!groups[orgId]) groups[orgId] = {};
      const uid = d.user_id || 0;
      if (!groups[orgId][uid]) groups[orgId][uid] = [];
      groups[orgId][uid].push(d);
    });

    return Object.entries(groups).map(([orgId, aaMap]) => {
      const org = orgs.find(o => o.id === +orgId);
      const orgDeals = Object.values(aaMap).flat();
      const pastDueStatuses = orgDeals.map(getPastDueStatus).filter(Boolean);
      const orgPastDue = worstStatus(pastDueStatuses);

      const aaList = Object.entries(aaMap).map(([uid, uDeals]) => {
        const user = users.find(u => u.id === +uid);
        const aaPastDueStatuses = uDeals.map(getPastDueStatus).filter(Boolean);
        return {
          uid: +uid,
          name: user?.n || uDeals[0]?.user_name || "Unknown",
          deals: uDeals.sort((a, b) => (b.commission || 0) - (a.commission || 0)),
          totalPrice: uDeals.reduce((s, d) => s + (d.price || 0), 0),
          totalComm: uDeals.reduce((s, d) => s + (d.commission || 0), 0),
          dealCount: uDeals.length,
          pastDue: worstStatus(aaPastDueStatuses),
        };
      }).sort((a, b) => b.totalComm - a.totalComm);

      return {
        orgId: +orgId,
        orgName: org?.n || orgDeals[0]?.org_name || "Unknown",
        aaList,
        totalDeals: orgDeals.length,
        totalPrice: orgDeals.reduce((s, d) => s + (d.price || 0), 0),
        totalComm: orgDeals.reduce((s, d) => s + (d.commission || 0), 0),
        pastDue: orgPastDue,
      };
    }).sort((a, b) => b.totalComm - a.totalComm);
  }, [fd, orgs, users]);

  const toggleExpand = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const updateInvoiceStatus = async (dealId, newStatus) => {
    try {
      await fetch(`${apiBase}/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_status: newStatus }),
      });
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, invoice_status: newStatus } : d));
    } catch (e) {}
  };

  const pastDueBg = (status) => {
    if (status === "red") return "#FEF2F2";
    if (status === "yellow") return "#FEFCE8";
    return undefined;
  };

  const pastDueBorder = (status) => {
    if (status === "red") return "2px solid #FECACA";
    if (status === "yellow") return "2px solid #FEF08A";
    return undefined;
  };

  const srcBreak = DL_SOURCES.map(s => ({ n: s, cnt: fd.filter(d => d.source === s).length }));
  const srcTotal = fd.length || 1;
  const ptBreak = DL_PTYPES.map(p => ({ n: p, cnt: fd.filter(d => d.property_type === p).length })).filter(p => p.cnt > 0).sort((a, b) => b.cnt - a.cnt);
  const intBreak = DL_INTENTS.map(i => ({ n: i, cnt: fd.filter(d => d.intent === i).length }));
  const activeFilters = [...dlSrc, ...dlInt];

  const grandTotal = fd.reduce((s, d) => s + (d.price || 0), 0);
  const grandComm = fd.reduce((s, d) => s + (d.commission || 0), 0);
  const isFiltered = flt.org || flt.phase || flt.health || dlSrc.length || dlInt.length || invFilter;

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Deal dashboard</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>
            {isFiltered ? `Showing ${fd.length} deals` : `All ${fd.length} deals`} across {orgGroups.length} companies — {fmt$(grandTotal)} total pipeline · {fmt$(grandComm)} projected commission
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {INVOICE_STATUSES.map(inv => {
          const data = invSummary[inv.key] || { count: 0, total: 0 };
          const isActive = invFilter === inv.key;
          return (
            <div key={inv.key} onClick={() => setInvFilter(isActive ? null : inv.key)} style={{ background: isActive ? inv.bg : "#FFF", border: isActive ? `2px solid ${inv.color}` : `1px solid ${inv.bc}`, borderRadius: 9, padding: "12px 16px", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>{inv.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: inv.color }}>{fmt$(data.total)}</span>
                <span style={{ fontSize: 11, color: "#64748B" }}>{data.count} deals</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "flex", alignItems: "center", marginRight: 4 }}>Source</div>
        {DL_SOURCES.map(s => {
          const active = dlSrc.includes(s);
          const cnt = fd.filter(d => d.source === s).length;
          return <Tip key={s} text={`Filter by ${s} deals (${cnt}). Click to toggle.`}><button onClick={() => setDlSrc(active ? dlSrc.filter(x => x !== s) : [...dlSrc, s])} style={{ padding: "6px 12px", fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#FFF" : "#3B82F6", background: active ? "#3B82F6" : "#EFF6FF", border: active ? "2px solid #2563EB" : "1px solid #BFDBFE", borderRadius: 6, cursor: "pointer", minHeight: 32 }}>{s} ({cnt})</button></Tip>;
        })}
        <div style={{ width: 1, background: "#E2E8F0", margin: "0 6px", height: 20 }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "flex", alignItems: "center", marginRight: 4 }}>Intent</div>
        {DL_INTENTS.map(i => {
          const active = dlInt.includes(i);
          const cnt = fd.filter(d => d.intent === i).length;
          return <Tip key={i} text={`Filter by ${i} intent (${cnt} deals). Click to toggle.`}><button onClick={() => setDlInt(active ? dlInt.filter(x => x !== i) : [...dlInt, i])} style={{ padding: "6px 12px", fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#FFF" : "#8B5CF6", background: active ? "#8B5CF6" : "#F5F3FF", border: active ? "2px solid #7C3AED" : "1px solid #DDD6FE", borderRadius: 6, cursor: "pointer", minHeight: 32 }}>{i} ({cnt})</button></Tip>;
        })}
        {activeFilters.length > 0 && <Tip text="Clear all deal filters"><button onClick={() => { setDlSrc([]); setDlInt([]); }} style={{ padding: "6px 12px", fontSize: 10, fontWeight: 600, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, cursor: "pointer", minHeight: 32 }}>Clear filters</button></Tip>}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748B", fontSize: 13 }}>Loading deals...</div>
      ) : (
        <>
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Pipeline Grid — by Stage Group & Month</div>
              <div style={{ fontSize: 10, color: "#64748B" }}>Current month + 6 months forward</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 800 }}>
                <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${monthCols.length}, 1fr)`, padding: "8px 16px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", gap: "0 4px" }}>
                  <div>Stage Group</div>
                  {monthCols.map(mc => <div key={`${mc.year}-${mc.month}`} style={{ textAlign: "center" }}>{mc.label}</div>)}
                </div>
                {STAGE_GROUPS.map(sg => (
                  <div key={sg.key}>
                    <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${monthCols.length}, 1fr)`, padding: "10px 16px", borderBottom: "1px solid #F1F5F9", background: sg.bg + "60", alignItems: "center", gap: "0 4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: sg.color }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: sg.color }}>{sg.label}</span>
                      </div>
                      {monthCols.map(mc => {
                        const k = `${mc.year}-${mc.month}`;
                        const cell = gridData[sg.key]?.[k] || { count: 0, revenue: 0 };
                        return (
                          <div key={k} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: cell.count > 0 ? sg.color : "#CBD5E1" }}>{cell.count}</div>
                            {sg.showRevenue && <div style={{ fontSize: 10, color: cell.revenue > 0 ? "#10B981" : "#CBD5E1", fontWeight: 600 }}>{cell.revenue > 0 ? fmt$(cell.revenue) : "—"}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${monthCols.length}, 1fr)`, padding: "10px 16px", background: "#F8FAFB", borderTop: "1px solid #E2E8F0", alignItems: "center", gap: "0 4px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1E293B" }}>Total</div>
                  {monthCols.map(mc => {
                    const k = `${mc.year}-${mc.month}`;
                    let totalCount = 0, totalRev = 0;
                    STAGE_GROUPS.forEach(sg => {
                      const cell = gridData[sg.key]?.[k] || { count: 0, revenue: 0 };
                      totalCount += cell.count;
                      totalRev += cell.revenue;
                    });
                    return (
                      <div key={k} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: totalCount > 0 ? "#1E293B" : "#CBD5E1" }}>{totalCount}</div>
                        <div style={{ fontSize: 10, color: totalRev > 0 ? "#10B981" : "#CBD5E1", fontWeight: 700 }}>{totalRev > 0 ? fmt$(totalRev) : "—"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Deals by Company → AA → Deal</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{orgGroups.length} companies · {fd.length} deals · {fmt$(grandComm)} commission</div>
              </div>
            </div>

            {orgGroups.map((org, oi) => (
              <div key={org.orgId}>
                <div
                  onClick={() => toggleExpand(`org-${org.orgId}`)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 100px 100px",
                    padding: "10px 18px", borderBottom: "1px solid #F1F5F9",
                    background: pastDueBg(org.pastDue) || (oi % 2 === 0 ? "#FFF" : "#FAFBFC"),
                    border: pastDueBorder(org.pastDue) || undefined,
                    cursor: "pointer", alignItems: "center", transition: "background 0.15s"
                  }}
                  onMouseEnter={e => { if (!org.pastDue) e.currentTarget.style.background = "#F0F7FF"; }}
                  onMouseLeave={e => { if (!org.pastDue) e.currentTarget.style.background = oi % 2 === 0 ? "#FFF" : "#FAFBFC"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#CBD5E1" }}>{expanded[`org-${org.orgId}`] ? "\u25BC" : "\u25B6"}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{org.orgName}</span>
                    {org.pastDue && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: org.pastDue === "red" ? "#DC2626" : "#EAB308", color: "#FFF", fontWeight: 700 }}>PAST DUE</span>}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textAlign: "center" }}>{org.totalDeals} deals</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", textAlign: "center" }}>{fmt$(org.totalPrice)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textAlign: "right" }}>{fmt$(org.totalComm)}</div>
                </div>

                {expanded[`org-${org.orgId}`] && org.aaList.map((aa, ai) => (
                  <div key={aa.uid}>
                    <div
                      onClick={() => toggleExpand(`aa-${aa.uid}`)}
                      style={{
                        display: "grid", gridTemplateColumns: "1fr 100px 100px 100px",
                        padding: "8px 18px 8px 40px", borderBottom: "1px solid #F1F5F9",
                        background: pastDueBg(aa.pastDue) || (ai % 2 === 0 ? "#FAFBFC" : "#F8FAFB"),
                        cursor: "pointer", alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "#CBD5E1" }}>{expanded[`aa-${aa.uid}`] ? "\u25BC" : "\u25B6"}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0369A1", textDecoration: "underline", textDecorationColor: "#CBD5E1" }}>{aa.name}</span>
                        {aa.pastDue && <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: aa.pastDue === "red" ? "#DC2626" : "#EAB308", color: "#FFF", fontWeight: 700 }}>!</span>}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textAlign: "center" }}>{aa.dealCount}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1E293B", textAlign: "center" }}>{fmt$(aa.totalPrice)}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textAlign: "right" }}>{fmt$(aa.totalComm)}</div>
                    </div>

                    {expanded[`aa-${aa.uid}`] && (
                      <div style={{ background: "#F8FAFB", borderBottom: "1px solid #E2E8F0" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(140px,1fr) 65px 55px 80px 80px 80px 75px 65px 130px", padding: "6px 18px 6px 60px", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", minWidth: 800, gap: "0 4px" }}>
                          <div>Address</div><div>Source</div><div>Intent</div><div>Price</div><div>Commission</div><div>Est. close</div><div>Stage</div><div>Days</div><div>Invoice</div>
                        </div>
                        {aa.deals.map(d => {
                          const stgColor = d.stage === "Acquired" ? "#059669" : d.stage === "Offer Accepted" ? "#10B981" : d.stage === "In Negotiations" ? "#8B5CF6" : d.stage === "Contract Submitted" ? "#F97316" : "#3B82F6";
                          const pastDue = getPastDueStatus(d);
                          const dayColor = (d.days_in_stage || 0) >= 14 ? "#DC2626" : (d.days_in_stage || 0) >= 7 ? "#F97316" : "#10B981";
                          const invSt = d.invoice_status || "need_to_invoice";
                          return (
                            <div key={d.id} style={{
                              display: "grid", gridTemplateColumns: "minmax(140px,1fr) 65px 55px 80px 80px 80px 75px 65px 130px",
                              padding: "6px 18px 6px 60px", borderBottom: "1px solid #F1F5F9", fontSize: 10, alignItems: "center", minWidth: 800, gap: "0 4px",
                              background: pastDue === "red" ? "#FEF2F2" : pastDue === "yellow" ? "#FEFCE8" : undefined,
                            }}>
                              <div style={{ color: "#1E293B", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.address}</div>
                              <div><span style={{ fontSize: 10, padding: "2px 5px", borderRadius: 4, background: d.source === "MLS" ? "#EFF6FF" : "#FFF7ED", color: d.source === "MLS" ? "#3B82F6" : "#F97316", fontWeight: 600 }}>{d.source}</span></div>
                              <div><span style={{ fontSize: 10, padding: "2px 5px", borderRadius: 4, background: d.intent === "Flip" ? "#FFF7ED" : d.intent === "Portfolio" ? "#ECFDF5" : "#F5F3FF", color: d.intent === "Flip" ? "#F97316" : d.intent === "Portfolio" ? "#059669" : "#8B5CF6", fontWeight: 600 }}>{d.intent}</span></div>
                              <div style={{ color: "#1E293B", fontWeight: 700 }}>{fmt$(d.price || 0)}</div>
                              <div style={{ color: "#10B981", fontWeight: 700 }}>{fmt$(d.commission || 0)}</div>
                              <div style={{ color: "#475569", fontSize: 10 }}>{d.expected_close_date ? new Date(d.expected_close_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</div>
                              <div><span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: stgColor + "15", color: stgColor, fontWeight: 600, whiteSpace: "nowrap" }}>{d.stage}</span></div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: dayColor }}>{d.days_in_stage || 0}d</div>
                              <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                                {INVOICE_STATUSES.map((ist, idx) => {
                                  const isChecked = invSt === ist.key || (idx === 0 && invSt === "invoiced") || (idx === 0 && invSt === "payment_received") || (idx === 1 && invSt === "payment_received");
                                  const isActive = invSt === ist.key;
                                  const nextStatus = ist.key;
                                  return (
                                    <Tip key={ist.key} text={`${ist.label}${isActive ? " (current)" : ""}`}>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateInvoiceStatus(d.id, nextStatus); }}
                                        style={{
                                          width: 16, height: 16, borderRadius: 3,
                                          border: `1.5px solid ${isChecked ? ist.color : "#CBD5E1"}`,
                                          background: isChecked ? ist.color + "20" : "#FFF",
                                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 10, color: ist.color, fontWeight: 700, padding: 0,
                                        }}
                                      >
                                        {isChecked ? "\u2713" : ""}
                                      </button>
                                    </Tip>
                                  );
                                })}
                                <span style={{ fontSize: 9, color: INVOICE_STATUSES.find(i => i.key === invSt)?.color || "#64748B", fontWeight: 600, marginLeft: 2, whiteSpace: "nowrap" }}>
                                  {invSt === "need_to_invoice" ? "Need inv." : invSt === "invoiced" ? "Invoiced" : "Paid"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div onClick={() => setAnalytics(!analytics)} style={{ padding: "12px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>Deal analytics</div>
              <span style={{ fontSize: 10, color: "#64748B" }}>{analytics ? "\u25B2" : "\u25BC"} {analytics ? "Collapse" : "Expand"}</span>
            </div>
            {analytics && (
              <div style={{ padding: "0 18px 18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 9, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 8 }}>By source</div>
                    {srcBreak.map(s => {
                      const active = dlSrc.includes(s.n);
                      return (
                        <div key={s.n} onClick={() => setDlSrc(active ? dlSrc.filter(x => x !== s.n) : [...dlSrc, s.n])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, padding: "3px 6px", borderRadius: 5, cursor: "pointer", background: active ? "#EFF6FF" : "transparent", border: active ? "1px solid #BFDBFE" : "1px solid transparent" }}>
                          <span style={{ fontSize: 11, color: "#1E293B", fontWeight: active ? 700 : 500 }}>{s.n}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#3B82F6" : "#1E293B" }}>{s.cnt}</span>
                            <span style={{ fontSize: 10, color: "#64748B" }}>{Math.round(s.cnt / srcTotal * 100)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 9, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#F97316", marginBottom: 8 }}>By property type</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      {ptBreak.map(p => (
                        <div key={p.n} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 4px", background: p.cnt > 0 ? "#FEFCE8" : "transparent", borderRadius: 3 }}>
                          <span style={{ color: "#64748B", fontWeight: 600 }}>{p.n}</span>
                          <span style={{ fontWeight: 700, color: p.cnt > 0 ? "#F97316" : "#CBD5E1" }}>{p.cnt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 9, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8B5CF6", marginBottom: 8 }}>By intent</div>
                    {intBreak.map(i => {
                      const pct = Math.round(i.cnt / srcTotal * 100);
                      const active = dlInt.includes(i.n);
                      return (
                        <div key={i.n} onClick={() => setDlInt(active ? dlInt.filter(x => x !== i.n) : [...dlInt, i.n])} style={{ marginBottom: 8, padding: "4px 6px", borderRadius: 5, cursor: "pointer", background: active ? "#F5F3FF" : "transparent", border: active ? "1px solid #DDD6FE" : "1px solid transparent" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: "#1E293B" }}>{i.n}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: i.n === "Flip" ? "#F97316" : i.n === "Portfolio" ? "#059669" : "#8B5CF6" }}>{i.cnt} <span style={{ fontSize: 10, color: "#64748B", fontWeight: 400 }}>{pct}%</span></span>
                          </div>
                          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3 }}>
                            <div style={{ height: 6, width: pct + "%", background: i.n === "Flip" ? "#F97316" : i.n === "Portfolio" ? "#059669" : "#8B5CF6", borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
