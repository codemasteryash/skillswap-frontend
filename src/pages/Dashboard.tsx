import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import dashboardService, { DashboardSummary, LedgerEntry, TransactionSummary } from "@/services/dashboardService";
import notificationService, { NotificationItem } from "@/services/notificationService";
import { toast } from "sonner";
import {
  CreditCard,
  Clock,
  Bell,
  BellDot,
  LogOut,
  User,
  RefreshCw,
  Zap,
  LayoutDashboard,
  CheckCheck,
  Menu,
  X,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkRead = async (id: number) => {
    if (!userId) return;
    try {
      await notificationService.markRead(id, userId);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await notificationService.markAllRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all notifications");
    }
  };

  const filteredTransactions = useMemo(() => {
    if (txStatusFilter === "ALL") return transactions;
    return transactions.filter((t) => (t.status || "").toUpperCase() === txStatusFilter);
  }, [transactions, txStatusFilter]);

  const earned = useMemo(
    () => ledger.filter((l) => l.changeAmount > 0).reduce((acc, l) => acc + l.changeAmount, 0),
    [ledger],
  );

  const spentAbs = useMemo(
    () => Math.abs(ledger.filter((l) => l.changeAmount < 0).reduce((acc, l) => acc + l.changeAmount, 0)),
    [ledger],
  );

  const statCards = summary
    ? [
        { label: "Current Credits", value: summary.credits, icon: CreditCard, color: "text-primary" },
        { label: "As Learner", value: summary.transactionsAsLearnerCount, icon: Clock, color: "text-warning" },
        { label: "As Teacher", value: summary.transactionsAsTeacherCount, icon: User, color: "text-success" },
        { label: "Avg Teacher Rating", value: summary.averageRatingAsTeacher ?? 0, icon: Star, color: "text-primary" },
      ]
    : [];

  const formatValue = (label: string, value: number) => {
    if (label === "Avg Teacher Rating") return value ? value.toFixed(1) : "—";
    if (label === "Current Credits") return value.toFixed(2);
    return value.toString();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="truncate text-lg font-bold">SkillSwap</span>
          </Link>
          <button
            type="button"
            className="ml-auto shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{summary?.userName || user?.name || "User"}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{summary?.email || user?.email}</p>
            </div>
          </div>
          {summary && (
            <div className="mt-4 rounded-lg bg-sidebar-accent p-3 text-center">
              <p className="text-2xl font-bold text-sidebar-primary">{summary.credits.toFixed(2)}</p>
              <p className="text-xs text-sidebar-foreground/60">Available Credits</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <button className="flex w-full items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-accent-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => fetchData(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchData(true)} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 transition-colors hover:bg-muted"
              >
                {unreadCount > 0 ? <BellDot className="h-5 w-5 text-primary" /> : <Bell className="h-5 w-5 text-muted-foreground" />}
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border bg-card shadow-xl">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <h3 className="font-semibold text-card-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <CheckCheck className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => !n.read && handleMarkRead(n.id)}
                          className={`flex w-full items-start gap-3 border-b border-border/50 p-4 text-left transition-colors hover:bg-muted/50 ${
                            !n.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.body}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/50 p-3">
                <p className="text-xs text-muted-foreground">Credits Earned (recent)</p>
                <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-success">
                  <TrendingUp className="h-4 w-4" /> +{earned.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-3">
                <p className="text-xs text-muted-foreground">Credits Spent (recent)</p>
                <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-destructive">
                  <TrendingDown className="h-4 w-4" /> -{spentAbs.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 p-3">
                <p className="text-xs text-muted-foreground">Transactions Loaded</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6">
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))
              : statCards.map((card) => (
                  <div key={card.label} className="animate-fade-in rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">{formatValue(card.label, Number(card.value))}</p>
                  </div>
                ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-semibold text-card-foreground">Recent Transactions</h2>
                <div className="flex items-center gap-2">
                  {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setTxStatusFilter(s)}
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        txStatusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-1 h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No transactions for selected filter</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div key={tx.transactionId} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          Tx #{tx.transactionId} • {tx.duration}h
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Provider #{tx.providerId} → Receiver #{tx.receiverId}
                        </p>
                        {tx.feedback && <p className="mt-1 text-xs text-muted-foreground">“{tx.feedback}”</p>}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            tx.status === "COMPLETED"
                              ? "bg-success/10 text-success"
                              : tx.status === "PENDING"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Rating: {tx.rating ?? "—"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-semibold text-card-foreground">Credit Ledger</h2>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-1 h-4 w-40" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))
                ) : ledger.length === 0 ? (
                  <div className="p-8 text-center">
                    <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No ledger entries yet</p>
                  </div>
                ) : (
                  ledger.map((entry) => (
                    <div key={entry.ledgerId} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {entry.entryType} {entry.transactionId ? `• Tx #${entry.transactionId}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Balance after: {entry.balanceAfterChange.toFixed(2)}
                        </p>
                      </div>
                      <p className={`text-sm font-semibold ${entry.changeAmount >= 0 ? "text-success" : "text-destructive"}`}>
                        {entry.changeAmount >= 0 ? "+" : ""}
                        {entry.changeAmount.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;