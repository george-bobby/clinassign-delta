
import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  const { user } = useAuth();
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Today</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="border-b border-gray-200"></div>
      </div>
    </div>
  );
};

export default DashboardHeader;
