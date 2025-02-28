
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TutorDashboard from '@/components/dashboard/TutorDashboard';
import NursingHeadDashboard from '@/components/dashboard/NursingHeadDashboard';
import HospitalAdminDashboard from '@/components/dashboard/HospitalAdminDashboard';
import PrincipalDashboard from '@/components/dashboard/PrincipalDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, loading, isRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
  
  // Render dashboard based on user role
  const renderDashboard = () => {
    if (isRole('student')) return <StudentDashboard />;
    if (isRole('tutor')) return <TutorDashboard />;
    if (isRole('nursing_head')) return <NursingHeadDashboard />;
    if (isRole('hospital_admin')) return <HospitalAdminDashboard />;
    if (isRole('principal')) return <PrincipalDashboard />;
    
    // Fallback dashboard
    return <StudentDashboard />;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
