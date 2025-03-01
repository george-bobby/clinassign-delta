
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceReports from '@/components/attendance/AttendanceReports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AttendancePage = () => {
  const { user, loading, isRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterParams, setFilterParams] = useState({
    date: null,
    department: '',
    studentId: '',
    status: '',
  });
  const { toast } = useToast();
  
  const canMarkAttendance = user && (isRole('tutor') || isRole('nursing_head') || isRole('hospital_admin') || isRole('principal'));
  
  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user, filterParams]);

  useEffect(() => {
    // Set up realtime subscription for attendance records
    if (user) {
      const channel = supabase
        .channel('public:attendance_records')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'attendance_records'
        }, (payload) => {
          console.log('Realtime update:', payload);
          // Refresh data when changes occur
          fetchAttendanceData();
          
          // Show notification based on the event type
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Attendance Record',
              description: 'A new attendance record has been added.',
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Attendance Updated',
              description: 'An attendance record has been updated.',
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Attendance Deleted',
              description: 'An attendance record has been deleted.',
            });
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoadingData(true);
      
      // Build query based on filters
      let query = supabase.from('attendance_records').select('*');
      
      // Apply filters if they exist
      if (filterParams.date) {
        query = query.eq('date', filterParams.date);
      }
      
      if (filterParams.department) {
        query = query.eq('department', filterParams.department);
      }
      
      if (filterParams.status) {
        query = query.eq('status', filterParams.status);
      }
      
      // For students, only show their own records
      if (isRole('student') && user) {
        // First get the student record for this user
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (studentData) {
          query = query.eq('student_id', studentData.id);
        }
      }
      
      // If specific student filter is applied
      if (filterParams.studentId) {
        query = query.eq('student_id', filterParams.studentId);
      }
      
      // Order by date descending
      query = query.order('date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching attendance data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load attendance data.',
          variant: 'destructive',
        });
      } else {
        setAttendanceData(data || []);
      }
    } catch (error) {
      console.error('Attendance fetch error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred when loading attendance data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilterParams(prev => ({ ...prev, ...newFilters }));
  };
  
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
                <AttendanceFilters onFilterChange={handleFilterChange} />
                <AttendanceTable 
                  canMark={canMarkAttendance} 
                  data={attendanceData} 
                  isLoading={isLoadingData}
                  onDataChange={fetchAttendanceData}
                />
              </TabsContent>
              
              {canMarkAttendance && (
                <TabsContent value="mark" className="space-y-4">
                  <AttendanceFilters showMarkControls onFilterChange={handleFilterChange} />
                  <AttendanceTable 
                    canMark 
                    markerView 
                    data={attendanceData} 
                    isLoading={isLoadingData}
                    onDataChange={fetchAttendanceData}
                  />
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
