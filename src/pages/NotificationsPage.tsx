
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, MessageSquare, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Dr. Smith',
    description: 'Regarding your upcoming clinical rotation',
    time: '10 minutes ago',
    read: false,
    icon: MessageSquare
  },
  {
    id: 2,
    type: 'schedule',
    title: 'Schedule update',
    description: 'Your rotation for next week has been updated',
    time: '2 hours ago',
    read: false,
    icon: Calendar
  },
  {
    id: 3,
    type: 'assignment',
    title: 'New case study assigned',
    description: 'Pediatric care case study has been assigned to you',
    time: '1 day ago',
    read: true,
    icon: BookOpen
  },
  {
    id: 4,
    type: 'alert',
    title: 'Attendance warning',
    description: 'You have missed 2 scheduled sessions',
    time: '2 days ago',
    read: true,
    icon: AlertTriangle
  },
  {
    id: 5,
    type: 'success',
    title: 'Case study reviewed',
    description: 'Your recent case study was reviewed with good feedback',
    time: '4 days ago',
    read: true,
    icon: CheckCircle2
  }
];

const NotificationsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(mockNotifications);
  
  // Show loading state
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
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'bg-blue-100 text-blue-600';
      case 'schedule': return 'bg-purple-100 text-purple-600';
      case 'assignment': return 'bg-amber-100 text-amber-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'success': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            <DashboardHeader title="Notifications" description="Manage your notifications and alerts" />
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-clinical-600" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-clinical-600 px-2 py-0.5 text-xs text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Stay updated with your latest activities
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll}>
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
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex items-start p-3 rounded-lg transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50`}
                      >
                        <div className={`p-2 rounded-full mr-3 ${getNotificationColor(notification.type)}`}>
                          <notification.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
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
                    ))}
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
