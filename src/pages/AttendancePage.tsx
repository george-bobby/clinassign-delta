
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceReports from '@/components/attendance/AttendanceReports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';

const AttendancePage = () => {
  const { user, loading, isRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canMarkAttendance = user && (isRole('tutor') || isRole('nursing_head') || isRole('hospital_admin') || isRole('principal'));
  
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-gray-500 mt-2">
                {canMarkAttendance 
                  ? "Track, mark, and manage student attendance records" 
                  : "View your attendance records"}
              </p>
            </div>
            
            <Tabs defaultValue="records" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="records">Attendance Records</TabsTrigger>
                {canMarkAttendance && <TabsTrigger value="mark">Mark Attendance</TabsTrigger>}
                {canMarkAttendance && <TabsTrigger value="reports">Reports</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="records" className="space-y-4">
                <AttendanceFilters />
                <AttendanceTable canMark={canMarkAttendance} />
              </TabsContent>
              
              {canMarkAttendance && (
                <TabsContent value="mark" className="space-y-4">
                  <AttendanceFilters showMarkControls />
                  <AttendanceTable canMark markerView />
                </TabsContent>
              )}
              
              {canMarkAttendance && (
                <TabsContent value="reports" className="space-y-4">
                  <AttendanceReports />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
