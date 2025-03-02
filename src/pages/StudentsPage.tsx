
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockStudents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  UserPlus,
  Clock,
  BookOpen,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
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

const StudentsPage = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(mockStudents);
  
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

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: 'Student Removed',
      description: 'The student has been successfully removed from the system.',
    });
  };

  const handleAddStudent = () => {
    toast({
      title: 'Add Student',
      description: 'Opening form to add a new student...',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={16} />
              <span>Search</span>
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
              <div className="text-2xl font-bold">{students.length}</div>
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
              <div className="text-2xl font-bold">532</div>
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
              <div className="text-2xl font-bold">24</div>
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
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={student.avatar_url || ""} alt={student.name || ""} />
                        <AvatarFallback>{student.name?.slice(0, 2).toUpperCase() || "ST"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{format(parseISO(student.created_at), 'MMM d, yyyy')}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentsPage;
