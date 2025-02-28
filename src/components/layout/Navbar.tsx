
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Bell, Menu, MessageSquare, User } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
              <Button variant="ghost" size="icon" className="relative text-slate-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-clinical-500 rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="icon" className="text-slate-600">
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
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
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
