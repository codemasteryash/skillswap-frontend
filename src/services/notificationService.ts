import api from "@/lib/api";

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  type: string;
  read: boolean;
  relatedTransactionId: number | null;
  createdAt: string;
}

interface BackendNotification {
  notificationId: number;
  title: string;
  body: string;
  type: string;
  read: boolean;
  relatedTransactionId: number | null;
  createdAt: string;
}

const mapNotification = (n: BackendNotification): NotificationItem => ({
  id: n.notificationId,
  title: n.title,
  body: n.body,
  type: n.type,
  read: n.read,
  relatedTransactionId: n.relatedTransactionId,
  createdAt: n.createdAt,
});

const notificationService = {
  list: async (userId: string | number, limit = 10) => {
    const res = await api.get<BackendNotification[]>("/api/notifications", {
      params: { userId: Number(userId), limit },
    });
    return { ...res, data: res.data.map(mapNotification) };
  },

  unreadCount: (userId: string | number) =>
    api.get<{ count: number }>("/api/notifications/unread-count", {
      params: { userId: Number(userId) },
    }),

  markRead: (notificationId: string | number, userId: string | number) =>
    api.patch(`/api/notifications/${notificationId}/read`, null, {
      params: { userId: Number(userId) },
    }),

  markAllRead: (userId: string | number) =>
    api.post("/api/notifications/read-all", null, {
      params: { userId: Number(userId) },
    }),
};

export default notificationService;
