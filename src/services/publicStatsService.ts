import api from "@/lib/api";

export interface PublicStats {
  userCount: number;
  transactionCount: number;
  creditsVolume: number;
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const { data } = await api.get<PublicStats>("/api/public/stats");
  return data;
}