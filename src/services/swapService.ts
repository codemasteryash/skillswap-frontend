import api from "@/lib/api";

const swapService = {
  completeSwap: (payload: { learnerId: number; teacherId: number; hours: number; skillId: number }) =>
    api.post("/api/transactions/complete", payload),
};

export default swapService;