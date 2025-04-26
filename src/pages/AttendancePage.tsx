
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AttendanceMarkButton } from '@/components/attendance/AttendanceMarkButton';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
}

interface AttendanceRecord {
  id: string;
  student_id: string;
  status: 'present' | 'absent' | 'late';
  date: string;
  marked_by: string;
  marker_role: string;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load students.',
        variant: 'destructive',
      });
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', today);

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendance records.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  const handleAttendanceMarked = () => {
    fetchTodayAttendance();
  };

  const getStudentAttendanceStatus = (studentId: string) => {
    return attendanceRecords.find(record => record.student_id === studentId)?.status || null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const currentStatus = getStudentAttendanceStatus(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>Year {student.year}</TableCell>
                      <TableCell>
                        {currentStatus ? (
                          <span className={`capitalize font-medium ${
                            currentStatus === 'present' ? 'text-green-600' :
                            currentStatus === 'late' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {currentStatus}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!currentStatus && (
                          <div className="flex justify-end gap-2">
                            <AttendanceMarkButton
                              studentId={student.id}
                              studentName={student.name}
                              department={student.department}
                              status="present"
                              onSuccess={handleAttendanceMarked}
                            />
                            <AttendanceMarkButton
                              studentId={student.id}
                              studentName={student.name}
                              department={student.department}
                              status="late"
                              onSuccess={handleAttendanceMarked}
                            />
                            <AttendanceMarkButton
                              studentId={student.id}
                              studentName={student.name}
                              department={student.department}
                              status="absent"
                              onSuccess={handleAttendanceMarked}
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
