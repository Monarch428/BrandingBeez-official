// server/routes/notifications.ts
import type { Express, RequestHandler } from "express";
import { notificationService } from "../notification-service";

export function registerNotificationsRoutes(app: Express, authenticateAdmin: RequestHandler) {
  app.get("/api/notifications", authenticateAdmin, async (_req, res) => {
    const notifications = notificationService.getNotifications();
    const unreadCount = notificationService.getUnreadCount();
    res.json({ notifications, unreadCount, total: notifications.length });
  });

  app.post("/api/notifications/:id/read", authenticateAdmin, async (req, res) => {
    notificationService.markAsRead(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/notifications/read-all", authenticateAdmin, async (_req, res) => {
    notificationService.markAllAsRead();
    res.json({ success: true });
  });
}
