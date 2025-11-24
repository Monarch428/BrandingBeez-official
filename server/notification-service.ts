interface NotificationOptions {
  webhook_url?: string;
  slack_webhook?: string;
  discord_webhook?: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
}

// Simple notification system that can be extended
export class NotificationService {
  private static instance: NotificationService;
  private notifications: any[] = [];
  
  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  // Store notifications in memory for easy viewing
  addNotification(type: string, data: any) {
    const notification = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.unshift(notification); // Add to beginning
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
    
    return notification;
  }
  
  getNotifications() {
    return this.notifications;
  }
  
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
  
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
  
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }
  
  // Optional: Send to webhook if configured
  async sendWebhook(message: string, data: any) {
    const webhookUrl = process.env.WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) return;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          data: data
        })
      });
      
      if (!response.ok) {
        console.error('Webhook failed:', response.statusText);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();