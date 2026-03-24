// @ts-nocheck
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

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
const EV = {
  "iQ Check-In": { vid: "nav", ph: [1,2,3], tip: "Start every day with your iQ Check-In" },
  "Report blockers": { vid: "nav", ph: [1,2,3], tip: "Report what's blocking your progress" },
  "Open Deal Review": { vid: "nav", ph: [1,2,3], tip: "Review your active deals daily" },
  "Review Critical Calls": { vid: "outreach", ph: [1,2,3], tip: "Follow up on your highest-priority calls" },
  "Process New Deals": { vid: "nav", ph: [1,2,3], tip: "Process incoming deals quickly" },
  "Open Daily Outreach": { vid: "outreach", ph: [1,2,3], tip: "Open your outreach queue and start calling" },
  "Call from Outreach": { vid: "outreach", ph: [1,2,3], tip: "Make calls directly from your outreach list" },
  "Open My Active Deals": { vid: "nav", ph: [1,2,3], tip: "Check on your active pipeline" },
  "Open MLS Hot Deals": { vid: "nav", ph: [1,2], tip: "Find new hot deals on MLS" },
  "Filter Hot Deals": { vid: "nav", ph: [1,2], tip: "Filter MLS results to find the best deals" },
  "Open MLS Search": { vid: "nav", ph: [1,2], tip: "Use MLS search to find properties" },
  "Apply MLS filters": { vid: "nav", ph: [1,2], tip: "Apply filters to narrow MLS results" },
  "Save a filter": { vid: "nav", ph: [1,2], tip: "Save your best search filters" },
  "Open Agent Search": { vid: "agentprofile", ph: [2,3], tip: "Search for agents in your area" },
  "Search agents": { vid: "agentprofile", ph: [2,3], tip: "Find and connect with listing agents" },
  "Open Agent Profile": { vid: "agentprofile", ph: [2,3], tip: "View agent profiles before calling" },
  "Open Campaigns": { vid: "campaigns", ph: [2,3], tip: "Launch targeted outreach campaigns" },
  "Select campaign": { vid: "campaigns", ph: [2,3], tip: "Choose the right campaign for your market" },
  "Send campaign": { vid: "campaigns", ph: [2,3], tip: "Send your campaigns to new agents" },
  "Call agent": { vid: "outreach", ph: [1,2,3], tip: "Pick up the phone and call an agent" },
  "Text agent": { vid: "outreach", ph: [1,2,3], tip: "Send a text to start a conversation" },
  "Email agent": { vid: "outreach", ph: [1,2,3], tip: "Email an agent about a deal" },
  "AI Connect": { vid: "outreach", ph: [2,3], tip: "Use AI Connect for smart outreach" },
  "Bulk Call": { vid: "outreach", ph: [2,3], tip: "Make calls in bulk to save time" },
  "Bulk Text": { vid: "outreach", ph: [2,3], tip: "Send bulk texts to your agent list" },
  "Add Note": { vid: "property", ph: [1,2,3], tip: "Add notes to every deal you work" },
  "Reminder": { vid: "property", ph: [1,2,3], tip: "Set reminders so deals don't slip" },
  "AI Report": { vid: "property", ph: [2,3], tip: "Generate AI reports for deal analysis" },
  "Follow-Up": { vid: "property", ph: [1,2,3], tip: "Follow up on every conversation" },
  "To Do": { vid: "property", ph: [1,2,3], tip: "Track your to-dos for each deal" },
  "PIQ Detail": { vid: "ia", ph: [2,3], tip: "Analyze property investment quality" },
  "Comps Map": { vid: "comps", ph: [2,3], tip: "Use Comps Map to evaluate deals" },
  "Comps Matrix": { vid: "comps", ph: [2,3], tip: "Compare comps side by side" },
  "Investment Analysis": { vid: "ia", ph: [2,3], tip: "Run full investment analysis before offering" },
  "Offer Terms": { vid: "offer", ph: [2,3], tip: "Set your offer terms and submit" },
  "Submit Contract": { vid: "offer", ph: [2,3], tip: "Submit your contract for the deal" },
  "Offer vs goal": { vid: "offer", ph: [2,3], tip: "Track your offers against your goal" },
  "No Props in priorities": { vid: "priority", ph: [1,2,3], tip: "Make sure you have properties set in your priorities" },
  "Review High Priority": { vid: "priority", ph: [1,2,3], tip: "Review your high-priority deals first" },
  "Review Med Priority": { vid: "priority", ph: [1,2,3], tip: "Check medium-priority deals after high" },
  "Review Low Priority": { vid: "priority", ph: [2,3], tip: "Don't forget your low-priority deals" },
  "Text VM": { vid: "outreach", ph: [1,2,3], tip: "Send a text voicemail to agents" },
  "Bulk Email": { vid: "outreach", ph: [2,3], tip: "Send bulk emails to your agent list" },
  "Bulk Text VM": { vid: "outreach", ph: [2,3], tip: "Send bulk text voicemails" },
  "Bulk AI Connect": { vid: "outreach", ph: [2,3], tip: "Use AI Connect in bulk for smart outreach" },
  "Tax Data": { vid: "property", ph: [2,3], tip: "Check tax data on properties" },
  "Activity history": { vid: "property", ph: [1,2,3], tip: "Review the activity history on your deals" },
  "Check-In": { vid: "property", ph: [1,2,3], tip: "Check in on your active properties" },
  "Offer Status": { vid: "offer", ph: [2,3], tip: "Update the status on your offers" },
  "Priority": { vid: "priority", ph: [1,2,3], tip: "Set priority level on your deals" },
  "Add Property": { vid: "property", ph: [1,2,3], tip: "Add new properties to your pipeline" },
  "Favorites": { vid: "property", ph: [1,2,3], tip: "Mark your best deals as favorites" },
  "Agent Deals": { vid: "agentprofile", ph: [2,3], tip: "View deals from your agents" },
  "Comps List": { vid: "comps", ph: [2,3], tip: "Review the comps list for your deals" },
  "Update Negotiation": { vid: "offer", ph: [2,3], tip: "Update your negotiation status" },
  "My Stats": { vid: "nav", ph: [1,2,3], tip: "Check your performance stats" },
  "DispoPro": { vid: "nav", ph: [2,3], tip: "Use DispoPro for deal disposition" },
  "Quick Links": { vid: "nav", ph: [1,2,3], tip: "Access quick links for common tasks" },
  "Login": { vid: "nav", ph: [1,2,3], tip: "Log in to FlipiQ daily" },
  "Script Practice": { vid: "outreach", ph: [1,2], tip: "Practice your call scripts" },
  "Post-call": { vid: "outreach", ph: [1,2,3], tip: "Complete your post-call notes" },
  "EOD Stats": { vid: "nav", ph: [1,2,3], tip: "Review your end-of-day stats" },
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

function parseMarDate(s) {
  if (!s) return null;
  const d = parseInt(s.replace("Mar ", ""));
  return isNaN(d) ? null : d;
}
function startDate(day) {
  const ref = new Date(2026, 2, 21);
  ref.setDate(ref.getDate() - day + 1);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[ref.getMonth()] + " " + ref.getDate();
}
function lagDays(userDay, firstStr) {
  if (!firstStr) return null;
  const fd = parseMarDate(firstStr);
  if (fd === null) return null;
  const sd = 21 - userDay + 1;
  return fd - sd;
}
function fmtLag(lg) {
  if (lg === null) return "—";
  if (lg <= 0) return "D1";
  return "D" + (lg + 1);
}

const UL = [
  { uid: 14, fn: "Johnny", ln: "Catala", lid: "jcatala", st: "Active", fl: null, ll: null, tl: 0, co: "TD Realty", email: "johnny.catala@tdrealty.com", ph: "(555) 301-1401", esrc: "smtp.tdrealty.com", epwd: "••••••••", besrc: "bulk.tdrealty.com", bepwd: "••••••••", baddr: "outreach@tdrealty.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10014", dpn: "+15553011401", duid: "dp-jcatala" },
  { uid: 15, fn: "Daniel", ln: "Worby", lid: "dworby", st: "Active", fl: "Mar 19, 2026 08:12", ll: "Mar 19, 2026 08:12", tl: 1, co: "TD Realty", email: "daniel.worby@tdrealty.com", ph: "(555) 301-1502", esrc: "smtp.tdrealty.com", epwd: "••••••••", besrc: "bulk.tdrealty.com", bepwd: "••••••••", baddr: "outreach@tdrealty.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10015", dpn: "+15553011502", duid: "dp-dworby" },
  { uid: 11, fn: "Roman", ln: "Bracamonte", lid: "rbracamonte", st: "Active", fl: "Mar 16, 2026 07:45", ll: "Mar 18, 2026 09:30", tl: 3, co: "Hegemark", email: "roman.bracamonte@hegemark.com", ph: "(555) 302-1101", esrc: "smtp.hegemark.com", epwd: "••••••••", besrc: "bulk.hegemark.com", bepwd: "••••••••", baddr: "outreach@hegemark.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10011", dpn: "+15553021101", duid: "dp-rbracamonte" },
  { uid: 5, fn: "Jesus", ln: "Valdez", lid: "jvaldez", st: "Active", fl: "Mar 18, 2026 10:22", ll: "Mar 20, 2026 14:05", tl: 4, co: "Coko Homes", email: "jesus.valdez@cokohomes.com", ph: "(555) 300-0501", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10005", dpn: "+15553000501", duid: "dp-jvaldez" },
  { uid: 21, fn: "Trevor", ln: "Kelly", lid: "tkelly", st: "Active", fl: "Jan 6, 2026 09:00", ll: "Mar 18, 2026 16:42", tl: 148, co: "Fair Close", email: "trevor.kelly@fairclose.com", ph: "(555) 304-2101", esrc: "smtp.fairclose.com", epwd: "••••••••", besrc: "bulk.fairclose.com", bepwd: "••••••••", baddr: "outreach@fairclose.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10021", dpn: "+15553042101", duid: "dp-tkelly" },
  { uid: 4, fn: "Duk", ln: "Lim", lid: "dlim", st: "Active", fl: "Mar 17, 2026 08:30", ll: "Mar 21, 2026 07:55", tl: 8, co: "Coko Homes", email: "duk.lim@cokohomes.com", ph: "(555) 300-0401", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10004", dpn: "+15553000401", duid: "dp-dlim" },
  { uid: 16, fn: "Brooke", ln: "Stiner", lid: "bstiner", st: "Active", fl: "Mar 19, 2026 09:10", ll: "Mar 21, 2026 08:45", tl: 5, co: "TD Realty", email: "brooke.stiner@tdrealty.com", ph: "(555) 301-1603", esrc: "smtp.tdrealty.com", epwd: "••••••••", besrc: "bulk.tdrealty.com", bepwd: "••••••••", baddr: "outreach@tdrealty.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10016", dpn: "+15553011603", duid: "dp-bstiner" },
  { uid: 19, fn: "Isaac", ln: "Haro", lid: "iharo", st: "Active", fl: "Mar 15, 2026 07:30", ll: "Mar 21, 2026 09:12", tl: 14, co: "STJ Investments", email: "isaac.haro@stjinvestments.com", ph: "(555) 303-1901", esrc: "smtp.stjinvestments.com", epwd: "••••••••", besrc: "bulk.stjinvestments.com", bepwd: "••••••••", baddr: "outreach@stjinvestments.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10019", dpn: "+15553031901", duid: "dp-iharo" },
  { uid: 3, fn: "Chris", ln: "Dragich", lid: "cdragich", st: "Active", fl: "Mar 8, 2026 08:00", ll: "Mar 21, 2026 10:30", tl: 28, co: "Coko Homes", email: "chris.dragich@cokohomes.com", ph: "(555) 300-0301", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10003", dpn: "+15553000301", duid: "dp-cdragich" },
  { uid: 13, fn: "Juan", ln: "Torres", lid: "jtorres", st: "Active", fl: "Mar 12, 2026 07:50", ll: "Mar 21, 2026 09:00", tl: 20, co: "TD Realty", email: "juan.torres@tdrealty.com", ph: "(555) 301-1304", esrc: "smtp.tdrealty.com", epwd: "••••••••", besrc: "bulk.tdrealty.com", bepwd: "••••••••", baddr: "outreach@tdrealty.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10013", dpn: "+15553011304", duid: "dp-jtorres" },
  { uid: 10, fn: "Maxwell", ln: "Irungu", lid: "mirungu", st: "Active", fl: "Mar 10, 2026 08:15", ll: "Mar 21, 2026 08:50", tl: 24, co: "Hegemark", email: "maxwell.irungu@hegemark.com", ph: "(555) 302-1002", esrc: "smtp.hegemark.com", epwd: "••••••••", besrc: "bulk.hegemark.com", bepwd: "••••••••", baddr: "outreach@hegemark.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10010", dpn: "+15553021002", duid: "dp-mirungu" },
  { uid: 2, fn: "Jared", ln: "Lynch", lid: "jlynch", st: "Active", fl: "Feb 12, 2026 08:00", ll: "Mar 21, 2026 11:20", tl: 72, co: "Coko Homes", email: "jared.lynch@cokohomes.com", ph: "(555) 300-0201", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10002", dpn: "+15553000201", duid: "dp-jlynch" },
  { uid: 7, fn: "Shaun", ln: "Alan", lid: "salan", st: "Active", fl: "Mar 4, 2026 07:40", ll: "Mar 21, 2026 09:35", tl: 36, co: "Coko Homes", email: "shaun.alan@cokohomes.com", ph: "(555) 300-0701", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10007", dpn: "+15553000701", duid: "dp-salan" },
  { uid: 6, fn: "Rod", ln: "Vianna", lid: "rvianna", st: "Active", fl: "Feb 24, 2026 08:10", ll: "Mar 21, 2026 10:15", tl: 52, co: "Coko Homes", email: "rod.vianna@cokohomes.com", ph: "(555) 300-0601", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10006", dpn: "+15553000601", duid: "dp-rvianna" },
  { uid: 12, fn: "Elizabeth", ln: "Puga", lid: "epuga", st: "Active", fl: "Mar 7, 2026 08:20", ll: "Mar 21, 2026 08:40", tl: 30, co: "Hegemark", email: "elizabeth.puga@hegemark.com", ph: "(555) 302-1203", esrc: "smtp.hegemark.com", epwd: "••••••••", besrc: "bulk.hegemark.com", bepwd: "••••••••", baddr: "outreach@hegemark.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10012", dpn: "+15553021203", duid: "dp-epuga" },
  { uid: 18, fn: "Lauren", ln: "Robles", lid: "lrobles", st: "Active", fl: "Mar 6, 2026 09:00", ll: "Mar 21, 2026 09:55", tl: 32, co: "STJ Investments", email: "lauren.robles@stjinvestments.com", ph: "(555) 303-1802", esrc: "smtp.stjinvestments.com", epwd: "••••••••", besrc: "bulk.stjinvestments.com", bepwd: "••••••••", baddr: "outreach@stjinvestments.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10018", dpn: "+15553031802", duid: "dp-lrobles" },
  { uid: 1, fn: "Miguel", ln: "Rivera", lid: "mrivera", st: "Active", fl: "Feb 5, 2026 07:30", ll: "Mar 21, 2026 11:00", tl: 90, co: "Coko Homes", email: "miguel.rivera@cokohomes.com", ph: "(555) 300-0101", esrc: "smtp.cokohomes.com", epwd: "••••••••", besrc: "bulk.cokohomes.com", bepwd: "••••••••", baddr: "outreach@cokohomes.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10001", dpn: "+15553000101", duid: "dp-mrivera" },
  { uid: 8, fn: "Michael", ln: "May", lid: "mmay", st: "Active", fl: "Jan 21, 2026 08:00", ll: "Mar 21, 2026 10:45", tl: 120, co: "Hegemark", email: "michael.may@hegemark.com", ph: "(555) 302-0802", esrc: "smtp.hegemark.com", epwd: "••••••••", besrc: "bulk.hegemark.com", bepwd: "••••••••", baddr: "outreach@hegemark.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10008", dpn: "+15553020802", duid: "dp-mmay" },
  { uid: 9, fn: "Alek", ln: "Tan", lid: "atan", st: "Active", fl: "Jan 31, 2026 08:30", ll: "Mar 21, 2026 09:20", tl: 100, co: "Hegemark", email: "alek.tan@hegemark.com", ph: "(555) 302-0903", esrc: "smtp.hegemark.com", epwd: "••••••••", besrc: "bulk.hegemark.com", bepwd: "••••••••", baddr: "outreach@hegemark.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10009", dpn: "+15553020903", duid: "dp-atan" },
  { uid: 17, fn: "Steve", ln: "Medina", lid: "smedina", st: "Active", fl: "Feb 10, 2026 09:15", ll: "Mar 21, 2026 10:10", tl: 80, co: "STJ Investments", email: "steve.medina@stjinvestments.com", ph: "(555) 303-1703", esrc: "smtp.stjinvestments.com", epwd: "••••••••", besrc: "bulk.stjinvestments.com", bepwd: "••••••••", baddr: "outreach@stjinvestments.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10017", dpn: "+15553031703", duid: "dp-smedina" },
  { uid: 20, fn: "Josh", ln: "Santos", lid: "jsantos", st: "Active", fl: "Dec 22, 2025 07:45", ll: "Mar 21, 2026 11:30", tl: 180, co: "Fair Close", email: "josh.santos@fairclose.com", ph: "(555) 304-2002", esrc: "smtp.fairclose.com", epwd: "••••••••", besrc: "bulk.fairclose.com", bepwd: "••••••••", baddr: "outreach@fairclose.com", enpwd: "••••••••", benpwd: "••••••••", cid: "CID-10020", dpn: "+15553042002", duid: "dp-jsantos" },
];

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
  { id: 14, n: "Johnny Catala", org: 3, ph: 1, day: 3, health: "red", ps: 1, gaps: ["NEVER LOGGED IN"], agenda: "CRITICAL: Day 3, NEVER logged in.", vid: "nav", ec: 2, s: { tx: 0, em: 0, ca: 0, cc: 0, nr: 0, up: 0, op: 0, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 0, piq: 0, comp: 0, ia: 0, off: 0, ag: 0, ck: false, mls: 0, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 15, n: "Daniel Worby", org: 3, ph: 1, day: 3, health: "red", ps: 1, gaps: ["2 days inactive"], agenda: "Day 3, disappeared.", vid: "nav", ec: 1, s: { tx: 1, em: 0, ca: 1, cc: 1, nr: 0, up: 0, op: 2, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 12, piq: 0, comp: 0, ia: 0, off: 0, ag: 5, ck: false, mls: 2, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 11, n: "Roman Bracamonte", org: 2, ph: 1, day: 6, health: "red", ps: 1, gaps: ["3 days inactive"], agenda: "ESCALATE to AM.", vid: "outreach", ec: 3, s: { tx: 3, em: 2, ca: 5, cc: 3, nr: 1, up: 0, op: 8, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 45, piq: 5, comp: 0, ia: 0, off: 0, ag: 15, ck: false, mls: 6, dm: 0, cold: 2, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 5, n: "Jesus Valdez", org: 1, ph: 1, day: 4, health: "red", ps: 1, gaps: ["Zero calls"], agenda: "Day 4, zero calls.", vid: "nav", ec: 2, s: { tx: 2, em: 0, ca: 0, cc: 0, nr: 0, up: 0, op: 1, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 8, piq: 0, comp: 0, ia: 0, off: 0, ag: 0, ck: false, mls: 1, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 21, n: "Trevor Kelly", org: 5, ph: 3, day: 75, health: "orange", ps: 2, gaps: ["3 days offline"], agenda: "75-day vet, 3 days off.", vid: null, ec: 1, s: { tx: 180, em: 95, ca: 220, cc: 165, nr: 15, up: 8, op: 120, re: 45, of: 42, ng: 8, ac: 3, aq: 1, mn: 4800, piq: 400, comp: 350, ia: 280, off: 320, ag: 600, ck: false, mls: 80, dm: 15, cold: 20, ref: 5, pH: 12, pW: 8 }, y: { tx: 0, em: 0, ca: 0, of: 0, op: 0 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 4, n: "Duk Lim", org: 1, ph: 1, day: 5, health: "orange", ps: 2, gaps: ["No micro-skills"], agenda: "Day 5, 3 calls.", vid: "property", ec: 1, s: { tx: 5, em: 1, ca: 3, cc: 2, nr: 1, up: 0, op: 4, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 35, piq: 5, comp: 0, ia: 0, off: 0, ag: 10, ck: true, mls: 4, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 2, em: 0, ca: 1, of: 0, op: 2 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 16, n: "Brooke Stiner", org: 3, ph: 1, day: 3, health: "orange", ps: 2, gaps: ["Micro-skills incomplete"], agenda: "Day 3.", vid: "property", ec: 0, s: { tx: 3, em: 0, ca: 2, cc: 1, nr: 0, up: 0, op: 3, re: 0, of: 0, ng: 0, ac: 0, aq: 0, mn: 22, piq: 0, comp: 0, ia: 0, off: 0, ag: 8, ck: true, mls: 3, dm: 0, cold: 0, ref: 0, pH: 0, pW: 0 }, y: { tx: 1, em: 0, ca: 1, of: 0, op: 1 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 19, n: "Isaac Haro", org: 4, ph: 1, day: 7, health: "yellow", ps: 2, gaps: ["No offers"], agenda: "Day 7 graduation.", vid: "offer", ec: 0, s: { tx: 8, em: 3, ca: 6, cc: 4, nr: 2, up: 0, op: 10, re: 1, of: 0, ng: 0, ac: 0, aq: 0, mn: 120, piq: 15, comp: 0, ia: 0, off: 0, ag: 30, ck: true, mls: 8, dm: 1, cold: 1, ref: 0, pH: 1, pW: 0 }, y: { tx: 2, em: 1, ca: 2, of: 0, op: 3 }, g: { ca: 30, of: 3, ct: 50 } },
  { id: 3, n: "Chris Dragich", org: 1, ph: 2, day: 14, health: "yellow", ps: 3, gaps: ["Comps never opened"], agenda: "1 offer without comps.", vid: "comps", ec: 1, s: { tx: 45, em: 20, ca: 15, cc: 10, nr: 5, up: 2, op: 30, re: 8, of: 1, ng: 0, ac: 0, aq: 0, mn: 680, piq: 60, comp: 0, ia: 0, off: 15, ag: 120, ck: true, mls: 25, dm: 3, cold: 2, ref: 0, pH: 3, pW: 2 }, y: { tx: 5, em: 2, ca: 3, of: 0, op: 4 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 13, n: "Juan Torres", org: 3, ph: 2, day: 10, health: "yellow", ps: 3, gaps: ["Low calls"], agenda: "8 calls vs 50.", vid: "ia", ec: 0, s: { tx: 25, em: 12, ca: 8, cc: 5, nr: 3, up: 1, op: 18, re: 3, of: 1, ng: 0, ac: 0, aq: 0, mn: 420, piq: 35, comp: 20, ia: 0, off: 10, ag: 80, ck: true, mls: 15, dm: 2, cold: 1, ref: 0, pH: 2, pW: 1 }, y: { tx: 3, em: 1, ca: 2, of: 0, op: 2 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 10, n: "Maxwell Irungu", org: 2, ph: 2, day: 12, health: "yellow", ps: 3, gaps: ["Comps unused"], agenda: "1 offer without comps.", vid: "comps", ec: 1, s: { tx: 30, em: 15, ca: 10, cc: 7, nr: 4, up: 1, op: 22, re: 5, of: 1, ng: 0, ac: 0, aq: 0, mn: 540, piq: 45, comp: 0, ia: 10, off: 12, ag: 100, ck: true, mls: 18, dm: 2, cold: 2, ref: 0, pH: 2, pW: 2 }, y: { tx: 4, em: 2, ca: 3, of: 1, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 2, n: "Jared Lynch", org: 1, ph: 3, day: 38, health: "yellow", ps: 3, gaps: ["Comps unused 8d"], agenda: "1 deal. Comps cold.", vid: "priority", ec: 1, s: { tx: 120, em: 65, ca: 22, cc: 16, nr: 12, up: 5, op: 85, re: 30, of: 28, ng: 4, ac: 2, aq: 1, mn: 3200, piq: 280, comp: 180, ia: 150, off: 200, ag: 420, ck: true, mls: 60, dm: 10, cold: 10, ref: 5, pH: 8, pW: 5 }, y: { tx: 8, em: 4, ca: 5, of: 2, op: 6 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 7, n: "Shaun Alan", org: 1, ph: 2, day: 18, health: "yellow", ps: 3, gaps: ["Notes empty"], agenda: "2 offers no deals.", vid: "property", ec: 0, s: { tx: 40, em: 22, ca: 18, cc: 12, nr: 6, up: 2, op: 28, re: 6, of: 2, ng: 0, ac: 0, aq: 0, mn: 780, piq: 65, comp: 40, ia: 20, off: 25, ag: 140, ck: true, mls: 22, dm: 3, cold: 3, ref: 0, pH: 3, pW: 2 }, y: { tx: 4, em: 3, ca: 4, of: 1, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 6, n: "Rod Vianna", org: 1, ph: 3, day: 26, health: "yellow", ps: 3, gaps: ["Campaigns cold 12d"], agenda: "Campaigns cold.", vid: "campaigns", ec: 1, s: { tx: 90, em: 48, ca: 28, cc: 20, nr: 10, up: 4, op: 65, re: 22, of: 18, ng: 3, ac: 1, aq: 1, mn: 2400, piq: 200, comp: 140, ia: 120, off: 160, ag: 350, ck: true, mls: 45, dm: 8, cold: 8, ref: 4, pH: 6, pW: 4 }, y: { tx: 6, em: 3, ca: 4, of: 1, op: 5 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 12, n: "Elizabeth Puga", org: 2, ph: 2, day: 15, health: "yellow", ps: 3, gaps: ["Agent Profile unused"], agenda: "Surface outreach.", vid: "agentprofile", ec: 0, s: { tx: 35, em: 18, ca: 12, cc: 8, nr: 5, up: 2, op: 25, re: 4, of: 2, ng: 0, ac: 0, aq: 0, mn: 620, piq: 50, comp: 35, ia: 25, off: 18, ag: 110, ck: true, mls: 20, dm: 3, cold: 2, ref: 0, pH: 3, pW: 1 }, y: { tx: 4, em: 2, ca: 3, of: 1, op: 4 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 18, n: "Lauren Robles", org: 4, ph: 2, day: 16, health: "yellow", ps: 3, gaps: ["IA once"], agenda: "1 offer.", vid: "ia", ec: 0, s: { tx: 38, em: 20, ca: 14, cc: 9, nr: 5, up: 3, op: 24, re: 5, of: 1, ng: 0, ac: 0, aq: 0, mn: 700, piq: 55, comp: 40, ia: 8, off: 15, ag: 120, ck: true, mls: 19, dm: 3, cold: 2, ref: 0, pH: 2, pW: 2 }, y: { tx: 5, em: 2, ca: 3, of: 0, op: 3 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 1, n: "Miguel Rivera", org: 1, ph: 3, day: 45, health: "green", ps: 4, gaps: [], agenda: "2 deals.", vid: null, ec: 0, s: { tx: 160, em: 85, ca: 38, cc: 28, nr: 18, up: 8, op: 110, re: 40, of: 52, ng: 6, ac: 4, aq: 2, mn: 5400, piq: 450, comp: 380, ia: 300, off: 350, ag: 550, ck: true, mls: 70, dm: 15, cold: 18, ref: 7, pH: 10, pW: 6 }, y: { tx: 10, em: 5, ca: 8, of: 3, op: 8 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 8, n: "Michael May", org: 2, ph: 3, day: 60, health: "green", ps: 4, gaps: [], agenda: "Star. 3 deals.", vid: null, ec: 0, s: { tx: 200, em: 110, ca: 45, cc: 34, nr: 22, up: 12, op: 140, re: 55, of: 68, ng: 10, ac: 5, aq: 3, mn: 7200, piq: 600, comp: 500, ia: 420, off: 480, ag: 700, ck: true, mls: 90, dm: 20, cold: 22, ref: 8, pH: 15, pW: 8 }, y: { tx: 12, em: 6, ca: 9, of: 4, op: 10 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 9, n: "Alek Tan", org: 2, ph: 3, day: 50, health: "green", ps: 4, gaps: [], agenda: "2 deals.", vid: null, ec: 0, s: { tx: 150, em: 80, ca: 30, cc: 22, nr: 14, up: 7, op: 95, re: 35, of: 45, ng: 7, ac: 4, aq: 2, mn: 6000, piq: 500, comp: 420, ia: 350, off: 400, ag: 600, ck: true, mls: 60, dm: 14, cold: 15, ref: 6, pH: 12, pW: 7 }, y: { tx: 8, em: 4, ca: 6, of: 3, op: 7 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 17, n: "Steve Medina", org: 4, ph: 3, day: 40, health: "green", ps: 4, gaps: [], agenda: "On target.", vid: null, ec: 0, s: { tx: 140, em: 75, ca: 35, cc: 26, nr: 16, up: 6, op: 90, re: 32, of: 48, ng: 8, ac: 3, aq: 2, mn: 4800, piq: 400, comp: 340, ia: 280, off: 320, ag: 520, ck: true, mls: 58, dm: 12, cold: 14, ref: 6, pH: 10, pW: 6 }, y: { tx: 9, em: 4, ca: 7, of: 3, op: 6 }, g: { ca: 50, of: 5, ct: 50 } },
  { id: 20, n: "Josh Santos", org: 5, ph: 3, day: 90, health: "green", ps: 4, gaps: [], agenda: "Model AA. 4 deals.", vid: null, ec: 0, s: { tx: 280, em: 150, ca: 50, cc: 40, nr: 30, up: 15, op: 200, re: 80, of: 95, ng: 15, ac: 8, aq: 4, mn: 10800, piq: 900, comp: 750, ia: 620, off: 700, ag: 1000, ck: true, mls: 120, dm: 30, cold: 35, ref: 15, pH: 20, pW: 12 }, y: { tx: 14, em: 7, ca: 10, of: 5, op: 12 }, g: { ca: 50, of: 5, ct: 50 } },
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
    const fs = c.events.filter((e) => e.first).map((e) => e.first).sort((a, b) => (parseMarDate(a) || 0) - (parseMarDate(b) || 0));
    const ls = c.events.filter((e) => e.last).map((e) => e.last).sort((a, b) => (parseMarDate(a) || 0) - (parseMarDate(b) || 0));
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

function gME(u) {
  const missing = [];
  const gaps = [];
  const cooling = [];
  C.forEach((cat, ci) => {
    cat.ev.forEach((eName, ei) => {
      const evMeta = EV[eName];
      if (!evMeta || !evMeta.ph.includes(u.ph)) return;
      const st = g3(u.health, ci, ei);
      if (st.st === 0) missing.push({ name: eName, cat: cat.n, vid: evMeta.vid, tip: evMeta.tip, st: 0 });
      else if (st.st === 1) gaps.push({ name: eName, cat: cat.n, vid: evMeta.vid, tip: evMeta.tip, st: 1 });
      else if (st.st === 2) cooling.push({ name: eName, cat: cat.n, vid: evMeta.vid, tip: evMeta.tip, st: 2 });
    });
  });
  return { missing, gaps, cooling };
}

function gEH(u) {
  if (u.ec === 0) return [];
  const hist = [];
  const today = new Date(2026, 2, 21);
  const { missing, gaps, cooling } = gME(u);
  const allIssues = [...missing, ...gaps, ...cooling];
  for (let i = 0; i < u.ec; i++) {
    const daysAgo = Math.min(u.ec - i, u.day - 1);
    const dt = new Date(today);
    dt.setDate(dt.getDate() - daysAgo);
    const isLast = i === u.ec - 1;
    const escalated = u.ec >= 3 && isLast;
    const offset = i * 3;
    const targets = allIssues.length > 0 ? allIssues.slice(offset % allIssues.length, (offset % allIssues.length) + 3).concat(allIssues.slice(0, Math.max(0, 3 - (allIssues.length - (offset % allIssues.length))))).slice(0, 3) : [];
    const vidKey = targets.length > 0 ? targets[0].vid : u.vid;
    const vObj = vidKey ? V[vidKey] : null;
    const acted = i < u.ec - 1 ? targets.filter((_, ti) => (i * 7 + ti * 3) % 5 > 2) : [];
    const ignored = i < u.ec - 1 ? targets.filter((t) => !acted.includes(t)) : [];
    let su;
    if (escalated) su = "ESCALATION: " + u.n + " \u2014 " + u.ec + " emails sent, needs AM review";
    else if (u.health === "red" && missing.length > 5) su = "Getting Started: " + targets.map((t) => t.name).slice(0, 2).join(" + ");
    else if (targets.length > 0 && acted.length > 0 && i < u.ec - 1) su = "Nice work on " + acted[0].name + "! Next: " + ignored.slice(0, 2).map((t) => t.name).join(", ");
    else if (targets.length > 0) su = "Today's focus: " + targets.map((t) => t.name).slice(0, 2).join(" + ") + (vObj ? " [" + vObj[1] + " video]" : "");
    else su = "FlipiQ Daily Update \u2014 Day " + (u.day - daysAgo);
    const ty = escalated ? "escalation" : u.health === "red" ? "onboarding" : acted.length > 0 ? "coaching" : gaps.length > 0 || cooling.length > 0 ? "reactivation" : "coaching";
    const nm = u.n.split(" ")[0];
    const dayThen = u.day - daysAgo;
    let body;
    const histSig = "\n\u2014\nRamy | CSM Lead, FlipiQ\nramy@flipiq.com | (555) 412-8800\nBook a call: https://calendly.com/ramy-flipiq/15min";
    const fakeYCa = Math.max(0, Math.round(u.y.ca * (0.6 + i * 0.15)));
    const fakeYTx = Math.max(0, Math.round(u.y.tx * (0.5 + i * 0.2)));
    const fakeYOf = Math.max(0, Math.round(u.y.of * (0.4 + i * 0.25)));
    const fakeYTotal = fakeYCa + fakeYTx;
    if (escalated) {
      const o = O.find((x) => x.id === u.org);
      body = "Hi " + (o?.am || "AM") + ",\n\n" + u.n + " has received " + u.ec + " coaching emails without improvement.\n\n";
      body += "\u2500\u2500\u2500 YESTERDAY'S REPORT \u2500\u2500\u2500\n";
      body += "Calls: " + fakeYCa + " | Texts: " + fakeYTx + " | Offers: " + fakeYOf + "\n\n";
      body += "\u2500\u2500\u2500 CURRENT STATUS \u2500\u2500\u2500\n";
      body += "Phase: " + PN[u.ph] + " | Day " + dayThen + "\n";
      body += "Calls: " + u.s.ca + "/" + u.g.ca + " | Offers: " + u.s.of + "/" + u.g.of + "\n";
      body += "Gaps: " + u.gaps.join(", ") + "\n\n";
      body += "Please intervene directly." + histSig;
    } else {
      body = "Hi " + nm + ",\n\n";
      body += "\u2500\u2500\u2500 YESTERDAY'S REPORT \u2500\u2500\u2500\n";
      if (fakeYTotal > 0) {
        if (fakeYCa > 0) body += "\u2022 " + fakeYCa + " call" + (fakeYCa !== 1 ? "s" : "") + "\n";
        if (fakeYTx > 0) body += "\u2022 " + fakeYTx + " text" + (fakeYTx !== 1 ? "s" : "") + "\n";
        if (fakeYOf > 0) body += "\u2022 " + fakeYOf + " offer" + (fakeYOf !== 1 ? "s" : "") + "\n";
        body += "Total: " + fakeYTotal + " touches\n";
      } else { body += "No activity logged.\n"; }
      body += "\n";
      if (acted.length > 0) { body += "\u2500\u2500\u2500 PROGRESS \u2500\u2500\u2500\n"; acted.forEach((a) => (body += "\u2713 " + a.name + " \u2014 done!\n")); body += "\n"; }
      body += "\u2500\u2500\u2500 TOP 3 PRIORITIES \u2500\u2500\u2500\n";
      const histPri = [];
      if (!u.s.ck) histPri.push("Complete daily check-in");
      if (u.s.ca < u.g.ca) histPri.push("Make " + u.g.ca + " calls today");
      if (targets.length > 0) histPri.push("Start using " + targets[0].name);
      if (histPri.length < 3 && u.s.of < u.g.of) histPri.push("Submit " + u.g.of + " offers");
      if (histPri.length < 3) histPri.push("Review My Stats");
      histPri.slice(0, 3).forEach((p, pi) => (body += (pi + 1) + ". " + p + "\n"));
      body += "\nDay " + dayThen + " " + PN[u.ph] + ".\n\n";
      if (targets.length > 0) {
        body += "\u2500\u2500\u2500 TODAY'S FOCUS \u2500\u2500\u2500\n";
        targets.forEach((t, ti) => {
          const stLabel = t.st === 0 ? "Never used" : t.st === 1 ? "Used once, dropped" : "Gone cold";
          body += (ti + 1) + ". " + t.name + " (" + t.cat + ") \u2014 " + stLabel + "\n   \u2192 " + t.tip + "\n";
        });
        body += "\n";
      }
      if (ignored.length > 0) body += "\u2500\u2500\u2500 STILL PENDING \u2500\u2500\u2500\n" + ignored.map((a) => "\u2022 " + a.name).join("\n") + "\n\n";
      if (vObj) body += "\u25B6 WATCH (" + vObj[1] + "): " + vObj[0] + "\n\n";
      body += "Need help? Use the iQ Help Bot \u2014 chat icon in COMMAND." + histSig;
    }
    hist.push({
      id: i + 1,
      ts: dt.getTime(),
      date: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: (7 + (i % 3)) + ":00 AM",
      subject: su,
      type: escalated ? "escalation" : ty,
      to: escalated ? (O.find((o) => o.id === u.org)?.am || "AM") : u.n,
      escalated,
      targets,
      video: vObj ? { key: vidKey, title: vObj[0], dur: vObj[1] } : null,
      acted: acted.map((a) => a.name),
      ignored: ignored.map((a) => a.name),
      body,
    });
  }
  return hist;
}

function bE(u) {
  const o = O.find((x) => x.id === u.org);
  const nm = u.n.split(" ")[0];
  const ie = u.ec >= 3;
  const ca = gc(u);
  const ys = u.y;
  const s = u.s;
  const { missing, gaps, cooling } = gME(u);
  const prevHist = gEH(u);
  const prevActed = prevHist.flatMap((h) => h.acted || []);
  const prevIgnored = prevHist.flatMap((h) => h.ignored || []);
  const priority = [...missing.filter((e) => !prevActed.includes(e.name)), ...gaps.filter((e) => !prevActed.includes(e.name)), ...cooling.filter((e) => prevIgnored.includes(e.name))];
  const todayTargets = priority.slice(0, 3);
  const topVidKey = todayTargets.length > 0 ? todayTargets[0].vid : u.vid;
  const topVid = topVidKey ? V[topVidKey] : null;
  const sig = "\n\u2014\nRamy | CSM Lead, FlipiQ\nramy@flipiq.com | (555) 412-8800\nBook a call: https://calendly.com/ramy-flipiq/15min";
  const top3 = [];
  if (!s.ck) top3.push({ action: "Complete your daily check-in in iQ", why: "Nothing fires until check-in is done", link: "Open COMMAND \u2192 iQ Check-In" });
  if (s.ca < u.g.ca) top3.push({ action: "Make " + (u.g.ca - s.ca) + " more calls today (goal: " + u.g.ca + ")", why: "Calls drive pipeline \u2014 " + s.ca + " of " + u.g.ca + " so far", link: "Open Daily Outreach \u2192 Call from Outreach" });
  if (s.of < u.g.of) top3.push({ action: "Submit " + (u.g.of - s.of) + " more offers (goal: " + u.g.of + ")", why: s.of + " offers vs " + u.g.of + " target", link: "Deal Review \u2192 Offer Terms \u2192 Submit" });
  if (top3.length < 3 && missing.length > 0) top3.push({ action: "Start using " + missing[0].name, why: "Never used \u2014 " + missing[0].tip, link: missing[0].cat + " \u2192 " + missing[0].name });
  if (top3.length < 3 && gaps.length > 0) top3.push({ action: "Re-open " + gaps[0].name, why: "Used once, then dropped", link: gaps[0].cat + " \u2192 " + gaps[0].name });
  if (top3.length < 3 && cooling.length > 0) top3.push({ action: "Keep up " + cooling[0].name, why: "Usage slowing", link: cooling[0].cat + " \u2192 " + cooling[0].name });
  if (top3.length < 3) top3.push({ action: "Review your My Stats dashboard", why: "Track your progress", link: "Tools \u2192 My Stats" });
  const top3List = top3.slice(0, 3);
  if (ie) {
    let escalBody = "Hi " + o.am + ",\n\n" + u.n + " has received " + u.ec + " coaching emails without improvement and needs your direct attention.\n\n";
    escalBody += "\u2500\u2500\u2500 YESTERDAY'S REPORT \u2500\u2500\u2500\n";
    escalBody += "Calls: " + ys.ca + " | Texts: " + ys.tx + " | Emails: " + ys.em + " | Offers: " + ys.of + "\n";
    escalBody += "Total activity: " + (ys.ca + ys.tx + ys.em) + " touches\n\n";
    escalBody += "\u2500\u2500\u2500 CURRENT STATUS \u2500\u2500\u2500\n";
    escalBody += "Phase: " + PN[u.ph] + " | Day " + u.day + "\n";
    escalBody += "Calls: " + s.ca + "/" + u.g.ca + " | Offers: " + s.of + "/" + u.g.of + " | Deals: " + s.aq + "/2\n";
    escalBody += "Gaps: " + u.gaps.join(", ") + "\n\n";
    escalBody += "Events sent but not acted on:\n" + prevIgnored.slice(0, 5).map((n) => "\u2022 " + n).join("\n") + "\n\n";
    escalBody += "Please intervene directly." + sig;
    return { to: o.am + " (AM)", su: "ACTION NEEDED: " + u.n + " \u2014 " + u.ec + " emails, needs AM review", bo: escalBody, ie: true, uid: u.id, targets: todayTargets, video: topVid ? { key: topVidKey, title: topVid[0], dur: topVid[1] } : null };
  }
  let b = "Hi " + nm + ",\n\n";
  const yT = ys.tx + ys.em + ys.ca;
  b += "\u2500\u2500\u2500 YESTERDAY'S REPORT \u2500\u2500\u2500\n";
  if (yT > 0) {
    if (ys.ca > 0) b += "\u2022 " + ys.ca + " call" + (ys.ca !== 1 ? "s" : "") + (ys.ca >= u.g.ca ? " \u2714 hit goal!" : "") + "\n";
    if (ys.tx > 0) b += "\u2022 " + ys.tx + " text" + (ys.tx !== 1 ? "s" : "") + "\n";
    if (ys.em > 0) b += "\u2022 " + ys.em + " email" + (ys.em !== 1 ? "s" : "") + "\n";
    if (ys.of > 0) b += "\u2022 " + ys.of + " offer" + (ys.of !== 1 ? "s" : "") + " submitted!\n";
    if (ys.op > 0) b += "\u2022 " + ys.op + " new propert" + (ys.op !== 1 ? "ies" : "y") + "\n";
    b += "Total: " + yT + " touches\n";
  } else {
    b += "No activity logged yesterday.\n";
  }
  b += "\n";
  if (prevActed.length > 0) {
    b += "\u2500\u2500\u2500 PROGRESS \u2500\u2500\u2500\n";
    prevActed.slice(-3).forEach((a) => (b += "\u2713 " + a + " \u2014 done!\n"));
    b += "\n";
  }
  if (u.ph >= 2 && yT > 0) {
    const avg = u.day > 0 ? Math.round(s.ca / u.day) : 0;
    if (ys.ca > avg) b += "\u2191 Calls (" + ys.ca + ") above your avg (" + avg + "). Keep it up.\n\n";
  }
  b += "\u2500\u2500\u2500 TOP 3 PRIORITIES TODAY \u2500\u2500\u2500\n";
  top3List.forEach((p, i) => {
    b += (i + 1) + ". " + p.action + "\n   Why: " + p.why + "\n   How: " + p.link + "\n";
  });
  b += "\n";
  b += "Day " + u.day + " " + PN[u.ph] + ". " + (u.ph === 3 ? s.aq + " deal" + (s.aq !== 1 ? "s" : "") + "/2 target. " + (s.aq >= 2 ? "On pace!" : "Push offers.") : "") + (u.ph <= 2 ? s.of + " offers vs " + u.g.of + "/day target." : "") + "\n\n";
  if (ca) b += "\u26A0 ROOT CAUSE: " + ca + "\n\n";
  if (todayTargets.length > 0) {
    b += "\u2500\u2500\u2500 TODAY'S FOCUS: " + todayTargets.length + " EVENTS \u2500\u2500\u2500\n";
    todayTargets.forEach((t, i) => {
      const stLabel = t.st === 0 ? "Never used" : t.st === 1 ? "Used once, dropped" : "Gone cold";
      b += (i + 1) + ". " + t.name + " (" + t.cat + ") \u2014 " + stLabel + "\n   \u2192 " + t.tip + "\n";
    });
    b += "\n";
  }
  if (prevIgnored.length > 0) {
    const still = prevIgnored.filter((n) => todayTargets.some((t) => t.name === n));
    if (still.length > 0) b += "\u2500\u2500\u2500 STILL PENDING \u2500\u2500\u2500\n" + still.map((n) => "\u2022 " + n).join("\n") + "\n\n";
  }
  if (topVid) b += "\u25B6 WATCH (" + topVid[1] + "): " + topVid[0] + "\n   Short video tied to " + todayTargets[0]?.name + "\n\n";
  const totalEv = C.reduce((s, c) => s + c.ev.length, 0);
  b += "\u2500\u2500\u2500 YOUR NUMBERS \u2500\u2500\u2500\n";
  b += "Targets: " + u.g.ca + " calls | " + u.g.of + " offers | " + u.g.ct + " contacts\n";
  b += "Current: " + s.ca + "C | " + s.of + "O | " + (s.nr + s.up) + " contacts\n";
  b += "Adoption: " + (totalEv - missing.length - gaps.length - cooling.length) + "/" + totalEv + " active\n\n";
  b += "Need help? Use the iQ Help Bot \u2014 chat icon in COMMAND." + sig;
  const su = top3List.length > 0 ? "Day " + u.day + ": " + top3List[0].action + (top3List.length > 1 ? " + " + (top3List.length - 1) + " more" : "") + (topVid ? " [\u25B6 " + topVid[1] + "]" : "") : "FlipiQ Daily Update \u2014 Day " + u.day;
  return { to: u.n, su, bo: b, ie: false, uid: u.id, targets: todayTargets, video: topVid ? { key: topVidKey, title: topVid[0], dur: topVid[1] } : null };
}

const EL = [
  { ph: "P1", d: "D1", tr: "No login", em: "Welcome + login help", vi: "Nav", to: "AA", es: "Call", ev: ["Login", "iQ Check-In"] },
  { ph: "P1", d: "D1", tr: "Login no check-in", em: "iQ check-in starts day", vi: "Nav", to: "AA", es: "Monitor", ev: ["iQ Check-In", "Open Deal Review"] },
  { ph: "P1", d: "D2", tr: "Can't find Deal Review", em: "Here's where it is", vi: "Outreach", to: "AA", es: "Walkthrough", ev: ["Open Deal Review", "Open Daily Outreach"] },
  { ph: "P1", d: "D2", tr: "No calls yet", em: "First call instructions", vi: "Agent", to: "AA", es: "Call D3", ev: ["Call agent", "Call from Outreach"] },
  { ph: "P1", d: "D3", tr: "Notes never created", em: "[X] calls no notes", vi: "Property", to: "AA", es: "Call", ev: ["Add Note", "Follow-Up"] },
  { ph: "P1", d: "D3", tr: "Reminders never set", em: "[X] deals 0 reminders", vi: "Property", to: "AA", es: "Call", ev: ["Reminder", "To Do"] },
  { ph: "P1", d: "D3", tr: "Status never changed", em: "All deals None", vi: "Property", to: "AA", es: "Call", ev: ["Offer Status", "Priority"] },
  { ph: "P1", d: "D3", tr: "Priority never set", em: "Set H/M/L", vi: "Priority", to: "AA", es: "Call", ev: ["Priority", "Review High Priority"] },
  { ph: "P1", d: "D5", tr: "No workflow loop", em: "Do one together", vi: "Offer", to: "AA", es: "Training", ev: ["Offer Terms", "Investment Analysis"] },
  { ph: "P1", d: "D5", tr: "Comps never opened", em: "Can't offer without", vi: "Comps", to: "AA", es: "Walk", ev: ["Comps Map", "Comps Matrix"] },
  { ph: "P1", d: "D6-7", tr: "Silent on live", em: "Check in today", vi: "-", to: "AA+AM", es: "Escalate", ev: [] },
  { ph: "P1", d: "D7", tr: "Graduation", em: "Week 1 scorecard", vi: "Dashboard", to: "AA", es: "Extend", ev: ["My Stats", "EOD Stats"] },
  { ph: "P2", d: "D8", tr: "No daily pattern", em: "Consistency = deals", vi: "Outreach", to: "AA", es: "Call", ev: ["Open Daily Outreach", "Call from Outreach", "iQ Check-In"] },
  { ph: "P2", d: "Daily", tr: "Checklist not done", em: "STOP. Checklist first.", vi: "-", to: "AA", es: "Block", ev: ["iQ Check-In", "Report blockers", "Open Deal Review"] },
  { ph: "P2", d: "Daily", tr: "Offers=0 no comps", em: "BECAUSE no comps", vi: "Comps", to: "AA", es: "Walk", ev: ["Comps Map", "Comps Matrix", "Investment Analysis"] },
  { ph: "P2", d: "Daily", tr: "90% texts <10% calls", em: "Shift 30% to phone", vi: "-", to: "AA", es: "Flag", ev: ["Call agent", "Bulk Call"] },
  { ph: "P2", d: "7+d", tr: "Feature unused 7d", em: "[Feature] why it matters", vi: "Specific", to: "AA", es: "2,3,call", ev: ["(dynamic)"] },
  { ph: "P2", d: "D14", tr: "Statuses not updating", em: "Pipeline invisible", vi: "Priority", to: "AA", es: "Review", ev: ["Offer Status", "Priority"] },
  { ph: "P2", d: "D14", tr: "Notes empty all deals", em: "[X] deals 0 notes", vi: "Property", to: "AA", es: "Walk", ev: ["Add Note", "Follow-Up", "Reminder"] },
  { ph: "P2", d: "D21", tr: "Not at KPI pace", em: "Graduation assessment", vi: "-", to: "AA+AM", es: "Extend", ev: ["My Stats", "EOD Stats"] },
  { ph: "P3", d: "Daily", tr: "Offers < target", em: "BECAUSE [root cause]", vi: "Offer", to: "AA", es: "3d=AM", ev: ["Offer Terms", "Submit Contract", "Offer vs goal"] },
  { ph: "P3", d: "Daily", tr: "Calls < target", em: "Low calls = empty pipeline", vi: "-", to: "AA", es: "Flag", ev: ["Call agent", "Call from Outreach", "Bulk Call"] },
  { ph: "P3", d: "Daily", tr: "Contacts < 50", em: "Use Campaigns", vi: "Campaigns", to: "AA", es: "Check", ev: ["Open Campaigns", "Select campaign", "Send campaign"] },
  { ph: "P3", d: "Weekly", tr: "0 deals closed", em: "Pipeline review", vi: "-", to: "AA+AM", es: "Review", ev: ["Open Deal Review", "Offer vs goal"] },
  { ph: "P3", d: "7+d", tr: "Feature gone cold 7d", em: "Reactivation", vi: "Specific", to: "AA", es: "2,3,call", ev: ["(dynamic)"] },
  { ph: "P3", d: "D30", tr: "Monthly assessment", em: "30-day scorecard", vi: "Dashboard", to: "AA+AM", es: "Review", ev: ["My Stats", "EOD Stats"] },
  { ph: "ALL", d: "3x", tr: "3 emails 0 response", em: "STOP emailing", vi: "-", to: "AM", es: "Escalate", ev: [] },
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
  const [eV, seV_] = useState(null);
  const seV = (v) => { seV_(v); setExpHist({}); };
  const [commLog, setCommLog] = useState(null);
  const [exp, sE] = useState(null);
  const [trendRange, setTrendRange] = useState(30);
  const [evSort, setEvSort] = useState({ col: "name", dir: 1 });
  const toggleEvSort = (col) => setEvSort((p) => p.col === col ? { col, dir: -p.dir } : { col, dir: 1 });
  const [hmSort, setHmSort] = useState({ col: null, dir: 1 });
  const toggleHmSort = (col) => setHmSort((p) => p.col === col ? { col, dir: -p.dir } : { col, dir: 1 });
  const [hC, sHC] = useState(null);
  const [dR, sDR] = useState("Today");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSumLoading, setAiSumLoading] = useState(false);
  const [prevAiUser, setPrevAiUser] = useState(null);
  const [expHist, setExpHist] = useState({});
  const aiEndRef = useRef(null);

  const tog = (k, v) => sf((f) => ({ ...f, [k]: f[k] === v ? null : v }));
  const toggleSort = (col) => { if (sortCol === col) { setSortDir(d => d === "desc" ? "asc" : "desc"); } else { setSortCol(col); setSortDir("desc"); } };

  const buildCtx = useCallback((u) => {
    if (!u) return "";
    const org = O.find((o) => o.id === u.org);
    const hl = { red: "Critical", orange: "Gap", yellow: "Cooling", green: "Healthy" };
    const missingCats = u.cs.filter((c) => c.sc === 0).map((_, i) => C[i]?.n).filter(Boolean);
    const gapCats = u.cs.filter((c) => c.sc === 1).map((_, i) => C[i]?.n).filter(Boolean);
    return `Name: ${u.n}
Organization: ${org?.n || "?"} (AM: ${org?.am || "?"})
Day: ${u.day}, Phase: ${PN[u.ph]} (P${u.ph}), Health: ${hl[u.health] || u.health}
Priority: ${PL[u.ps] || u.ps}, Email count: ${u.ec} (${u.ec >= 3 ? "3-STRIKE reached" : "no response"})
Agenda: ${u.agenda || "none"}
Gaps: ${u.gaps.length > 0 ? u.gaps.join(", ") : "none"}
Root cause: ${gc(u) || "none identified"}
Check-in: ${u.s.ck ? "Done" : "NOT DONE"}
Stats: Calls=${u.s.ca}/${u.g.ca} goal, Texts=${u.s.tx}, Emails=${u.s.em}, Connected=${u.s.cc}
Pipeline: Open=${u.s.op}, Reopened=${u.s.re}, Offers=${u.s.of}, Negot=${u.s.ng}, Accepted=${u.s.ac}, Acquired=${u.s.aq}/2 target
Yesterday: Calls=${u.y.ca}, Texts=${u.y.tx}, Emails=${u.y.em}, Offers=${u.y.of}, Opens=${u.y.op}
Time: ${Math.round(u.s.mn / 60)}h total, PIQ:${u.s.piq}m, Comps:${u.s.comp}m, IA:${u.s.ia}m
Contacts: New=${u.s.nr}, Upgraded=${u.s.up}, MLS=${u.s.mls}, DM=${u.s.dm}
Feature usage: ${u.cs.map((c, i) => C[i].n + "=" + SL[c.sc] + "(" + c.ac + "/" + c.t + ")").join(", ")}
${missingCats.length > 0 ? "Missing categories: " + missingCats.join(", ") : ""}
${u.vid ? "Recommended video: " + (V[u.vid] ? V[u.vid][0] + " (" + V[u.vid][1] + ")" : u.vid) : ""}`;
  }, []);

  const aiCall = useCallback(async (msgs, ctx) => {
    const base = import.meta.env.BASE_URL || "/";
    const apiBase = base.replace(/\/$/, "").replace(/\/[^/]*$/, "") || "";
    try {
      const res = await fetch(apiBase + "/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, userContext: ctx }),
      });
      if (!res.ok) throw new Error("API error " + res.status);
      const data = await res.json();
      return data.reply;
    } catch (e) {
      return "Unable to reach AI service. Please try again.";
    }
  }, []);


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
  const tgt = base.length * 2;
  const pct = tgt > 0 ? Math.round((td / tgt) * 100) : 0;
  const tasks = fU.filter((u) => u.health !== "green");
  const pend = tasks.filter((t) => !done[t.id]);
  const fin = tasks.filter((t) => done[t.id]);
  const cp = tasks.length > 0 ? Math.round((fin.length / tasks.length) * 100) : 100;
  const lb = useMemo(() => {
    const sorted = [...fU];
    const colMap = { tx: u => u.s.tx, em: u => u.s.em, ca: u => u.s.ca, nr: u => u.s.nr, up: u => u.s.up, op: u => u.s.op, re: u => u.s.re, rn: u => u.s.op > 0 ? u.s.re / u.s.op : 0, of: u => u.s.of, ng: u => u.s.ng, ac: u => u.s.ac, aq: u => u.s.aq, mn: u => u.s.mn };
    if (sortCol && colMap[sortCol]) {
      const fn = colMap[sortCol];
      sorted.sort((a, b) => sortDir === "desc" ? fn(b) - fn(a) : fn(a) - fn(b));
    } else {
      sorted.sort((a, b) => b.s.aq - a.s.aq || b.s.of - a.s.of || b.s.ca - a.s.ca);
    }
    return sorted;
  }, [fU, sortCol, sortDir]);

  const doC = () => {
    if (!aT) return;
    sd((d) => ({ ...d, [modal]: { type: aT, note: aN, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) } }));
    sm(null);
    saT(null);
    saN("");
  };

  const user = sel ? U.find((u) => u.id === sel) : null;

  useEffect(() => {
    if (!sel || !user) { setAiSummary(null); setPrevAiUser(null); setAiMsgs([]); return; }
    if (prevAiUser === sel) return;
    setPrevAiUser(sel);
    setAiMsgs([]);
    setAiInput("");
    setAiSummary(null);
    setAiSumLoading(true);
    const ctx = buildCtx(user);
    aiCall([{ role: "user", content: "Give me a brief 2-3 sentence summary of this AA's current situation. Then list the TOP 3 things this AA needs to do TODAY to improve, numbered 1-2-3. Frame each as an action for the AA (e.g. 'Complete your daily check-in', 'Make 15 calls'), not what the CSM should do." }], ctx)
      .then((reply) => { setAiSummary(reply); setAiSumLoading(false); })
      .catch(() => { setAiSummary("Failed to load summary."); setAiSumLoading(false); });
  }, [sel, prevAiUser, buildCtx, aiCall]);

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMsgs]);

  const sendAiMsg = async () => {
    if (!aiInput.trim() || aiLoading || !user) return;
    const q = aiInput.trim();
    setAiInput("");
    const newMsgs = [...aiMsgs, { role: "user", content: q }];
    setAiMsgs(newMsgs);
    setAiLoading(true);
    const ctx = buildCtx(user);
    const allMsgs = aiSummary
      ? [{ role: "user", content: "Give me a summary of this AA and the top 3 things this AA needs to do today based on their data and gaps." }, { role: "assistant", content: aiSummary }, ...newMsgs]
      : newMsgs;
    const reply = await aiCall(allMsgs, ctx);
    setAiMsgs([...newMsgs, { role: "assistant", content: reply }]);
    setAiLoading(false);
  };

  const tE = (uid, ci) => { if (exp && exp.u === uid && exp.c === ci) sE(null); else sE({ u: uid, c: ci }); };
  const sel0 = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394A3B8' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#F8FAFB", minHeight: "100vh", color: "#1E293B", position: "relative" }}>
      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0", padding: "16px 32px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Tip text="Click to go back to the Overview tab."><img src={import.meta.env.BASE_URL + "flipiq-logo.png"} alt="FlipiQ" style={{ height: 132, width: "auto", cursor: "pointer" }} onClick={() => { st("overview"); ss(null); seV(null); }} /></Tip>
          <div>
            <Tip text="FlipiQ CSM Dashboard — your daily command center for monitoring all Acquisition Associates."><div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.4 }}>FlipiQ USER COMMAND</div></Tip>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#F97316", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}><Tip text="The single North Star metric every AA is measured against. Hit this and everything else follows.">Atomic KPI</Tip></div>
            <div style={{ fontSize: 20, fontWeight: 800 }}><Tip text="Each AA must close at least 2 deals per month. This is the minimum acquisition target across all orgs.">2 Deals per Month per AA</Tip></div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Tip text="Monthly deal progress. Ring fills as total team deals approach the target. Green = 75%+, yellow = 50%+, red = below 50%."><div style={{ position: "relative", width: 60, height: 60 }}>
              <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="#F1F5F9" strokeWidth="5" /><circle cx="30" cy="30" r="24" fill="none" stroke={pct >= 75 ? "#10B981" : pct >= 50 ? "#D97706" : "#DC2626"} strokeWidth="5" strokeLinecap="round" strokeDasharray={pct * 1.508 + " 150.8"} transform="rotate(-90 30 30)" /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>{pct}%</div>
            </div></Tip>
            <Tip text="Total deals acquired this month across all AAs vs the team target. Target = number of AAs × 2 deals each."><div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}><span style={{ color: "#F97316" }}>{td}</span><span style={{ color: "#94A3B8", fontSize: 18, fontWeight: 600 }}> / {tgt}</span></div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{base.length} AAs x 2 = {tgt} target</div>
            </div></Tip>
          </div>

          <Tip text="Current reporting date. All stats and goals shown are for this day."><div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Mar 21, 2026</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Pacific Time</div>
          </div></Tip>
        </div>
      </div>

      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}><Tip text="Filter by organization. Each org has an Account Manager (AM) who oversees the AAs.">ORG</Tip></span>
          <select value={flt.org || "all"} onChange={(e) => sf((f) => ({ ...f, org: e.target.value === "all" ? null : +e.target.value }))} style={{ padding: "6px 32px 6px 12px", fontSize: 13, fontWeight: 500, border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFF", appearance: "none", WebkitAppearance: "none", cursor: "pointer", minWidth: 200, backgroundImage: sel0, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
            <option value="all">All organizations ({U.length})</option>
            {O.map((o) => <option key={o.id} value={o.id}>{o.n} ({U.filter((u) => u.org === o.id).length})</option>)}
          </select>
          <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 4px" }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}><Tip text="AA lifecycle phase. P1 Onboarding (Days 1-7): learn the tool. P2 Activation (Days 8-21): build habits. P3 Performance (Day 22+): hit targets.">PHASE</Tip></span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ p: 1, n: "Onboarding", d: "Days 1-7", c: "#0C447C", bc: "#85B7EB", bg: "#E6F1FB", tip: "Phase 1: First 7 days. AAs are learning the tool, setting up, and making first calls." }, { p: 2, n: "Activation", d: "Days 8-21", c: "#854F0B", bc: "#EF9F27", bg: "#FAEEDA", tip: "Phase 2: Days 8-21. AAs should be building habits — consistent calls, offers, and pipeline activity." }, { p: 3, n: "Performance", d: "Day 22+", c: "#085041", bc: "#5DCAA5", bg: "#E1F5EE", tip: "Phase 3: Day 22+. AAs should be hitting targets — 2 deals/month, strong call volume, steady offers." }].map((x) => (
              <Tip key={x.p} text={x.tip}><div onClick={() => tog("phase", x.p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 8, border: flt.phase === x.p ? "1.5px solid " + x.bc : "1px solid #E2E8F0", background: flt.phase === x.p ? x.bg : "#FAFBFC", cursor: "pointer", minWidth: 150 }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: x.c }}>{sts["p" + x.p]}</div>
                <div><div style={{ fontSize: 12, fontWeight: 500, color: x.c }}>{x.n}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{x.d}</div></div>
              </div></Tip>
            ))}
          </div>
          <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 4px" }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}><Tip text="Overall health score based on 3-Track scoring. Critical = needs immediate attention. Gap = falling behind. Cooling = slowing down. Healthy = on track.">HEALTH</Tip></span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ h: "red", n: "Critical", c: "#791F1F", bc: "#F09595", bg: "#FCEBEB", dot: "#E24B4A", k: "r", tip: "Critical: AA is inactive, never logged in, or has zero activity. Needs immediate intervention." }, { h: "orange", n: "Gap", c: "#712B13", bc: "#F0997B", bg: "#FAECE7", dot: "#D85A30", k: "o", tip: "Gap: AA is falling behind — missing calls, low offers, or incomplete training." }, { h: "yellow", n: "Cooling", c: "#854F0B", bc: "#FAC775", bg: "#FAEEDA", dot: "#EF9F27", k: "y", tip: "Cooling: AA was active but is slowing down. Watch for continued decline." }, { h: "green", n: "Healthy", c: "#085041", bc: "#9FE1CB", bg: "#E1F5EE", dot: "#1D9E75", k: "g", tip: "Healthy: AA is on track — meeting call, offer, and deal targets." }].map((x) => (
              <Tip key={x.h} text={x.tip}><div onClick={() => tog("health", x.h)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: flt.health === x.h ? "1.5px solid " + x.bc : "1px solid #E2E8F0", background: flt.health === x.h ? x.bg : "#FAFBFC", cursor: "pointer", minWidth: 110 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.dot }} />
                <div style={{ fontSize: 22, fontWeight: 500, color: x.c }}>{sts[x.k]}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: x.c }}>{x.n}</div>
              </div></Tip>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0", padding: "0 24px", display: "flex" }}>
        {[["overview","Overview","Daily task list. See every non-healthy AA, their root cause, and take action."],["leaderboard","Leaderboard","Ranked performance table of all AAs. Compare calls, offers, deals across the team."],["heatmap","Heat map","Visual grid of 62 feature events across 7 categories for every AA. Red = missing, green = active."],["emails","Emails","Generate and preview coaching emails for each struggling AA. One click to send."],["logic","Email logic","Reference table of all rules that trigger coaching emails. Shows phase, timing, and escalation paths."],["users","User list","Complete user directory with login history, contact info, company, email sources, and Dialpad phone numbers."]].map(([t, label, tip]) => (
          <Tip key={t} text={tip}><button onClick={() => { st(t); ss(null); seV(null); sE(null); }} style={{ padding: "10px 14px", fontSize: 12, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#F97316" : "#64748B", background: "none", border: "none", borderBottom: tab === t ? "2px solid #F97316" : "2px solid transparent", cursor: "pointer" }}>
            {label}
          </button></Tip>
        ))}
      </div>

      <div style={{ padding: "16px 24px", margin: "0 auto" }}>
        {tab === "overview" && !sel && !eV && (
          <>

            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, fontWeight: 700 }}><Tip text="Daily action items for you (CSM). Each non-healthy AA generates a task. Complete by reviewing, forwarding an email, or logging an action.">Tasks</Tip></span><span style={{ fontSize: 11, color: "#64748B" }}>{fin.length}/{tasks.length}</span></div>
              <Tip text="Your daily progress. Complete all tasks by reviewing each AA and taking action (email, call, text, or escalate)."><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 160, height: 6, background: "#F1F5F9", borderRadius: 3 }}><div style={{ height: 6, background: cp === 100 ? "#10B981" : "#F97316", borderRadius: 3, width: cp + "%" }} /></div>
                <span style={{ fontSize: 12, fontWeight: 800, color: cp === 100 ? "#10B981" : "#F97316" }}>{cp}%</span>
              </div></Tip>
            </div>

            {pend.map((u) => {
              const ca = gc(u);
              return (
                <div key={u.id} style={{ background: "#FFF", border: "1px solid " + (u.ec >= 3 ? "#FECACA" : "#E2E8F0"), borderRadius: 8, padding: "10px 12px", marginBottom: 4, borderLeft: "4px solid " + PLC[u.ps] }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Tip text="Click to mark this task as complete. You'll choose what action you took (call, email, text, etc.)."><button onClick={() => { sm(u.id); saT(null); saN(""); }} style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid " + PLC[u.ps], background: "none", cursor: "pointer", flexShrink: 0 }} /></Tip>
                    <Tip text={"Priority " + PL[u.ps] + ". " + (u.ps === 1 ? "Needs immediate attention today." : u.ps === 2 ? "Address before end of day." : u.ps === 3 ? "Monitor and coach when time allows." : "Low urgency — check in periodically.")}><span style={{ fontSize: 8, fontWeight: 800, color: "#fff", background: PLC[u.ps], padding: "1px 6px", borderRadius: 3 }}>{PL[u.ps]}</span></Tip>
                    <Tip text="Click to view this AA's full profile — stats, feature usage, and root cause."><span onClick={() => ss(u.id)} style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textDecorationColor: "#E2E8F0" }}>{u.n}</span></Tip>
                    <Tip text={"Organization: " + (O.find((o) => o.id === u.org)?.n || "") + ". Day " + u.day + " in " + PN[u.ph] + " phase."}><span style={{ fontSize: 10, color: "#94A3B8" }}>{O.find((o) => o.id === u.org)?.n} D{u.day} {PN[u.ph]}</span></Tip>
                    {u.ec >= 3 && <Tip text="This AA has been emailed 3 times with no response. STOP emailing — escalate to their Account Manager instead."><span style={{ fontSize: 7, fontWeight: 800, color: "#DC2626", background: "#FEF2F2", padding: "1px 5px", borderRadius: 2, border: "1px solid #FECACA" }}>3-STRIKE</span></Tip>}
                    {!u.s.ck && <Tip text="This AA hasn't completed their daily iQ Check-In. No check-in = no coaching triggers fire. This is the first thing to fix."><span style={{ fontSize: 7, fontWeight: 800, color: "#EA580C", background: "#FFF7ED", padding: "1px 5px", borderRadius: 2, border: "1px solid #FED7AA" }}>NO CHECK-IN</span></Tip>}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#64748B" }}><Tip text="Calls today vs goal. Offers today vs daily pace needed for monthly target.">Calls: <span style={{ color: vc(u.s.ca, u.g.ca), fontWeight: 700 }}>{u.s.ca}</span> Offers: <span style={{ color: vc(u.s.of, u.g.of * Math.min(u.day, 30)), fontWeight: 700 }}>{u.s.of}</span></Tip></span>
                      <Tip text={u.ec >= 3 ? "3 strikes reached. This will notify the Account Manager instead of the AA." : "Generate a coaching email for this AA based on their root cause and gaps."}><button onClick={() => seV(bE(u))} style={{ fontSize: 9, fontWeight: 600, color: "#F97316", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>{u.ec >= 3 ? "AM" : "Email"}</button></Tip>
                    </div>
                  </div>
                  {ca && <div style={{ marginTop: 4, marginLeft: 24, fontSize: 10, color: "#EA580C", fontWeight: 600 }}>WHY: {ca}</div>}
                  {u.gaps.length > 0 && <div style={{ marginTop: 3, marginLeft: 24, display: "flex", gap: 2, flexWrap: "wrap" }}>{u.gaps.map((g, i) => <span key={i} style={{ fontSize: 8, color: HC[u.health], background: HBG[u.health], padding: "1px 5px", borderRadius: 2 }}>{g}</span>)}</div>}
                </div>
              );
            })}

            {fin.length > 0 && (
              <>
                <Tip text="Tasks you've already completed today. These AAs have been addressed."><div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 4px" }}>Done ({fin.length})</div></Tip>
                {fin.map((u) => {
                  const a = done[u.id];
                  return (
                    <div key={u.id} style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 7, padding: "7px 12px", marginBottom: 3, opacity: 0.55, borderLeft: "4px solid #CBD5E1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800 }}>&#10003;</div>
                        <span onClick={() => ss(u.id)} style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textDecoration: "line-through", cursor: "pointer" }}>{u.n}</span>
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

        {eV && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{eV.ie ? "AM Escalation" : "Coaching Email"}</div>
              <Tip text="Close the email preview and return to the previous view."><button onClick={() => seV(null)} style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 5, padding: "4px 12px", cursor: "pointer" }}>Back</button></Tip>
            </div>
            <div style={{ background: eV.ie ? "#FEF2F2" : "#F8FAFB", borderRadius: 7, padding: 16, border: "1px solid " + (eV.ie ? "#FECACA" : "#E2E8F0") }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 3 }}><b>To:</b> {eV.to}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}><b>Subject:</b> {eV.su}</div>
              {eV.targets && eV.targets.length > 0 && (
                <div style={{ marginBottom: 10, padding: "8px 10px", background: "#FFF", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 5 }}>Event targets in this email</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: eV.video ? 6 : 0 }}>
                    {eV.targets.map((t, ti) => {
                      const stL = { 0: { bg: "#FEE2E2", c: "#DC2626", l: "Missing" }, 1: { bg: "#FFF7ED", c: "#EA580C", l: "Gap" }, 2: { bg: "#FEFCE8", c: "#CA8A04", l: "Cooling" } };
                      const sc = stL[t.st] || stL[0];
                      return <Tip key={ti} text={t.tip + " \u2014 " + sc.l + " in " + t.cat}><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: sc.bg, color: sc.c, fontWeight: 600 }}>{t.name} <span style={{ fontWeight: 400, fontSize: 8 }}>({sc.l})</span></span></Tip>;
                    })}
                  </div>
                  {eV.video && <div style={{ fontSize: 10, color: "#0369A1", display: "flex", alignItems: "center", gap: 4 }}><span>{"\u25B6"}</span> <b>{eV.video.title}</b> ({eV.video.dur}) — tied to {eV.targets[0]?.name}</div>}
                </div>
              )}
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line" }}>{eV.bo}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Tip text="Mark this AA's task as done with action type 'email' and close the preview."><button onClick={() => { sm(eV.uid); saT("email"); saN(""); seV(null); }} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 700, background: "#F97316", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Forward and complete</button></Tip>
              <Tip text="Close the email preview without taking action."><button onClick={() => seV(null)} style={{ padding: "8px 20px", fontSize: 12, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button></Tip>
            </div>
            {(() => {
              const usr = U.find((u) => u.id === eV.uid);
              if (!usr) return null;
              const allHist = gEH(usr);
              const tyC = { coaching: "#F97316", onboarding: "#3B82F6", reactivation: "#8B5CF6", reminder: "#D97706", escalation: "#DC2626" };
              const tyL = { coaching: "Coaching", onboarding: "Onboarding", reactivation: "Reactivation", reminder: "Reminder", escalation: "Escalation" };
              const stC = { 0: { bg: "#FEE2E2", c: "#DC2626", l: "Missing" }, 1: { bg: "#FFF7ED", c: "#EA580C", l: "Gap" }, 2: { bg: "#FEFCE8", c: "#CA8A04", l: "Cooling" } };
              const todayEmail = bE(usr);
              const fullList = [{ id: 0, date: "Today", time: "Next send", subject: todayEmail.su, type: eV.ie ? "escalation" : "coaching", to: todayEmail.to, escalated: eV.ie, targets: todayEmail.targets || [], video: todayEmail.video, acted: [], ignored: [], isCurrent: true, body: todayEmail.bo }, ...allHist.sort((a, b) => b.ts - a.ts)];
              return (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <Tip text="Complete email history for this AA. Shows every email sent with event targets, video, and what was acted on or ignored. Click any row to expand and see the full email body.">
                      All emails ({fullList.length})
                    </Tip>
                  </div>
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "70px 55px 1fr 80px 65px", padding: "6px 12px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                      <div>Date</div><div>Time</div><div>Subject</div><div>Type</div><div>Status</div>
                    </div>
                    {fullList.map((e) => {
                      const isExp = expHist[e.id + "_" + (e.isCurrent ? "cur" : "past")];
                      const hKey = e.id + "_" + (e.isCurrent ? "cur" : "past");
                      const actedCount = e.acted?.length || 0;
                      const totalTargets = e.targets?.length || 0;
                      const statusLabel = e.isCurrent ? "Queued" : actedCount > 0 ? actedCount + "/" + totalTargets + " done" : totalTargets > 0 ? "Sent" : "Sent";
                      const statusColor = e.isCurrent ? "#3B82F6" : actedCount === totalTargets && totalTargets > 0 ? "#16A34A" : actedCount > 0 ? "#F97316" : "#64748B";
                      return (
                        <div key={hKey}>
                          <div onClick={() => setExpHist((p) => ({ ...p, [hKey]: !p[hKey] }))} style={{ display: "grid", gridTemplateColumns: "70px 55px 1fr 80px 65px", padding: "8px 12px", borderBottom: "1px solid #F1F5F9", background: e.isCurrent ? "#FFFBEB" : isExp ? "#F8FAFB" : "#FFF", cursor: "pointer", fontSize: 11, alignItems: "center", transition: "background 0.15s" }}>
                            <div style={{ fontWeight: 600, color: e.isCurrent ? "#F97316" : "#64748B" }}>{e.date}</div>
                            <div style={{ color: "#94A3B8", fontSize: 10 }}>{e.time}</div>
                            <div style={{ fontWeight: 600, color: e.escalated ? "#DC2626" : "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
                              <span style={{ marginRight: 4, fontSize: 9, color: "#94A3B8" }}>{isExp ? "\u25BC" : "\u25B6"}</span>
                              {e.subject}
                            </div>
                            <div><span style={{ fontSize: 8, fontWeight: 700, color: "#FFF", background: tyC[e.type] || "#94A3B8", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>{tyL[e.type]}</span></div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: statusColor }}>{statusLabel}</div>
                          </div>
                          {isExp && (
                            <div style={{ padding: "10px 16px 14px", borderBottom: "1px solid #E2E8F0", background: "#FAFBFC" }}>
                              {e.targets && e.targets.length > 0 && (
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>Event targets</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {e.targets.map((t, ti) => {
                                      const sc = stC[t.st] || stC[0];
                                      const wasActed = e.acted?.includes(t.name);
                                      return (
                                        <Tip key={ti} text={t.tip + (wasActed ? " \u2014 Completed!" : " \u2014 " + sc.l)}>
                                          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: wasActed ? "#F0FDF4" : sc.bg, color: wasActed ? "#16A34A" : sc.c, fontWeight: 600, textDecoration: wasActed ? "line-through" : "none" }}>
                                            {wasActed ? "\u2713 " : ""}{t.name} <span style={{ fontWeight: 400, fontSize: 7 }}>({wasActed ? "Done" : sc.l})</span>
                                          </span>
                                        </Tip>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {e.video && (
                                <div style={{ marginBottom: 8, fontSize: 10, color: "#0369A1", display: "flex", alignItems: "center", gap: 4 }}>
                                  <span>{"\u25B6"}</span> <b>{e.video.title}</b> ({e.video.dur})
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 10 }}>
                                <div><span style={{ color: "#94A3B8" }}>To:</span> <b style={{ color: "#334155" }}>{e.to}</b>{e.escalated ? " (AM)" : ""}</div>
                                {e.acted && e.acted.length > 0 && <div><span style={{ color: "#16A34A", fontWeight: 600 }}>{e.acted.length} acted on</span></div>}
                                {e.ignored && e.ignored.length > 0 && <div><span style={{ color: "#DC2626", fontWeight: 600 }}>{e.ignored.length} ignored</span></div>}
                              </div>
                              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 6, padding: 12, fontSize: 11, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line", maxHeight: 300, overflowY: "auto" }}>{e.body}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {tab === "leaderboard" && !sel && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 16, fontWeight: 800 }}><Tip text="Ranked list of all AAs sorted by deals acquired. Compare performance across all metrics. Click any name to see detailed breakdown.">Team Leaderboard</Tip></div><div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>My Stats KPIs. Click name for detail.</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Tip text="Select the time range for leaderboard stats. Today, 7-day, 30-day, or all-time."><select value={dR} onChange={(e) => sDR(e.target.value)} style={{ padding: "6px 30px 6px 12px", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFF", appearance: "none", WebkitAppearance: "none", cursor: "pointer", backgroundImage: sel0, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                  {DR.map((d) => <option key={d}>{d}</option>)}
                </select></Tip>
                <Tip text="Data as of this date and timezone."><span style={{ fontSize: 11, color: "#64748B" }}>Mar 21 &middot; Pacific</span></Tip>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
                    <th colSpan={2} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left", borderRight: "1px solid #E2E8F0" }}></th>
                    <th colSpan={3} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, color: "#0C447C", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", borderRight: "1px solid #E2E8F0", background: "#EEF5FC" }}><Tip text="Outbound activity: texts sent, emails sent, and calls made (with connected calls). Green = at/above goal, red = below.">Communication</Tip></th>
                    <th colSpan={2} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, color: "#085041", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", borderRight: "1px solid #E2E8F0", background: "#E8F8F2" }}><Tip text="New contacts added and relationship upgrades (e.g. cold → warm). Shows how well the AA is building their network.">Relationships</Tip></th>
                    <th colSpan={4} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, color: "#854F0B", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", borderRight: "1px solid #E2E8F0", background: "#FEF7E8" }}><Tip text="Deal pipeline: open deals, reopened deals, R/N ratio (reopened/new), and offers made. Tracks deal flow health.">Pipeline</Tip></th>
                    <th colSpan={3} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, color: "#7C2D12", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", background: "#FFF1EC" }}><Tip text="Final deal stages: negotiations, accepted offers, and acquisitions (closed deals). Acq is the key number — 2/month is the target.">Deal Progress</Tip></th>
                  </tr>
                  <tr style={{ background: "#F8FAFB", borderBottom: "2px solid #E2E8F0" }}>
                    <th style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", textAlign: "left", width: 36 }}>#</th>
                    <th style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", textAlign: "left", minWidth: 140, borderRight: "1px solid #E2E8F0" }}>Name</th>
                    {[["tx","Texts",65,false,"Total text messages sent by this AA."],["em","Emails",65,false,"Total emails sent by this AA."],["ca","Calls",75,true,"Total calls made. Number in parentheses = connected calls."],["nr","New",55,false,"New contacts added to their pipeline."],["up","Upgr",55,true,"Contacts upgraded from cold to warm status."],["op","Open",55,false,"Properties/deals currently open in their pipeline."],["re","Reop",55,false,"Previously closed deals that were reopened."],["rn","R/N",50,false,"Reopened-to-New ratio. Higher = reusing old leads instead of finding new ones."],["of","Offers",65,true,"Total offers submitted. Green = on pace for monthly target."],["ng","Neg",50,false,"Deals currently in negotiation stage."],["ac","Acc",50,false,"Offers that were accepted by the seller."],["aq","Acq",55,false,"Deals fully acquired (closed). Target is 2 per month."]].map(([k,label,w,br,tip]) => (
                      <th key={k} onClick={() => toggleSort(k)} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: sortCol === k ? "#F97316" : "#94A3B8", textTransform: "uppercase", textAlign: "center", minWidth: w, cursor: "pointer", userSelect: "none", borderRight: br ? "1px solid #E2E8F0" : "none", background: sortCol === k ? "#FFF7ED" : "transparent", transition: "color 0.15s" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                          <Tip text={tip}>{label}</Tip>
                          <span style={{ fontSize: 8, opacity: sortCol === k ? 1 : 0.3 }}>{sortCol === k ? (sortDir === "desc" ? "\u25BC" : "\u25B2") : "\u25BC"}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
              {lb.map((u, i) => {
                const rn = u.s.op > 0 ? (u.s.re / u.s.op).toFixed(2) : "0";
                return (
                  <tr key={u.id} onClick={() => ss(u.id)} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#FFF" : "#FAFBFC", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#F0F7FF"} onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#FFF" : "#FAFBFC"}>
                    <td style={{ padding: "10px 12px", fontWeight: 800, fontSize: 13, color: i < 3 ? "#F97316" : "#CBD5E1" }}>{i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : i + 1}</td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: HC[u.health], flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{u.n}</div>
                          <div style={{ fontSize: 9, color: "#94A3B8" }}>{O.find((o) => o.id === u.org)?.n} &middot; D{u.day} &middot; P{u.ph}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.tx}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.em}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 600, color: vc(u.s.ca, u.g.ca), borderRight: "1px solid #F1F5F9" }}>{u.s.ca} <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 400 }}>({u.s.cc}c)</span></td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.nr}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B", borderRight: "1px solid #F1F5F9" }}>{u.s.up}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.op}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.re}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, color: "#64748B" }}>{rn}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 600, color: vc(u.s.of, u.g.of * Math.min(u.day, 30)), borderRight: "1px solid #F1F5F9" }}>{u.s.of}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.ng}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#64748B" }}>{u.s.ac}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 13, fontWeight: 800, color: u.s.aq >= 2 ? "#10B981" : u.s.aq > 0 ? "#D97706" : "#DC2626" }}>{u.s.aq}</td>
                  </tr>
                );
              })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "heatmap" && !sel && !eV && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}><Tip text="Visual grid showing every AA's feature usage across 7 categories. Colors indicate activity level — red is missing, green is active. Click any cell to see full event breakdown.">Heat map</Tip></div><div style={{ fontSize: 11, color: "#94A3B8" }}>62 events. Hover for 3-Track. Click to expand.</div></div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["#DC2626", "Miss", "Feature never used. AA hasn't tried this at all."], ["#EA580C", "Gap", "Feature used once or twice but not recently. Training gap."], ["#D97706", "Cool", "Feature was used but activity is cooling off."], ["#10B981", "Active", "Feature is being used regularly. On track."]].map(([c, l, tip]) => (
                  <Tip key={l} text={tip}><div style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: c }} /><span style={{ fontSize: 10, color: "#64748B" }}>{l}</span></div></Tip>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "24px 140px 48px repeat(7,1fr)", padding: "5px 10px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", alignItems: "center" }}>
              <div></div>
              {[["user", "User", "Sort by AA name alphabetically."], ["ph", "Ph", "Sort by lifecycle phase (Onboarding → Activation → Performance)."]].map(([k, l, tip]) => (
                <Tip key={k} text={tip}><div onClick={() => toggleHmSort(k)} style={{ cursor: "pointer", userSelect: "none", color: hmSort.col === k ? "#F97316" : "#94A3B8" }}>{l} {hmSort.col === k ? (hmSort.dir === 1 ? "\u25B2" : "\u25BC") : ""}</div></Tip>
              ))}
              {[["Plan", "Today's plan events — daily check-in, deal review, priorities, outreach."], ["Find", "Deal sourcing — MLS search, agent search, campaigns."], ["Comms", "Communication — calls, texts, emails, AI Connect, bulk actions."], ["Prop", "Property actions — notes, reminders, AI reports, favorites, to-dos."], ["Analysis", "Analysis tools — PIQ detail, comps matrix, investment analysis."], ["Offers", "Offer process — terms, contracts, negotiations, offer vs goal."], ["Tools", "Utility tools — My Stats, DispoPro, Quick Links, Script Practice, EOD Stats."]].map(([h, tip], i) => <Tip key={h} text={tip}><div onClick={() => toggleHmSort("c" + i)} style={{ textAlign: "center", cursor: "pointer", userSelect: "none", color: hmSort.col === "c" + i ? "#F97316" : "#94A3B8" }}>{h} {hmSort.col === "c" + i ? (hmSort.dir === 1 ? "\u25B2" : "\u25BC") : ""}</div></Tip>)}
            </div>
            {[...fU].sort((a, b) => { if (!hmSort.col) return 0; const d = hmSort.dir; if (hmSort.col === "user") return a.n.localeCompare(b.n) * d; if (hmSort.col === "ph") return (a.ph - b.ph) * d; const ci = parseInt(hmSort.col.slice(1)); return (a.cs[ci].sc - b.cs[ci].sc) * d; }).map((u, ri) => (
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
                      onClick={() => { ss(u.id); sE({ u: u.id, c: ci }); sHC(null); }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", marginBottom: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}><Tip text="Pre-written coaching emails for each non-healthy AA. Generated based on their root cause, gaps, and current stats vs goals. Click Generate to preview the full email.">Coaching Emails</Tip></div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                <b style={{ color: "#F97316" }}>Goal:</b> Review each AA below and send them a personalized coaching email.
                <span style={{ margin: "0 8px", color: "#E2E8F0" }}>|</span>
                <b style={{ color: "#3B82F6" }}>Task:</b> Click "Preview Email" to see what to send, then "Forward and Complete" to mark done.
                <span style={{ margin: "0 8px", color: "#E2E8F0" }}>|</span>
                <b style={{ color: "#DC2626" }}>3-Strike:</b> If an AA has 3+ ignored emails, it escalates to their Account Manager instead.
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 2 }}>{fU.filter((u) => u.health !== "green").length} AAs need coaching today</div>
            {fU.filter((u) => u.health !== "green").map((u) => {
              const ca = gc(u);
              const yAct = u.y.ca + u.y.tx + u.y.em;
              const hc = { red: "#DC2626", orange: "#EA580C", yellow: "#D97706" };
              const hn = { red: "Critical", orange: "Gap", yellow: "Cooling" };
              return (
                <div key={u.id} style={{ background: "#FFF", border: "1px solid " + (u.ec >= 3 ? "#FECACA" : "#E2E8F0"), borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid " + (hc[u.health] || "#94A3B8") }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Tip text={"Health: " + (hn[u.health] || "Unknown") + ". " + (u.health === "red" ? "Needs immediate intervention." : u.health === "orange" ? "Falling behind on key metrics." : "Activity slowing — monitor closely.")}><span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: hc[u.health] || "#94A3B8", padding: "2px 8px", borderRadius: 3 }}>{hn[u.health] || "Unknown"}</span></Tip>
                      <Tip text="Click the Preview button to see the coaching email for this AA."><span style={{ fontSize: 14, fontWeight: 700 }}>{u.n}</span></Tip>
                      <Tip text={"Organization: " + (O.find((o) => o.id === u.org)?.n || "") + ". AM: " + (O.find((o) => o.id === u.org)?.am || "")}><span style={{ fontSize: 11, color: "#94A3B8" }}>{O.find((o) => o.id === u.org)?.n}</span></Tip>
                      <Tip text={"This AA is on day " + u.day + " in the " + PN[u.ph] + " phase."}><span style={{ fontSize: 10, color: "#64748B", background: "#F1F5F9", padding: "2px 6px", borderRadius: 3 }}>Day {u.day} {PN[u.ph]}</span></Tip>
                      {u.ec >= 3 && <Tip text="This AA has received 3+ coaching emails with no response. The email now escalates to their Account Manager."><span style={{ fontSize: 9, color: "#DC2626", background: "#FEF2F2", padding: "2px 8px", borderRadius: 3, border: "1px solid #FECACA", fontWeight: 800 }}>3-STRIKE → Goes to AM</span></Tip>}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {u.ec > 0 && <Tip text="View all coaching emails previously sent to this AA."><button onClick={() => setCommLog(u)} style={{ fontSize: 11, fontWeight: 600, color: "#F97316", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 6, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>Sent ({u.ec})</button></Tip>}
                      <Tip text={u.ec >= 3 ? "Preview the escalation email that will be sent to this AA's Account Manager." : "Preview the coaching email generated for this AA based on their gaps and stats."}><button onClick={() => seV(bE(u))} style={{ fontSize: 11, fontWeight: 700, color: "#FFF", background: u.ec >= 3 ? "#DC2626" : "#F97316", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer", whiteSpace: "nowrap" }}>{u.ec >= 3 ? "Preview AM Email" : "Preview Email"}</button></Tip>
                    </div>
                  </div>
                  {ca && <div style={{ fontSize: 12, color: "#EA580C", fontWeight: 600, background: "#FFF7ED", padding: "6px 10px", borderRadius: 6, marginBottom: 8 }}>Why: {ca}</div>}
                  {(() => {
                    const em = bE(u);
                    return em.targets && em.targets.length > 0 ? (
                      <div style={{ marginBottom: 8, padding: "6px 10px", background: "#F8FAFB", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>Today's email targets</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: em.video ? 4 : 0 }}>
                          {em.targets.map((t, ti) => {
                            const stL = { 0: { bg: "#FEE2E2", c: "#DC2626", l: "Missing" }, 1: { bg: "#FFF7ED", c: "#EA580C", l: "Gap" }, 2: { bg: "#FEFCE8", c: "#CA8A04", l: "Cooling" } };
                            const sc = stL[t.st] || stL[0];
                            return <Tip key={ti} text={t.tip + " \u2014 " + sc.l + " in " + t.cat}><span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: sc.bg, color: sc.c, fontWeight: 600 }}>{t.name}</span></Tip>;
                          })}
                        </div>
                        {em.video && <div style={{ fontSize: 9, color: "#0369A1" }}>{"\u25B6"} Video: {em.video.title} ({em.video.dur})</div>}
                      </div>
                    ) : null;
                  })()}
                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#64748B" }}>
                    <Tip text="What this AA did yesterday. Red = zero activity. Includes calls, offers, and total touches (calls + texts + emails)."><div><span style={{ color: "#94A3B8" }}>Yesterday:</span> <b style={{ color: yAct > 0 ? "#334155" : "#DC2626" }}>{u.y.ca} calls, {u.y.of} offers, {yAct} total touches</b></div></Tip>
                    <div style={{ color: "#E2E8F0" }}>|</div>
                    <Tip text="The daily targets this AA should be hitting based on their phase. Calls and offers per day."><div><span style={{ color: "#94A3B8" }}>Daily goal:</span> <b style={{ color: "#334155" }}>{u.g.ca} calls, {u.g.of} offers</b></div></Tip>
                  </div>
                </div>
              );
            })}

            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", marginTop: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}><Tip text="Complete log of all coaching emails sent across all AAs. Shows what was sent, when, and to whom.">Communication Log</Tip></div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>
                <b style={{ color: "#F97316" }}>{fU.reduce((s, u) => s + u.ec, 0)}</b> total emails sent &middot; <b style={{ color: "#DC2626" }}>{fU.filter((u) => u.ec >= 3).length}</b> AAs at 3-strike
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "40px 70px 60px 1fr 80px 1fr", padding: "5px 10px", background: "#F8FAFB", borderRadius: "6px 6px 0 0", border: "1px solid #E2E8F0", fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                <Tip text="Sequential email number for this AA."><div>#</div></Tip>
                <Tip text="Date the email was sent."><div>Date</div></Tip>
                <Tip text="Time the email was sent."><div>Time</div></Tip>
                <Tip text="Email subject line. Escalation emails start with 'ESCALATION:'."><div>Subject</div></Tip>
                <Tip text="Email type: Coaching (daily), Onboarding (first setup), Reactivation (after inactivity), Reminder, or Escalation (to AM)."><div>Type</div></Tip>
                <Tip text="Who received the email — the AA name or the Account Manager (for escalations)."><div>To</div></Tip>
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 6px 6px", maxHeight: 340, overflowY: "auto" }}>
                {fU.filter((u) => u.ec > 0).flatMap((u) => gEH(u).map((e) => ({ ...e, uName: u.n, uHealth: u.health }))).sort((a, b) => b.ts - a.ts || a.uName.localeCompare(b.uName)).map((e, i) => {
                  const tyC = { coaching: "#F97316", onboarding: "#3B82F6", reactivation: "#8B5CF6", reminder: "#D97706", escalation: "#DC2626" };
                  const tyL = { coaching: "Coaching", onboarding: "Onboarding", reactivation: "Reactivation", reminder: "Reminder", escalation: "Escalation" };
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 70px 60px 1fr 80px 1fr", padding: "6px 10px", borderTop: i > 0 ? "1px solid #F1F5F9" : "none", fontSize: 11, alignItems: "center", background: e.escalated ? "#FEF2F2" : "#FFF" }}>
                      <div style={{ color: "#94A3B8", fontSize: 10 }}>{e.id}</div>
                      <div style={{ color: "#64748B" }}>{e.date}</div>
                      <div style={{ color: "#94A3B8", fontSize: 10 }}>{e.time}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: e.escalated ? "#DC2626" : "#334155", fontSize: 11 }}>{e.subject}</div>
                        <div style={{ fontSize: 9, color: "#94A3B8" }}>{e.uName}</div>
                      </div>
                      <div><span style={{ fontSize: 8, fontWeight: 700, color: "#FFF", background: tyC[e.type] || "#94A3B8", padding: "1px 6px", borderRadius: 3, textTransform: "uppercase" }}>{tyL[e.type]}</span></div>
                      <div style={{ fontSize: 10, color: "#64748B" }}>{e.to}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {tab === "logic" && (
          <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}><Tip text="Reference table showing every rule that triggers a coaching email. Each rule fires based on phase, timing, and specific behavior patterns detected in the AA's data. Events column shows which of the 62 tracked events each rule targets.">Email logic</Tip></div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>Every email: yesterday data + event targets + phase-matched video + iQ Help Bot. System tracks sent vs. used vs. ignored daily.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "40px 45px 140px 1fr 70px 140px 40px 1fr", padding: "5px 8px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
              <div><Tip text="Which phase this rule applies to: P1 (Onboarding), P2 (Activation), P3 (Performance), or ALL.">Ph</Tip></div><div><Tip text="When the rule fires: Daily, at specific day milestones (D3, D14, etc.), or after inactivity periods (7+d).">When</Tip></div><div><Tip text="The specific behavior or condition that triggers the email. E.g., 'Calls below 30/day' or 'Feature unused 7d'.">Trigger</Tip></div><div><Tip text="What the coaching email says — the specific message or subject line sent to the AA.">Email</Tip></div><div><Tip text="Which training video is linked in the email. Shows the specific feature or skill the AA needs help with.">Video</Tip></div><div><Tip text="Which of the 62 tracked FlipiQ events this rule targets. (dynamic) means the system picks the specific unused event for that AA.">Events</Tip></div><div><Tip text="Who receives the email: AA (the associate), AM (account manager), or both AA+AM.">To</Tip></div><div><Tip text="What happens if the AA doesn't respond to the email. Escalation path — e.g., 'Flag', 'call', or 'Escalate' to AM.">No resp</Tip></div>
            </div>
            {EL.map((r, i) => {
              const strike = r.tr.includes("0 response");
              const bc = r.em.includes("BECAUSE");
              const pc = r.ph === "P1" ? PC[1] : r.ph === "P2" ? PC[2] : r.ph === "P3" ? PC[3] : "#64748B";
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 45px 140px 1fr 70px 140px 40px 1fr", padding: "7px 8px", borderBottom: "1px solid #F1F5F9", background: strike ? "#FEF2F2" : bc ? "#FFF7ED" : i % 2 === 0 ? "#FFF" : "#FAFBFC", fontSize: 10, alignItems: "start" }}>
                  <div style={{ color: pc, fontWeight: 700 }}>{r.ph}</div>
                  <div style={{ color: "#64748B", fontSize: 9 }}>{r.d}</div>
                  <div style={{ color: "#1E293B", fontWeight: 500 }}>{r.tr}</div>
                  <div style={{ color: bc ? "#EA580C" : "#334155", fontWeight: bc ? 600 : 400, lineHeight: 1.4 }}>{r.em}</div>
                  <div style={{ color: r.vi !== "-" ? "#0369A1" : "#CBD5E1", fontSize: 9 }}>{r.vi}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>{r.ev && r.ev.length > 0 ? r.ev.map((e, ei) => <span key={ei} style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: e === "(dynamic)" ? "#EDE9FE" : "#F0F9FF", color: e === "(dynamic)" ? "#7C3AED" : "#0369A1", fontWeight: 500 }}>{e}</span>) : <span style={{ color: "#CBD5E1", fontSize: 8 }}>-</span>}</div>
                  <div style={{ fontWeight: 600, color: r.to.includes("AM") || (r.to.includes("P") && r.to.length < 4) ? "#DC2626" : "#64748B" }}>{r.to}</div>
                  <div style={{ color: strike ? "#DC2626" : "#64748B", fontWeight: strike ? 700 : 400 }}>{r.es}</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "users" && !sel && !eV && (() => {
          const ulCols = [
            { k: "uid", l: "ID", w: 45, tip: "Unique user ID in the system." },
            { k: "fn", l: "First", w: 80, tip: "First name." },
            { k: "ln", l: "Last", w: 95, tip: "Last name." },
            { k: "co", l: "Company", w: 110, tip: "Organization / company name." },
            { k: "lid", l: "Login ID", w: 100, tip: "Login username for FlipiQ." },
            { k: "st", l: "Status", w: 60, tip: "Account status: Active or Inactive." },
            { k: "fl", l: "First login", w: 140, tip: "Date and time of the user's very first login." },
            { k: "ll", l: "Last login", w: 140, tip: "Date and time of the user's most recent login." },
            { k: "tl", l: "Total", w: 50, tip: "Total number of logins." },
            { k: "email", l: "Email", w: 200, tip: "Primary email address." },
            { k: "ph", l: "Phone", w: 110, tip: "Primary phone number." },
            { k: "dpn", l: "Dialpad phone", w: 120, tip: "Dialpad phone number assigned to this user." },
            { k: "duid", l: "Dialpad user ID", w: 110, tip: "Dialpad user identifier." },
            { k: "esrc", l: "Email src", w: 130, tip: "SMTP email source server." },
            { k: "epwd", l: "Email pwd", w: 70, tip: "Email password (masked)." },
            { k: "besrc", l: "Bulk email src", w: 140, tip: "Bulk email source server." },
            { k: "bepwd", l: "Bulk email pwd", w: 90, tip: "Bulk email password (masked)." },
            { k: "baddr", l: "Bulk email addr", w: 160, tip: "Bulk email sender address." },
            { k: "enpwd", l: "Email pwd new", w: 90, tip: "New email password (masked)." },
            { k: "benpwd", l: "Bulk email pwd new", w: 110, tip: "New bulk email password (masked)." },
            { k: "cid", l: "Contact ID", w: 85, tip: "CRM contact identifier." },
          ];
          const tw = ulCols.reduce((s, c) => s + c.w, 0);
          return (
            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>User list</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>All {UL.length} acquisition associates — login history, credentials, contact info, and Dialpad integration.</div>
                </div>
                <div style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", padding: "4px 10px", borderRadius: 5, fontWeight: 600 }}>{UL.length} users</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: tw + 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: ulCols.map(c => c.w + "px").join(" "), padding: "6px 10px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0", fontSize: 8, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", gap: 0 }}>
                    {ulCols.map(c => <div key={c.k}><Tip text={c.tip}>{c.l}</Tip></div>)}
                  </div>
                  {UL.map((u, i) => (
                    <div key={u.uid} style={{ display: "grid", gridTemplateColumns: ulCols.map(c => c.w + "px").join(" "), padding: "7px 10px", borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#FFF" : "#FAFBFC", fontSize: 10, alignItems: "center", gap: 0 }}>
                      <div style={{ color: "#64748B", fontWeight: 600 }}>{u.uid}</div>
                      <div style={{ fontWeight: 600, color: "#1E293B" }}>{u.fn}</div>
                      <div style={{ fontWeight: 600, color: "#1E293B" }}>{u.ln}</div>
                      <div style={{ color: "#F97316", fontWeight: 600 }}>{u.co}</div>
                      <div style={{ color: "#64748B", fontFamily: "monospace", fontSize: 9 }}>{u.lid}</div>
                      <div><span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: u.st === "Active" ? "#ECFDF5" : "#FEF2F2", color: u.st === "Active" ? "#10B981" : "#DC2626", fontWeight: 600 }}>{u.st}</span></div>
                      <div style={{ color: u.fl ? "#1E293B" : "#DC2626", fontWeight: u.fl ? 400 : 600, fontSize: 9 }}>{u.fl || "Never"}</div>
                      <div style={{ color: u.ll ? "#1E293B" : "#DC2626", fontWeight: u.ll ? 400 : 600, fontSize: 9 }}>{u.ll || "Never"}</div>
                      <div style={{ fontWeight: 700, color: u.tl === 0 ? "#DC2626" : u.tl < 10 ? "#D97706" : "#10B981" }}>{u.tl}</div>
                      <div style={{ color: "#0369A1", fontSize: 9 }}>{u.email}</div>
                      <div style={{ color: "#64748B", fontSize: 9 }}>{u.ph}</div>
                      <div style={{ color: "#64748B", fontFamily: "monospace", fontSize: 9 }}>{u.dpn}</div>
                      <div style={{ color: "#64748B", fontFamily: "monospace", fontSize: 9 }}>{u.duid}</div>
                      <div style={{ color: "#64748B", fontSize: 9 }}>{u.esrc}</div>
                      <div style={{ color: "#94A3B8", fontSize: 9 }}>{u.epwd}</div>
                      <div style={{ color: "#64748B", fontSize: 9 }}>{u.besrc}</div>
                      <div style={{ color: "#94A3B8", fontSize: 9 }}>{u.bepwd}</div>
                      <div style={{ color: "#64748B", fontSize: 9 }}>{u.baddr}</div>
                      <div style={{ color: "#94A3B8", fontSize: 9 }}>{u.enpwd}</div>
                      <div style={{ color: "#94A3B8", fontSize: 9 }}>{u.benpwd}</div>
                      <div style={{ color: "#64748B", fontFamily: "monospace", fontSize: 9 }}>{u.cid}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {sel && user && (
          <div>
            <Tip text="Go back to the main list view."><button onClick={() => { ss(null); sE(null); }} style={{ fontSize: 11, color: "#F97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>&larr; Back</button></Tip>
            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 9, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{user.n}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{O.find((o) => o.id === user.org)?.n} &mdash; Day {user.day} &mdash; <span style={{ color: PC[user.ph], fontWeight: 700 }}>{PN[user.ph]}</span></div>
                  {user.agenda && <div style={{ fontSize: 11, color: "#EA580C", fontWeight: 600, marginTop: 6 }}>{user.agenda}</div>}
                </div>
                <Tip text="Generate and preview a coaching email for this AA."><button onClick={() => { seV(bE(user)); ss(null); }} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, background: "#F97316", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Send email</button></Tip>
                {user.ec > 0 && <Tip text="View all coaching emails previously sent to this AA."><button onClick={() => setCommLog(user)} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, background: "#FFF7ED", color: "#F97316", border: "1px solid #FED7AA", borderRadius: 7, cursor: "pointer" }}>Sent emails ({user.ec})</button></Tip>}
              </div>
              {(() => {
                const trOpts = [{ v: 30, l: "30 days" }, { v: 90, l: "90 days" }, { v: 180, l: "6 months" }, { v: 365, l: "12 months" }];
                const sampleCount = trendRange <= 30 ? trendRange : trendRange <= 90 ? 30 : trendRange <= 180 ? 24 : 24;
                const mkTrend = (cur, day, seed) => {
                  const pts = [];
                  for (let i = 0; i < sampleCount; i++) {
                    const progress = i / (sampleCount - 1);
                    const noise = Math.sin((seed + i) * 2.7 + i * 0.37) * 0.25 + Math.cos((seed * 3 + i) * 1.3) * 0.15;
                    const ramp = Math.pow(progress, 0.7);
                    const base = cur * ramp * (1 + noise);
                    pts.push(Math.max(0, Math.round(base)));
                  }
                  pts[pts.length - 1] = cur;
                  return pts;
                };
                const mkDates = () => {
                  const dates = [];
                  const today = new Date(2026, 2, 21);
                  const step = Math.max(1, Math.round(trendRange / sampleCount));
                  for (let i = sampleCount - 1; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i * step);
                    dates.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
                  }
                  return dates;
                };
                const TrendChart = ({ data, dates, color, h = 60 }) => {
                  const [hov, setHov] = useState(null);
                  const ref = useRef(null);
                  if (data.length < 2) return <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94A3B8" }}>No trend data</div>;
                  const mn = Math.min(...data);
                  const mx = Math.max(...data, 1);
                  const rng = mx - mn || 1;
                  const vw = 200;
                  const pad = 6;
                  const onMove = (e) => {
                    if (!ref.current) return;
                    const rect = ref.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const w = rect.width;
                    const pxPad = (pad / vw) * w;
                    const idx = Math.round(((x - pxPad) / (w - pxPad * 2)) * (data.length - 1));
                    setHov(Math.max(0, Math.min(data.length - 1, idx)));
                  };
                  return (
                    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setHov(null)} style={{ position: "relative", cursor: "crosshair", width: "100%" }}>
                      <svg width="100%" height={h} preserveAspectRatio="none" viewBox={"0 0 " + vw + " " + h}>
                        {data.map((v, i) => {
                          const x = pad + (i / (data.length - 1)) * (vw - pad * 2);
                          return <line key={"g" + i} x1={x} y1={4} x2={x} y2={h - 4} stroke="#F1F5F9" strokeWidth="0.5" />;
                        })}
                        <polyline points={data.map((v, i) => {
                          const x = pad + (i / (data.length - 1)) * (vw - pad * 2);
                          const y = h - 6 - ((v - mn) / rng) * (h - 12);
                          return x + "," + y;
                        }).join(" ")} fill="none" stroke={color + "20"} strokeWidth="1" />
                        <polyline points={data.map((v, i) => {
                          const x = pad + (i / (data.length - 1)) * (vw - pad * 2);
                          const y = h - 6 - ((v - mn) / rng) * (h - 12);
                          return x + "," + y;
                        }).join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
                        {data.map((v, i) => {
                          const x = pad + (i / (data.length - 1)) * (vw - pad * 2);
                          const y = h - 6 - ((v - mn) / rng) * (h - 12);
                          return <circle key={i} cx={x} cy={y} r={hov === i ? 3.5 : 1.5} fill={hov === i ? color : color + "80"} stroke={hov === i ? "#FFF" : "none"} strokeWidth="1" />;
                        })}
                        {hov !== null && (() => {
                          const hx = pad + (hov / (data.length - 1)) * (vw - pad * 2);
                          const hy = h - 6 - ((data[hov] - mn) / rng) * (h - 12);
                          return <line x1={hx} y1={4} x2={hx} y2={h - 4} stroke={color + "40"} strokeWidth="0.5" strokeDasharray="2,2" />;
                        })()}
                      </svg>
                      {hov !== null && (() => {
                        const pctX = (pad + (hov / (data.length - 1)) * (vw - pad * 2)) / vw * 100;
                        return (
                          <div style={{ position: "absolute", top: -2, left: pctX + "%", transform: "translateX(-50%) translateY(-100%)", background: "#1E293B", color: "#FFF", padding: "4px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                            <span style={{ color: "#94A3B8" }}>{dates[hov]}</span>{" "}<span style={{ color: color, fontWeight: 800 }}>{data[hov]}</span>
                          </div>
                        );
                      })()}
                    </div>
                  );
                };
                const trendDates = mkDates();
                const pipe = [
                  { n: "Active Pipeline", v: user.s.op, max: Math.max(user.s.op, 1), color: "#3B82F6", bg: "#EFF6FF", bc: "#BFDBFE", tip: "Total open properties/deals currently in this AA's pipeline.", seed: 1 },
                  { n: "Offers", v: user.s.of, max: user.g.of * Math.min(user.day, 30) || 1, color: "#F97316", bg: "#FFF7ED", bc: "#FED7AA", tip: "Total offers submitted. Target based on daily offer pace × days active.", seed: 2 },
                  { n: "In Negotiations", v: user.s.ng, max: Math.max(user.s.of, 1), color: "#8B5CF6", bg: "#F5F3FF", bc: "#DDD6FE", tip: "Deals in active negotiation.", seed: 3 },
                  { n: "Offer Accepted", v: user.s.ac, max: Math.max(user.s.ng, user.s.ac, 1), color: "#10B981", bg: "#ECFDF5", bc: "#A7F3D0", tip: "Offers accepted by seller.", seed: 4 },
                  { n: "Acquired", v: user.s.aq, max: 2, color: user.s.aq >= 2 ? "#10B981" : user.s.aq > 0 ? "#D97706" : "#DC2626", bg: user.s.aq >= 2 ? "#ECFDF5" : user.s.aq > 0 ? "#FEF9C3" : "#FEF2F2", bc: user.s.aq >= 2 ? "#A7F3D0" : user.s.aq > 0 ? "#FDE68A" : "#FECACA", tip: "Deals acquired (closed). Target: 2/month.", seed: 5 },
                ];
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                      <select value={trendRange} onChange={(e) => setTrendRange(+e.target.value)} style={{ padding: "4px 24px 4px 8px", fontSize: 10, border: "1px solid #E2E8F0", borderRadius: 6, background: "#FFF", appearance: "none", WebkitAppearance: "none", cursor: "pointer", color: "#64748B", backgroundImage: sel0, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}>
                        {trOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                    {pipe.map((p, pi) => {
                      const pct2 = Math.min(100, Math.round((p.v / p.max) * 100));
                      const trend = mkTrend(p.v, user.day, p.seed + user.id);
                      const trendUp = trend.length >= 2 && trend[trend.length - 1] >= trend[trend.length - 2];
                      return (
                        <Tip key={p.n} text={p.tip}><div style={{ background: p.bg, border: "1px solid " + p.bc, borderRadius: 10, padding: "12px 10px 8px", position: "relative" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.n}</span>
                            <span style={{ fontSize: 8, fontWeight: 700, color: trendUp ? "#10B981" : "#DC2626" }}>{trendUp ? "\u25B2" : "\u25BC"}</span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: p.color, marginLeft: "auto" }}>{p.v}</span>
                            <span style={{ fontSize: 9, color: "#94A3B8" }}>/ {p.max}</span>
                            <span style={{ fontSize: 9, color: "#94A3B8" }}>{pct2}%</span>
                          </div>
                          <TrendChart data={trend} dates={trendDates} color={p.color} h={56} />
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, color: "#94A3B8", marginTop: 2, padding: "0 2px" }}>
                            <span>{trendDates[0]}</span>
                            <span>{trendDates[trendDates.length - 1]}</span>
                          </div>
                          {pi < pipe.length - 1 && <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "#CBD5E1" }}>{"\u25B6"}</div>}
                        </div></Tip>
                      );
                    })}
                  </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F97316", marginBottom: 8 }}><Tip text="Outbound communication metrics: texts, emails, calls (with connected count), and average time spent. Green values = on pace, red = below goal.">Communication</Tip></div>
                {[["Texts", user.s.tx, null, "Total text messages sent today by this AA."], ["Emails", user.s.em, null, "Total emails sent today by this AA."], ["Calls", user.s.ca + " (" + user.s.cc + " conn)", user.g.ca, "Total calls made today with connected count in parentheses. Red = below daily goal."], ["Avg Time", Math.round(user.s.mn / 60) + "h", null, "Average total time spent in FlipiQ today across all features."]].map(([l, v, g, tip]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <Tip text={tip}><span style={{ color: "#64748B" }}>{l}</span></Tip>
                    <span style={{ fontWeight: 700, color: g ? vc(typeof v === "number" ? v : 0, g) : "#1E293B" }}>{v}{g ? <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 400 }}> /{g}</span> : null}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 6, paddingTop: 6, fontSize: 10, color: "#94A3B8" }}>
                  <Tip text="Time breakdown by feature: PIQ = Priority IQ, Comps = Comparables, IA = Investment Analysis, Offer = Offer Builder, Agents = Agent outreach.">PIQ:{user.s.piq}m Comps:{user.s.comp}m IA:{user.s.ia}m Offer:{user.s.off}m Agents:{user.s.ag}m</Tip>
                </div>
              </div>

              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 8 }}><Tip text="Deal flow from opened to acquired. R/N = reopened/new ratio. Acquired target is 2/month.">Deal pipeline</Tip></div>
                {[["Opened", user.s.op, null, "Total properties/deals opened or added to the pipeline."], ["Reopened", user.s.re, null, "Deals that were closed but reopened for another attempt."], ["R/N", user.s.op > 0 ? (user.s.re / user.s.op).toFixed(2) : "0", null, "Reopen-to-new ratio. Higher means more recycling of old leads vs finding new ones."], ["Offers", user.s.of, user.g.of * Math.min(user.day, 30), "Total offers submitted. Red = below target pace."], ["Negot", user.s.ng, null, "Deals currently in active negotiation with the seller."], ["Accepted", user.s.ac, null, "Offers accepted by the seller — moving toward closing."], ["Acquired", user.s.aq, 2, "Deals fully closed/acquired. Target is 2 per month. This is the Atomic KPI."]].map(([l, v, g, tip]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <Tip text={tip}><span style={{ color: "#64748B" }}>{l}</span></Tip>
                    <span style={{ fontWeight: l === "Acquired" ? 800 : 700, color: g ? vc(typeof v === "number" ? v : 0, g) : "#1E293B" }}>{v}{g ? <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 400 }}> /{g}</span> : null}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 6, paddingTop: 6, fontSize: 10, color: "#94A3B8" }}>
                  <Tip text="Lead sources breakdown: MLS = MLS listings, DM = direct mail, CC = cold calls, Ref = referrals.">Source: MLS:{user.s.mls} DM:{user.s.dm} CC:{user.s.cold} Ref:{user.s.ref}</Tip>
                </div>
              </div>

              <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", marginBottom: 8 }}><Tip text="Contact relationship status: new contacts added, upgrades (cold→warm), priority/hot contacts, warm leads, and daily check-in completion.">Relationships</Tip></div>
                {[["New", user.s.nr, "New contacts added to this AA's contact list today."], ["Upgraded", user.s.up, "Contacts upgraded from cold to warm status — showing relationship progress."], ["Priority H", user.s.pH, "Number of high-priority (hot) contacts this AA is actively working."], ["Warm", user.s.pW, "Number of warm leads — contacts who have shown interest but haven't converted."], ["Check-in", user.s.ck ? "Done" : "Not Done", "Daily check-in status. Must be completed before any coaching rules fire. Red = not done."]].map(([l, v, tip]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <Tip text={tip}><span style={{ color: "#64748B" }}>{l}</span></Tip>
                    <span style={{ fontWeight: 700, color: v === "Done" ? "#10B981" : v === "Not Done" ? "#DC2626" : "#1E293B" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {gc(user) && (
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#EA580C", marginBottom: 4 }}><Tip text="The #1 reason this AA is struggling, determined by the WHY analysis. This drives the coaching email content and recommended action.">ROOT CAUSE</Tip></div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{gc(user)}</div>
              </div>
            )}


            {(() => {
              const allEv = user.ev.flatMap((c) => c.events);
              const total = allEv.length;
              const active = allEv.filter((e) => e.st === 3).length;
              const cooling = allEv.filter((e) => e.st === 2).length;
              const gap = allEv.filter((e) => e.st === 1).length;
              const unused = allEv.filter((e) => e.st === 0).length;
              const adopted = active + cooling;
              const pct = Math.round((adopted / total) * 100);
              const newEv = allEv.filter((e) => e.st >= 1 && e.first && parseInt(e.first.replace("Mar ", "")) >= 19);
              const legend = [
                { label: "Active", color: "#10B981", count: active },
                { label: "Cooling", color: "#D97706", count: cooling },
                { label: "Gap", color: "#EA580C", count: gap },
                { label: "Unused", color: "#DC2626", count: unused },
              ];
              return (
                <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    <Tip text="Visual breakdown of feature adoption across 62 events in 7 categories. Shows what's actively used, cooling off, has gaps, or is completely unused. The progress bar shows the overall adoption rate (Active + Cooling events).">Feature Adoption</Tip>
                    <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400, marginLeft: 8 }}>{adopted}/{total} adopted ({pct}%)</span>
                    <Tip text={"AA started on " + startDate(user.day) + " — Day " + user.day + " of " + (user.day <= 7 ? "Onboarding" : user.day <= 21 ? "Activation" : "Performance") + ". Track adoption timeline from this date."}><span style={{ fontSize: 10, color: "#64748B", fontWeight: 400, marginLeft: 10, background: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>Started {startDate(user.day)} · Day {user.day}</span></Tip>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, height: 20, background: "#F1F5F9", borderRadius: 6, overflow: "hidden", display: "flex" }}>
                        {active > 0 && <div style={{ width: (active / total * 100) + "%", background: "#10B981", height: "100%", transition: "width 0.5s" }} />}
                        {cooling > 0 && <div style={{ width: (cooling / total * 100) + "%", background: "#D97706", height: "100%", transition: "width 0.5s" }} />}
                        {gap > 0 && <div style={{ width: (gap / total * 100) + "%", background: "#EA580C", height: "100%", transition: "width 0.5s" }} />}
                        {unused > 0 && <div style={{ width: (unused / total * 100) + "%", background: "#FEE2E2", height: "100%", transition: "width 0.5s" }} />}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#F97316", flexShrink: 0 }}>{pct}%</span>
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                        {legend.map((l) => (
                          <Tip key={l.label} text={l.label + ": " + l.count + " of " + total + " events — " + (l.label === "Active" ? "regularly used features" : l.label === "Cooling" ? "usage slowing down" : l.label === "Gap" ? "used once, not recently" : "never used")}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                              <span style={{ color: "#64748B" }}>{l.label}</span>
                              <span style={{ fontWeight: 700, color: l.color }}>{l.count}</span>
                            </div>
                          </Tip>
                        ))}
                      </div>
                      {C.map((cat, ci) => {
                        const evs = user.ev[ci].events;
                        const t = evs.length;
                        const a = evs.filter((e) => e.st === 3).length;
                        const co = evs.filter((e) => e.st === 2).length;
                        const g2 = evs.filter((e) => e.st === 1).length;
                        const un = evs.filter((e) => e.st === 0).length;
                        const isAdoptOpen = exp && exp.u === user.id && exp.c === ci;
                        const catCs = user.cs[ci];
                        const catLag = lagDays(user.day, catCs.fa);
                        const catLagStr = catLag !== null ? " (adopted " + fmtLag(catLag) + ")" : "";
                        const tipParts = [cat.n + ": " + a + " active, " + co + " cooling, " + g2 + " gap, " + un + " unused."];
                        if (catCs.fa) tipParts.push("First: " + catCs.fa + catLagStr);
                        if (catCs.la) tipParts.push("Last: " + catCs.la);
                        tipParts.push("Click to open in table below.");
                        return (
                          <Tip key={ci} text={tipParts.join(" | ")}>
                            <div onClick={() => { tE(user.id, ci); setTimeout(() => { const el = document.getElementById("fu-cat-" + ci); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 50); }} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, cursor: "pointer", padding: "3px 0", borderRadius: 4, transition: "background 0.15s" }}>
                              <span style={{ fontSize: 10, color: isAdoptOpen ? "#F97316" : "#64748B", fontWeight: isAdoptOpen ? 700 : 400, width: 55, textAlign: "right", flexShrink: 0 }}>{HL[ci]}</span>
                              <div style={{ flex: 1, height: 16, background: "#F1F5F9", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                                {a > 0 && <div style={{ width: (a / t * 100) + "%", background: "#10B981", height: "100%" }} />}
                                {co > 0 && <div style={{ width: (co / t * 100) + "%", background: "#D97706", height: "100%" }} />}
                                {g2 > 0 && <div style={{ width: (g2 / t * 100) + "%", background: "#EA580C", height: "100%" }} />}
                                {un > 0 && <div style={{ width: (un / t * 100) + "%", background: "#FEE2E2", height: "100%" }} />}
                              </div>
                              <span style={{ fontSize: 10, color: "#94A3B8", width: 30, flexShrink: 0 }}>{a + co}/{t}</span>
                            </div>
                          </Tip>
                        );
                      })}
                      {newEv.length > 0 && (
                        <div style={{ marginTop: 8, padding: "6px 10px", background: "#ECFDF5", borderRadius: 6, border: "1px solid #10B98140" }}>
                          <Tip text="Events first used in the last few days — newly adopted features showing positive momentum.">
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#10B981" }}>Recently adopted: </span>
                            <span style={{ fontSize: 11, color: "#334155" }}>{newEv.map((e) => e.name).join(", ")}</span>
                          </Tip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}><Tip text="3-Track scoring of 62 FlipiQ features across 7 categories. Each event is scored: First use (ever used?), Recency (used recently?), Frequency (how often?). Colors: red=missing, orange=gap, yellow=cooling, green=active.">Feature usage</Tip> &mdash; 62 events</div>
            {C.map((cat, ci) => {
              const cs = user.cs[ci];
              const isO = exp && exp.u === user.id && exp.c === ci;
              return (
                <div key={ci} id={"fu-cat-" + ci} style={{ marginBottom: 6 }}>
                  <div onClick={() => tE(user.id, ci)} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: isO ? "8px 8px 0 0" : 8, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Tip text={SL[cs.sc] + " — " + (cs.sc === 0 ? "Never used any events in this category." : cs.sc === 1 ? "Used once but not recently — needs reactivation." : cs.sc === 2 ? "Usage is slowing down — monitor closely." : "Actively using events in this category.")}><div style={{ width: 28, height: 20, borderRadius: 4, background: HMBG[cs.sc], border: "1.5px solid " + HMC[cs.sc] + "60", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: HMC[cs.sc] }}>{SL[cs.sc].slice(0, 4)}</span>
                      </div></Tip>
                      <div>
                        <Tip text={"Click to expand all " + cs.t + " events in the " + cat.n + " category."}><span style={{ fontSize: 13, fontWeight: 600 }}>{cat.n}</span></Tip>
                        <Tip text={cs.ac + " of " + cs.t + " events are actively being used in this category."}><span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{cs.ac}/{cs.t} active</span></Tip>
                        {cs.mi > 0 && <Tip text={cs.mi + " events in this category have NEVER been used — these are gaps to address."}><span style={{ fontSize: 10, color: "#DC2626", marginLeft: 8, fontWeight: 600 }}>{cs.mi} missing</span></Tip>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#64748B" }}>
                      {(() => {
                        const cLag = lagDays(user.day, cs.fa);
                        const sd = startDate(user.day);
                        return (
                          <>
                            <Tip text={"AA started " + sd + " (Day 1). First used this category: " + (cs.fa || "never") + (cLag !== null ? " (" + fmtLag(cLag) + " — " + (cLag <= 0 ? "same day!" : cLag + " day" + (cLag !== 1 ? "s" : "") + " after start") + ")" : "") + "."}><div>First: <span style={{ fontWeight: 600, color: cs.fa ? "#334155" : "#DC2626" }}>{cs.fa || "never"}</span>{cLag !== null && <span style={{ fontSize: 9, color: "#F97316", fontWeight: 600, marginLeft: 3 }}>{fmtLag(cLag)}</span>}</div></Tip>
                            <Tip text="Total number of times any event in this category has been used."><div>Uses: <span style={{ fontWeight: 600 }}>{cs.tc}</span></div></Tip>
                            <Tip text={"Most recent date any event in this category was used." + (cs.la && cs.fa ? " Span: " + cs.fa + " → " + cs.la + "." : "")}><div>Last: <span style={{ fontWeight: 600, color: cs.la ? "#334155" : "#DC2626" }}>{cs.la || "never"}</span></div></Tip>
                          </>
                        );
                      })()}
                      <span style={{ fontSize: 14, color: "#94A3B8", transform: isO ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BE"}</span>
                    </div>
                  </div>
                  {isO && (
                    <div style={{ background: "#FAFBFC", border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "4px 0" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 75px 45px 55px 75px 65px", padding: "4px 14px", fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                        {[["name", "Event", "left", "Name of the feature event tracked in FlipiQ."], ["first", "First", "center", "Date this feature was first used by the AA. 'never' = never tried."], ["lag", "Lag", "center", "Days from AA start date to first use of this event. D1 = adopted on day 1. '—' = never used."], ["count", "Count", "center", "Total number of times this feature has been used."], ["last", "Last", "center", "Most recent date this feature was used. 'never' = never tried."], ["st", "Status", "center", "3-Track score: Missing (never used), Gap (used once, not recently), Cooling (used but slowing), Active (regular use)."]].map(([k, label, align, tip]) => (
                          <Tip key={k} text={tip}><div onClick={() => toggleEvSort(k)} style={{ textAlign: align, cursor: "pointer", userSelect: "none", color: evSort.col === k ? "#F97316" : "#94A3B8" }}>{label} {evSort.col === k ? (evSort.dir === 1 ? "\u25B2" : "\u25BC") : ""}</div></Tip>
                        ))}
                      </div>
                      {[...user.ev[ci].events].sort((a, b) => { const c = evSort.col; const d = evSort.dir; if (c === "lag") { const al = lagDays(user.day, a.first); const bl = lagDays(user.day, b.first); if (al === null && bl === null) return 0; if (al === null) return d; if (bl === null) return -d; return (al - bl) * d; } if (c === "count" || c === "st") return (a[c] - b[c]) * d; const av = (c === "name" ? a.name : a[c]) || ""; const bv = (c === "name" ? b.name : b[c]) || ""; return av.localeCompare(bv) * d; }).map((ev, ei) => {
                        const evLag = lagDays(user.day, ev.first);
                        const evLagStr = fmtLag(evLag);
                        const lagColor = evLag === null ? "#DC2626" : evLag <= 1 ? "#10B981" : evLag <= 7 ? "#D97706" : "#EA580C";
                        return (
                        <Tip key={ei} text={ev.name + ": " + (ev.st === 0 ? "MISSING — never used. This is a gap to address." : ev.st === 1 ? "GAP — used once (" + (ev.first || "?") + ", " + evLagStr + ") but not recently. Needs reactivation." : ev.st === 2 ? "COOLING — was active but slowing. Used " + ev.count + "×, first " + (ev.first || "?") + " (" + evLagStr + "), last " + (ev.last || "?") + "." : "ACTIVE — regularly used. " + ev.count + "×, first " + (ev.first || "?") + " (" + evLagStr + "), last " + (ev.last || "?") + ".")}><div style={{ display: "grid", gridTemplateColumns: "1fr 75px 45px 55px 75px 65px", padding: "4px 14px", borderTop: "1px solid #F1F5F9", fontSize: 10, alignItems: "center" }}>
                          <div style={{ color: ev.st === 0 ? "#DC2626" : "#334155", fontWeight: ev.st === 0 ? 600 : 400 }}>{ev.name}</div>
                          <div style={{ textAlign: "center", color: ev.first ? "#64748B" : "#DC2626" }}>{ev.first || "never"}</div>
                          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 9, color: lagColor }}>{evLagStr}</div>
                          <div style={{ textAlign: "center", fontWeight: 600 }}>{ev.count}</div>
                          <div style={{ textAlign: "center", color: ev.last ? "#64748B" : "#DC2626" }}>{ev.last || "never"}</div>
                          <div style={{ textAlign: "center" }}><span style={{ fontSize: 8, fontWeight: 700, color: HMC[ev.st], background: HMBG[ev.st], padding: "1px 5px", borderRadius: 2 }}>{SL[ev.st]}</span></div>
                        </div></Tip>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, marginTop: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>FlipiQ AI Assistant</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>Summary &amp; what {user.n} needs to do today</div>
                </div>
              </div>

              <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9" }}>
                {aiSumLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 0" }}>
                    <div style={{ width: 16, height: 16, border: "2px solid #F97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>Analyzing {user.n}'s data...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : aiSummary ? (
                  <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiSummary}</div>
                ) : (
                  <div style={{ fontSize: 12, color: "#94A3B8", padding: "8px 0" }}>Summary unavailable.</div>
                )}
              </div>

              {aiMsgs.length > 0 && (
                <div style={{ maxHeight: 280, overflowY: "auto", padding: "10px 18px", borderBottom: "1px solid #F1F5F9" }}>
                  {aiMsgs.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
                      <div style={{
                        maxWidth: "80%", padding: "8px 12px", borderRadius: 10,
                        background: m.role === "user" ? "#F97316" : "#F8FAFB",
                        color: m.role === "user" ? "#FFF" : "#334155",
                        fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap",
                        border: m.role === "user" ? "none" : "1px solid #E2E8F0"
                      }}>{m.content}</div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div style={{ display: "flex", gap: 4, padding: "6px 0" }}>
                      {[0, 1, 2].map((d) => (
                        <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316", animation: `bounce 1s ease-in-out ${d * 0.15}s infinite` }} />
                      ))}
                      <style>{`@keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
                    </div>
                  )}
                  <div ref={aiEndRef} />
                </div>
              )}

              <div style={{ padding: "10px 18px", display: "flex", gap: 8 }}>
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAiMsg(); } }}
                  placeholder={"Ask anything about " + user.n + "..."}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, outline: "none", fontFamily: "inherit" }}
                  disabled={aiLoading}
                />
                <button
                  onClick={sendAiMsg}
                  disabled={!aiInput.trim() || aiLoading}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: aiInput.trim() && !aiLoading ? "#F97316" : "#E2E8F0", color: aiInput.trim() && !aiLoading ? "#FFF" : "#94A3B8", fontSize: 12, fontWeight: 700, cursor: aiInput.trim() && !aiLoading ? "pointer" : "default" }}
                >Send</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {hC && !sel && !eV && tab === "heatmap" && (() => {
        const u = U.find((x) => x.id === hC.uid);
        const cs = u?.cs[hC.ci];
        if (!u || !cs) return null;
        return (
          <div style={{ position: "fixed", left: Math.min(hC.x, 900), top: hC.y, width: 270, background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, pointerEvents: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{C[hC.ci].n}</div>
              <div style={{ fontSize: 9, color: "#64748B", background: "#F1F5F9", padding: "1px 6px", borderRadius: 3 }}>Started {startDate(u.day)} · Day {u.day}</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 6, fontSize: 11 }}>
              <div>Active: <span style={{ fontWeight: 600, color: "#10B981" }}>{cs.ac}</span>/{cs.t}</div>
              <div>Missing: <span style={{ fontWeight: 600, color: cs.mi > 0 ? "#DC2626" : "#64748B" }}>{cs.mi}</span></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5 }}>
              {[{ l: "First", v: cs.fa }, { l: "Lag", v: cs.fa ? fmtLag(lagDays(u.day, cs.fa)) : "—" }, { l: "Uses", v: cs.tc }, { l: "Last", v: cs.la }].map((x) => (
                <div key={x.l} style={{ background: "#F8FAFB", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#94A3B8" }}>{x.l}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: x.l === "Lag" ? "#F97316" : (x.v ? "#334155" : "#DC2626") }}>{x.v || "never"}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 6 }}>Click to expand</div>
          </div>
        );
      })()}

      {commLog && (() => {
        const eh = gEH(commLog);
        const tyC = { coaching: "#F97316", onboarding: "#3B82F6", reactivation: "#8B5CF6", reminder: "#D97706", escalation: "#DC2626" };
        const tyL = { coaching: "Coaching", onboarding: "Onboarding", reactivation: "Reactivation", reminder: "Reminder", escalation: "Escalation" };
        const stC = { 0: { bg: "#FEE2E2", c: "#DC2626", l: "Missing" }, 1: { bg: "#FFF7ED", c: "#EA580C", l: "Gap" }, 2: { bg: "#FEFCE8", c: "#CA8A04", l: "Cooling" } };
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setCommLog(null)}>
            <div style={{ background: "#FFF", borderRadius: 12, padding: 0, width: 540, maxHeight: "85vh", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Emails sent to {commLog.n}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{eh.length} email{eh.length !== 1 ? "s" : ""} sent {commLog.ec >= 3 ? " \u2014 3-strike reached" : ""}</div>
                </div>
                <button onClick={() => setCommLog(null)} style={{ background: "none", border: "none", fontSize: 18, color: "#94A3B8", cursor: "pointer", padding: "4px 8px" }}>{"\u2715"}</button>
              </div>
              <div style={{ padding: "12px 20px", overflowY: "auto", flex: 1 }}>
                <div style={{ position: "relative", paddingLeft: 20 }}>
                  <div style={{ position: "absolute", left: 7, top: 4, bottom: 4, width: 2, background: "#E2E8F0" }} />
                  {eh.map((e) => (
                    <div key={e.id} style={{ position: "relative", marginBottom: 18, paddingLeft: 16 }}>
                      <div style={{ position: "absolute", left: -16, top: 5, width: 10, height: 10, borderRadius: "50%", background: e.escalated ? "#DC2626" : tyC[e.type] || "#94A3B8", border: "2px solid #FFF", boxShadow: "0 0 0 1px " + (e.escalated ? "#FECACA" : "#E2E8F0") }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{e.date}</span>
                        <span style={{ fontSize: 10, color: "#94A3B8" }}>{e.time}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#FFF", background: tyC[e.type] || "#94A3B8", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase" }}>{tyL[e.type]}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: e.escalated ? "#DC2626" : "#334155" }}>{e.subject}</div>
                      <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>To: {e.to}{e.escalated ? " (Account Manager)" : ""}</div>
                      {e.targets && e.targets.length > 0 && (
                        <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {e.targets.map((t, ti) => {
                            const sc = stC[t.st] || stC[0];
                            const wasActed = e.acted?.includes(t.name);
                            return (
                              <Tip key={ti} text={t.tip + (wasActed ? " \u2014 AA completed this!" : " \u2014 " + sc.l)}>
                                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: wasActed ? "#F0FDF4" : sc.bg, color: wasActed ? "#16A34A" : sc.c, fontWeight: 600, textDecoration: wasActed ? "line-through" : "none" }}>
                                  {wasActed ? "\u2713 " : ""}{t.name}
                                </span>
                              </Tip>
                            );
                          })}
                        </div>
                      )}
                      {e.video && (
                        <div style={{ marginTop: 4, fontSize: 9, color: "#0369A1", display: "flex", alignItems: "center", gap: 4 }}>
                          <span>{"\u25B6"}</span> {e.video.title} ({e.video.dur})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#FFF", borderRadius: 10, padding: 20, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Complete task</div>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>{U.find((u) => u.id === modal)?.n}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              {[["call", "Made a phone call", "You called this AA directly to coach them."], ["text", "Sent a text", "You sent a coaching text message to this AA."], ["email", "Sent coaching email", "You forwarded the generated coaching email to this AA."], ["notify_am", "Notified AM", "You escalated this AA to their Account Manager."], ["walkthrough", "Scheduled walkthrough", "You scheduled a screen-share walkthrough with this AA."], ["other", "Other", "Any other action you took for this AA."]].map(([k, l, tip]) => (
                <Tip key={k} text={tip}><button onClick={() => saT(k)} style={{ padding: "7px 10px", borderRadius: 6, border: aT === k ? "2px solid #F97316" : "1px solid #E2E8F0", background: aT === k ? "#FFF7ED" : "#FFF", cursor: "pointer", fontSize: 12, fontWeight: aT === k ? 700 : 500, textAlign: "left" }}>{l}</button></Tip>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 2 }}>Notes</div>
              <textarea value={aN} onChange={(e) => saN(e.target.value)} placeholder="What happened?" style={{ width: "100%", minHeight: 55, padding: 8, borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "inherit", resize: "vertical", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <Tip text="Close without completing the task."><button onClick={() => { sm(null); saT(null); saN(""); }} style={{ padding: "6px 14px", fontSize: 12, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button></Tip>
              <Tip text="Mark this task as done with the selected action."><button onClick={doC} disabled={!aT} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#fff", background: aT ? "#F97316" : "#CBD5E1", border: "none", borderRadius: 6, cursor: aT ? "pointer" : "default" }}>Complete</button></Tip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
