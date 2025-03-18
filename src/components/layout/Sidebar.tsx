
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Calendar,
  GraduationCap,
  Home,
  Hospital,
  MessageSquare,
  Users,
  Book,
  Clock,
  User,
  Check,
  FileText,
  BarChart3,
  Building,
  BotMessageSquare
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-clinical-50 text-clinical-700 font-medium"
          : "text-slate-600 hover:bg-clinical-50 hover:text-clinical-700"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, isRole } = useAuth();
  const location = useLocation();

  // If no user, don't show sidebar
  if (!user) return null;

  // Define navigation items based on user role
  const renderNavItems = () => {
    // Common items for all roles
    const commonItems = [
      {
        to: '/dashboard',
        icon: <Home className="h-4 w-4" />,
        label: 'Dashboard'
      }
    ];

    // Role-specific items
    const roleSpecificItems = {
      student: [
        {
          to: '/schedule',
          icon: <Calendar className="h-4 w-4" />,
          label: 'Schedule'
        },
        {
          to: '/case-studies',
          icon: <Book className="h-4 w-4" />,
          label: 'Case Studies'
        },
        {
          to: '/chat',
          icon: <MessageSquare className="h-4 w-4" />,
          label: 'Chat'
        },
        {
          to: '/attendance',
          icon: <Clock className="h-4 w-4" />,
          label: 'Attendance'
        },
        {
          to: '/chatbot',
          icon: <BotMessageSquare className="h-4 w-4" />,
          label: 'Chatbot'
        }
      ],
      tutor: [
        {
          to: '/students',
          icon: <GraduationCap className="h-4 w-4" />,
          label: 'Students'
        },
        {
          to: '/review-cases',
          icon: <Book className="h-4 w-4" />,
          label: 'Review Cases'
        },
        {
          to: '/attendance',
          icon: <Clock className="h-4 w-4" />,
          label: 'Attendance'
        },
        {
          to: '/chat',
          icon: <MessageSquare className="h-4 w-4" />,
          label: 'Chat'
        },
      ],
      nursing_head: [
        {
          to: '/departments',
          icon: <Building className="h-4 w-4" />,
          label: 'Departments'
        },
        {
          to: '/tutors',
          icon: <Users className="h-4 w-4" />,
          label: 'Tutors'
        },
        {
          to: '/manage-schedule',
          icon: <Calendar className="h-4 w-4" />,
          label: 'Manage Schedule'
        },
        {
          to: '/students',
          icon: <GraduationCap className="h-4 w-4" />,
          label: 'Students'
        },
        {
          to: '/attendance',
          icon: <Clock className="h-4 w-4" />,
          label: 'Attendance'
        },
        {
          to: '/review-cases',
          icon: <Book className="h-4 w-4" />,
          label: 'Review Cases'
        },
      ],
      hospital_admin: [
        {
          to: '/departments',
          icon: <Hospital className="h-4 w-4" />,
          label: 'Departments'
        },
        {
          to: '/users',
          icon: <User className="h-4 w-4" />,
          label: 'Users'
        },
        {
          to: '/reports',
          icon: <FileText className="h-4 w-4" />,
          label: 'Reports'
        },
      ],
      principal: [
        {
          to: '/users',
          icon: <User className="h-4 w-4" />,
          label: 'Users'
        },
        {
          to: '/reports',
          icon: <BarChart3 className="h-4 w-4" />,
          label: 'Reports'
        },
      ]
    };

    let items = [...commonItems];

    // Add role-specific items
    if (user?.role && Object.keys(roleSpecificItems).includes(user.role)) {
      items = [...items, ...roleSpecificItems[user.role as keyof typeof roleSpecificItems]];
    }

    return items.map((item, index) => (
      <SidebarItem
        key={index}
        to={item.to}
        icon={item.icon}
        label={item.label}
        isActive={location.pathname === item.to}
      />
    ));
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="rounded-full bg-clinical-600 w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold text-xl">ClinAssign</span>
        </Link>
      </div>

      <div className="py-4 px-4">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-2 px-3">
            Role: {user?.role?.replace('_', ' ')}
          </p>
        </div>

        <div className="space-y-1">
          {renderNavItems()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
