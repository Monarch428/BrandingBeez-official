import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, Mail, Phone, Building, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

interface Notification {
  id: string;
  type: string;
  data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    submittedAt: string;
  };
  timestamp: string;
  read: boolean;
}

interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export default function NotificationsManager() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery<NotificationResponse>({
    queryKey: ['/api/notifications'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Notifications</h2>
        </div>
        <div className="text-center py-8">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Live Notifications</h2>
          {data?.unreadCount ? (
            <Badge variant="destructive" className="ml-2">
              {data.unreadCount} new
            </Badge>
          ) : null}
        </div>
        
        {data?.unreadCount ? (
          <Button 
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            variant="outline"
            size="sm"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        ) : null}
      </div>

      <div className="text-sm text-muted-foreground">
        Real-time notifications for contact form submissions. Updates every 30 seconds.
      </div>

      {!data?.notifications.length ? (
        <Card>
          <CardContent className="pt-6 text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact form submissions will appear here in real-time
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all ${
                notification.read 
                  ? 'bg-background' 
                  : 'bg-primary/5 border-primary/20 shadow-sm'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {notification.type === 'contact_form' && (
                        <>
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Contact Form Submission
                        </>
                      )}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                    </span>
                    {!notification.read && (
                      <Button
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        variant="outline"
                        size="sm"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{notification.data.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${notification.data.email}`}
                        className="text-primary hover:underline"
                      >
                        {notification.data.email}
                      </a>
                    </div>
                    
                    {notification.data.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{notification.data.company}</span>
                      </div>
                    )}
                    
                    {notification.data.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${notification.data.phone}`}
                          className="text-primary hover:underline"
                        >
                          {notification.data.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Message:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {notification.data.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}