// import { useState, useEffect, useCallback, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import dashboardService, { DashboardSummary, LedgerEntry, TransactionSummary } from "@/services/dashboardService";
// import notificationService, { NotificationItem } from "@/services/notificationService";
// import { toast } from "sonner";
// import {
//   CreditCard,
//   Clock,
//   Bell,
//   BellDot,
//   LogOut,
//   User,
//   RefreshCw,
//   Zap,
//   LayoutDashboard,
//   CheckCheck,
//   Menu,
//   X,
//   Star,
//   TrendingUp,
//   TrendingDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// const Dashboard = () => {
//   const { user, logout } = useAuth();

//   const [summary, setSummary] = useState<DashboardSummary | null>(null);
//   const [ledger, setLedger] = useState<LedgerEntry[]>([]);
//   const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const [showNotifications, setShowNotifications] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [txStatusFilter, setTxStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");

//   const userId = user?.id ? Number(user.id) : null;

//   const fetchData = useCallback(async (isManualRefresh = false) => {
//     if (!userId) return;

//     if (isManualRefresh) setRefreshing(true);
//     else setLoading(true);

//     try {
//       const [dashRes, notifRes, countRes] = await Promise.all([
//         dashboardService.getFullDashboard(userId, 10, 10),
//         notificationService.list(userId, 10),
//         notificationService.unreadCount(userId),
//       ]);

//       setSummary(dashRes.data.summary);
//       setLedger(dashRes.data.recentLedgerEntries ?? []);
//       setTransactions(dashRes.data.recentTransactions ?? []);
//       setNotifications(notifRes.data);
//       setUnreadCount(countRes.data.count ?? 0);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleMarkRead = async (id: number) => {
//     if (!userId) return;
//     try {
//       await notificationService.markRead(id, userId);
//       setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//       setUnreadCount((c) => Math.max(0, c - 1));
//     } catch {
//       toast.error("Failed to mark notification as read");
//     }
//   };

//   const handleMarkAllRead = async () => {
//     if (!userId) return;
//     try {
//       await notificationService.markAllRead(userId);
//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//       setUnreadCount(0);
//       toast.success("All notifications marked as read");
//     } catch {
//       toast.error("Failed to mark all notifications");
//     }
//   };

//   const filteredTransactions = useMemo(() => {
//     if (txStatusFilter === "ALL") return transactions;
//     return transactions.filter((t) => (t.status || "").toUpperCase() === txStatusFilter);
//   }, [transactions, txStatusFilter]);

//   const earned = useMemo(
//     () => ledger.filter((l) => l.changeAmount > 0).reduce((acc, l) => acc + l.changeAmount, 0),
//     [ledger],
//   );

//   const spentAbs = useMemo(
//     () => Math.abs(ledger.filter((l) => l.changeAmount < 0).reduce((acc, l) => acc + l.changeAmount, 0)),
//     [ledger],
//   );

//   const statCards = summary
//     ? [
//         { label: "Current Credits", value: summary.credits, icon: CreditCard, color: "text-primary" },
//         { label: "As Learner", value: summary.transactionsAsLearnerCount, icon: Clock, color: "text-warning" },
//         { label: "As Teacher", value: summary.transactionsAsTeacherCount, icon: User, color: "text-success" },
//         { label: "Avg Teacher Rating", value: summary.averageRatingAsTeacher ?? 0, icon: Star, color: "text-primary" },
//       ]
//     : [];

//   const formatValue = (label: string, value: number) => {
//     if (label === "Avg Teacher Rating") return value ? value.toFixed(1) : "—";
//     if (label === "Current Credits") return value.toFixed(2);
//     return value.toString();
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
//           <Link
//             to="/"
//             onClick={() => setSidebarOpen(false)}
//             className="flex min-w-0 flex-1 items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
//           >
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
//               <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
//             </div>
//             <span className="truncate text-lg font-bold">SkillSwap</span>
//           </Link>
//           <button
//             type="button"
//             className="ml-auto shrink-0 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close menu"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="border-b border-sidebar-border p-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
//               <User className="h-5 w-5 text-sidebar-accent-foreground" />
//             </div>
//             <div className="min-w-0">
//               <p className="truncate text-sm font-medium">{summary?.userName || user?.name || "User"}</p>
//               <p className="truncate text-xs text-sidebar-foreground/60">{summary?.email || user?.email}</p>
//             </div>
//           </div>
//           {summary && (
//             <div className="mt-4 rounded-lg bg-sidebar-accent p-3 text-center">
//               <p className="text-2xl font-bold text-sidebar-primary">{summary.credits.toFixed(2)}</p>
//               <p className="text-xs text-sidebar-foreground/60">Available Credits</p>
//             </div>
//           )}
//         </div>

//         <nav className="flex-1 space-y-1 p-4">
//           <button className="flex w-full items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-accent-foreground">
//             <LayoutDashboard className="h-4 w-4" />
//             Dashboard
//           </button>
//           <button
//             onClick={() => fetchData(true)}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//           >
//             <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//             Refresh Data
//           </button>
//         </nav>

//         <div className="border-t border-sidebar-border p-4">
//           <button
//             onClick={logout}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-destructive"
//           >
//             <LogOut className="h-4 w-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {sidebarOpen && (
//         <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       <main className="flex-1 lg:ml-64">
//         <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
//           <div className="flex items-center gap-4">
//             <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
//               <Menu className="h-5 w-5 text-foreground" />
//             </button>
//             <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => fetchData(true)} disabled={refreshing}>
//               <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative rounded-lg p-2 transition-colors hover:bg-muted"
//               >
//                 {unreadCount > 0 ? <BellDot className="h-5 w-5 text-primary" /> : <Bell className="h-5 w-5 text-muted-foreground" />}
//                 {unreadCount > 0 && (
//                   <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
//                     {unreadCount > 9 ? "9+" : unreadCount}
//                   </span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border bg-card shadow-xl">
//                   <div className="flex items-center justify-between border-b border-border p-4">
//                     <h3 className="font-semibold text-card-foreground">Notifications</h3>
//                     {unreadCount > 0 && (
//                       <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
//                         <CheckCheck className="h-3 w-3" /> Mark all read
//                       </button>
//                     )}
//                   </div>

//                   <div className="max-h-96 overflow-y-auto">
//                     {notifications.length === 0 ? (
//                       <div className="p-8 text-center">
//                         <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
//                         <p className="text-sm text-muted-foreground">No notifications yet</p>
//                       </div>
//                     ) : (
//                       notifications.map((n) => (
//                         <button
//                           key={n.id}
//                           onClick={() => !n.read && handleMarkRead(n.id)}
//                           className={`flex w-full items-start gap-3 border-b border-border/50 p-4 text-left transition-colors hover:bg-muted/50 ${
//                             !n.read ? "bg-primary/5" : ""
//                           }`}
//                         >
//                           <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`} />
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-card-foreground">{n.title}</p>
//                             <p className="text-xs text-muted-foreground">{n.body}</p>
//                             <p className="mt-1 text-[11px] text-muted-foreground">
//                               {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
//                             </p>
//                           </div>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <div className="p-4 lg:p-8">
//           <div className="mb-6 rounded-xl border border-border bg-card p-4">
//             <div className="grid gap-4 sm:grid-cols-3">
//               <div className="rounded-lg border border-border/50 p-3">
//                 <p className="text-xs text-muted-foreground">Credits Earned (recent)</p>
//                 <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-success">
//                   <TrendingUp className="h-4 w-4" /> +{earned.toFixed(2)}
//                 </p>
//               </div>
//               <div className="rounded-lg border border-border/50 p-3">
//                 <p className="text-xs text-muted-foreground">Credits Spent (recent)</p>
//                 <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-destructive">
//                   <TrendingDown className="h-4 w-4" /> -{spentAbs.toFixed(2)}
//                 </p>
//               </div>
//               <div className="rounded-lg border border-border/50 p-3">
//                 <p className="text-xs text-muted-foreground">Transactions Loaded</p>
//                 <p className="mt-1 text-lg font-semibold text-foreground">{transactions.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {loading
//               ? Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="rounded-xl border border-border bg-card p-6">
//                     <Skeleton className="mb-2 h-4 w-24" />
//                     <Skeleton className="h-8 w-16" />
//                   </div>
//                 ))
//               : statCards.map((card) => (
//                   <div key={card.label} className="animate-fade-in rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
//                     <div className="mb-2 flex items-center justify-between">
//                       <p className="text-sm text-muted-foreground">{card.label}</p>
//                       <card.icon className={`h-5 w-5 ${card.color}`} />
//                     </div>
//                     <p className="text-2xl font-bold text-card-foreground">{formatValue(card.label, Number(card.value))}</p>
//                   </div>
//                 ))}
//           </div>

//           <div className="grid gap-6 lg:grid-cols-2">
//             <div className="rounded-xl border border-border bg-card">
//               <div className="flex items-center justify-between border-b border-border p-5">
//                 <h2 className="font-semibold text-card-foreground">Recent Transactions</h2>
//                 <div className="flex items-center gap-2">
//                   {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setTxStatusFilter(s)}
//                       className={`rounded-full px-2 py-1 text-[10px] font-medium ${
//                         txStatusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="divide-y divide-border">
//                 {loading ? (
//                   Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="flex items-center gap-4 p-4">
//                       <Skeleton className="h-10 w-10 rounded-full" />
//                       <div className="flex-1">
//                         <Skeleton className="mb-1 h-4 w-32" />
//                         <Skeleton className="h-3 w-24" />
//                       </div>
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                   ))
//                 ) : filteredTransactions.length === 0 ? (
//                   <div className="p-8 text-center">
//                     <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
//                     <p className="text-sm text-muted-foreground">No transactions for selected filter</p>
//                   </div>
//                 ) : (
//                   filteredTransactions.map((tx) => (
//                     <div key={tx.transactionId} className="flex items-center justify-between p-4">
//                       <div>
//                         <p className="text-sm font-medium text-card-foreground">
//                           Tx #{tx.transactionId} • {tx.duration}h
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           Provider #{tx.providerId} → Receiver #{tx.receiverId}
//                         </p>
//                         {tx.feedback && <p className="mt-1 text-xs text-muted-foreground">“{tx.feedback}”</p>}
//                       </div>
//                       <div className="text-right">
//                         <span
//                           className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
//                             tx.status === "COMPLETED"
//                               ? "bg-success/10 text-success"
//                               : tx.status === "PENDING"
//                               ? "bg-warning/10 text-warning"
//                               : "bg-destructive/10 text-destructive"
//                           }`}
//                         >
//                           {tx.status}
//                         </span>
//                         <p className="mt-1 text-xs text-muted-foreground">
//                           Rating: {tx.rating ?? "—"}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             <div className="rounded-xl border border-border bg-card">
//               <div className="flex items-center justify-between border-b border-border p-5">
//                 <h2 className="font-semibold text-card-foreground">Credit Ledger</h2>
//                 <CreditCard className="h-4 w-4 text-muted-foreground" />
//               </div>

//               <div className="divide-y divide-border">
//                 {loading ? (
//                   Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="flex items-center gap-4 p-4">
//                       <Skeleton className="h-10 w-10 rounded-full" />
//                       <div className="flex-1">
//                         <Skeleton className="mb-1 h-4 w-40" />
//                         <Skeleton className="h-3 w-20" />
//                       </div>
//                       <Skeleton className="h-4 w-12" />
//                     </div>
//                   ))
//                 ) : ledger.length === 0 ? (
//                   <div className="p-8 text-center">
//                     <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
//                     <p className="text-sm text-muted-foreground">No ledger entries yet</p>
//                   </div>
//                 ) : (
//                   ledger.map((entry) => (
//                     <div key={entry.ledgerId} className="flex items-center justify-between p-4">
//                       <div>
//                         <p className="text-sm font-medium text-card-foreground">
//                           {entry.entryType} {entry.transactionId ? `• Tx #${entry.transactionId}` : ""}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           Balance after: {entry.balanceAfterChange.toFixed(2)}
//                         </p>
//                       </div>
//                       <p className={`text-sm font-semibold ${entry.changeAmount >= 0 ? "text-success" : "text-destructive"}`}>
//                         {entry.changeAmount >= 0 ? "+" : ""}
//                         {entry.changeAmount.toFixed(2)}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import dashboardService, { DashboardSummary, LedgerEntry, TransactionSummary } from "@/services/dashboardService";
import notificationService, { NotificationItem } from "@/services/notificationService";
import { toast } from "sonner";
import {
  CreditCard, Clock, Bell, BellDot, LogOut, User, RefreshCw, Zap,
  LayoutDashboard, CheckCheck, Menu, X, Star, TrendingUp, TrendingDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
 
/* ── Font loader ── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};
 
/* ── Design tokens ── */
const G = {
  bg:         "#090f0d",
  card:       "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
  green:      "#4ADE80",
  greenDeep:  "#16A34A",
  greenDark:  "#052e10",
  greenGlow:  "rgba(74,222,128,",
  text:       "#ffffff",
  textMuted:  "rgba(255,255,255,0.38)",
  textSub:    "rgba(255,255,255,0.22)",
  serif:      "'Instrument Serif', serif",
  sans:       "'Syne', sans-serif",
};
 
/* ── Reusable primitives ── */
const glass = (extra = ""): React.CSSProperties => ({
  background: G.card,
  border: `1px solid ${G.cardBorder}`,
  backdropFilter: "blur(16px)",
  borderRadius: "16px",
  ...(extra ? JSON.parse(extra) : {}),
});
 
function GreenDot({ size = 8, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      background: G.green, opacity, flexShrink: 0,
    }} />
  );
}
 
function StatusPill({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  const cfg: Record<string, { bg: string; color: string }> = {
    COMPLETED: { bg: `${G.greenGlow}0.12)`, color: G.green },
    PENDING:   { bg: "rgba(251,191,36,0.12)", color: "#FBBf24" },
    CANCELLED: { bg: "rgba(239,68,68,0.12)",  color: "#F87171" },
  };
  const c = cfg[s] ?? { bg: "rgba(255,255,255,0.06)", color: G.textMuted };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 10px",
      borderRadius: "999px", fontSize: 10, fontWeight: 700,
      fontFamily: G.sans, letterSpacing: "0.06em",
      background: c.bg, color: c.color,
    }}>{s}</span>
  );
}
 
function SectionHeading({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h2 style={{ fontFamily: G.serif, fontSize: 18, color: G.text, fontWeight: 400, margin: 0 }}>
        {children}
      </h2>
      {right}
    </div>
  );
}
 
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: G.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: G.textMuted, margin: 0 }}>
      {children}
    </p>
  );
}
 
/* ── Stat card ── */
function StatCard({ label, value, icon: Icon, accent }: {
  label: string; value: string; icon: React.FC<any>; accent?: string;
}) {
  const col = accent ?? G.green;
  return (
    <div style={{
      ...glass(), padding: "22px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* ambient glow */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 100, height: 100, borderRadius: "50%",
        background: `radial-gradient(circle, ${col}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <FieldLabel>{label}</FieldLabel>
        <div style={{
          width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center",
          justifyContent: "center", background: `${col}18`, color: col, flexShrink: 0,
        }}>
          <Icon size={14} />
        </div>
      </div>
      <p style={{ fontFamily: G.serif, fontSize: 32, color: G.text, fontWeight: 400, margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      {/* bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 24, right: 24, height: 1,
        background: `linear-gradient(90deg, ${col}44, transparent)`,
      }} />
    </div>
  );
}
 
/* ── Ledger row ── */
function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const pos = entry.changeAmount >= 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: `1px solid ${G.cardBorder}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: pos ? `${G.greenGlow}0.1)` : "rgba(239,68,68,0.1)",
          color: pos ? G.green : "#F87171",
        }}>
          {pos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
        <div>
          <p style={{ fontFamily: G.sans, fontSize: 13, color: G.text, margin: 0, fontWeight: 500 }}>
            {entry.entryType}{entry.transactionId ? ` · Tx #${entry.transactionId}` : ""}
          </p>
          <p style={{ fontFamily: G.sans, fontSize: 11, color: G.textMuted, margin: "2px 0 0" }}>
            Balance after: {entry.balanceAfterChange.toFixed(2)}
          </p>
        </div>
      </div>
      <p style={{
        fontFamily: G.serif, fontSize: 18, fontWeight: 400,
        color: pos ? G.green : "#F87171", margin: 0,
      }}>
        {pos ? "+" : ""}{entry.changeAmount.toFixed(2)}
      </p>
    </div>
  );
}
 
/* ── Transaction row ── */
function TxRow({ tx }: { tx: TransactionSummary }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: `1px solid ${G.cardBorder}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${G.greenGlow}0.08)`,
          color: G.textMuted,
          fontFamily: G.sans, fontSize: 11, fontWeight: 700,
        }}>
          #{tx.transactionId}
        </div>
        <div>
          <p style={{ fontFamily: G.sans, fontSize: 13, color: G.text, margin: 0, fontWeight: 500 }}>
            {tx.duration}h session &nbsp;·&nbsp;
            <span style={{ color: G.textMuted }}>#{tx.providerId} → #{tx.receiverId}</span>
          </p>
          {tx.feedback && (
            <p style={{ fontFamily: G.sans, fontSize: 11, color: G.textSub, margin: "2px 0 0",
              fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
              "{tx.feedback}"
            </p>
          )}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
        <StatusPill status={tx.status} />
        {tx.rating != null && (
          <p style={{ fontFamily: G.sans, fontSize: 10, color: G.textMuted, margin: "4px 0 0" }}>
            ★ {tx.rating}
          </p>
        )}
      </div>
    </div>
  );
}
 
/* ── Main Dashboard ── */
const Dashboard = () => {
  const { user, logout } = useAuth();
 
  const [summary, setSummary]           = useState<DashboardSummary | null>(null);
  const [ledger, setLedger]             = useState<LedgerEntry[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [txStatusFilter, setTxStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");
 
  const userId = user?.id ? Number(user.id) : null;
 
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (!userId) return;
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [dashRes, notifRes, countRes] = await Promise.all([
        dashboardService.getFullDashboard(userId, 10, 10),
        notificationService.list(userId, 10),
        notificationService.unreadCount(userId),
      ]);
      setSummary(dashRes.data.summary);
      setLedger(dashRes.data.recentLedgerEntries ?? []);
      setTransactions(dashRes.data.recentTransactions ?? []);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count ?? 0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);
 
  useEffect(() => { fetchData(); }, [fetchData]);
 
  const handleMarkRead = async (id: number) => {
    if (!userId) return;
    try {
      await notificationService.markRead(id, userId);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { toast.error("Failed to mark notification as read"); }
  };
 
  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await notificationService.markAllRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch { toast.error("Failed to mark all notifications"); }
  };
 
  const filteredTransactions = useMemo(() =>
    txStatusFilter === "ALL" ? transactions : transactions.filter(t => (t.status || "").toUpperCase() === txStatusFilter),
    [transactions, txStatusFilter],
  );
 
  const earned = useMemo(() =>
    ledger.filter(l => l.changeAmount > 0).reduce((a, l) => a + l.changeAmount, 0), [ledger]);
  const spentAbs = useMemo(() =>
    Math.abs(ledger.filter(l => l.changeAmount < 0).reduce((a, l) => a + l.changeAmount, 0)), [ledger]);
 
  const statCards = summary ? [
    { label: "Current Credits",      value: summary.credits.toFixed(2),                         icon: CreditCard, accent: G.green },
    { label: "Sessions as Learner",  value: String(summary.transactionsAsLearnerCount),          icon: Clock,      accent: "#60A5FA" },
    { label: "Sessions as Teacher",  value: String(summary.transactionsAsTeacherCount),          icon: User,       accent: "#A78BFA" },
    { label: "Avg Teacher Rating",   value: summary.averageRatingAsTeacher ? summary.averageRatingAsTeacher.toFixed(1) : "—", icon: Star, accent: "#FBBf24" },
  ] : [];
 
  /* ── Sidebar nav item ── */
  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
      fontFamily: G.sans, fontSize: 13, fontWeight: active ? 600 : 400,
      background: active ? `${G.greenGlow}0.1)` : "transparent",
      color: active ? G.green : G.textMuted,
      transition: "all 0.2s",
    }}>
      <Icon size={15} />
      {label}
    </button>
  );
 
  return (
    <>
      <FontLoader />
      <div style={{ display: "flex", minHeight: "100vh", background: G.bg, fontFamily: G.sans }}>
 
        {/* ── background aura ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            radial-gradient(ellipse 700px 500px at 15% 0%, ${G.greenGlow}0.055) 0%, transparent 70%),
            radial-gradient(ellipse 400px 400px at 85% 90%, ${G.greenGlow}0.035) 0%, transparent 70%)
          `,
        }} />
 
        {/* ══════════════ SIDEBAR ══════════════ */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 30,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          }} />
        )}
 
        <aside style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
          width: 240, display: "flex", flexDirection: "column",
          background: "linear-gradient(180deg, rgba(9,15,13,0.98) 0%, rgba(13,18,16,0.98) 100%)",
          borderRight: `1px solid ${G.cardBorder}`,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
          className="lg:translate-x-0"
        >
          {/* sidebar glow strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 2,
            background: `linear-gradient(180deg, transparent, ${G.green}66, transparent)`,
            pointerEvents: "none",
          }} />
 
          {/* Logo */}
          <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${G.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link to="/" onClick={() => setSidebarOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg, ${G.green}, ${G.greenDeep})`,
                }}>
                  <Zap size={16} color={G.greenDark} />
                </div>
                <span style={{ fontFamily: G.serif, fontSize: 18, color: G.text, fontWeight: 400 }}>
                  SkillSwap
                </span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: "none", border: "none", color: G.textMuted, cursor: "pointer", padding: 4 }}
                className="lg:hidden">
                <X size={16} />
              </button>
            </div>
          </div>
 
          {/* User profile */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${G.greenGlow}0.15)`,
                border: `1.5px solid ${G.greenGlow}0.3)`,
                color: G.green,
              }}>
                <User size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: G.sans, fontSize: 13, fontWeight: 600, color: G.text, margin: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {summary?.userName || user?.name || "User"}
                </p>
                <p style={{ fontFamily: G.sans, fontSize: 10, color: G.textMuted, margin: "2px 0 0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {summary?.email || user?.email}
                </p>
              </div>
            </div>
 
            {summary && (
              <div style={{
                borderRadius: 10, padding: "10px 14px", textAlign: "center",
                background: `${G.greenGlow}0.07)`,
                border: `1px solid ${G.greenGlow}0.15)`,
              }}>
                <p style={{ fontFamily: G.serif, fontSize: 26, color: G.green, margin: 0, lineHeight: 1 }}>
                  {summary.credits.toFixed(2)}
                </p>
                <p style={{ fontFamily: G.sans, fontSize: 10, color: G.textMuted, margin: "4px 0 0",
                  letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Available Credits
                </p>
              </div>
            )}
          </div>
 
          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={RefreshCw} label="Refresh Data" onClick={() => fetchData(true)} />
          </nav>
 
          {/* Logout */}
          <div style={{ padding: 12, borderTop: `1px solid ${G.cardBorder}` }}>
            <button onClick={logout} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: G.sans, fontSize: 13, fontWeight: 400,
              background: "transparent", color: "#F87171", transition: "all 0.2s",
            }}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </aside>
 
        {/* ══════════════ MAIN ══════════════ */}
        <main style={{ flex: 1, marginLeft: 0, position: "relative", zIndex: 1 }}
          className="lg:ml-[240px]">
 
          {/* ── Top header ── */}
          <header style={{
            position: "sticky", top: 0, zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px", height: 60,
            background: "rgba(9,15,13,0.85)", backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${G.cardBorder}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setSidebarOpen(true)}
                style={{ background: "none", border: "none", color: G.textMuted, cursor: "pointer", padding: 4 }}
                className="lg:hidden">
                <Menu size={18} />
              </button>
              <div>
                <p style={{ fontFamily: G.sans, fontSize: 10, color: G.textMuted, margin: 0,
                  letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Overview
                </p>
                <h1 style={{ fontFamily: G.serif, fontSize: 20, color: G.text, margin: 0, fontWeight: 400 }}>
                  Dashboard
                </h1>
              </div>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Refresh */}
              <button onClick={() => fetchData(true)} disabled={refreshing} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 10, border: `1px solid ${G.cardBorder}`,
                background: G.card, color: G.textMuted, cursor: "pointer",
                fontFamily: G.sans, fontSize: 12, fontWeight: 500, transition: "all 0.2s",
              }}>
                <RefreshCw size={12} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </button>
 
              {/* Notification bell */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowNotifications(!showNotifications)} style={{
                  width: 36, height: 36, borderRadius: 10, border: `1px solid ${G.cardBorder}`,
                  background: showNotifications ? `${G.greenGlow}0.08)` : G.card,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: unreadCount > 0 ? G.green : G.textMuted, cursor: "pointer",
                  position: "relative",
                }}>
                  {unreadCount > 0 ? <BellDot size={16} /> : <Bell size={16} />}
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: -4, right: -4,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#EF4444", color: "#fff",
                      fontFamily: G.sans, fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
 
                {/* Notification dropdown */}
                {showNotifications && (
                  <div style={{
                    position: "absolute", right: 0, top: 44, zIndex: 50,
                    width: 360, borderRadius: 16,
                    background: "rgba(11,18,15,0.97)", backdropFilter: "blur(24px)",
                    border: `1px solid ${G.cardBorder}`,
                    boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${G.greenGlow}0.08)`,
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", borderBottom: `1px solid ${G.cardBorder}`,
                    }}>
                      <p style={{ fontFamily: G.serif, fontSize: 16, color: G.text, margin: 0, fontWeight: 400 }}>
                        Notifications
                      </p>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} style={{
                          display: "flex", alignItems: "center", gap: 4,
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: G.sans, fontSize: 11, color: G.green, fontWeight: 600,
                        }}>
                          <CheckCheck size={12} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: "32px 16px", textAlign: "center" }}>
                          <Bell size={28} color={G.textSub} style={{ margin: "0 auto 8px" }} />
                          <p style={{ fontFamily: G.sans, fontSize: 12, color: G.textMuted, margin: 0 }}>
                            No notifications yet
                          </p>
                        </div>
                      ) : notifications.map(n => (
                        <button key={n.id} onClick={() => !n.read && handleMarkRead(n.id)} style={{
                          display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
                          padding: "12px 16px", border: "none", cursor: "pointer", textAlign: "left",
                          borderBottom: `1px solid ${G.cardBorder}`,
                          background: !n.read ? `${G.greenGlow}0.04)` : "transparent",
                          transition: "background 0.2s",
                        }}>
                          <div style={{ marginTop: 4, flexShrink: 0 }}>
                            <GreenDot size={7} opacity={n.read ? 0.2 : 1} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontFamily: G.sans, fontSize: 13, fontWeight: 600, color: G.text, margin: 0 }}>
                              {n.title}
                            </p>
                            <p style={{ fontFamily: G.sans, fontSize: 11, color: G.textMuted, margin: "2px 0 0" }}>
                              {n.body}
                            </p>
                            <p style={{ fontFamily: G.sans, fontSize: 10, color: G.textSub, margin: "4px 0 0" }}>
                              {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
 
          {/* ── Page body ── */}
          <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
 
            {/* Credit flow strip */}
            <div style={{ ...glass(), padding: "16px 24px", marginBottom: 24,
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Earned (recent)</FieldLabel>
                <p style={{ fontFamily: G.serif, fontSize: 22, color: G.green, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingUp size={16} /> +{earned.toFixed(2)}
                </p>
              </div>
              <div style={{ borderLeft: `1px solid ${G.cardBorder}`, paddingLeft: 20 }}>
                <FieldLabel>Spent (recent)</FieldLabel>
                <p style={{ fontFamily: G.serif, fontSize: 22, color: "#F87171", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingDown size={16} /> -{spentAbs.toFixed(2)}
                </p>
              </div>
              <div style={{ borderLeft: `1px solid ${G.cardBorder}`, paddingLeft: 20 }}>
                <FieldLabel>Transactions loaded</FieldLabel>
                <p style={{ fontFamily: G.serif, fontSize: 22, color: G.text, margin: "6px 0 0" }}>
                  {transactions.length}
                </p>
              </div>
            </div>
 
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ ...glass(), padding: "22px 24px" }}>
                      <Skeleton className="mb-3 h-3 w-20" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <Skeleton className="h-8 w-16" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                  ))
                : statCards.map(c => (
                    <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />
                  ))
              }
            </div>
 
            {/* Tables row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
              className="block lg:grid">
 
              {/* Transactions */}
              <div style={{ ...glass(), padding: "20px 22px", marginBottom: 20 }} className="lg:mb-0">
                <SectionHeading
                  right={
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map(s => (
                        <button key={s} onClick={() => setTxStatusFilter(s)} style={{
                          padding: "3px 9px", borderRadius: 999, border: "none", cursor: "pointer",
                          fontFamily: G.sans, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                          background: txStatusFilter === s ? `${G.greenGlow}0.18)` : "rgba(255,255,255,0.05)",
                          color: txStatusFilter === s ? G.green : G.textMuted,
                          transition: "all 0.2s",
                        }}>{s}</button>
                      ))}
                    </div>
                  }
                >
                  Transactions
                </SectionHeading>
 
                <div>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${G.cardBorder}` }}>
                        <Skeleton className="h-8 w-8 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <Skeleton className="mb-1.5 h-3 w-36" style={{ background: "rgba(255,255,255,0.05)" }} />
                          <Skeleton className="h-2.5 w-24" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </div>
                      </div>
                    ))
                  ) : filteredTransactions.length === 0 ? (
                    <div style={{ padding: "32px 0", textAlign: "center" }}>
                      <Clock size={28} color={G.textSub} style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontFamily: G.sans, fontSize: 12, color: G.textMuted, margin: 0 }}>
                        No transactions for this filter
                      </p>
                    </div>
                  ) : filteredTransactions.map(tx => <TxRow key={tx.transactionId} tx={tx} />)}
                </div>
              </div>
 
              {/* Ledger */}
              <div style={{ ...glass(), padding: "20px 22px" }}>
                <SectionHeading
                  right={<CreditCard size={14} color={G.textMuted} />}
                >
                  Credit Ledger
                </SectionHeading>
 
                <div>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${G.cardBorder}` }}>
                        <Skeleton className="h-8 w-8 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <Skeleton className="mb-1.5 h-3 w-40" style={{ background: "rgba(255,255,255,0.05)" }} />
                          <Skeleton className="h-2.5 w-20" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </div>
                      </div>
                    ))
                  ) : ledger.length === 0 ? (
                    <div style={{ padding: "32px 0", textAlign: "center" }}>
                      <CreditCard size={28} color={G.textSub} style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontFamily: G.sans, fontSize: 12, color: G.textMuted, margin: 0 }}>
                        No ledger entries yet
                      </p>
                    </div>
                  ) : ledger.map(e => <LedgerRow key={e.ledgerId} entry={e} />)}
                </div>
              </div>
            </div>
 
          </div>
        </main>
 
        {/* spin keyframes */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (min-width: 1024px) {
            .lg\\:translate-x-0 { transform: translateX(0) !important; }
            .lg\\:ml-\\[240px\\] { margin-left: 240px !important; }
            .lg\\:hidden { display: none !important; }
            .lg\\:grid { display: grid !important; }
            .lg\\:mb-0 { margin-bottom: 0 !important; }
          }
        `}</style>
      </div>
    </>
  );
};
 
export default Dashboard;