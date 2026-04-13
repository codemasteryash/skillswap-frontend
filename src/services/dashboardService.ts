import api from "@/lib/api";

export interface DashboardSummary {
  totalCredits: number;
  creditsEarned: number;
  creditsSpent: number;
  totalTransactions: number;
  pendingRequests: number;
}

export interface LedgerEntry {
  id: string;
  type: "EARNED" | "SPENT";
  amount: number;
  description: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromUser: string;
  toUser: string;
  skill: string;
  credits: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  createdAt: string;
}

export interface FullDashboard {
  summary: DashboardSummary;
  ledger: LedgerEntry[];
  transactions: Transaction[];
}

const dashboardService = {
  getSummary: (userId: string) =>
    api.get<DashboardSummary>(`/api/dashboard/summary`, { params: { userId } }),

  getLedger: (userId: string, limit = 5) =>
    api.get<LedgerEntry[]>(`/api/dashboard/ledger`, { params: { userId, limit } }),

  getTransactions: (userId: string, limit = 5) =>
    api.get<Transaction[]>(`/api/dashboard/transactions`, { params: { userId, limit } }),

  getFullDashboard: (userId: string, ledgerLimit = 5, transactionLimit = 5) =>
    api.get<FullDashboard>(`/api/dashboard`, {
      params: { userId, ledgerLimit, transactionLimit },
    }),
};

export default dashboardService;
