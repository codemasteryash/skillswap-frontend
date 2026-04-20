import api from "@/lib/api";

export interface DashboardSummary {
  userId: number;
  userName: string;
  email: string;
  credits: number;
  transactionsAsLearnerCount: number;
  transactionsAsTeacherCount: number;
  averageRatingAsTeacher: number | null;
}

export interface LedgerEntry {
  ledgerId: number;
  transactionId: number | null;
  changeAmount: number;
  balanceAfterChange: number;
  entryType: string;
}

export interface TransactionSummary {
  transactionId: number;
  providerId: number;
  receiverId: number;
  duration: number;
  status: string;
  rating: number | null;
  feedback: string | null;
}

export interface FullDashboardResponse {
  summary: DashboardSummary;
  recentTransactions: TransactionSummary[];
  recentLedgerEntries: LedgerEntry[];
}

const dashboardService = {
  getSummary: (userId: string | number) =>
    api.get<DashboardSummary>("/api/dashboard/summary", {
      params: { userId: Number(userId) },
    }),

  getLedger: (userId: string | number, limit = 5) =>
    api.get<LedgerEntry[]>("/api/dashboard/ledger", {
      params: { userId: Number(userId), limit },
    }),

  getTransactions: (userId: string | number, limit = 5) =>
    api.get<TransactionSummary[]>("/api/dashboard/transactions", {
      params: { userId: Number(userId), limit },
    }),

  getFullDashboard: (userId: string | number, ledgerLimit = 5, transactionLimit = 5) =>
    api.get<FullDashboardResponse>("/api/dashboard", {
      params: { userId: Number(userId), ledgerLimit, transactionLimit },
    }),
};

export default dashboardService;