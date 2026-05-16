import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN TOKENS & THEME
// ============================================================
const COLORS = {
  bg: "#0a0a0f",
  bgCard: "#111118",
  bgHover: "#16161f",
  bgActive: "#1c1c28",
  border: "#1e1e2e",
  borderLight: "#2a2a3e",
  accent: "#6c63ff",
  accentLight: "#8b83ff",
  accentDim: "rgba(108,99,255,0.15)",
  green: "#00d17a",
  greenDim: "rgba(0,209,122,0.12)",
  orange: "#ff8c42",
  orangeDim: "rgba(255,140,66,0.12)",
  red: "#ff4d6a",
  redDim: "rgba(255,77,106,0.12)",
  blue: "#38bdf8",
  blueDim: "rgba(56,189,248,0.12)",
  purple: "#c084fc",
  purpleDim: "rgba(192,132,252,0.12)",
  yellow: "#fbbf24",
  yellowDim: "rgba(251,191,36,0.12)",
  text: "#e8e8f0",
  textMuted: "#6b6b8a",
  textDim: "#9898b5",
};

// ============================================================
// ICONS (inline SVG components)
// ============================================================
const Icon = ({ d, size = 16, color = "currentColor", fill = "none", strokeWidth = 1.75 }: { d: string | string[]; size?: number; color?: string; fill?: string; strokeWidth?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  tasks: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  habits: ["M12 2a10 10 0 110 20A10 10 0 0112 2z", "M12 6v6l4 2"],
  study: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  dsa: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  placement: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  expense: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  notes: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  ai: "M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM12 16a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2zM4 12a2 2 0 012-2h2a2 2 0 012 2 2 2 0 01-2 2H6a2 2 0 01-2-2zM16 12a2 2 0 012-2h2a2 2 0 012 2 2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 012.83-2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 01-1.51-2.91 2 2 0 00-2.12-3.37 1.65 1.65 0 01-1.51.11 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00-.33-1.82 1.65 1.65 0 01-2.91 1.51 2 2 0 00-3.37 2.12 1.65 1.65 0 01.11 1.51 1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82.33 1.65 1.65 0 01-1.51 2.91 2 2 0 002.12 3.37 1.65 1.65 0 011.51-.11 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00.33 1.82 1.65 1.65 0 012.91-1.51 2 2 0 003.37-2.12 1.65 1.65 0 01-.11-1.51z",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  fire: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  cpu: ["M18 4h2a2 2 0 012 2v2","M18 18h2a2 2 0 002-2v-2","M4 4H2a2 2 0 00-2 2v2","M4 18H2a2 2 0 01-2-2v-2","M9 9h6v6H9z"],
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  pin: "M12 2l.324.001A9 9 0 0121 11v.02C21 16.078 17 20.664 12 22 7 20.664 3 16.078 3 11.02V11a9 9 0 018.676-8.999L12 2zM12 8v5M12 16v.01",
  grid: "M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z",
  calendar: "M8 7V3M16 7V3M3 11h18M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z",
  clock: ["M12 22a10 10 0 110-20 10 10 0 010 20z", "M12 6v6l4 2"],
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 110 14A7 7 0 0112 5z",
  target: ["M12 22a10 10 0 110-20 10 10 0 010 20z","M12 18a6 6 0 110-12 6 6 0 010 12z","M12 14a2 2 0 110-4 2 2 0 010 4z"],
  briefcase: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  award: "M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  droplet: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
  coffee: "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];
const todayLabel = () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback((v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [val, key]);
  return [val, set];
}

// ============================================================
// SEED DATA
// ============================================================
const SEED_TASKS = [
  { id: 1, title: "Complete OS assignment", priority: "high", category: "Study", due: "2026-05-15", done: false, recurring: false },
  { id: 2, title: "Solve 5 LeetCode problems", priority: "medium", category: "DSA", due: "2026-05-14", done: false, recurring: true },
  { id: 3, title: "Apply to Google SWE Internship", priority: "high", category: "Placement", due: "2026-05-16", done: false, recurring: false },
  { id: 4, title: "Morning workout", priority: "low", category: "Health", due: "2026-05-14", done: true, recurring: true },
  { id: 5, title: "Read DBMS notes - Chapter 4", priority: "medium", category: "Study", due: "2026-05-15", done: false, recurring: false },
];

const SEED_HABITS = [
  { id: 1, name: "Wake up by 6 AM", icon: "☀️", color: COLORS.yellow, streak: 7, logs: {} },
  { id: 2, name: "Drink 8 glasses of water", icon: "💧", color: COLORS.blue, streak: 5, logs: {} },
  { id: 3, name: "Workout 30 mins", icon: "💪", color: COLORS.green, streak: 3, logs: {} },
  { id: 4, name: "Meditate 10 mins", icon: "🧘", color: COLORS.purple, streak: 12, logs: {} },
  { id: 5, name: "No social media before 10 AM", icon: "📵", color: COLORS.orange, streak: 4, logs: {} },
  { id: 6, name: "Solve 2+ LeetCode", icon: "💻", color: COLORS.accent, streak: 9, logs: {} },
];

const SEED_DSA = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", solved: true, link: "https://leetcode.com/problems/two-sum", notes: "Use hashmap for O(n)", revised: true },
  { id: 2, title: "Longest Substring Without Repeating", topic: "Strings", difficulty: "Medium", solved: true, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters", notes: "Sliding window", revised: false },
  { id: 3, title: "Merge Intervals", topic: "Arrays", difficulty: "Medium", solved: false, link: "https://leetcode.com/problems/merge-intervals", notes: "", revised: false },
  { id: 4, title: "Binary Tree Level Order", topic: "Trees", difficulty: "Medium", solved: true, link: "https://leetcode.com/problems/binary-tree-level-order-traversal", notes: "BFS with queue", revised: true },
  { id: 5, title: "Coin Change", topic: "DP", difficulty: "Medium", solved: false, link: "https://leetcode.com/problems/coin-change", notes: "", revised: false },
  { id: 6, title: "Reverse Linked List", topic: "Linked Lists", difficulty: "Easy", solved: true, link: "https://leetcode.com/problems/reverse-linked-list", notes: "Iterative + recursive", revised: true },
  { id: 7, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", solved: true, link: "https://leetcode.com/problems/number-of-islands", notes: "DFS flood fill", revised: false },
  { id: 8, title: "Climbing Stairs", topic: "DP", difficulty: "Easy", solved: true, link: "https://leetcode.com/problems/climbing-stairs", notes: "Fibonacci pattern", revised: true },
];

const SEED_PLACEMENTS = [
  { id: 1, company: "Google", role: "SWE Intern", salary: "₹80,000/mo", applied: "2026-05-01", deadline: "2026-05-20", stage: "Applied", notes: "Dream company!" },
  { id: 2, company: "Microsoft", role: "SDE Intern", salary: "₹60,000/mo", applied: "2026-04-28", deadline: "2026-05-18", stage: "OA Scheduled", notes: "OA on May 18" },
  { id: 3, company: "Amazon", role: "SDE Intern", salary: "₹70,000/mo", applied: "2026-04-25", deadline: "2026-05-30", stage: "OA Completed", notes: "Went well" },
  { id: 4, company: "Flipkart", role: "Backend Intern", salary: "₹45,000/mo", applied: "2026-04-20", deadline: "2026-05-15", stage: "Interview Scheduled", notes: "2 rounds" },
  { id: 5, company: "Zomato", role: "Product Intern", salary: "₹40,000/mo", applied: "2026-04-15", deadline: "2026-05-10", stage: "Rejected", notes: "Improve system design" },
];

const SEED_EXPENSES = [
  { id: 1, title: "Mess food", amount: 3500, category: "Food", date: "2026-05-01" },
  { id: 2, title: "Autorickshaw", amount: 120, category: "Travel", date: "2026-05-03" },
  { id: 3, title: "Mobile recharge", amount: 399, category: "Recharge", date: "2026-05-05" },
  { id: 4, title: "Amazon books", amount: 850, category: "Education", date: "2026-05-07" },
  { id: 5, title: "Swiggy delivery", amount: 340, category: "Food", date: "2026-05-09" },
  { id: 6, title: "Gym", amount: 1200, category: "Shopping", date: "2026-05-10" },
  { id: 7, title: "LeetCode Premium", amount: 1900, category: "Education", date: "2026-05-11" },
  { id: 8, title: "Clothes", amount: 2200, category: "Shopping", date: "2026-05-12" },
];

const SEED_NOTES = [
  { id: 1, title: "OS Process Scheduling", content: "# Process Scheduling\n\n**Algorithms:**\n- FCFS: First come first serve\n- SJF: Shortest job first\n- Round Robin: Time quantum based\n- Priority: Based on priority value\n\n> Remember: Starvation can occur in Priority scheduling. Aging is the solution.", tags: ["OS", "Study"], pinned: true, created: "2026-05-10" },
  { id: 2, title: "Google Interview Tips", content: "## Google Interview Prep\n\n1. Know your data structures deeply\n2. Practice behavioral (STAR format)\n3. System design: Start with requirements\n4. Communicate your thought process\n\n**Key topics:** Arrays, Trees, Graphs, DP", tags: ["Placement", "Interview"], pinned: false, created: "2026-05-12" },
  { id: 3, title: "Monthly Goals - May", content: "## May Goals\n\n- [ ] Solve 60 LeetCode problems\n- [ ] Apply to 10 companies\n- [ ] Complete DBMS course\n- [ ] Maintain all streaks\n- [ ] Save ₹5000", tags: ["Goals", "Personal"], pinned: true, created: "2026-05-01" },
];

const SEED_STUDY_SUBJECTS = [
  { id: 1, name: "DSA", color: COLORS.accent, progress: 68, target: 100, sessions: 45 },
  { id: 2, name: "OS", color: COLORS.blue, progress: 55, target: 100, sessions: 30 },
  { id: 3, name: "DBMS", color: COLORS.green, progress: 40, target: 100, sessions: 22 },
  { id: 4, name: "CN", color: COLORS.purple, progress: 30, target: 100, sessions: 18 },
  { id: 5, name: "Aptitude", color: COLORS.orange, progress: 72, target: 100, sessions: 35 },
];

const DSA_TOPICS = ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "DP", "Recursion", "Binary Search", "Heap", "Trie"];
const PLACEMENT_STAGES = ["Wishlist", "Applied", "OA Scheduled", "OA Completed", "Interview Scheduled", "HR Round", "Offer Received", "Rejected"];
const EXPENSE_CATEGORIES = ["Food", "Travel", "Recharge", "Shopping", "Education", "Misc"];
const TASK_PRIORITIES = ["low", "medium", "high"];
const TASK_CATEGORIES = ["Study", "DSA", "Placement", "Health", "Personal", "Other"];

// ============================================================
// SHARED UI COMPONENTS
// ============================================================
const Card = ({ children, className = "", style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      padding: 20,
      transition: "border-color 0.2s, transform 0.15s",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.transform = "translateY(-1px)"; } }}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; } }}
    className={className}
  >
    {children}
  </div>
);

const Badge = ({ children, color = COLORS.accent, dim }) => (
  <span style={{
    background: dim || `${color}20`,
    color: color,
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
  }}>{children}</span>
);

const ProgressBar = ({ value, max = 100, color = COLORS.accent, height = 6 }) => (
  <div style={{ background: COLORS.border, borderRadius: 999, height, overflow: "hidden" }}>
    <div style={{
      width: `${Math.min(100, (value / max) * 100)}%`,
      height: "100%",
      background: color,
      borderRadius: 999,
      transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
    }} />
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", icon, disabled = false, style = {} }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: COLORS.textDim, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.redDim, color: COLORS.red, border: `1px solid ${COLORS.red}30` },
    success: { background: COLORS.greenDim, color: COLORS.green, border: `1px solid ${COLORS.green}30` },
  };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "10px 20px", fontSize: 14 } };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "opacity 0.15s, transform 0.1s",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >
      {icon && <Icon d={Icons[icon]} size={14} />}
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "8px 12px",
      color: COLORS.text,
      fontSize: 13,
      outline: "none",
      width: "100%",
      fontFamily: "inherit",
      transition: "border-color 0.2s",
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = COLORS.accent}
    onBlur={e => e.target.style.borderColor = COLORS.border}
  />
);

const Select = ({ value, onChange, options, style = {} }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "8px 12px",
      color: COLORS.text,
      fontSize: 13,
      outline: "none",
      fontFamily: "inherit",
      cursor: "pointer",
      ...style,
    }}
  >
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);

const Modal = ({ open, onClose, title, children, width = 480 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.borderLight}`,
        borderRadius: 20, padding: 28, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
            <Icon d={Icons.x} size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ toasts }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "error" ? COLORS.redDim : t.type === "success" ? COLORS.greenDim : COLORS.bgActive,
        border: `1px solid ${t.type === "error" ? COLORS.red : t.type === "success" ? COLORS.green : COLORS.borderLight}30`,
        borderRadius: 12, padding: "10px 16px", color: COLORS.text, fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 8, minWidth: 240,
        animation: "slideIn 0.3s ease",
      }}>
        {t.type === "success" && <Icon d={Icons.check} size={14} color={COLORS.green} />}
        {t.type === "error" && <Icon d={Icons.x} size={14} color={COLORS.red} />}
        {t.message}
      </div>
    ))}
  </div>
);

const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ background: `${color}20`, borderRadius: 10, padding: 8, display: "flex" }}>
        <Icon d={Icons[icon]} size={16} color={color} />
      </div>
      {trend && <Badge color={COLORS.green}>{trend}</Badge>}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{subtitle}</div>}
  </Card>
);

// ============================================================
// POMODORO TIMER COMPONENT
// ============================================================
function PomodoroTimer() {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("work"); // work | short | long
  const intervalRef = useRef(null);

  const MODES = { work: 25, short: 5, long: 15 };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s === 0) {
            setMins(m => {
              if (m === 0) { setRunning(false); return MODES[mode]; }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const reset = () => { setRunning(false); setMins(MODES[mode]); setSecs(0); };
  const switchMode = (m) => { setRunning(false); setMode(m); setMins(MODES[m]); setSecs(0); };
  const total = MODES[mode] * 60;
  const elapsed = (MODES[mode] - mins - 1) * 60 + (60 - secs);
  const progress = Math.min(100, (elapsed / total) * 100);

  return (
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Pomodoro Timer</div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
        {Object.keys(MODES).map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{
            background: mode === m ? COLORS.accentDim : "transparent",
            color: mode === m ? COLORS.accent : COLORS.textMuted,
            border: `1px solid ${mode === m ? COLORS.accent : COLORS.border}`,
            borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{m === "work" ? "Work" : m === "short" ? "Short" : "Long"}</button>
        ))}
      </div>
      <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 20px" }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="58" fill="none" stroke={COLORS.border} strokeWidth="8" />
          <circle cx="70" cy="70" r="58" fill="none" stroke={COLORS.accent} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 58}`}
            strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
            strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase" }}>{mode}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Button onClick={() => setRunning(r => !r)} icon={running ? "x" : "zap"}>{running ? "Pause" : "Start"}</Button>
        <Button onClick={reset} variant="ghost" icon="repeat">Reset</Button>
      </div>
    </Card>
  );
}

// ============================================================
// MINI BAR CHART
// ============================================================
function MiniBarChart({ data, height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", background: d.color || COLORS.accent,
            height: `${(d.value / max) * (height - 20)}px`,
            borderRadius: "4px 4px 0 0", minHeight: 2,
            opacity: 0.8, transition: "height 0.5s ease",
          }} />
          <div style={{ fontSize: 9, color: COLORS.textMuted }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MINI PIE CHART (SVG)
// ============================================================
function MiniPieChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size}>
      {data.map((d, i) => {
        const angle = (d.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(cumAngle);
        const y1 = cy + r * Math.sin(cumAngle);
        cumAngle += angle;
        const x2 = cx + r * Math.cos(cumAngle);
        const y2 = cy + r * Math.sin(cumAngle);
        const large = angle > Math.PI ? 1 : 0;
        return (
          <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
            fill={d.color} opacity={0.9} />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={COLORS.bgCard} />
    </svg>
  );
}

// ============================================================
// HEATMAP CALENDAR
// ============================================================
function HeatmapCalendar({ logs, color }) {
  const weeks = [];
  const now = new Date();
  for (let w = 12; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split("T")[0];
      week.push({ key, done: !!logs[key] });
    }
    weeks.push(week);
  }
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {week.map((day, di) => (
            <div key={di} style={{
              width: 10, height: 10, borderRadius: 2,
              background: day.done ? color : COLORS.border,
              opacity: day.done ? 0.85 : 0.4,
            }} title={day.key} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MODULES
// ============================================================

// DASHBOARD
function Dashboard({ tasks, habits, dsaProblems, placements, expenses, notes }) {
  const todayTasks = tasks.filter(t => t.due === today() && !t.done);
  const topStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;
  const solvedDSA = dsaProblems.filter(p => p.solved).length;
  const activeApps = placements.filter(p => !["Rejected", "Offer Received"].includes(p.stage)).length;
  const monthExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const pinnedNotes = notes.filter(n => n.pinned);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.text }}>Good morning! 👋</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{todayLabel()}</div>
      </div>

      {/* Stat Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard title="Tasks Today" value={todayTasks.length} icon="tasks" color={COLORS.accent} subtitle="Pending" />
        <StatCard title="Top Streak" value={`${topStreak}d`} icon="fire" color={COLORS.orange} subtitle="Active habits" />
        <StatCard title="DSA Solved" value={solvedDSA} icon="code" color={COLORS.green} subtitle={`of ${dsaProblems.length} problems`} />
        <StatCard title="Applications" value={activeApps} icon="briefcase" color={COLORS.blue} subtitle="Active pipelines" />
        <StatCard title="May Expenses" value={formatCurrency(monthExpenses)} icon="expense" color={COLORS.purple} subtitle="This month" />
        <StatCard title="Notes" value={notes.length} icon="notes" color={COLORS.yellow} subtitle={`${pinnedNotes.length} pinned`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Today's Tasks */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.tasks} size={14} color={COLORS.accent} />
            Today's Tasks
          </div>
          {todayTasks.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>🎉 All done for today!</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todayTasks.slice(0, 4).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: t.priority === "high" ? COLORS.red : t.priority === "medium" ? COLORS.orange : COLORS.green,
                    flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 13, color: COLORS.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                  <Badge color={COLORS.accent}>{t.category}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Habit Check */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.fire} size={14} color={COLORS.orange} />
            Habit Streaks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {habits.slice(0, 4).map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: COLORS.text }}>{h.name}</div>
                  <ProgressBar value={h.streak} max={30} color={h.color} height={4} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: h.color }}>{h.streak}d</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Placement Pipeline */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.placement} size={14} color={COLORS.blue} />
            Placement Pipeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {placements.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{p.company}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.role}</div>
                </div>
                <Badge color={
                  p.stage === "Offer Received" ? COLORS.green :
                  p.stage === "Rejected" ? COLORS.red :
                  p.stage.includes("Interview") ? COLORS.orange : COLORS.blue
                }>{p.stage}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Notes */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.notes} size={14} color={COLORS.yellow} />
            Pinned Notes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pinnedNotes.slice(0, 3).map(n => (
              <div key={n.id} style={{ background: COLORS.bg, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{n.title}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{n.content.slice(0, 60)}...</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// TASK MANAGER
function TaskManager() {
  const [tasks, setTasks] = useLocalStorage("tasks", SEED_TASKS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", priority: "medium", category: "Study", due: today(), recurring: false });

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    if (filter === "today") return matchSearch && t.due === today();
    if (filter === "pending") return matchSearch && !t.done;
    if (filter === "done") return matchSearch && t.done;
    return matchSearch && t.priority === filter;
  });

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setTasks(ts => ts.map(t => t.id === editing ? { ...t, ...form } : t));
    } else {
      setTasks(ts => [...ts, { ...form, id: Date.now(), done: false }]);
    }
    setModal(false); setEditing(null); setForm({ title: "", priority: "medium", category: "Study", due: today(), recurring: false });
  };

  const openEdit = (t) => {
    setEditing(t.id); setForm({ title: t.title, priority: t.priority, category: t.category, due: t.due, recurring: t.recurring });
    setModal(true);
  };

  const priorityColor = { high: COLORS.red, medium: COLORS.orange, low: COLORS.green };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Task Manager</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{tasks.filter(t => !t.done).length} pending tasks</div>
        </div>
        <Button icon="plus" onClick={() => { setEditing(null); setForm({ title: "", priority: "medium", category: "Study", due: today(), recurring: false }); setModal(true); }}>Add Task</Button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <Icon d={Icons.search} size={14} color={COLORS.textMuted} />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10,
            padding: "8px 12px 8px 32px", color: COLORS.text, fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit",
          }} />
        </div>
        <Select value={filter} onChange={setFilter} options={[
          { value: "all", label: "All Tasks" }, { value: "today", label: "Today" },
          { value: "pending", label: "Pending" }, { value: "done", label: "Done" },
          { value: "high", label: "High Priority" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
        ]} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.textMuted }}>
            <Icon d={Icons.tasks} size={32} color={COLORS.textMuted} />
            <div style={{ marginTop: 8 }}>No tasks found</div>
          </div>
        )}
        {filtered.map(t => (
          <Card key={t.id} style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                style={{
                  width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.done ? COLORS.accent : COLORS.border}`,
                  background: t.done ? COLORS.accent : "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                {t.done && <Icon d={Icons.check} size={10} color="#fff" />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: t.done ? COLORS.textMuted : COLORS.text, fontWeight: 500, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  <Badge color={priorityColor[t.priority]}>{t.priority}</Badge>
                  <Badge color={COLORS.blue}>{t.category}</Badge>
                  {t.recurring && <Badge color={COLORS.purple}>↻ Recurring</Badge>}
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>Due {formatDate(t.due)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openEdit(t)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.edit} size={14} />
                </button>
                <button onClick={() => setTasks(ts => ts.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.red, padding: 4 }}>
                  <Icon d={Icons.trash} size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Edit Task" : "Add New Task"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Task Title</label>
            <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="What needs to be done?" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Priority</label>
              <Select value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={TASK_PRIORITIES} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Category</label>
              <Select value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={TASK_CATEGORIES} style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Due Date</label>
            <Input type="date" value={form.due} onChange={v => setForm(f => ({ ...f, due: v }))} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))} id="recurring" style={{ accentColor: COLORS.accent }} />
            <label htmlFor="recurring" style={{ fontSize: 13, color: COLORS.text, cursor: "pointer" }}>Recurring task</label>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setModal(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Task"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// HABIT TRACKER
function HabitTracker() {
  const [habits, setHabits] = useLocalStorage("habits", SEED_HABITS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "💪", color: COLORS.accent });
  const todayKey = today();

  const checkIn = (id) => {
    setHabits(hs => hs.map(h => {
      if (h.id !== id) return h;
      const already = h.logs[todayKey];
      return {
        ...h,
        logs: { ...h.logs, [todayKey]: !already },
        streak: !already ? h.streak + 1 : Math.max(0, h.streak - 1),
      };
    }));
  };

  const addHabit = () => {
    if (!form.name.trim()) return;
    setHabits(hs => [...hs, { id: Date.now(), ...form, streak: 0, logs: {} }]);
    setModal(false); setForm({ name: "", icon: "💪", color: COLORS.accent });
  };

  const ICONS = ["💪", "☀️", "💧", "🧘", "📵", "💻", "📚", "🏃", "🥗", "😴"];
  const COLS = [COLORS.accent, COLORS.green, COLORS.orange, COLORS.blue, COLORS.purple, COLORS.yellow, COLORS.red];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Habit Tracker</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{habits.filter(h => h.logs[todayKey]).length}/{habits.length} completed today</div>
        </div>
        <Button icon="plus" onClick={() => setModal(true)}>Add Habit</Button>
      </div>

      {/* Today's check-in */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {habits.map(h => {
          const done = !!h.logs[todayKey];
          return (
            <Card key={h.id} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600 }}>{h.name}</div>
                  <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                    {weekDates.map((d, i) => (
                      <div key={i} style={{
                        width: 20, height: 20, borderRadius: 4,
                        background: h.logs[d] ? h.color : COLORS.border,
                        opacity: h.logs[d] ? 0.9 : 0.4,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 8, color: h.logs[d] ? "#fff" : COLORS.textMuted }}>{weekDays[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginRight: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: h.color }}>{h.streak}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>streak</div>
                </div>
                <button onClick={() => checkIn(h.id)} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: done ? h.color : "transparent",
                  border: `2px solid ${done ? h.color : COLORS.border}`,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {done ? <Icon d={Icons.check} size={16} color="#fff" /> : <Icon d={Icons.plus} size={16} color={COLORS.textMuted} />}
                </button>
                <button onClick={() => setHabits(hs => hs.filter(x => x.id !== h.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.trash} size={13} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Heatmaps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {habits.map(h => (
          <Card key={h.id} style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>{h.icon} {h.name}</div>
            <HeatmapCalendar logs={h.logs} color={h.color} />
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Habit">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Habit Name</label>
            <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Drink 8 glasses of water" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 8 }}>Icon</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} style={{
                  fontSize: 20, width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                  background: form.icon === ic ? COLORS.accentDim : "transparent",
                  border: `1px solid ${form.icon === ic ? COLORS.accent : COLORS.border}`,
                }}>{ic}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 8 }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: "none",
                  outline: form.color === c ? `2px solid ${COLORS.text}` : "none", outlineOffset: 2,
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={addHabit}>Add Habit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// STUDY PLANNER
function StudyPlanner() {
  const [subjects, setSubjects] = useLocalStorage("subjects", SEED_STUDY_SUBJECTS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", color: COLORS.accent, target: 100 });
  const examDate = new Date("2026-11-15");
  const daysLeft = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));

  const save = () => {
    if (!form.name.trim()) return;
    setSubjects(ss => [...ss, { id: Date.now(), ...form, progress: 0, sessions: 0 }]);
    setModal(false); setForm({ name: "", color: COLORS.accent, target: 100 });
  };

  const COLORS_OPTS = [COLORS.accent, COLORS.green, COLORS.orange, COLORS.blue, COLORS.purple, COLORS.yellow, COLORS.red];

  const weekData = [
    { label: "Mon", value: 2.5, color: COLORS.accent },
    { label: "Tue", value: 3, color: COLORS.accent },
    { label: "Wed", value: 1.5, color: COLORS.accent },
    { label: "Thu", value: 4, color: COLORS.accent },
    { label: "Fri", value: 2, color: COLORS.accent },
    { label: "Sat", value: 5, color: COLORS.accent },
    { label: "Sun", value: 1, color: COLORS.accent },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Study Planner</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Placement season: {daysLeft} days left</div>
        </div>
        <Button icon="plus" onClick={() => setModal(true)}>Add Subject</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.calendar} size={14} color={COLORS.accent} />
            Exam Countdown
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.accent, lineHeight: 1 }}>{daysLeft}</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>days until placement season</div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar value={100 - Math.min(100, (daysLeft / 365) * 100)} color={COLORS.orange} />
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>Preparation progress</div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textDim, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.chart} size={14} color={COLORS.green} />
            This Week (hours)
          </div>
          <MiniBarChart data={weekData} height={100} />
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {subjects.map(s => (
          <Card key={s.id} style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 6, height: 40, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{s.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>{s.sessions} sessions</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.progress}%</span>
                  </div>
                </div>
                <ProgressBar value={s.progress} max={s.target} color={s.color} height={6} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setSubjects(ss => ss.map(x => x.id === s.id ? { ...x, progress: Math.min(100, x.progress + 5), sessions: x.sessions + 1 } : x))}
                  style={{ background: COLORS.accentDim, border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: COLORS.accent, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
                  +5%
                </button>
                <button onClick={() => setSubjects(ss => ss.filter(x => x.id !== s.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.trash} size={13} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PomodoroTimer />

      <Modal open={modal} onClose={() => setModal(false)} title="Add Subject">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Subject Name</label>
            <Input value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. DBMS, OS, Aptitude" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 8 }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS_OPTS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: "none",
                  outline: form.color === c ? `2px solid ${COLORS.text}` : "none", outlineOffset: 2,
                }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save}>Add Subject</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// DSA TRACKER
function DSATracker() {
  const [problems, setProblems] = useLocalStorage("dsa", SEED_DSA);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [form, setForm] = useState({ title: "", topic: "Arrays", difficulty: "Easy", link: "", notes: "" });

  const DIFFS = ["Easy", "Medium", "Hard"];
  const diffColor = { Easy: COLORS.green, Medium: COLORS.orange, Hard: COLORS.red };

  const filtered = problems.filter(p => {
    const matchFilter = filter === "all" ? true : filter === "solved" ? p.solved : !p.solved;
    const matchTopic = topicFilter === "all" ? true : p.topic === topicFilter;
    return matchFilter && matchTopic;
  });

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setProblems(ps => ps.map(p => p.id === editing ? { ...p, ...form } : p));
    } else {
      setProblems(ps => [...ps, { ...form, id: Date.now(), solved: false, revised: false }]);
    }
    setModal(false); setEditing(null); setForm({ title: "", topic: "Arrays", difficulty: "Easy", link: "", notes: "" });
  };

  const topicStats = DSA_TOPICS.map(t => ({
    topic: t,
    total: problems.filter(p => p.topic === t).length,
    solved: problems.filter(p => p.topic === t && p.solved).length,
  }));

  const solvedCount = problems.filter(p => p.solved).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>DSA Tracker</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{solvedCount}/{problems.length} problems solved</div>
        </div>
        <Button icon="plus" onClick={() => { setEditing(null); setForm({ title: "", topic: "Arrays", difficulty: "Easy", link: "", notes: "" }); setModal(true); }}>Add Problem</Button>
      </div>

      {/* Topic stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {topicStats.filter(t => t.total > 0).map(t => (
          <Card key={t.topic} style={{ padding: 12, cursor: "pointer" }} onClick={() => setTopicFilter(topicFilter === t.topic ? "all" : t.topic)}>
            <div style={{ fontSize: 12, fontWeight: 600, color: topicFilter === t.topic ? COLORS.accent : COLORS.text, marginBottom: 6 }}>{t.topic}</div>
            <ProgressBar value={t.solved} max={Math.max(t.total, 1)} color={COLORS.accent} height={4} />
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{t.solved}/{t.total} solved</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {["all", "solved", "unsolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? COLORS.accentDim : "transparent",
            color: filter === f ? COLORS.accent : COLORS.textMuted,
            border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`,
            borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            textTransform: "capitalize",
          }}>{f}</button>
        ))}
        {topicFilter !== "all" && (
          <button onClick={() => setTopicFilter("all")} style={{
            background: COLORS.blueDim, color: COLORS.blue, border: `1px solid ${COLORS.blue}40`,
            borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Topic: {topicFilter} ✕</button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setProblems(ps => ps.map(x => x.id === p.id ? { ...x, solved: !x.solved } : x))} style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${p.solved ? COLORS.green : COLORS.border}`,
                background: p.solved ? COLORS.green : "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {p.solved && <Icon d={Icons.check} size={11} color="#fff" />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: p.solved ? COLORS.textMuted : COLORS.text, textDecoration: p.solved ? "line-through" : "none" }}>{p.title}</span>
                  <Badge color={diffColor[p.difficulty]}>{p.difficulty}</Badge>
                  <Badge color={COLORS.blue}>{p.topic}</Badge>
                  {p.revised && <Badge color={COLORS.purple}>Revised ✓</Badge>}
                </div>
                {p.notes && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{p.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, padding: 4 }}>
                    <Icon d={Icons.link} size={13} color={COLORS.accent} />
                  </a>
                )}
                <button onClick={() => setProblems(ps => ps.map(x => x.id === p.id ? { ...x, revised: !x.revised } : x))} style={{ background: "none", border: "none", cursor: "pointer", color: p.revised ? COLORS.purple : COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.repeat} size={13} />
                </button>
                <button onClick={() => {
                  setEditing(p.id); setForm({ title: p.title, topic: p.topic, difficulty: p.difficulty, link: p.link, notes: p.notes }); setModal(true);
                }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.edit} size={13} />
                </button>
                <button onClick={() => setProblems(ps => ps.filter(x => x.id !== p.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.red, padding: 4 }}>
                  <Icon d={Icons.trash} size={13} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Edit Problem" : "Add DSA Problem"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Problem Title</label>
            <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Two Sum" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Topic</label>
              <Select value={form.topic} onChange={v => setForm(f => ({ ...f, topic: v }))} options={DSA_TOPICS} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Difficulty</label>
              <Select value={form.difficulty} onChange={v => setForm(f => ({ ...f, difficulty: v }))} options={DIFFS} style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>LeetCode Link</label>
            <Input value={form.link} onChange={v => setForm(f => ({ ...f, link: v }))} placeholder="https://leetcode.com/problems/..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Notes</label>
            <Input value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Key insight or approach..." />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => { setModal(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Add Problem"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// PLACEMENT TRACKER (Kanban)
function PlacementTracker() {
  const [apps, setApps] = useLocalStorage("placements", SEED_PLACEMENTS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ company: "", role: "", salary: "", applied: today(), deadline: "", stage: "Wishlist", notes: "" });
  const [drag, setDrag] = useState(null);

  const save = () => {
    if (!form.company.trim()) return;
    if (editing) {
      setApps(as => as.map(a => a.id === editing ? { ...a, ...form } : a));
    } else {
      setApps(as => [...as, { ...form, id: Date.now() }]);
    }
    setModal(false); setEditing(null);
    setForm({ company: "", role: "", salary: "", applied: today(), deadline: "", stage: "Wishlist", notes: "" });
  };

  const stageColor = {
    Wishlist: COLORS.textMuted, Applied: COLORS.blue, "OA Scheduled": COLORS.orange,
    "OA Completed": COLORS.yellow, "Interview Scheduled": COLORS.purple,
    "HR Round": COLORS.accent, "Offer Received": COLORS.green, Rejected: COLORS.red,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Placement Tracker</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{apps.filter(a => a.stage === "Offer Received").length} offers • {apps.length} total applications</div>
        </div>
        <Button icon="plus" onClick={() => { setEditing(null); setForm({ company: "", role: "", salary: "", applied: today(), deadline: "", stage: "Wishlist", notes: "" }); setModal(true); }}>Add Application</Button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        <StatCard title="Applied" value={apps.filter(a => a.stage === "Applied").length} icon="briefcase" color={COLORS.blue} />
        <StatCard title="OA Stage" value={apps.filter(a => a.stage.includes("OA")).length} icon="code" color={COLORS.orange} />
        <StatCard title="Interviews" value={apps.filter(a => a.stage.includes("Interview") || a.stage === "HR Round").length} icon="user" color={COLORS.purple} />
        <StatCard title="Offers" value={apps.filter(a => a.stage === "Offer Received").length} icon="award" color={COLORS.green} />
      </div>

      {/* Kanban */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 10, minWidth: 900 }}>
          {PLACEMENT_STAGES.map(stage => {
            const stageApps = apps.filter(a => a.stage === stage);
            const color = stageColor[stage];
            return (
              <div key={stage} style={{ minWidth: 200, flex: 1 }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  if (drag !== null) {
                    setApps(as => as.map(a => a.id === drag ? { ...a, stage } : a));
                    setDrag(null);
                  }
                }}>
                <div style={{
                  padding: "8px 10px", borderRadius: "10px 10px 0 0",
                  background: `${color}20`, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stage}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>{stageApps.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 200 }}>
                  {stageApps.map(a => (
                    <div key={a.id} draggable
                      onDragStart={() => setDrag(a.id)}
                      style={{
                        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10,
                        cursor: "grab", transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{a.company}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{a.role}</div>
                      {a.salary && <div style={{ fontSize: 11, color: COLORS.green, marginTop: 4 }}>{a.salary}</div>}
                      {a.deadline && <div style={{ fontSize: 10, color: COLORS.orange, marginTop: 4 }}>📅 {formatDate(a.deadline)}</div>}
                      <div style={{ display: "flex", gap: 4, marginTop: 8, justifyContent: "flex-end" }}>
                        <button onClick={() => { setEditing(a.id); setForm({ company: a.company, role: a.role, salary: a.salary, applied: a.applied, deadline: a.deadline, stage: a.stage, notes: a.notes }); setModal(true); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 2 }}>
                          <Icon d={Icons.edit} size={12} />
                        </button>
                        <button onClick={() => setApps(as => as.filter(x => x.id !== a.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.red, padding: 2 }}>
                          <Icon d={Icons.trash} size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div style={{ border: `1px dashed ${color}30`, borderRadius: 10, padding: 14, textAlign: "center", color: COLORS.textMuted, fontSize: 11 }}>Drop here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? "Edit Application" : "Add Application"} width={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Company</label>
              <Input value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} placeholder="Google" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Role</label>
              <Input value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} placeholder="SWE Intern" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Salary/Stipend</label>
              <Input value={form.salary} onChange={v => setForm(f => ({ ...f, salary: v }))} placeholder="₹80,000/mo" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Stage</label>
              <Select value={form.stage} onChange={v => setForm(f => ({ ...f, stage: v }))} options={PLACEMENT_STAGES} style={{ width: "100%" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Applied Date</label>
              <Input type="date" value={form.applied} onChange={v => setForm(f => ({ ...f, applied: v }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Deadline</label>
              <Input type="date" value={form.deadline} onChange={v => setForm(f => ({ ...f, deadline: v }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Notes</label>
            <Input value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Any notes..." />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => { setModal(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// EXPENSE TRACKER
function ExpenseTracker() {
  const [expenses, setExpenses] = useLocalStorage("expenses", SEED_EXPENSES);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: today() });
  const [budget] = useState(15000);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const catData = EXPENSE_CATEGORIES.map(c => ({
    label: c,
    value: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0),
    color: [COLORS.orange, COLORS.blue, COLORS.purple, COLORS.red, COLORS.green, COLORS.yellow][EXPENSE_CATEGORIES.indexOf(c)],
  })).filter(d => d.value > 0);

  const save = () => {
    if (!form.title.trim() || !form.amount) return;
    setExpenses(es => [...es, { ...form, amount: parseFloat(form.amount), id: Date.now() }]);
    setModal(false); setForm({ title: "", amount: "", category: "Food", date: today() });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>Expense Tracker</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>May 2026 • Budget: {formatCurrency(budget)}</div>
        </div>
        <Button icon="plus" onClick={() => setModal(true)}>Add Expense</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <StatCard title="Total Spent" value={formatCurrency(total)} icon="expense" color={COLORS.red} />
        <StatCard title="Budget Left" value={formatCurrency(Math.max(0, budget - total))} icon="target" color={COLORS.green} />
        <StatCard title="Transactions" value={expenses.length} icon="chart" color={COLORS.blue} />
      </div>

      {/* Budget bar */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Monthly Budget</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: total > budget ? COLORS.red : COLORS.green }}>
            {formatCurrency(total)} / {formatCurrency(budget)}
          </span>
        </div>
        <ProgressBar value={total} max={budget} color={total > budget ? COLORS.red : COLORS.accent} height={8} />
        {total > budget && (
          <div style={{ fontSize: 12, color: COLORS.red, marginTop: 6 }}>⚠️ Over budget by {formatCurrency(total - budget)}</div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, marginBottom: 20 }}>
        {/* Pie chart */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16, width: 200 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textDim, marginBottom: 10 }}>By Category</div>
          <MiniPieChart data={catData} size={130} />
          <div style={{ marginTop: 10, width: "100%" }}>
            {catData.map(d => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text }}>{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Expenses list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => {
            const catIdx = EXPENSE_CATEGORIES.indexOf(e.category);
            const catColor = [COLORS.orange, COLORS.blue, COLORS.purple, COLORS.red, COLORS.green, COLORS.yellow][catIdx] || COLORS.textMuted;
            return (
              <div key={e.id} style={{
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${catColor}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={Icons.expense} size={14} color={catColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{e.category} • {formatDate(e.date)}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{formatCurrency(e.amount)}</div>
                <button onClick={() => setExpenses(es => es.filter(x => x.id !== e.id))} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 4 }}>
                  <Icon d={Icons.trash} size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Expense">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Description</label>
            <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Mess food" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Amount (₹)</label>
              <Input type="number" value={form.amount} onChange={v => setForm(f => ({ ...f, amount: v }))} placeholder="0" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Category</label>
              <Select value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={EXPENSE_CATEGORIES} style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Date</label>
            <Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save}>Add Expense</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// NOTES VAULT
function NotesVault() {
  const [notes, setNotes] = useLocalStorage("notes", SEED_NOTES);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "", pinned: false });

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );
  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);
  const orderedNotes = [...pinned, ...unpinned];

  const save = () => {
    if (!form.title.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editing && selected) {
      setNotes(ns => ns.map(n => n.id === selected.id ? { ...n, title: form.title, content: form.content, tags, pinned: form.pinned } : n));
      setSelected(s => s ? { ...s, title: form.title, content: form.content, tags, pinned: form.pinned } : s);
    } else {
      const newNote = { id: Date.now(), title: form.title, content: form.content, tags, pinned: form.pinned, created: today() };
      setNotes(ns => [...ns, newNote]);
      setSelected(newNote);
    }
    setModal(false); setEditing(false);
    setForm({ title: "", content: "", tags: "", pinned: false });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14, height: "calc(100vh - 140px)", minHeight: 500 }}>
      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}>
              <Icon d={Icons.search} size={12} color={COLORS.textMuted} />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8,
              padding: "6px 8px 6px 26px", color: COLORS.text, fontSize: 12, outline: "none", width: "100%", fontFamily: "inherit",
            }} />
          </div>
          <button onClick={() => { setEditing(false); setForm({ title: "", content: "", tags: "", pinned: false }); setModal(true); }} style={{
            background: COLORS.accent, border: "none", borderRadius: 8, width: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon d={Icons.plus} size={14} color="#fff" />
          </button>
        </div>

        {orderedNotes.map(n => (
          <div key={n.id} onClick={() => setSelected(n)} style={{
            background: selected?.id === n.id ? COLORS.bgActive : COLORS.bgCard,
            border: `1px solid ${selected?.id === n.id ? COLORS.accent : COLORS.border}`,
            borderRadius: 10, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {n.pinned && <Icon d={Icons.pin} size={10} color={COLORS.yellow} />}
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {n.content.replace(/[#*\-\[\]]/g, "").slice(0, 50)}
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {n.tags.map(t => <Badge key={t} color={COLORS.blue}>{t}</Badge>)}
            </div>
          </div>
        ))}
      </div>

      {/* Content area */}
      <Card style={{ overflowY: "auto" }}>
        {selected ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>{selected.title}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {selected.pinned ? "📌 Pinned • " : ""}{formatDate(selected.created)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button size="sm" variant="ghost" icon="pin" onClick={() => {
                  setNotes(ns => ns.map(n => n.id === selected.id ? { ...n, pinned: !n.pinned } : n));
                  setSelected(s => s ? { ...s, pinned: !s.pinned } : s);
                }}>{selected.pinned ? "Unpin" : "Pin"}</Button>
                <Button size="sm" variant="ghost" icon="edit" onClick={() => {
                  setForm({ title: selected.title, content: selected.content, tags: selected.tags.join(", "), pinned: selected.pinned });
                  setEditing(true); setModal(true);
                }}>Edit</Button>
                <Button size="sm" variant="danger" icon="trash" onClick={() => {
                  setNotes(ns => ns.filter(n => n.id !== selected.id));
                  setSelected(null);
                }}>Delete</Button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {selected.tags.map(t => <Badge key={t} color={COLORS.blue}>{t}</Badge>)}
            </div>
            <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {selected.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <div key={i} style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginTop: 16, marginBottom: 4 }}>{line.slice(3)}</div>;
                if (line.startsWith("# ")) return <div key={i} style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>{line.slice(2)}</div>;
                if (line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 16, color: COLORS.textDim }}>• {line.slice(2)}</div>;
                if (line.startsWith("> ")) return <div key={i} style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: 12, color: COLORS.textMuted, fontStyle: "italic", margin: "8px 0" }}>{line.slice(2)}</div>;
                if (line.startsWith("- [ ] ")) return <div key={i} style={{ paddingLeft: 16, color: COLORS.textDim }}>☐ {line.slice(6)}</div>;
                if (line.startsWith("- [x] ")) return <div key={i} style={{ paddingLeft: 16, color: COLORS.green }}>☑ {line.slice(6)}</div>;
                const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong style="color:${COLORS.text}">${m}</strong>`);
                return <div key={i} dangerouslySetInnerHTML={{ __html: bold || "&nbsp;" }} />;
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.textMuted }}>
            <Icon d={Icons.notes} size={40} color={COLORS.textMuted} />
            <div style={{ marginTop: 12, fontSize: 14 }}>Select a note or create one</div>
          </div>
        )}
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); setEditing(false); }} title={editing ? "Edit Note" : "New Note"} width={600}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Title</label>
            <Input value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Note title" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Content (Markdown supported)</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write your note here... Supports # headings, **bold**, - lists, > quotes"
              style={{
                background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px",
                color: COLORS.text, fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit",
                resize: "vertical", minHeight: 200, lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Tags (comma-separated)</label>
            <Input value={form.tags} onChange={v => setForm(f => ({ ...f, tags: v }))} placeholder="Study, OS, Important" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} id="pinNote" style={{ accentColor: COLORS.accent }} />
            <label htmlFor="pinNote" style={{ fontSize: 13, color: COLORS.text, cursor: "pointer" }}>Pin this note</label>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => { setModal(false); setEditing(false); }}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Create Note"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// AI MENTOR CHAT
function AIMentor() {
  const [messages, setMessages] = useLocalStorage("chatHistory", [
    { id: 1, role: "assistant", content: "Hey! I'm your AI Mentor 🎓 I can help you with:\n\n• **CS subjects** (OS, DBMS, CN, DSA)\n• **Mock interviews** — Tell me: *\"Start mock interview\"*\n• **Resume feedback**\n• **Study plan generation**\n• **DSA hints** and problem walkthroughs\n• **HR interview practice**\n• **Productivity coaching**\n\nWhat would you like to work on today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("general");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const QUICK_PROMPTS = [
    "Explain process scheduling in OS simply",
    "Start a mock interview for SWE",
    "Give me a DSA hint for DP problems",
    "Review my resume for placements",
    "Create a 30-day study plan",
    "Practice HR interview questions",
  ];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", content: msg };
    setMessages(ms => [...ms, userMsg]);
    setLoading(true);

    const systemPrompt = `You are LifeOS AI Mentor — a brilliant, friendly mentor for Indian college students preparing for tech placements. You:
- Explain CS concepts (OS, DBMS, CN, DSA, System Design) in a clear, engaging way with examples
- Conduct mock technical interviews with realistic questions and detailed feedback
- Give DSA hints and explain algorithmic approaches step-by-step
- Provide study plans and productivity advice
- Practice HR/behavioral questions using STAR framework
- Give resume feedback for tech roles
- Keep responses concise but thorough
- Use emojis and formatting to make content engaging
- Reference Indian placement context (TCS, Infosys, Wipro, Google, Amazon, etc.)
Current mode: ${mode}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
      setMessages(ms => [...ms, { id: Date.now(), role: "assistant", content: reply }]);
    } catch {
      setMessages(ms => [...ms, { id: Date.now(), role: "assistant", content: "⚠️ Connection error. Make sure your API key is configured. In the full Next.js app, this connects to OpenAI/Anthropic via your backend API routes." }]);
    }
    setLoading(false);
  };

  const renderContent = (content) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <div key={i} style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginTop: 12 }}>{line.slice(3)}</div>;
      if (line.startsWith("# ")) return <div key={i} style={{ fontSize: 17, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>{line.slice(2)}</div>;
      if (line.startsWith("• ") || line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 12, color: COLORS.textDim, lineHeight: 1.7 }}>• {line.slice(2)}</div>;
      const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong style="color:${COLORS.accentLight}">${m}</strong>`);
      const italic = bold.replace(/\*(.*?)\*/g, (_, m) => `<em style="color:${COLORS.textDim}">${m}</em>`);
      return <div key={i} dangerouslySetInnerHTML={{ __html: italic || "&nbsp;" }} style={{ lineHeight: 1.7 }} />;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", minHeight: 500 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>AI Mentor</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Your personal placement coach</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["general", "interview", "dsa", "hr"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              background: mode === m ? COLORS.accentDim : "transparent",
              color: mode === m ? COLORS.accent : COLORS.textMuted,
              border: `1px solid ${mode === m ? COLORS.accent : COLORS.border}`,
              borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              textTransform: "capitalize",
            }}>{m}</button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setMessages([{ id: Date.now(), role: "assistant", content: "Chat cleared! How can I help?" }])}>Clear</Button>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8,
            padding: "5px 10px", fontSize: 11, color: COLORS.textDim, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textDim; }}
          >{p}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                <Icon d={Icons.ai} size={14} color={COLORS.accent} />
              </div>
            )}
            <div style={{
              maxWidth: "75%", background: m.role === "user" ? COLORS.accent : COLORS.bgCard,
              border: `1px solid ${m.role === "user" ? "transparent" : COLORS.border}`,
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              padding: "10px 14px", fontSize: 13, color: m.role === "user" ? "#fff" : COLORS.text, lineHeight: 1.6,
            }}>
              {m.role === "assistant" ? renderContent(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
              <Icon d={Icons.ai} size={14} color={COLORS.accent} />
            </div>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "14px 14px 14px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: COLORS.accent,
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything about CS, placements, DSA... (Enter to send)"
          style={{
            flex: 1, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12,
            padding: "10px 14px", color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.accent}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
        <Button onClick={() => send()} icon="send" disabled={loading || !input.trim()}>Send</Button>
      </div>
    </div>
  );
}

// SETTINGS
function Settings() {
  const [profile, setProfile] = useLocalStorage("profile", {
    name: "Suman singh", college: "TMSL", year: "4th Year", branch: "Computer Science",
    targetCompanies: "Google, Microsoft, Amazon", budget: 15000,
  });

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Your name" },
    { key: "college", label: "College", placeholder: "College name" },
    { key: "year", label: "Year", placeholder: "e.g. 3rd Year" },
    { key: "branch", label: "Branch", placeholder: "e.g. Computer Science" },
    { key: "targetCompanies", label: "Target Companies", placeholder: "Google, Amazon, ..." },
  ];

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 24 }}>Settings</div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Profile</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>{f.label}</label>
              <Input value={profile[f.key]} onChange={v => setProfile(p => ({ ...p, [f.key]: v }))} placeholder={f.placeholder} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Monthly Budget (₹)</label>
            <Input type="number" value={profile.budget} onChange={v => setProfile(p => ({ ...p, budget: parseInt(v) || 0 }))} placeholder="15000" />
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>App Info</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Version", value: "1.0.0" },
            { label: "Tech Stack", value: "React + TypeScript + Tailwind" },
            { label: "Full Stack", value: "Next.js 14 + Prisma + PostgreSQL" },
            { label: "Auth", value: "NextAuth.js" },
            { label: "AI", value: "Anthropic Claude API" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{item.label}</span>
              <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Data</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" onClick={() => {
            const data = {};
            ["tasks", "habits", "subjects", "dsa", "placements", "expenses", "notes"].forEach(k => {
              try { data[k] = JSON.parse(localStorage.getItem(k) || "[]"); } catch {}
            });
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "lifeos-backup.json"; a.click();
          }}>Export Data</Button>
          <Button variant="danger" onClick={() => {
            if (confirm("Reset all data? This cannot be undone.")) {
              ["tasks", "habits", "subjects", "dsa", "placements", "expenses", "notes", "chatHistory"].forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }
          }}>Reset All Data</Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function LifeOS() {
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks] = useLocalStorage("tasks", SEED_TASKS);
  const [habits] = useLocalStorage("habits", SEED_HABITS);
  const [dsaProblems] = useLocalStorage("dsa", SEED_DSA);
  const [placements] = useLocalStorage("placements", SEED_PLACEMENTS);
  const [expenses] = useLocalStorage("expenses", SEED_EXPENSES);
  const [notes] = useLocalStorage("notes", SEED_NOTES);
  const [profile] = useLocalStorage("profile", { name: "Suman singh", college: "TMSL" });
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, message, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3500);
  };

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "tasks", label: "Tasks", icon: "tasks" },
    { id: "habits", label: "Habits", icon: "fire" },
    { id: "study", label: "Study", icon: "book" },
    { id: "dsa", label: "DSA", icon: "code" },
    { id: "placement", label: "Placement", icon: "briefcase" },
    { id: "expense", label: "Expenses", icon: "expense" },
    { id: "notes", label: "Notes", icon: "notes" },
    { id: "ai", label: "AI Mentor", icon: "ai" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const navBadges = {
    tasks: tasks.filter(t => !t.done && t.due === today()).length || null,
    placement: placements.filter(p => p.stage === "OA Scheduled" || p.stage === "Interview Scheduled").length || null,
  };

  const pages = {
    dashboard: <Dashboard tasks={tasks} habits={habits} dsaProblems={dsaProblems} placements={placements} expenses={expenses} notes={notes} />,
    tasks: <TaskManager />,
    habits: <HabitTracker />,
    study: <StudyPlanner />,
    dsa: <DSATracker />,
    placement: <PlacementTracker />,
    expense: <ExpenseTracker />,
    notes: <NotesVault />,
    ai: <AIMentor />,
    settings: <Settings />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderLight}; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
        select option { background: ${COLORS.bgCard}; color: ${COLORS.text}; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? 60 : 220,
        minHeight: "100vh",
        background: COLORS.bgCard,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={Icons.zap} size={16} color="#fff" fill="#fff" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>LifeOS</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.06em" }}>COMMAND CENTER</div>
            </div>
          )}
        </div>

        {/* Profile */}
        {!sidebarCollapsed && (
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={Icons.user} size={14} color={COLORS.accent} />
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.college}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV.map(n => {
            const isActive = page === n.id;
            const badge = navBadges[n.id];
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: sidebarCollapsed ? "10px 14px" : "9px 12px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: isActive ? COLORS.accentDim : "transparent",
                color: isActive ? COLORS.accent : COLORS.textMuted,
                fontWeight: isActive ? 700 : 500,
                fontSize: 13, fontFamily: "inherit", marginBottom: 2,
                transition: "all 0.15s", position: "relative",
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = COLORS.bgHover; e.currentTarget.style.color = COLORS.text; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textMuted; } }}
                title={sidebarCollapsed ? n.label : undefined}
              >
                <div style={{ flexShrink: 0 }}>
                  <Icon d={typeof Icons[n.icon] === "string" ? Icons[n.icon] : Icons[n.icon]?.[0] || Icons.home} size={16} />
                </div>
                {!sidebarCollapsed && <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>}
                {!sidebarCollapsed && badge && (
                  <span style={{ background: COLORS.red, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "0 5px", minWidth: 16, textAlign: "center" }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: 10, borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setSidebarCollapsed(c => !c)} style={{
            width: "100%", background: "transparent", border: "none", cursor: "pointer",
            color: COLORS.textMuted, padding: 8, borderRadius: 8, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <Icon d={sidebarCollapsed ? Icons.chevronRight : Icons.chevronRight} size={16}
              style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)" }} />
          </button>
        </div>
      </div>

      {/* Main content */}git
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          height: 56, background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", flexShrink: 0, position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
            {todayLabel()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setPage("ai")} style={{
              background: COLORS.accentDim, border: `1px solid ${COLORS.accent}30`, borderRadius: 8,
              padding: "5px 12px", color: COLORS.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Icon d={Icons.ai} size={12} color={COLORS.accent} />
              AI Mentor
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setPage("settings")}>
              <Icon d={Icons.user} size={14} color={COLORS.accent} />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {pages[page]}
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
