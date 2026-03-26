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
      <span ref={ref} onMouseEnter={enter} onMouseLeave={() => setShow(false)} style={{ cursor: "help", display: "inline" }}>
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
  { key: "sent_offer", label: "Sent Offer Deals", stages: ["Contract Submitted", "In Negotiations"], color: "#F97316", bg: "#FFF7ED", showRevenue: true },
  { key: "offer_accepted", label: "Offer Accepted", stages: ["Offer Accepted"], color: "#10B981", bg: "#ECFDF5", showRevenue: true },
  { key: "acquired", label: "Acquired", stages: ["Acquired"], color: "#059669", bg: "#D1FAE5", showRevenue: true },
];

const DL_SOURCES = ["MLS", "Off Market"];
const DL_INTENTS = ["Flip", "Wholesale", "Portfolio"];
const DL_PTYPES = ["STD", "SPAY", "NOD", "REO", "PRO", "AUC", "TRUS", "TPA", "HUD", "BK", "FORC", "CONS"];
const DL_STREETS = ["Oak","Elm","Maple","Cedar","Pine","Birch","Walnut","Cherry","Ash","Spruce","Willow","Poplar","Magnolia","Cypress","Sycamore","Redwood","Hickory","Juniper","Laurel","Holly","Ivy","Hazel","Aspen","Alder","Beech","Olive","Palm","Peach","Fig","Sage"];
const DL_SUFFIXES = ["St","Ave","Dr","Ln","Ct","Blvd","Way","Pl","Rd","Cir"];
const DL_CITIES = ["Phoenix","Scottsdale","Mesa","Tempe","Chandler","Gilbert","Glendale","Peoria","Surprise","Goodyear","Avondale","Buckeye","Tolleson","Litchfield Park"];

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

const INVOICE_ORDER = ["need_to_invoice", "invoiced", "payment_received"];

function getStageGroup(stage) {
  for (const sg of STAGE_GROUPS) {
    if (sg.stages.includes(stage)) return sg.key;
  }
  return "sent_offer";
}

function getPastDueStatus(deal) {
  if (deal.stage === "Acquired" || !deal.expected_close_date) return null;
  const now = new Date();
  const close = new Date(deal.expected_close_date);
  const diff = Math.floor((now - close) / 86400000);
  if (diff <= 0) return null;
  return diff >= 7 ? "red" : "yellow";
}

function getDaysToClose(deal) {
  if (!deal.expected_close_date) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const close = new Date(deal.expected_close_date);
  return Math.round((close - now) / 86400000);
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
      label: d.toLocaleDateString("en-US", { month: "short" }),
      isCurrent: i === 0,
    });
  }
  return cols;
}

export default function DealGrid({ users, orgs, flt }) {
  const [dlSrc, setDlSrc] = useState([]);
  const [dlInt, setDlInt] = useState([]);
  const [invFilter, setInvFilter] = useState(null);
  const [expanded, setExpanded] = useState({});

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
      .then(data => { if (!cancelled) { setDeals(Array.isArray(data) ? data : []); setLoading(false); } })
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
    const now = new Date();
    const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    const curMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    STAGE_GROUPS.forEach(sg => {
      grid[sg.key] = {};
      monthCols.forEach(mc => {
        const k = `${mc.year}-${mc.month}`;
        grid[sg.key][k] = { count: 0, revenue: 0 };
        if (mc.isCurrent) {
          grid[sg.key][k + "-collected"] = { count: 0, revenue: 0 };
          grid[sg.key][k + "-forecast"] = { count: 0, revenue: 0 };
        }
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
        if (key === curMonthKey) {
          const isCollected = d.stage === "Acquired" && (
            (d.actual_close_date && new Date(d.actual_close_date).getTime() <= todayMs) ||
            d.invoice_status === "payment_received"
          );
          const subKey = isCollected ? key + "-collected" : key + "-forecast";
          grid[sg][subKey].count++;
          grid[sg][subKey].revenue += (d.commission || 0);
        }
      }
    });
    return grid;
  }, [fd, monthCols]);

  const acquiredThisMonth = useMemo(() => {
    const now = new Date();
    const curKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    return gridData["acquired"]?.[curKey]?.count || 0;
  }, [gridData]);

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

  const advanceInvoice = (deal) => {
    const cur = deal.invoice_status || "need_to_invoice";
    const idx = INVOICE_ORDER.indexOf(cur);
    if (idx < INVOICE_ORDER.length - 1) {
      updateInvoiceStatus(deal.id, INVOICE_ORDER[idx + 1]);
    }
  };

  const pastDueBg = (status) => {
    if (status === "red") return "#FEF2F2";
    if (status === "yellow") return "#FEFCE8";
    return undefined;
  };

  const srcCounts = useMemo(() => {
    const counts = {};
    DL_SOURCES.forEach(s => { counts[s] = 0; });
    fd.forEach(d => { if (counts[d.source] !== undefined) counts[d.source]++; });
    return counts;
  }, [fd]);

  const intCounts = useMemo(() => {
    const counts = {};
    DL_INTENTS.forEach(i => { counts[i] = 0; });
    fd.forEach(d => { if (counts[d.intent] !== undefined) counts[d.intent]++; });
    return counts;
  }, [fd]);

  return (
    <div>
      {/* === TOP BAR: Filters (left) + Invoice Status (right) === */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
          {DL_SOURCES.map(s => {
            const active = dlSrc.includes(s);
            return (
              <button key={s} onClick={() => setDlSrc(active ? dlSrc.filter(x => x !== s) : [...dlSrc, s])} style={{
                padding: "5px 12px", fontSize: 11, fontWeight: active ? 700 : 500, borderRadius: 20,
                color: active ? "#FFF" : "#3B82F6", background: active ? "#3B82F6" : "#EFF6FF",
                border: active ? "2px solid #2563EB" : "1px solid #BFDBFE", cursor: "pointer",
              }}>{s} ({srcCounts[s]})</button>
            );
          })}
          <div style={{ width: 1, height: 20, background: "#E2E8F0", margin: "0 4px" }} />
          {DL_INTENTS.map(i => {
            const active = dlInt.includes(i);
            return (
              <button key={i} onClick={() => setDlInt(active ? dlInt.filter(x => x !== i) : [...dlInt, i])} style={{
                padding: "5px 12px", fontSize: 11, fontWeight: active ? 700 : 500, borderRadius: 20,
                color: active ? "#FFF" : "#8B5CF6", background: active ? "#8B5CF6" : "#F5F3FF",
                border: active ? "2px solid #7C3AED" : "1px solid #DDD6FE", cursor: "pointer",
              }}>{i} ({intCounts[i]})</button>
            );
          })}
          {(dlSrc.length > 0 || dlInt.length > 0) && (
            <button onClick={() => { setDlSrc([]); setDlInt([]); }} style={{
              padding: "5px 10px", fontSize: 10, fontWeight: 600, color: "#DC2626", background: "#FEF2F2",
              border: "1px solid #FECACA", borderRadius: 20, cursor: "pointer", marginLeft: 2,
            }}>Clear</button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {INVOICE_STATUSES.map(inv => {
            const data = invSummary[inv.key] || { count: 0, total: 0 };
            const isActive = invFilter === inv.key;
            return (
              <div key={inv.key} onClick={() => setInvFilter(isActive ? null : inv.key)} style={{
                background: isActive ? inv.bg : "#FFF", border: isActive ? `2px solid ${inv.color}` : `1px solid #E2E8F0`,
                borderRadius: 8, padding: "6px 14px", cursor: "pointer", transition: "all 0.15s", minWidth: 100, textAlign: "center",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.3 }}>{inv.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: inv.color }}>{fmt$(data.total)}</span>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{data.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748B", fontSize: 13 }}>Loading deals...</div>
      ) : (
        <>
          {/* === PIPELINE GRID === */}
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    <th rowSpan={2} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", width: 170, verticalAlign: "bottom" }}>Stage Group</th>
                    {monthCols.map(mc => (
                      mc.isCurrent ? (
                        <th key={`${mc.year}-${mc.month}`} colSpan={3} style={{ padding: "6px 4px 2px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", borderBottom: "none", background: "#EFF6FF", borderLeft: "2px solid #3B82F6", borderRight: "2px solid #3B82F6" }}>
                          {mc.label}
                          <div style={{ fontSize: 18, fontWeight: 900, color: "#059669", marginTop: 2 }}>{acquiredThisMonth} <span style={{ fontSize: 9, fontWeight: 600, color: "#64748B" }}>closed</span></div>
                        </th>
                      ) : (
                        <th key={`${mc.year}-${mc.month}`} rowSpan={2} style={{ padding: "10px 8px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", verticalAlign: "bottom" }}>
                          {mc.label}
                        </th>
                      )
                    ))}
                  </tr>
                  <tr style={{ background: "#F8FAFC" }}>
                    <th style={{ padding: "4px 6px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "#059669", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", background: "#ECFDF5", borderLeft: "2px solid #3B82F6" }}>Collected</th>
                    <th style={{ padding: "4px 6px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", background: "#FFFBEB" }}>Forecast</th>
                    <th style={{ padding: "4px 6px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", background: "#EFF6FF", borderRight: "2px solid #3B82F6" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {STAGE_GROUPS.map(sg => (
                    <tr key={sg.key}>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", borderLeft: `4px solid ${sg.color}`, background: sg.bg + "40" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: sg.color }}>{sg.label}</span>
                      </td>
                      {monthCols.map(mc => {
                        const k = `${mc.year}-${mc.month}`;
                        const cell = gridData[sg.key]?.[k] || { count: 0, revenue: 0 };
                        if (mc.isCurrent) {
                          const collected = gridData[sg.key]?.[k + "-collected"] || { count: 0, revenue: 0 };
                          const forecast = gridData[sg.key]?.[k + "-forecast"] || { count: 0, revenue: 0 };
                          return [
                            <td key={k + "-c"} style={{ padding: "8px 6px", textAlign: "center", borderBottom: "1px solid #F1F5F9", background: "#F0FDF4", borderLeft: "2px solid #3B82F6" }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: collected.count > 0 ? "#059669" : "#CBD5E1" }}>{collected.count}</div>
                              {sg.showRevenue && <div style={{ fontSize: 10, color: collected.revenue > 0 ? "#059669" : "#CBD5E1", fontWeight: 600, marginTop: 1 }}>{collected.revenue > 0 ? fmt$(collected.revenue) : "—"}</div>}
                            </td>,
                            <td key={k + "-f"} style={{ padding: "8px 6px", textAlign: "center", borderBottom: "1px solid #F1F5F9", background: "#FFFBEB" }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: forecast.count > 0 ? "#D97706" : "#CBD5E1" }}>{forecast.count}</div>
                              {sg.showRevenue && <div style={{ fontSize: 10, color: forecast.revenue > 0 ? "#D97706" : "#CBD5E1", fontWeight: 600, marginTop: 1 }}>{forecast.revenue > 0 ? fmt$(forecast.revenue) : "—"}</div>}
                            </td>,
                            <td key={k + "-t"} style={{ padding: "8px 6px", textAlign: "center", borderBottom: "1px solid #F1F5F9", background: "#FAFCFF", borderRight: "2px solid #3B82F6" }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: cell.count > 0 ? sg.color : "#CBD5E1" }}>{cell.count}</div>
                              {sg.showRevenue && <div style={{ fontSize: 10, color: cell.revenue > 0 ? "#10B981" : "#CBD5E1", fontWeight: 600, marginTop: 1 }}>{cell.revenue > 0 ? fmt$(cell.revenue) : "—"}</div>}
                            </td>,
                          ];
                        }
                        return (
                          <td key={k} style={{ padding: "10px 8px", textAlign: "center", borderBottom: "1px solid #F1F5F9" }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: cell.count > 0 ? sg.color : "#CBD5E1" }}>{cell.count}</div>
                            {sg.showRevenue && <div style={{ fontSize: 10, color: cell.revenue > 0 ? "#10B981" : "#CBD5E1", fontWeight: 600, marginTop: 1 }}>{cell.revenue > 0 ? fmt$(cell.revenue) : "—"}</div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ background: "#F8FAFC" }}>
                    <td style={{ padding: "10px 16px", borderTop: "2px solid #E2E8F0", fontWeight: 800, fontSize: 12, color: "#1E293B" }}>Total</td>
                    {monthCols.map(mc => {
                      const k = `${mc.year}-${mc.month}`;
                      let totalCount = 0, totalRev = 0;
                      STAGE_GROUPS.forEach(sg => {
                        const cell = gridData[sg.key]?.[k] || { count: 0, revenue: 0 };
                        totalCount += cell.count;
                        totalRev += cell.revenue;
                      });
                      if (mc.isCurrent) {
                        let colCount = 0, colRev = 0, forCount = 0, forRev = 0;
                        STAGE_GROUPS.forEach(sg => {
                          const cc = gridData[sg.key]?.[k + "-collected"] || { count: 0, revenue: 0 };
                          const fc = gridData[sg.key]?.[k + "-forecast"] || { count: 0, revenue: 0 };
                          colCount += cc.count; colRev += cc.revenue;
                          forCount += fc.count; forRev += fc.revenue;
                        });
                        return [
                          <td key={k + "-c"} style={{ padding: "10px 6px", textAlign: "center", borderTop: "2px solid #E2E8F0", background: "#F0FDF4", borderLeft: "2px solid #3B82F6" }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: colCount > 0 ? "#059669" : "#CBD5E1" }}>{colCount}</div>
                            <div style={{ fontSize: 10, color: colRev > 0 ? "#059669" : "#CBD5E1", fontWeight: 700, marginTop: 1 }}>{colRev > 0 ? fmt$(colRev) : "—"}</div>
                          </td>,
                          <td key={k + "-f"} style={{ padding: "10px 6px", textAlign: "center", borderTop: "2px solid #E2E8F0", background: "#FFFBEB" }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: forCount > 0 ? "#D97706" : "#CBD5E1" }}>{forCount}</div>
                            <div style={{ fontSize: 10, color: forRev > 0 ? "#D97706" : "#CBD5E1", fontWeight: 700, marginTop: 1 }}>{forRev > 0 ? fmt$(forRev) : "—"}</div>
                          </td>,
                          <td key={k + "-t"} style={{ padding: "10px 6px", textAlign: "center", borderTop: "2px solid #E2E8F0", background: "#FAFCFF", borderRight: "2px solid #3B82F6" }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: totalCount > 0 ? "#1E293B" : "#CBD5E1" }}>{totalCount}</div>
                            <div style={{ fontSize: 10, color: totalRev > 0 ? "#10B981" : "#CBD5E1", fontWeight: 700, marginTop: 1 }}>{totalRev > 0 ? fmt$(totalRev) : "—"}</div>
                          </td>,
                        ];
                      }
                      return (
                        <td key={k} style={{ padding: "10px 8px", textAlign: "center", borderTop: "2px solid #E2E8F0" }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: totalCount > 0 ? "#1E293B" : "#CBD5E1" }}>{totalCount}</div>
                          <div style={{ fontSize: 10, color: totalRev > 0 ? "#10B981" : "#CBD5E1", fontWeight: 700, marginTop: 1 }}>{totalRev > 0 ? fmt$(totalRev) : "—"}</div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* === COMPANY → AA → DEAL DRILL-DOWN === */}
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>Company → AA → Deal</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{orgGroups.length} companies · {fd.length} deals</div>
            </div>

            {orgGroups.map((org, oi) => (
              <div key={org.orgId}>
                {/* Company row */}
                <div
                  onClick={() => toggleExpand(`org-${org.orgId}`)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 90px 100px 100px",
                    padding: "10px 18px", borderBottom: "1px solid #F1F5F9",
                    background: pastDueBg(org.pastDue) || (oi % 2 === 0 ? "#FFF" : "#FAFBFC"),
                    cursor: "pointer", alignItems: "center", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!org.pastDue) e.currentTarget.style.background = "#F0F7FF"; }}
                  onMouseLeave={e => { if (!org.pastDue) e.currentTarget.style.background = pastDueBg(org.pastDue) || (oi % 2 === 0 ? "#FFF" : "#FAFBFC"); }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#94A3B8", width: 12 }}>{expanded[`org-${org.orgId}`] ? "\u25BC" : "\u25B6"}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{org.orgName}</span>
                    {org.pastDue && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: org.pastDue === "red" ? "#DC2626" : "#EAB308", color: "#FFF", fontWeight: 700 }}>PAST DUE</span>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textAlign: "center" }}>{org.totalDeals} deals</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1E293B", textAlign: "center" }}>{fmt$(org.totalPrice)}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textAlign: "right" }}>{fmt$(org.totalComm)}</div>
                </div>

                {/* AA rows */}
                {expanded[`org-${org.orgId}`] && org.aaList.map((aa, ai) => (
                  <div key={aa.uid}>
                    <div
                      onClick={() => toggleExpand(`aa-${aa.uid}`)}
                      style={{
                        display: "grid", gridTemplateColumns: "1fr 90px 100px 100px",
                        padding: "8px 18px 8px 40px", borderBottom: "1px solid #F1F5F9",
                        background: pastDueBg(aa.pastDue) || (ai % 2 === 0 ? "#FAFBFC" : "#F8FAFB"),
                        cursor: "pointer", alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "#94A3B8", width: 12 }}>{expanded[`aa-${aa.uid}`] ? "\u25BC" : "\u25B6"}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0369A1" }}>{aa.name}</span>
                        {aa.pastDue && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: aa.pastDue === "red" ? "#DC2626" : "#EAB308", color: "#FFF", fontWeight: 700 }}>PAST DUE</span>}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textAlign: "center" }}>{aa.dealCount}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1E293B", textAlign: "center" }}>{fmt$(aa.totalPrice)}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textAlign: "right" }}>{fmt$(aa.totalComm)}</div>
                    </div>

                    {/* Deal rows */}
                    {expanded[`aa-${aa.uid}`] && (
                      <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                        {aa.deals.map(d => {
                          const pastDue = getPastDueStatus(d);
                          const daysToClose = getDaysToClose(d);
                          const invSt = d.invoice_status || "need_to_invoice";
                          const invIdx = INVOICE_ORDER.indexOf(invSt);
                          return (
                            <div key={d.id} style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 60px",
                              borderBottom: "1px solid #F1F5F9", fontSize: 11,
                              background: pastDue === "red" ? "#FEF2F2" : pastDue === "yellow" ? "#FEFCE8" : undefined,
                            }}>
                              {/* Thumbnail */}
                              <div style={{ width: 36, height: 36, borderRadius: 6, background: "#E2E8F0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {d.thumbnail_url ? (
                                  <img src={d.thumbnail_url} alt="" style={{ width: 36, height: 36, objectFit: "cover" }} />
                                ) : (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /></svg>
                                )}
                              </div>

                              {/* Address */}
                              <div style={{ flex: "1 1 140px", minWidth: 0 }}>
                                <div style={{ fontWeight: 600, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.address}</div>
                              </div>

                              {/* Source badge */}
                              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: d.source === "MLS" ? "#EFF6FF" : "#FFF7ED", color: d.source === "MLS" ? "#3B82F6" : "#F97316", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{d.source}</span>

                              {/* Intent badge */}
                              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: d.intent === "Flip" ? "#FFF7ED" : d.intent === "Portfolio" ? "#ECFDF5" : "#F5F3FF", color: d.intent === "Flip" ? "#F97316" : d.intent === "Portfolio" ? "#059669" : "#8B5CF6", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{d.intent}</span>

                              {/* Price */}
                              <div style={{ width: 65, textAlign: "right", fontWeight: 700, color: "#1E293B", flexShrink: 0 }}>{fmt$(d.price || 0)}</div>

                              {/* Expected Revenue (commission) */}
                              <div style={{ width: 65, textAlign: "right", fontWeight: 700, color: "#10B981", flexShrink: 0 }}>{fmt$(d.commission || 0)}</div>

                              {/* Expected Close Date */}
                              <div style={{ width: 60, textAlign: "center", color: "#475569", fontSize: 10, flexShrink: 0 }}>{d.expected_close_date ? new Date(d.expected_close_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</div>

                              {/* Days to Close */}
                              <div style={{ width: 50, textAlign: "center", flexShrink: 0 }}>
                                {daysToClose !== null ? (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: daysToClose < 0 ? "#DC2626" : daysToClose <= 7 ? "#F97316" : "#10B981" }}>
                                    {daysToClose}d
                                  </span>
                                ) : "—"}
                              </div>

                              {/* Success Fee */}
                              <div style={{ width: 55, textAlign: "right", color: "#8B5CF6", fontWeight: 600, fontSize: 10, flexShrink: 0 }}>{d.success_fee ? fmt$(d.success_fee) : "—"}</div>

                              {/* Invoice Status Stepper */}
                              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                {INVOICE_STATUSES.map((ist, idx) => {
                                  const isReached = idx <= invIdx;
                                  const isCurrent = idx === invIdx;
                                  return (
                                    <Tip key={ist.key} text={`${ist.label}${isCurrent ? " (current)" : ""}. Click to set.`}>
                                      <button
                                        onClick={() => updateInvoiceStatus(d.id, ist.key)}
                                        style={{
                                          width: 18, height: 18, borderRadius: "50%",
                                          border: `2px solid ${isReached ? ist.color : "#CBD5E1"}`,
                                          background: isReached ? ist.color : "#FFF",
                                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 10, color: "#FFF", fontWeight: 700, padding: 0, transition: "all 0.15s",
                                        }}
                                      >
                                        {isReached ? "\u2713" : ""}
                                      </button>
                                    </Tip>
                                  );
                                })}
                                {invIdx < INVOICE_ORDER.length - 1 && (
                                  <Tip text={`Advance to ${INVOICE_STATUSES[invIdx + 1]?.label}`}>
                                    <button onClick={() => advanceInvoice(d)} style={{
                                      fontSize: 9, padding: "2px 6px", borderRadius: 4, border: "1px solid #CBD5E1",
                                      background: "#F8FAFC", color: "#64748B", cursor: "pointer", fontWeight: 600, marginLeft: 2,
                                    }}>&rarr;</button>
                                  </Tip>
                                )}
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
        </>
      )}
    </div>
  );
}
