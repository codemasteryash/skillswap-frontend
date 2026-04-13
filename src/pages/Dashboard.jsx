import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import dashboardService from "@/services/dashboardService";
import notificationService from "@/services/notificationService";
import { toast } from "sonner";
import {
  CreditCard, TrendingUp, TrendingDown, ArrowUpDown, Clock, Bell, BellDot,
  LogOut, User, ChevronRight, Zap, LayoutDashboard, CheckCheck, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [dashRes, notifRes, countRes] = await Promise.all([
        dashboardService.getFullDashboard(user.id),
        notificationService.list(user.id, 10),
        notificationService.unreadCount(user.id),
      ]);
      setSummary(dashRes.data.summary);
      setLedger(dashRes.data.ledger);
      setTransactions(dashRes.data.transactions);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch {
      toast.error("Failed to load dashboard data");
      setSummary({ totalCredits: 0, creditsEarned: 0, creditsSpent: 0, totalTransactions: 0, pendingRequests: 0 });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkRead = async (id) => {
    if (!user) return;
    try {
      await notificationService.markRead(id, user.id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const statCards = summary
    ? [
        { label: "Total Credits", value: summary.totalCredits, icon: CreditCard, color: "text-primary" },
        { label: "Earned", value: summary.creditsEarned, icon: TrendingUp, color: "text-success" },
        { label: "Spent", value: summary.creditsSpent, icon: TrendingDown, color: "text-destructive" },
        { label: "Transactions", value: summary.totalTransactions, icon: ArrowUpDown, color: "text-primary" },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold">SkillSwap</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
            </div>
          </div>
          {summary && (
            <div className="mt-4 rounded-lg bg-sidebar-accent p-3 text-center">
              <p className="text-2xl font-bold text-sidebar-primary">{summary.totalCredits}</p>
              <p className="text-xs text-sidebar-foreground/60">Available Credits</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ArrowUpDown, label: "Transactions" },
            { icon: Bell, label: "Notifications" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
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

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          </div>
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

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h3 className="font-semibold text-card-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <CheckCheck className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
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
                          <p className="text-sm text-card-foreground">{n.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6">
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))
              : statCards.map((card) => (
                  <div
                    key={card.label}
                    className="animate-fade-in rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">{card.value.toLocaleString()}</p>
                  </div>
                ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Transactions */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-semibold text-card-foreground">Recent Transactions</h2>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
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
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <ArrowUpDown className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <ArrowUpDown className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{tx.skill}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.fromUser} → {tx.toUser}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">{tx.credits} credits</p>
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
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Credit Ledger */}
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
                    <div key={entry.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            entry.type === "EARNED" ? "bg-success/10" : "bg-destructive/10"
                          }`}
                        >
                          {entry.type === "EARNED" ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          entry.type === "EARNED" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {entry.type === "EARNED" ? "+" : "-"}{entry.amount}
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
