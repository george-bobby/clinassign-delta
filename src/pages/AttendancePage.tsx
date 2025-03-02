
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
import { CalendarDays } from 'lucide-react';
import { mockAttendanceData } from '@/lib/mock-attendance-data';

const AttendancePage = () => {
  const { user, loading, isRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterParams, setFilterParams] = useState({
    date: null,
    startDate: null,
    endDate: null,
    department: '',
    studentId: '',
    status: '',
  });
  const { toast } = useToast();
  const [isDataFromMock, setIsDataFromMock] = useState(false);
  
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
      setIsDataFromMock(false);
      
      // Build query based on filters
      let query = supabase.from('attendance_records').select('*');
      
      // Apply filters if they exist
      if (filterParams.date) {
        query = query.eq('date', filterParams.date);
      } else if (filterParams.startDate && filterParams.endDate) {
        // If date range is specified, use it instead of single date
        query = query
          .gte('date', filterParams.startDate)
          .lte('date', filterParams.endDate);
      } else if (filterParams.startDate) {
        query = query.gte('date', filterParams.startDate);
      } else if (filterParams.endDate) {
        query = query.lte('date', filterParams.endDate);
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
        } else {
          // If we can't find the student record, try matching by email
          if (user.email) {
            const { data: studentsByEmail } = await supabase
              .from('students')
              .select('id')
              .eq('email', user.email)
              .single();
              
            if (studentsByEmail) {
              query = query.eq('student_id', studentsByEmail.id);
            }
          }
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
          title: 'Using Mock Data',
          description: 'Failed to load attendance data from the database. Using sample data instead.',
        });
        setAttendanceData(mockAttendanceData);
        setIsDataFromMock(true);
      } else if (data && data.length > 0) {
        setAttendanceData(data);
      } else {
        // If no data is returned, check if it's due to filtering or no data at all
        const { data: checkData, error: checkError } = await supabase
          .from('attendance_records')
          .select('id')
          .limit(1);
          
        if (checkError || !checkData || checkData.length === 0) {
          // If there's no data at all, use mock data
          toast({
            title: 'Using Mock Data',
            description: 'No attendance records found in the database. Using sample data instead.',
          });
          setAttendanceData(mockAttendanceData);
          setIsDataFromMock(true);
        } else {
          // If there's data but none matches the filters
          setAttendanceData([]);
        }
      }
    } catch (error) {
      console.error('Attendance fetch error:', error);
      toast({
        title: 'Using Mock Data',
        description: 'An unexpected error occurred when loading attendance data. Using sample data instead.',
      });
      setAttendanceData(mockAttendanceData);
      setIsDataFromMock(true);
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
              
              {isDataFromMock && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                  <CalendarDays className="text-blue-500 mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Using sample data</p>
                    <p className="text-xs text-blue-600 mt-1">
                      We're currently displaying sample attendance data. Connect to Supabase to see real data.
                    </p>
                  </div>
                </div>
              )}
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
