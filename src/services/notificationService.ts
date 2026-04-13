import api from "@/lib/api";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const notificationService = {
  list: (userId: string, limit = 10) =>
    api.get<Notification[]>(`/api/notifications`, { params: { userId, limit } }),

  unreadCount: (userId: string) =>
    api.get<{ count: number }>(`/api/notifications/unread-count`, { params: { userId } }),

  markRead: (notificationId: string, userId: string) =>
    api.patch(`/api/notifications/${notificationId}/read`, null, { params: { userId } }),

  markAllRead: (userId: string) =>
    api.post(`/api/notifications/read-all`, null, { params: { userId } }),
};

export default notificationService;
