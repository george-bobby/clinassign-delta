
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Bell, Menu, MessageSquare, User, Settings } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Mock unread notifications count
  const unreadNotifications = 3;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm animate-fade-in">
      <div className="px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-clinical-600 w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">ClinAssign</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-slate-600">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-3 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => navigate('/notifications')}
                      >
                        View all
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-2">
                    <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <div className="flex gap-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New message from Dr. Smith</p>
                          <p className="text-xs text-gray-500">Regarding your upcoming clinical rotation</p>
                          <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <div className="flex gap-2">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Bell className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Schedule update</p>
                          <p className="text-xs text-gray-500">Your rotation for next week has been updated</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      onClick={() => navigate('/notifications')}
                    >
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-600"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 font-normal">
                    <div className="w-8 h-8 rounded-full bg-clinical-100 text-clinical-800 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden md:inline-block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/notifications')}>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-clinical-600"
              >
                Log in
              </Button>
              <Button 
                variant="default" 
                onClick={() => navigate('/')}
                className="bg-clinical-600 hover:bg-clinical-700"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
