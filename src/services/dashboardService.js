import api from "@/lib/api";

const dashboardService = {
  getSummary: (userId) =>
    api.get("/api/dashboard/summary", { params: { userId } }),

  getLedger: (userId, limit = 5) =>
    api.get("/api/dashboard/ledger", { params: { userId, limit } }),

  getTransactions: (userId, limit = 5) =>
    api.get("/api/dashboard/transactions", { params: { userId, limit } }),

  getFullDashboard: (userId, ledgerLimit = 5, transactionLimit = 5) =>
    api.get("/api/dashboard", {
      params: { userId, ledgerLimit, transactionLimit },
    }),
};

export default dashboardService;
