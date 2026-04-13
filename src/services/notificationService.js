import api from "@/lib/api";

const notificationService = {
  list: (userId, limit = 10) =>
    api.get("/api/notifications", { params: { userId, limit } }),

  unreadCount: (userId) =>
    api.get("/api/notifications/unread-count", { params: { userId } }),

  markRead: (notificationId, userId) =>
    api.patch(`/api/notifications/${notificationId}/read`, null, { params: { userId } }),

  markAllRead: (userId) =>
    api.post("/api/notifications/read-all", null, { params: { userId } }),
};

export default notificationService;
