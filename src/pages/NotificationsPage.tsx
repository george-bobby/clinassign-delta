
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'message' | 'schedule' | 'assignment' | 'alert' | 'success';
  created_at: string;
  read: boolean;
}

const NotificationsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setNotifications(data || []);
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notifications',
          variant: 'destructive',
        });
      }
    };

    fetchNotifications();
  }, [user, toast]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'schedule': return Calendar;
      case 'assignment': return BookOpen;
      case 'alert': return AlertTriangle;
      case 'success': return CheckCircle2;
      default: return Bell;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Show loading state if authentication is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            <DashboardHeader 
              title="Notifications" 
              description="Manage your notifications and alerts" 
            />
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-clinical-600" />
                    <span>Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-2 rounded-full bg-clinical-600 px-2 py-0.5 text-xs text-white">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Stay updated with your latest activities
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAsRead}
                    disabled={notifications.every(n => n.read)}
                  >
                    Mark all as read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAll}
                    disabled={notifications.length === 0}
                  >
                    Clear all
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => {
                      const NotificationIcon = getNotificationIcon(notification.type);
                      return (
                        <div 
                          key={notification.id} 
                          className={`flex items-start p-3 rounded-lg transition-colors ${
                            notification.read ? 'bg-white' : 'bg-blue-50'
                          } hover:bg-gray-50`}
                        >
                          <div className={`p-2 rounded-full mr-3`}>
                            <NotificationIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 h-8 w-8 p-0 rounded-full"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <span className="sr-only">Mark as read</span>
                              <div className="h-2 w-2 rounded-full bg-clinical-600"></div>
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
