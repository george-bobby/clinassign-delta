
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Search, 
  UserPlus,
  Clock,
  BookOpen,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  created_at: string;
}

interface Stats {
  totalStudents: number;
  totalClinicalHours: number;
  totalCaseStudies: number;
}

const StudentsPage = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalClinicalHours: 0,
    totalCaseStudies: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch students data
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          name,
          email,
          department,
          year,
          created_at
        `);

      if (studentsError) {
        throw studentsError;
      }

      setStudents(studentsData || []);
      setStats(prev => ({
        ...prev,
        totalStudents: studentsData?.length || 0
      }));

      // Fetch additional statistics from schedule_tracker table
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule_tracker')
        .select('completed_hours')
        .order('completed_hours', { ascending: false });

      if (!scheduleError && scheduleData) {
        const totalHours = scheduleData.reduce((sum, record) => sum + (record.completed_hours || 0), 0);
        setStats(prev => ({
          ...prev,
          totalClinicalHours: totalHours
        }));
      }

      // Count case studies
      const { count: caseStudiesCount, error: caseStudiesError } = await supabase
        .from('case_studies')
        .select('id', { count: 'exact', head: true });

      if (!caseStudiesError) {
        setStats(prev => ({
          ...prev,
          totalCaseStudies: caseStudiesCount || 0
        }));
      }
    } catch (error: any) {
      console.error('Error fetching students data:', error);
      setError(error.message || 'Failed to load students data');
      toast({
        title: 'Error',
        description: 'Failed to load students data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewStudent = (id: string) => {
    toast({
      title: 'View Student',
      description: 'Opening student details view...',
    });
  };

  const handleEditStudent = (id: string) => {
    toast({
      title: 'Edit Student',
      description: 'Opening student edit form...',
    });
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setStudents(students.filter(student => student.id !== id));
      
      toast({
        title: 'Student Removed',
        description: 'The student has been successfully removed from the system.',
      });

      // Refetch stats to update counts
      fetchStudents();
    } catch (error: any) {
      console.error('Error removing student:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove student. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAddStudent = () => {
    toast({
      title: 'Add Student',
      description: 'Opening form to add a new student...',
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleRefresh = () => {
    fetchStudents();
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh}>
              <Search size={16} />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleAddStudent} className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Add Student</span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">Active students in the system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Clinical Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClinicalHours}</div>
              <p className="text-xs text-gray-500 mt-1">Total clinical hours logged</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCaseStudies}</div>
              <p className="text-xs text-gray-500 mt-1">Submitted case studies</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>Manage student profiles and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading students...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No students found. Add a new student to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src="" alt={student.name || ""} />
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>Year {student.year}</TableCell>
                        <TableCell>{formatDate(student.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewStudent(student.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditStudent(student.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit student</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove student</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentsPage;
