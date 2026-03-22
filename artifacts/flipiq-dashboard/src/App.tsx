// @ts-nocheck
import { useState, useMemo } from "react";

const O = [
  { id: 1, n: "Coko Homes", am: "Gregory Patterson" },
  { id: 2, n: "Hegemark", am: "Jeffrey Kuo" },
  { id: 3, n: "TD Realty", am: "Matt Carmean" },
  { id: 4, n: "STJ Investments", am: "Andruw Tafolla" },
  { id: 5, n: "Fair Close", am: "Tony Fletcher" },
];

const V = {
  nav: ["Navigation", "3-5m"],
  outreach: ["Outreach", "4-6m"],
  property: ["Property Actions", "3-4m"],
  offer: ["Offer Process", "4-5m"],
  comps: ["Comps Matrix", "60s"],
  ia: ["Investment Analysis", "90s"],
  campaigns: ["Campaigns", "60s"],
  priority: ["Priority Mgmt", "60s"],
  agentprofile: ["Agent Profile", "90s"],
};

const C = [
  { n: "Today's plan", ev: ["iQ Check-In", "Report blockers", "Open Deal Review", "Review Critical Calls", "No Props in priorities", "Review High Priority", "Review Med Priority", "Review Low Priority", "Process New Deals", "Open Daily Outreach", "Call from Outreach", "Open My Active Deals"] },
  { n: "Find deals", ev: ["Open MLS Hot Deals", "Filter Hot Deals", "Open MLS Search", "Apply MLS filters", "Save a filter", "Open Agent Search", "Search agents", "Open Agent Profile", "Open Campaigns", "Select campaign", "Send campaign"] },
  { n: "Communication", ev: ["Call agent", "Text agent", "Email agent", "Text VM", "AI Connect", "Bulk Call", "Bulk Text", "Bulk Email", "Bulk Text VM", "Bulk AI Connect"] },
  { n: "Property actions", ev: ["Add Note", "Tax Data", "Activity history", "Reminder", "AI Report", "Check-In", "Offer Status", "Priority", "Add Property", "To Do", "Favorites", "Agent Deals", "Follow-Up"] },
  { n: "Analysis", ev: ["PIQ Detail", "Comps Map", "Comps Matrix", "Comps List", "Investment Analysis"] },
  { n: "Offers", ev: ["Offer Terms", "Submit Contract", "Update Negotiation", "Offer vs goal"] },
  { n: "Tools", ev: ["My Stats", "DispoPro", "Quick Links", "Login", "Script Practice", "Post-call", "EOD Stats"] },
];

const HL = ["Plan", "Find", "Comms", "Prop", "Analysis", "Offers", "Tools"];
const PN = { 1: "Onboarding", 2: "Activation", 3: "Performance" };
const PC = { 1: "#3B82F6", 2: "#D97706", 3: "#10B981" };
const HC = { green: "#10B981", yellow: "#D97706", orange: "#EA580C", red: "#DC2626" };
const HBG = { green: "#ECFDF5", yellow: "#FEF9C3", orange: "#FFF7ED", red: "#FEF2F2" };
const HMC = ["#DC2626", "#EA580C", "#D97706", "#10B981"];
const HMBG = ["#FEF2F2", "#FFF7ED", "#FEF9C3", "#ECFDF5"];
const PL = { 1: "Critical", 2: "High", 3: "Medium", 4: "Low" };
const PLC = { 1: "#DC2626", 2: "#EA580C", 3: "#D97706", 4: "#94A3B8" };
const SL = ["Missing", "Gap", "Cooling", "Active"];

const vc = (v, g) => {
  if (g <= 0) return "#64748B";
  const p = v / g;
  return p >= 0.8 ? "#10B981" : p >= 0.5 ? "#D97706" : "#DC2626";
};

function g3(h, ci, ei) {
  const s = (ci * 13 + ei * 7) % 100;
  if (h === "red") return { first: null, count: 0, last: null, st: 0 };
  if (h === "orange") {
    if (s < 50) return { first: null, count: 0, last: null, st: 0 };
    return { first: "Mar " + (21 - (s % 12)), count: Math.floor(s / 15), last: s < 75 ? "Mar " + (21 - (s % 8)) : "Mar " + (20 - (s % 4)), st: s < 75 ? 1 : 2 };
  }
  if (h === "yellow") {
    if (s < 20) return { first: null, count: 0, last: null, st: 0 };
    if (s < 40) return { first: "Mar " + (21 - (s % 14)), count: Math.floor(s / 12), last: "Mar " + (21 - (s % 7)), st: 1 };
    if (s < 70) return { first: "Mar " + (21 - (s % 14)), count: Math.floor(s / 5), last: "Mar " + (21 - (s % 4)), st: 2 };
    return { first: "Mar " + (21 - (s % 14)), count: (s / 3 + 5) | 0, last: "Mar 21", st: 3 };
  }
  if (s < 5) return { first: "Mar " + (21 - (s % 12)), count: (s / 2 + 2) | 0, last: "Mar " + (21 - (s % 3)), st: 2 };
  return { first: "Mar " + (21 - (s % 14)), count: (s / 2 + 10) | 0, last: "Mar " + (21 - (s % 3)), st: 3 };
}

const UR = [
  { id: 14, n: "Johnny Catala", org: 3, ph: 1, day: 3, health: "red", ps: 1, gaps: ["NEVER LOGGED IN"], agenda: "CRITICAL: Day 3, NEVER logged in.", vid: "nav", ec: 2, s: { tx: 0, em: 0, ca: 0, cc: 0, nr: 0, up: 0, op: 0, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 0, piq: 0, comp: 0, ia: 0, off: 0, ag: 0, ck: false, mls: 0, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 15, n: "Daniel Worby", org: 3, ph: 1, day: 3, health: "red", ps: 1, gaps: ["2 days inactive"], agenda: "Day 3, disappeared.", vid: "nav", ec: 1, s: { tx: 1, em: 0, ca: 1, cc: 1, nr: 0, up: 0, op: 2, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 12, piq: 0, comp: 0, ia: 0, off: 0, ag: 5, ck: false, mls: 2, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 11, n: "Roman Bracamonte", org: 2, ph: 1, day: 6, health: "red", ps: 1, gaps: ["3 days inactive"], agenda: "ESCALATE to AM.", vid: "outreach", ec: 3, s: { tx: 3, em: 2, ca: 5, cc: 3, nr: 1, up: 0, op: 8, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 45, piq: 5, comp: 0, ia: 0, off: 0, ag: 15, ck: false, mls: 6, dm: 0, cold: 2, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 5, n: "Jesus Valdez", org: 1, ph: 1, day: 4, health: "red", ps: 1, gaps: ["Zero calls"], agenda: "Day 4, zero calls.", vid: "nav", ec: 2, s: { tx: 2, em: 0, ca: 0, cc: 0, nr: 0, up: 0, op: 1, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 8, piq: 0, comp: 0, ia: 0, off: 0, ag: 0, ck: false, mls: 1, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 21, n: "Trevor Kelly", org: 5, ph: 3, day: 75, health: "orange", ps: 2, gaps: ["3 days offline"], agenda: "75-day vet, 3 days off.", vid: null, ec: 1, s: { tx: 180, em: 95, ca: 220, cc: 165, nr: 15, up: 8, op: 120, re: 45, of: 42, oT: 30, oC: 12, ng: 8, ac: 3, aq: 1, mn: 4800, piq: 400, comp: 350, ia: 280, off: 320, ag: 600, ck: false, mls: 80, dm: 15, cold: 20, ref: 5, pH: 12, pW: 8 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 4, n: "Duk Lim", org: 1, ph: 1, day: 5, health: "orange", ps: 2, gaps: ["No micro-skills"], agenda: "Day 5, 3 calls.", vid: "property", ec: 1, s: { tx: 5, em: 1, ca: 3, cc: 2, nr: 1, up: 0, op: 4, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 35, piq: 5, comp: 0, ia: 0, off: 0, ag: 10, ck: true, mls: 4, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 2, em: 0, ca: 1, of: 0, op: 2 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 16, n: "Brooke Stiner", org: 3, ph: 1, day: 3, health: "orange", ps: 2, gaps: ["Micro-skills incomplete"], agenda: "Day 3.", vid: "property", ec: 0, s: { tx: 3, em: 0, ca: 2, cc: 1, nr: 0, up: 0, op: 3, re: 0, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 22, piq: 0, comp: 0, ia: 0, off: 0, ag: 8, ck: true, mls: 3, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 1, em: 0, ca: 1, of: 0, op: 1 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 19, n: "Isaac Haro", org: 4, ph: 1, day: 7, health: "yellow", ps: 2, gaps: ["No offers"], agenda: "Day 7 graduation.", vid: "offer", ec: 0, s: { tx: 8, em: 3, ca: 6, cc: 4, nr: 2, up: 0, op: 10, re: 1, of: 0, oT: 0, oC: 0, ng: 0, ac: 0, aq: 0, mn: 120, piq: 15, comp: 0, ia: 0, off: 0, ag: 30, ck: true, mls: 8, dm: 1, cold: 1, ref: 0, pH: 1, pW: 0 }, y: { tx: 2, em: 1, ca: 2, of: 0, op: 3 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 3, n: "Chris Dragich", org: 1, ph: 2, day: 14, health: "yellow", ps: 3, gaps: ["Comps never opened"], agenda: "1 offer without comps.", vid: "comps", ec: 1, s: { tx: 45, em: 20, ca: 15, cc: 10, nr: 5, up: 2, op: 30, re: 8, of: 1, oT: 1, oC: 0, ng: 0, ac: 0, aq: 0, mn: 680, piq: 60, comp: 0, ia: 0, off: 15, ag: 120, ck: true, mls: 25, dm: 3, cold: 2, ref: 0, pH: 3, pW: 2 }, y: { tx: 5, em: 2, ca: 3, of: 0, op: 4 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 13, n: "Juan Torres", org: 3, ph: 2, day: 10, health: "yellow", ps: 3, gaps: ["Low calls"], agenda: "8 calls vs 50.", vid: "ia", ec: 0, s: { tx: 25, em: 12, ca: 8, cc: 5, nr: 3, up: 1, op: 18, re: 3, of: 1, oT: 1, oC: 0, ng: 0, ac: 0, aq: 0, mn: 420, piq: 35, comp: 20, ia: 0, off: 10, ag: 80, ck: true, mls: 15, dm: 2, cold: 1, ref: 0, pH: 2, pW: 1 }, y: { tx: 3, em: 1, ca: 2, of: 0, op: 2 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 10, n: "Maxwell Irungu", org: 2, ph: 2, day: 12, health: "yellow", ps: 3, gaps: ["Comps unused"], agenda: "1 offer without comps.", vid: "comps", ec: 1, s: { tx: 30, em: 15, ca: 10, cc: 7, nr: 4, up: 1, op: 22, re: 5, of: 1, oT: 1, oC: 0, ng: 0, ac: 0, aq: 0, mn: 540, piq: 45, comp: 0, ia: 10, off: 12, ag: 100, ck: true, mls: 18, dm: 2, cold: 2, ref: 0, pH: 2, pW: 2 }, y: { tx: 4, em: 2, ca: 3, of: 1, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 2, n: "Jared Lynch", org: 1, ph: 3, day: 38, health: "yellow", ps: 3, gaps: ["Comps unused 8d"], agenda: "1 deal. Comps cold.", vid: "priority", ec: 1, s: { tx: 120, em: 65, ca: 22, cc: 16, nr: 12, up: 5, op: 85, re: 30, of: 28, oT: 20, oC: 8, ng: 4, ac: 2, aq: 1, mn: 3200, piq: 280, comp: 180, ia: 150, off: 200, ag: 420, ck: true, mls: 60, dm: 10, cold: 10, ref: 5, pH: 8, pW: 5 }, y: { tx: 8, em: 4, ca: 5, of: 2, op: 6 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 7, n: "Shaun Alan", org: 1, ph: 2, day: 18, health: "yellow", ps: 3, gaps: ["Notes empty"], agenda: "2 offers no deals.", vid: "property", ec: 0, s: { tx: 40, em: 22, ca: 18, cc: 12, nr: 6, up: 2, op: 28, re: 6, of: 2, oT: 2, oC: 0, ng: 0, ac: 0, aq: 0, mn: 780, piq: 65, comp: 40, ia: 20, off: 25, ag: 140, ck: true, mls: 22, dm: 3, cold: 3, ref: 0, pH: 3, pW: 2 }, y: { tx: 4, em: 3, ca: 4, of: 1, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 6, n: "Rod Vianna", org: 1, ph: 3, day: 26, health: "yellow", ps: 3, gaps: ["Campaigns cold 12d"], agenda: "Campaigns cold.", vid: "campaigns", ec: 1, s: { tx: 90, em: 48, ca: 28, cc: 20, nr: 10, up: 4, op: 65, re: 22, of: 18, oT: 12, oC: 6, ng: 3, ac: 1, aq: 1, mn: 2400, piq: 200, comp: 140, ia: 120, off: 160, ag: 350, ck: true, mls: 45, dm: 8, cold: 8, ref: 4, pH: 6, pW: 4 }, y: { tx: 6, em: 3, ca: 4, of: 1, op: 5 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 12, n: "Elizabeth Puga", org: 2, ph: 2, day: 15, health: "yellow", ps: 3, gaps: ["Agent Profile unused"], agenda: "Surface outreach.", vid: "agentprofile", ec: 0, s: { tx: 35, em: 18, ca: 12, cc: 8, nr: 5, up: 2, op: 25, re: 4, of: 2, oT: 2, oC: 0, ng: 0, ac: 0, aq: 0, mn: 620, piq: 50, comp: 35, ia: 25, off: 18, ag: 110, ck: true, mls: 20, dm: 3, cold: 2, ref: 0, pH: 3, pW: 1 }, y: { tx: 4, em: 2, ca: 3, of: 1, op: 4 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 18, n: "Lauren Robles", org: 4, ph: 2, day: 16, health: "yellow", ps: 3, gaps: ["IA once"], agenda: "1 offer.", vid: "ia", ec: 0, s: { tx: 38, em: 20, ca: 14, cc: 9, nr: 5, up: 3, op: 24, re: 5, of: 1, oT: 1, oC: 0, ng: 0, ac: 0, aq: 0, mn: 700, piq: 55, comp: 40, ia: 8, off: 15, ag: 120, ck: true, mls: 19, dm: 3, cold: 2, ref: 0, pH: 2, pW: 2 }, y: { tx: 5, em: 2, ca: 3, of: 0, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 1, n: "Miguel Rivera", org: 1, ph: 3, day: 45, health: "green", ps: 4, gaps: [], agenda: "2 deals.", vid: null, ec: 0, s: { tx: 160, em: 85, ca: 38, cc: 28, nr: 18, up: 8, op: 110, re: 40, of: 52, oT: 35, oC: 17, ng: 6, ac: 4, aq: 2, mn: 5400, piq: 450, comp: 380, ia: 300, off: 350, ag: 550, ck: true, mls: 70, dm: 15, cold: 18, ref: 7, pH: 10, pW: 6 }, y: { tx: 10, em: 5, ca: 8, of: 3, op: 8 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 8, n: "Michael May", org: 2, ph: 3, day: 60, health: "green", ps: 4, gaps: [], agenda: "Star. 3 deals.", vid: null, ec: 0, s: { tx: 200, em: 110, ca: 45, cc: 34, nr: 22, up: 12, op: 140, re: 55, of: 68, oT: 45, oC: 23, ng: 10, ac: 5, aq: 3, mn: 7200, piq: 600, comp: 500, ia: 420, off: 480, ag: 700, ck: true, mls: 90, dm: 20, cold: 22, ref: 8, pH: 15, pW: 8 }, y: { tx: 12, em: 6, ca: 9, of: 4, op: 10 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 9, n: "Alek Tan", org: 2, ph: 3, day: 50, health: "green", ps: 4, gaps: [], agenda: "2 deals.", vid: null, ec: 0, s: { tx: 150, em: 80, ca: 30, cc: 22, nr: 14, up: 7, op: 95, re: 35, of: 45, oT: 30, oC: 15, ng: 7, ac: 4, aq: 2, mn: 6000, piq: 500, comp: 420, ia: 350, off: 400, ag: 600, ck: true, mls: 60, dm: 14, cold: 15, ref: 6, pH: 12, pW: 7 }, y: { tx: 8, em: 4, ca: 6, of: 3, op: 7 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 17, n: "Steve Medina", org: 4, ph: 3, day: 40, health: "green", ps: 4, gaps: [], agenda: "On target.", vid: null, ec: 0, s: { tx: 140, em: 75, ca: 35, cc: 26, nr: 16, up: 6, op: 90, re: 32, of: 48, oT: 32, oC: 16, ng: 8, ac: 3, aq: 2, mn: 4800, piq: 400, comp: 340, ia: 280, off: 320, ag: 520, ck: true, mls: 58, dm: 12, cold: 14, ref: 6, pH: 10, pW: 6 }, y: { tx: 9, em: 4, ca: 7, of: 3, op: 6 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 20, n: "Josh Santos", org: 5, ph: 3, day: 90, health: "green", ps: 4, gaps: [], agenda: "Model AA. 4 deals.", vid: null, ec: 0, s: { tx: 280, em: 150, ca: 50, cc: 40, nr: 30, up: 15, op: 200, re: 80, of: 95, oT: 65, oC: 30, ng: 15, ac: 8, aq: 4, mn: 10800, piq: 900, comp: 750, ia: 620, off: 700, ag: 1000, ck: true, mls: 120, dm: 30, cold: 35, ref: 15, pH: 20, pW: 12 }, y: { tx: 14, em: 7, ca: 10, of: 5, op: 12 }, g: { ca: 50, of: 5, ct: 50 } },
];

const U = UR.map((u) => {
  const ev = C.map((cat, ci) => ({
    cn: cat.n,
    events: cat.ev.map((e, ei) => ({ name: e, ...g3(u.health, ci, ei) })),
  }));
  const cs = ev.map((c) => {
    const t = c.events.length;
    const sm = c.events.reduce((s, e) => s + e.st, 0);
    const a = sm / t;
    const ac = c.events.filter((e) => e.st >= 2).length;
    const mi = c.events.filter((e) => e.st === 0).length;
    const tc = c.events.reduce((s, e) => s + e.count, 0);
    const fs = c.events.filter((e) => e.first).map((e) => e.first);
    const ls = c.events.filter((e) => e.last).map((e) => e.last);
    return { sc: a >= 2.5 ? 3 : a >= 1.5 ? 2 : a >= 0.5 ? 1 : 0, ac, mi, t, tc, fa: fs[0] || null, la: ls[ls.length - 1] || null };
  });
  return { ...u, ev, cs };
});

function gc(u) {
  if (!u.s.ck) return "Check-in not done. NOTHING fires until done.";
  if (u.s.of === 0 && u.cs[4]?.sc === 0) return "Zero offers BECAUSE Analysis never opened.";
  if (u.s.of === 0 && u.s.ca < 5) return "Zero offers BECAUSE not calling.";
  if (u.s.ca < 10 && u.ph >= 2) return "Low calls (" + u.s.ca + "/" + u.g.ca + "). Pipeline drying.";
  if (u.gaps.includes("Campaigns cold 12d")) return "Campaigns stopped. Pipeline cooling.";
  if (u.gaps.includes("Notes empty")) return "No notes. Follow-ups failing.";
  return null;
}

function bE(u) {
  const o = O.find((x) => x.id === u.org);
  const nm = u.n.split(" ")[0];
  const v = u.vid ? V[u.vid] : null;
  const ie = u.ec >= 3;
  const ca = gc(u);
  const ys = u.y;
  const s = u.s;
  if (ie) return { to: o.am + " (AM)", su: "ACTION: " + u.n + " \u2014 " + u.ec + " emails, 0 response", bo: "Hi " + o.am + ",\n\n" + u.n + " received " + u.ec + " coaching emails, zero response.\n\nPhase: " + PN[u.ph] + ", Day " + u.day + "\nCalls: " + s.ca + " (goal: " + u.g.ca + ")\nOffers: " + s.of + "\nDeals: " + s.aq + "\nGaps: " + u.gaps.join(", ") + "\n\nPlease intervene.\n\n\u2014 Ramy", ie: true, uid: u.id };
  let b = "Good morning " + nm + ",\n\n";
  const yT = ys.tx + ys.em + ys.ca;
  if (yT > 0) {
    b += "YESTERDAY:\n";
    if (ys.ca > 0) b += "\u2022 " + ys.ca + " calls" + (ys.ca >= 6 ? " \u2014 solid!" : "") + "\n";
    if (ys.tx > 0) b += "\u2022 " + ys.tx + " texts\n";
    if (ys.of > 0) b += "\u2022 " + ys.of + " offers!\n";
    if (ys.op > 0) b += "\u2022 " + ys.op + " properties\n";
    b += "\n";
  } else if (u.health === "red") b += "No activity yesterday. Let's fix that.\n\n";
  if (u.ph >= 2 && yT > 0) {
    const avg = u.day > 0 ? Math.round(s.ca / u.day) : 0;
    if (ys.ca > avg) b += "TREND: Calls (" + ys.ca + ") above avg (" + avg + "). Keep going.\n\n";
  }
  if (!s.ck) b += "FIRST: Complete check-in. Open iQ.\n\n";
  b += "Day " + u.day + " " + PN[u.ph] + ". " + (u.ph === 3 ? s.aq + " deal" + (s.aq !== 1 ? "s" : "") + "/2 target. " + (s.aq >= 2 ? "On pace!" : "Push offers.") : "") + (u.ph <= 2 ? s.of + " offers vs " + u.g.of + "/day." : "") + "\n\n";
  if (ca) b += "KEY: " + ca + "\n\n";
  if (u.gaps.length > 0) { b += "FOCUS:\n"; u.gaps.forEach((g) => (b += "\u2022 " + g + "\n")); b += "\n"; }
  if (v) b += "WATCH (" + v[1] + "): " + v[0] + "\n\n";
  b += "TARGETS: " + u.g.ca + "C " + u.g.of + "O " + u.g.ct + "ct\nYesterday: " + ys.ca + "C " + ys.of + "O " + (ys.tx + ys.em + ys.ca) + "ct\n\niQ Help Bot \u2014 chat icon in COMMAND.\n\n\u2014 Ramy";
  return { to: u.n, su: "FlipIQ Daily Update", bo: b, ie: false, uid: u.id };
}

const EL = [
  { ph: "P1", d: "D1", tr: "No login", em: "Welcome + login help", vi: "Nav", to: "AA", es: "Call" },
  { ph: "P1", d: "D1", tr: "Login no check-in", em: "iQ check-in starts day", vi: "Nav", to: "AA", es: "Monitor" },
  { ph: "P1", d: "D2", tr: "Can't find Deal Review", em: "Here's where it is", vi: "Outreach", to: "AA", es: "Walkthrough" },
  { ph: "P1", d: "D2", tr: "No calls yet", em: "First call instructions", vi: "Agent", to: "AA", es: "Call D3" },
  { ph: "P1", d: "D3", tr: "Notes never created", em: "[X] calls no notes", vi: "Property", to: "AA", es: "Call" },
  { ph: "P1", d: "D3", tr: "Reminders never set", em: "[X] deals 0 reminders", vi: "Property", to: "AA", es: "Call" },
  { ph: "P1", d: "D3", tr: "Status never changed", em: "All deals None", vi: "Property", to: "AA", es: "Call" },
  { ph: "P1", d: "D3", tr: "Priority never set", em: "Set H/M/L", vi: "Priority", to: "AA", es: "Call" },
  { ph: "P1", d: "D5", tr: "No workflow loop", em: "Do one together", vi: "Offer", to: "AA", es: "Training" },
  { ph: "P1", d: "D5", tr: "Comps never opened", em: "Can't offer without", vi: "Comps", to: "AA", es: "Walk" },
  { ph: "P1", d: "D6-7", tr: "Silent on live", em: "Check in today", vi: "-", to: "AA+AM", es: "Escalate" },
  { ph: "P1", d: "D7", tr: "Graduation", em: "Week 1 scorecard", vi: "Dashboard", to: "AA", es: "Extend" },
  { ph: "P2", d: "D8", tr: "No daily pattern", em: "Consistency = deals", vi: "Outreach", to: "AA", es: "Call" },
  { ph: "P2", d: "Daily", tr: "Checklist not done", em: "STOP. Checklist first.", vi: "-", to: "AA", es: "Block" },
  { ph: "P2", d: "Daily", tr: "Offers=0 no comps", em: "BECAUSE no comps", vi: "Comps", to: "AA", es: "Walk" },
  { ph: "P2", d: "Daily", tr: "90% texts <10% calls", em: "Shift 30% to phone", vi: "-", to: "AA", es: "Flag" },
  { ph: "P2", d: "7+d", tr: "Feature unused 7d", em: "[Feature] why it matters", vi: "Specific", to: "AA", es: "2,3,call" },
  { ph: "P2", d: "D14", tr: "Statuses not updating", em: "Pipeline invisible", vi: "Priority", to: "AA", es: "Review" },
  { ph: "P2", d: "D14", tr: "Notes empty all deals", em: "[X] deals 0 notes", vi: "Property", to: "AA", es: "Walk" },
  { ph: "P2", d: "D21", tr: "Not at KPI pace", em: "Graduation assessment", vi: "-", to: "AA+AM", es: "Extend" },
  { ph: "P3", d: "Daily", tr: "Offers < target", em: "BECAUSE [root cause]", vi: "Offer", to: "AA", es: "3d=AM" },
  { ph: "P3", d: "Daily", tr: "Calls < target", em: "Low calls = empty pipeline", vi: "-", to: "AA", es: "Flag" },
  { ph: "P3", d: "Daily", tr: "Contacts < 50", em: "Use Campaigns", vi: "Campaigns", to: "AA", es: "Check" },
  { ph: "P3", d: "Weekly", tr: "0 deals closed", em: "Pipeline review", vi: "-", to: "AA+AM", es: "Review" },
  { ph: "P3", d: "7+d", tr: "Feature gone cold 7d", em: "Reactivation", vi: "Specific", to: "AA", es: "2,3,call" },
  { ph: "P3", d: "D30", tr: "Monthly assessment", em: "30-day scorecard", vi: "Dashboard", to: "AA+AM", es: "Review" },
  { ph: "ALL", d: "3x", tr: "3 emails 0 response", em: "STOP emailing", vi: "-", to: "AM", es: "Escalate" },
];

const DR = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "This month", "All time"];

export default function App() {
  const [flt, sf] = useState({ org: null, phase: null, health: null });
  const [done, sd] = useState({});
  const [modal, sm] = useState(null);
  const [aT, saT] = useState(null);
  const [aN, saN] = useState("");
  const [sel, ss] = useState(null);
  const [tab, st] = useState("overview");
  const [eV, seV] = useState(null);
  const [exp, sE] = useState(null);
  const [hC, sHC] = useState(null);
  const [dR, sDR] = useState("Today");

  const tog = (k, v) => sf((f) => ({ ...f, [k]: f[k] === v ? null : v }));

  const fU = useMemo(() => {
    let u = [...U];
    if (flt.org) u = u.filter((x) => x.org === flt.org);
    if (flt.phase) u = u.filter((x) => x.ph === flt.phase);
    if (flt.health) u = u.filter((x) => x.health === flt.health);
    return u;
  }, [flt]);

  const base = flt.org ? U.filter((u) => u.org === flt.org) : U;
  const sts = {
    t: base.length,
    p1: base.filter((x) => x.ph === 1).length,
    p2: base.filter((x) => x.ph === 2).length,
    p3: base.filter((x) => x.ph === 3).length,
    r: base.filter((x) => x.health === "red").length,
    o: base.filter((x) => x.health === "orange").length,
    y: base.filter((x) => x.health === "yellow").length,
    g: base.filter((x) => x.health === "green").length,
  };
  const td = base.reduce((a, x) => a + x.s.aq, 0);
  const tgt = base.filter((x) => x.ph === 3).length * 2;
  const pct = tgt > 0 ? Math.round((td / tgt) * 100) : 0;
  const tasks = fU.filter((u) => u.health !== "green");
  const pend = tasks.filter((t) => !done[t.id]);
  const fin = tasks.filter((t) => done[t.id]);
  const cp = tasks.length > 0 ? Math.round((fin.length / tasks.length) * 100) : 100;
  const lb = [...fU].sort((a, b) => b.s.aq - a.s.aq || b.s.of - a.s.of || b.s.ca - a.s.ca);

  const doC = () => {
    if (!aT) return;
    sd((d) => ({ ...d, [modal]: { type: aT, note: aN, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) } }));
    sm(null);
    saT(null);
    saN("");
  };

  const user = sel ? U.find((u) => u.id === sel) : null;
  const tE = (uid, ci) => { if (exp && exp.u === uid && exp.c === ci) sE(null); else sE({ u: uid, c: ci }); };
  const sel0 = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394A3B8' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#F8FAFB", minHeight: "100vh", color: "#1E293B", position: "relative" }}>
      <div style={{ background: "linear-gradient(135deg,#FFF7ED,#FFF)", borderBottom: "1px solid #FED7AA", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "linear-gradient(135deg,#F97316,#EA580C)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>iQ</div>
          <div><div style={{ fontSize: 15, fontWeight: 700 }}>FlipIQ COMMAND</div><div style={{ fontSize: 10, color: "#94A3B8" }}>CSM Dashboard</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#F97316", textTransform: "uppercase", letterSpacing: 1.5 }}>Atomic KPI</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>2 Deals / Month / Person</div>
            <div style={{ fontSize: 10, color: "#64748B" }}>= Big Bucks for All <b style={{ color: "#F97316" }}>Ramy, get us to big bucks!!!</b></div>
          </div>
          <div style={{ width: 1, height: 32, background: "#FED7AA" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="#F1F5F9" strokeWidth="4" /><circle cx="22" cy="22" r="18" fill="none" stroke={pct >= 75 ? "#10B981" : pct >= 50 ? "#D97706" : "#DC2626"} strokeWidth="4" strokeLinecap="round" strokeDasharray={pct * 1.131 + " 113.1"} transform="rotate(-90 22 22)" /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{pct}%</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#F97316" }}>{td}</div>
              <div style={{ fontSize: 9, color: "#94A3B8" }}>deals / {tgt} target</div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "#FED7AA" }} />
          <div style={{ fontSize: 11, color: "#64748B" }}>Mar 21, 2026</div>
        </div>
      </div>

      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}>ORG</span>
          <select value={flt.org || "all"} onChange={(e) => sf((f) => ({ ...f, org: e.target.value === "all" ? null : +e.target.value }))} style={{ padding: "6px 32px 6px 12px", fontSize: 13, fontWeight: 500, border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFF", appearance: "none", WebkitAppearance: "none", cursor: "pointer", minWidth: 200, backgroundImage: sel0, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
            <option value="all">All organizations ({U.length})</option>
            {O.map((o) => <option key={o.id} value={o.id}>{o.n} ({U.filter((u) => u.org === o.id).length})</option>)}
          </select>
          <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 4px" }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}>PHASE</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ p: 1, n: "Onboarding", d: "Days 1-7", c: "#0C447C", bc: "#85B7EB", bg: "#E6F1FB" }, { p: 2, n: "Activation", d: "Days 8-21", c: "#854F0B", bc: "#EF9F27", bg: "#FAEEDA" }, { p: 3, n: "Performance", d: "Day 22+", c: "#085041", bc: "#5DCAA5", bg: "#E1F5EE" }].map((x) => (
              <div key={x.p} onClick={() => tog("phase", x.p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 8, border: flt.phase === x.p ? "1.5px solid " + x.bc : "1px solid #E2E8F0", background: flt.phase === x.p ? x.bg : "#FAFBFC", cursor: "pointer", minWidth: 150 }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: x.c }}>{sts["p" + x.p]}</div>
                <div><div style={{ fontSize: 12, fontWeight: 500, color: x.c }}>{x.n}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{x.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 4px" }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}>HEALTH</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ h: "red", n: "Critical", c: "#791F1F", bc: "#F09595", bg: "#FCEBEB", dot: "#E24B4A", k: "r" }, { h: "orange", n: "Gap", c: "#712B13", bc: "#F0997B", bg: "#FAECE7", dot: "#D85A30", k: "o" }, { h: "yellow", n: "Cooling", c: "#854F0B", bc: "#FAC775", bg: "#FAEEDA", dot: "#EF9F27", k: "y" }, { h: "green", n: "Healthy", c: "#085041", bc: "#9FE1CB", bg: "#E1F5EE", dot: "#1D9E75", k: "g" }].map((x) => (
              <div key={x.h} onClick={() => tog("health", x.h)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: flt.health === x.h ? "1.5px solid " + x.bc : "1px solid #E2E8F0", background: flt.health === x.h ? x.bg : "#FAFBFC", cursor: "pointer", minWidth: 110 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.dot }} />
                <div style={{ fontSize: 22, fontWeight: 500, color: x.c }}>{sts[x.k]}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: x.c }}>{x.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0", padding: "0 24px", display: "flex" }}>
        {["overview", "leaderboard", "heatmap", "emails", "logic"].map((t) => (
          <button key={t} onClick={() => { st(t); ss(null); seV(null); sE(null); }} style={{ padding: "10px 14px", fontSize: 12, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#F97316" : "#64748B", background: "none", border: "none", borderBottom: tab === t ? "2px solid #F97316" : "2px solid transparent", cursor: "pointer" }}>
            {t === "logic" ? "Email logic" : t === "heatmap" ? "Heat map" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 24px", maxWidth: 1300, margin: "0 auto" }}>
        {tab === "overview" && !sel && !eV && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[{ t: "What this is", d: "AI coaching engine. Tracks AAs daily.", c: "#F97316" }, { t: "How it works", d: "5AM: reads activity, 3-Track scoring, fires rules.", c: "#3B82F6" }, { t: "Your role", d: "Review emails. Forward. Log action.", c: "#10B981" }, { t: "The rule", d: "3 emails no response = STOP. Next to AM.", c: "#DC2626" }].map((x, i) => (
                <div key={i} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "14px 16px", borderTop: "3px solid " + x.c }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: x.c, textTransform: "uppercase", letterSpacing: 1 }}>{x.t}</div>
                  <div style={{ fontSize: 12, color: "#334155", marginTop: 6, lineHeight: 1.5 }}>{x.d}</div>
                </div>
              ))}
            </div>


            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, fontWeight: 700 }}>Tasks</span><span style={{ fontSize: 11, color: "#64748B" }}>{fin.length}/{tasks.length}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 160, height: 6, background: "#F1F5F9", borderRadius: 3 }}><div style={{ height: 6, background: cp === 100 ? "#10B981" : "#F97316", borderRadius: 3, width: cp + "%" }} /></div>
                <span style={{ fontSize: 12, fontWeight: 800, color: cp === 100 ? "#10B981" : "#F97316" }}>{cp}%</span>
              </div>
            </div>

            {pend.map((u) => {
              const ca = gc(u);
              return (
                <div key={u.id} style={{ background: "#FFF", border: "1px solid " + (u.ec >= 3 ? "#FECACA" : "#E2E8F0"), borderRadius: 8, padding: "10px 12px", marginBottom: 4, borderLeft: "4px solid " + PLC[u.ps] }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => { sm(u.id); saT(null); saN(""); }} style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid " + PLC[u.ps], background: "none", cursor: "pointer", flexShrink: 0 }} />
                    <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", background: PLC[u.ps], padding: "1px 6px", borderRadius: 3 }}>{PL[u.ps]}</span>
                    <span onClick={() => ss(u.id)} style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textDecorationColor: "#E2E8F0" }}>{u.n}</span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{O.find((o) => o.id === u.org)?.n} D{u.day} {PN[u.ph]}</span>
                    {u.ec >= 3 && <span style={{ fontSize: 7, fontWeight: 800, color: "#DC2626", background: "#FEF2F2", padding: "1px 5px", borderRadius: 2, border: "1px solid #FECACA" }}>3-STRIKE</span>}
                    {!u.s.ck && <span style={{ fontSize: 7, fontWeight: 800, color: "#EA580C", background: "#FFF7ED", padding: "1px 5px", borderRadius: 2, border: "1px solid #FED7AA" }}>NO CHECK-IN</span>}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#64748B" }}>C:<span style={{ color: vc(u.s.ca, u.g.ca), fontWeight: 700 }}>{u.s.ca}</span> O:<span style={{ color: vc(u.s.of, u.g.of * Math.min(u.day, 30)), fontWeight: 700 }}>{u.s.of}</span></span>
                      <button onClick={() => seV(bE(u))} style={{ fontSize: 9, fontWeight: 600, color: "#F97316", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>{u.ec >= 3 ? "AM" : "Email"}</button>
                    </div>
                  </div>
                  {ca && <div style={{ marginTop: 4, marginLeft: 24, fontSize: 10, color: "#EA580C", fontWeight: 600 }}>WHY: {ca}</div>}
                  {u.gaps.length > 0 && <div style={{ marginTop: 3, marginLeft: 24, display: "flex", gap: 2, flexWrap: "wrap" }}>{u.gaps.map((g, i) => <span key={i} style={{ fontSize: 8, color: HC[u.health], background: HBG[u.health], padding: "1px 5px", borderRadius: 2 }}>{g}</span>)}</div>}
                </div>
              );
            })}

            {fin.length > 0 && (
              <>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 4px" }}>Done ({fin.length})</div>
                {fin.map((u) => {
                  const a = done[u.id];
                  return (
                    <div key={u.id} style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 7, padding: "7px 12px", marginBottom: 3, opacity: 0.55, borderLeft: "4px solid #CBD5E1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800 }}>&#10003;</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textDecoration: "line-through" }}>{u.n}</span>
                        <span style={{ fontSize: 8, fontWeight: 600, color: "#10B981", background: "#ECFDF5", padding: "1px 5px", borderRadius: 2 }}>{a.type}</span>
                        {a.note && <span style={{ fontSize: 8, color: "#64748B", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.note}</span>}
                        <span style={{ fontSize: 8, color: "#94A3B8", marginLeft: "auto" }}>{a.time}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {eV && (tab === "overview" || tab === "emails") && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{eV.ie ? "AM Escalation" : "Coaching Email"}</div>
              <button onClick={() => seV(null)} style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 5, padding: "4px 12px", cursor: "pointer" }}>Back</button>
            </div>
            <div style={{ background: eV.ie ? "#FEF2F2" : "#F8FAFB", borderRadius: 7, padding: 16, border: "1px solid " + (eV.ie ? "#FECACA" : "#E2E8F0") }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 3 }}><b>To:</b> {eV.to}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}><b>Subject:</b> {eV.su}</div>
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line" }}>{eV.bo}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => { sm(eV.uid); saT("email"); saN(""); seV(null); }} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 700, background: "#F97316", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Forward and complete</button>
              <button onClick={() => seV(null)} style={{ padding: "8px 20px", fontSize: 12, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {tab === "leaderboard" && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>Team leaderboard</div><div style={{ fontSize: 11, color: "#94A3B8" }}>My Stats KPIs. Click name for detail.</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select value={dR} onChange={(e) => sDR(e.target.value)} style={{ padding: "5px 28px 5px 10px", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 6, background: "#FFF", appearance: "none", WebkitAppearance: "none", cursor: "pointer", backgroundImage: sel0, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                  {DR.map((d) => <option key={d}>{d}</option>)}
                </select>
                <span style={{ fontSize: 11, color: "#64748B" }}>Mar 21 &middot; Pacific</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "28px 120px 62px 62px 68px 50px 50px 50px 50px 44px 50px 50px 50px 50px 55px", padding: "3px 8px", background: "#F1F5F9", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#64748B", textTransform: "uppercase", minWidth: 950 }}>
                <div></div><div></div><div style={{ textAlign: "center" }}>Comms</div><div></div><div></div><div></div><div style={{ textAlign: "center" }}>Rels</div><div></div><div style={{ textAlign: "center" }}>Deal Progress</div><div></div><div></div><div></div><div></div><div></div><div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "28px 120px 62px 62px 68px 50px 50px 50px 50px 44px 50px 50px 50px 50px 55px", padding: "3px 8px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", minWidth: 950 }}>
                <div>#</div><div>Name</div><div style={{ textAlign: "center" }}>Texts</div><div style={{ textAlign: "center" }}>Emails</div><div style={{ textAlign: "center" }}>Calls</div><div style={{ textAlign: "center" }}>New</div><div style={{ textAlign: "center" }}>Upgr</div><div style={{ textAlign: "center" }}>New</div><div style={{ textAlign: "center" }}>Reop</div><div style={{ textAlign: "center" }}>R/N</div><div style={{ textAlign: "center" }}>Offers</div><div style={{ textAlign: "center" }}>Neg</div><div style={{ textAlign: "center" }}>Acc</div><div style={{ textAlign: "center" }}>Acq</div><div style={{ textAlign: "center" }}>Time</div>
              </div>
              {lb.map((u, i) => {
                const rn = u.s.op > 0 ? (u.s.re / u.s.op).toFixed(2) : "0";
                return (
                  <div key={u.id} onClick={() => ss(u.id)} style={{ display: "grid", gridTemplateColumns: "28px 120px 62px 62px 68px 50px 50px 50px 50px 44px 50px 50px 50px 50px 55px", padding: "6px 8px", borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#FFF" : "#FAFBFC", cursor: "pointer", minWidth: 950, fontSize: 11, alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: i < 3 ? "#F97316" : "#CBD5E1" }}>{i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : i + 1}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: HC[u.health] }} /><span style={{ fontWeight: 600, fontSize: 11 }}>{u.n}</span></div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.tx}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.em}</div>
                    <div style={{ textAlign: "center", fontWeight: 600, color: vc(u.s.ca, u.g.ca) }}>{u.s.ca}<span style={{ fontSize: 8, color: "#94A3B8" }}>({u.s.cc})</span></div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.nr}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.up}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.op}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.re}</div>
                    <div style={{ textAlign: "center", color: "#64748B", fontSize: 10 }}>{rn}</div>
                    <div style={{ textAlign: "center", fontWeight: 600, color: vc(u.s.of, u.g.of * Math.min(u.day, 30)) }}>{u.s.of}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.ng}</div>
                    <div style={{ textAlign: "center", color: "#64748B" }}>{u.s.ac}</div>
                    <div style={{ textAlign: "center", fontWeight: 800, color: u.s.aq >= 2 ? "#10B981" : u.s.aq > 0 ? "#D97706" : "#DC2626" }}>{u.s.aq}</div>
                    <div style={{ textAlign: "center", fontSize: 10, color: "#64748B" }}>{u.s.mn}m</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "heatmap" && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>Heat map</div><div style={{ fontSize: 11, color: "#94A3B8" }}>61 events. Hover for 3-Track. Click to expand.</div></div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["#DC2626", "Miss"], ["#EA580C", "Gap"], ["#D97706", "Cool"], ["#10B981", "Active"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: c }} /><span style={{ fontSize: 10, color: "#64748B" }}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "24px 140px 48px repeat(7,1fr)", padding: "5px 10px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", alignItems: "center" }}>
              <div></div><div>User</div><div>Ph</div>{HL.map((h) => <div key={h} style={{ textAlign: "center" }}>{h}</div>)}
            </div>
            {fU.map((u, ri) => (
              <div key={u.id}>
                <div style={{ display: "grid", gridTemplateColumns: "24px 140px 48px repeat(7,1fr)", padding: "5px 10px", borderBottom: "1px solid #F1F5F9", background: ri % 2 === 0 ? "#FFF" : "#FAFBFC", alignItems: "center" }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: PLC[u.ps] + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: PLC[u.ps] }}>{u.ps}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => ss(u.id)}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: HC[u.health] }} />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{u.n}</span>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: PC[u.ph] }}>{PN[u.ph].slice(0, 3)}</div>
                  {u.cs.map((cs, ci) => (
                    <div key={ci} style={{ display: "flex", justifyContent: "center" }}
                      onMouseEnter={(e) => { const r = e.currentTarget.getBoundingClientRect(); sHC({ uid: u.id, ci, x: r.left, y: r.bottom + 4 }); }}
                      onMouseLeave={() => sHC(null)}
                      onClick={() => { ss(u.id); sE({ u: u.id, c: ci }); }}>
                      <div style={{ width: 50, height: 22, borderRadius: 4, background: HMBG[cs.sc], border: "1.5px solid " + HMC[cs.sc] + "60", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: HMC[cs.sc] }}>{cs.ac}/{cs.t}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "emails" && !eV && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Coaching emails ({fU.filter((u) => u.health !== "green").length})</div>
            {fU.filter((u) => u.health !== "green").map((u) => {
              const ca = gc(u);
              return (
                <div key={u.id} style={{ background: "#FFF", border: "1px solid " + (u.ec >= 3 ? "#FECACA" : "#E2E8F0"), borderRadius: 7, padding: "10px 12px", borderLeft: "3px solid " + PLC[u.ps] }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", background: PLC[u.ps], padding: "1px 5px", borderRadius: 2 }}>{PL[u.ps]}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{u.n}</span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{O.find((o) => o.id === u.org)?.n}</span>
                    {u.ec >= 3 && <span style={{ fontSize: 7, color: "#DC2626", background: "#FEF2F2", padding: "1px 4px", borderRadius: 2, border: "1px solid #FECACA", fontWeight: 800 }}>3-STRIKE</span>}
                    {u.vid && <span style={{ fontSize: 7, color: "#0369A1", background: "#F0F9FF", padding: "1px 4px", borderRadius: 2 }}>{V[u.vid]?.[0]}</span>}
                    <button onClick={() => seV(bE(u))} style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, color: "#F97316", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>Generate</button>
                  </div>
                  {ca && <div style={{ marginTop: 3, fontSize: 10, color: "#EA580C", fontWeight: 600 }}>BECAUSE: {ca}</div>}
                  <div style={{ marginTop: 3, fontSize: 10, color: "#64748B" }}>Y: {u.y.ca}C {u.y.of}O {u.y.tx + u.y.em + u.y.ca}ct | G: {u.g.ca}C {u.g.of}O {u.g.ct}ct</div>
                </div>
              );
            })}
          </div>
        )}

        {eV && tab === "emails" && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{eV.ie ? "AM Escalation" : "Coaching Email"}</div>
              <button onClick={() => seV(null)} style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 5, padding: "4px 12px", cursor: "pointer" }}>Back</button>
            </div>
            <div style={{ background: eV.ie ? "#FEF2F2" : "#F8FAFB", borderRadius: 7, padding: 16, border: "1px solid " + (eV.ie ? "#FECACA" : "#E2E8F0") }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 3 }}><b>To:</b> {eV.to}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}><b>Subject:</b> {eV.su}</div>
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line" }}>{eV.bo}</div>
            </div>
            <button onClick={() => { sm(eV.uid); saT("email"); saN(""); seV(null); }} style={{ marginTop: 12, padding: "7px 18px", fontSize: 12, fontWeight: 700, background: "#F97316", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Forward and complete</button>
          </div>
        )}

        {tab === "logic" && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Email logic</div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>Every email: yesterday data + video + iQ Help Bot.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "45px 50px 160px 1fr 75px 45px 1fr", padding: "5px 8px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
              <div>Ph</div><div>When</div><div>Trigger</div><div>Email</div><div>Video</div><div>To</div><div>No resp</div>
            </div>
            {EL.map((r, i) => {
              const strike = r.tr.includes("0 response");
              const bc = r.em.includes("BECAUSE");
              const pc = r.ph === "P1" ? PC[1] : r.ph === "P2" ? PC[2] : r.ph === "P3" ? PC[3] : "#64748B";
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "45px 50px 160px 1fr 75px 45px 1fr", padding: "7px 8px", borderBottom: "1px solid #F1F5F9", background: strike ? "#FEF2F2" : bc ? "#FFF7ED" : i % 2 === 0 ? "#FFF" : "#FAFBFC", fontSize: 10, alignItems: "start" }}>
                  <div style={{ color: pc, fontWeight: 700 }}>{r.ph}</div>
                  <div style={{ color: "#64748B", fontSize: 9 }}>{r.d}</div>
                  <div style={{ color: "#1E293B", fontWeight: 500 }}>{r.tr}</div>
                  <div style={{ color: bc ? "#EA580C" : "#334155", fontWeight: bc ? 600 : 400, lineHeight: 1.4 }}>{r.em}</div>
                  <div style={{ color: r.vi !== "-" ? "#0369A1" : "#CBD5E1", fontSize: 9 }}>{r.vi}</div>
                  <div style={{ fontWeight: 600, color: r.to.includes("AM") || (r.to.includes("P") && r.to.length < 4) ? "#DC2626" : "#64748B" }}>{r.to}</div>
                  <div style={{ color: strike ? "#DC2626" : "#64748B", fontWeight: strike ? 700 : 400 }}>{r.es}</div>
                </div>
              );
            })}
          </div>
        )}

        {sel && user && (
          <div>
            <button onClick={() => { ss(null); sE(null); }} style={{ fontSize: 11, color: "#F97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>&larr; Back</button>
            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{user.n}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{O.find((o) => o.id === user.org)?.n} &mdash; Day {user.day} &mdash; <span style={{ color: PC[user.ph], fontWeight: 700 }}>{PN[user.ph]}</span></div>
                  {user.agenda && <div style={{ fontSize: 11, color: "#EA580C", fontWeight: 600, marginTop: 6 }}>{user.agenda}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[{ n: "Deals", v: user.s.aq, g: 2 }, { n: "Calls", v: user.s.ca, g: user.g.ca }, { n: "Offers", v: user.s.of, g: user.g.of * Math.min(user.day, 30) }].map((x) => (
                    <div key={x.n} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: vc(x.v, x.g) }}>{x.v}</div>
                      <div style={{ fontSize: 9, color: "#94A3B8" }}>{x.n}/{x.g}</div>
                    </div>
                  ))}
                  <button onClick={() => { seV(bE(user)); ss(null); }} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, background: "#F97316", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", marginLeft: 8 }}>Send email</button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F97316", marginBottom: 8 }}>Communication</div>
                {[["Texts", user.s.tx], ["Emails", user.s.em], ["Calls", user.s.ca + " (" + user.s.cc + " conn)", user.g.ca], ["Avg Time", Math.round(user.s.mn / 60) + "h"]].map(([l, v, g]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: "#64748B" }}>{l}</span>
                    <span style={{ fontWeight: 700, color: g ? vc(typeof v === "number" ? v : 0, g) : "#1E293B" }}>{v}{g ? <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 400 }}> /{g}</span> : null}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 6, paddingTop: 6, fontSize: 10, color: "#94A3B8" }}>PIQ:{user.s.piq}m Comps:{user.s.comp}m IA:{user.s.ia}m Offer:{user.s.off}m Agents:{user.s.ag}m</div>
              </div>

              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 8 }}>Deal pipeline</div>
                {[["Opened", user.s.op], ["Reopened", user.s.re], ["R/N", user.s.op > 0 ? (user.s.re / user.s.op).toFixed(2) : "0"], ["Offers", user.s.of + " (T:" + user.s.oT + " C:" + user.s.oC + ")", user.g.of * Math.min(user.day, 30)], ["Negot", user.s.ng], ["Accepted", user.s.ac], ["Acquired", user.s.aq, 2]].map(([l, v, g]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: "#64748B" }}>{l}</span>
                    <span style={{ fontWeight: l === "Acquired" ? 800 : 700, color: g ? vc(typeof v === "number" ? v : 0, g) : "#1E293B" }}>{v}{g ? <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 400 }}> /{g}</span> : null}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 6, paddingTop: 6, fontSize: 10, color: "#94A3B8" }}>Source: MLS:{user.s.mls} DM:{user.s.dm} CC:{user.s.cold} Ref:{user.s.ref}</div>
              </div>

              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>Relationships</div>
                {[["New", user.s.nr], ["Upgraded", user.s.up], ["Priority H", user.s.pH], ["Warm", user.s.pW], ["Check-in", user.s.ck ? "Done" : "Not Done"]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: "#64748B" }}>{l}</span>
                    <span style={{ fontWeight: 700, color: v === "Done" ? "#10B981" : v === "Not Done" ? "#DC2626" : "#1E293B" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {gc(user) && (
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#EA580C", marginBottom: 4 }}>ROOT CAUSE</div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{gc(user)}</div>
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Feature usage &mdash; 61 events</div>
            {C.map((cat, ci) => {
              const cs = user.cs[ci];
              const isO = exp && exp.u === user.id && exp.c === ci;
              return (
                <div key={ci} style={{ marginBottom: 6 }}>
                  <div onClick={() => tE(user.id, ci)} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: isO ? "8px 8px 0 0" : 8, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 20, borderRadius: 4, background: HMBG[cs.sc], border: "1.5px solid " + HMC[cs.sc] + "60", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: HMC[cs.sc] }}>{SL[cs.sc].slice(0, 4)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.n}</span>
                        <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{cs.ac}/{cs.t} active</span>
                        {cs.mi > 0 && <span style={{ fontSize: 10, color: "#DC2626", marginLeft: 8, fontWeight: 600 }}>{cs.mi} missing</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#64748B" }}>
                      <div>First: <span style={{ fontWeight: 600, color: cs.fa ? "#334155" : "#DC2626" }}>{cs.fa || "never"}</span></div>
                      <div>Uses: <span style={{ fontWeight: 600 }}>{cs.tc}</span></div>
                      <div>Last: <span style={{ fontWeight: 600, color: cs.la ? "#334155" : "#DC2626" }}>{cs.la || "never"}</span></div>
                      <span style={{ fontSize: 14, color: "#94A3B8", transform: isO ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BE"}</span>
                    </div>
                  </div>
                  {isO && (
                    <div style={{ background: "#FAFBFC", border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "4px 0" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 75px 55px 75px 65px", padding: "4px 14px", fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                        <div>Event</div><div style={{ textAlign: "center" }}>First</div><div style={{ textAlign: "center" }}>Count</div><div style={{ textAlign: "center" }}>Last</div><div style={{ textAlign: "center" }}>Status</div>
                      </div>
                      {user.ev[ci].events.map((ev, ei) => (
                        <div key={ei} style={{ display: "grid", gridTemplateColumns: "1fr 75px 55px 75px 65px", padding: "4px 14px", borderTop: "1px solid #F1F5F9", fontSize: 10, alignItems: "center" }}>
                          <div style={{ color: ev.st === 0 ? "#DC2626" : "#334155", fontWeight: ev.st === 0 ? 600 : 400 }}>{ev.name}</div>
                          <div style={{ textAlign: "center", color: ev.first ? "#64748B" : "#DC2626" }}>{ev.first || "never"}</div>
                          <div style={{ textAlign: "center", fontWeight: 600 }}>{ev.count}</div>
                          <div style={{ textAlign: "center", color: ev.last ? "#64748B" : "#DC2626" }}>{ev.last || "never"}</div>
                          <div style={{ textAlign: "center" }}><span style={{ fontSize: 8, fontWeight: 700, color: HMC[ev.st], background: HMBG[ev.st], padding: "1px 5px", borderRadius: 2 }}>{SL[ev.st]}</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hC && (() => {
        const u = U.find((x) => x.id === hC.uid);
        const cs = u?.cs[hC.ci];
        if (!u || !cs) return null;
        return (
          <div style={{ position: "fixed", left: Math.min(hC.x, 900), top: hC.y, width: 250, background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, pointerEvents: "none" }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{C[hC.ci].n}</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 6, fontSize: 11 }}>
              <div>Active: <span style={{ fontWeight: 600, color: "#10B981" }}>{cs.ac}</span>/{cs.t}</div>
              <div>Missing: <span style={{ fontWeight: 600, color: cs.mi > 0 ? "#DC2626" : "#64748B" }}>{cs.mi}</span></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[{ l: "First", v: cs.fa }, { l: "Uses", v: cs.tc }, { l: "Last", v: cs.la }].map((x) => (
                <div key={x.l} style={{ background: "#F8FAFB", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#94A3B8" }}>{x.l}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: x.v ? "#334155" : "#DC2626" }}>{x.v || "never"}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 6 }}>Click to expand</div>
          </div>
        );
      })()}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#FFF", borderRadius: 10, padding: 20, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Complete task</div>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>{U.find((u) => u.id === modal)?.n}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {[["call", "Made a phone call"], ["text", "Sent a text"], ["email", "Sent coaching email"], ["notify_am", "Notified AM"], ["walkthrough", "Scheduled walkthrough"], ["other", "Other"]].map(([k, l]) => (
                <button key={k} onClick={() => saT(k)} style={{ padding: "7px 10px", borderRadius: 6, border: aT === k ? "2px solid #F97316" : "1px solid #E2E8F0", background: aT === k ? "#FFF7ED" : "#FFF", cursor: "pointer", fontSize: 12, fontWeight: aT === k ? 700 : 500, textAlign: "left" }}>{l}</button>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 2 }}>Notes</div>
              <textarea value={aN} onChange={(e) => saN(e.target.value)} placeholder="What happened?" style={{ width: "100%", minHeight: 55, padding: 8, borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "inherit", resize: "vertical", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <button onClick={() => { sm(null); saT(null); saN(""); }} style={{ padding: "6px 14px", fontSize: 12, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
              <button onClick={doC} disabled={!aT} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#fff", background: aT ? "#F97316" : "#CBD5E1", border: "none", borderRadius: 6, cursor: aT ? "pointer" : "default" }}>Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
