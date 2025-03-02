
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockTutors } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  UserPlus,
  BarChart,
  BookOpen,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck
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

const TutorsPage = () => {
  const { toast } = useToast();
  const [tutors, setTutors] = useState(mockTutors);
  
  const handleViewTutor = (id: string) => {
    toast({
      title: 'View Tutor',
      description: 'Opening tutor details view...',
    });
  };

  const handleEditTutor = (id: string) => {
    toast({
      title: 'Edit Tutor',
      description: 'Opening tutor edit form...',
    });
  };

  const handleDeleteTutor = (id: string) => {
    setTutors(tutors.filter(tutor => tutor.id !== id));
    toast({
      title: 'Tutor Removed',
      description: 'The tutor has been successfully removed from the system.',
    });
  };

  const handleAddTutor = () => {
    toast({
      title: 'Add Tutor',
      description: 'Opening form to add a new tutor...',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tutors Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={16} />
              <span>Search</span>
            </Button>
            <Button onClick={handleAddTutor} className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Add Tutor</span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Total Tutors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tutors.length}</div>
              <p className="text-xs text-gray-500 mt-1">Active tutors in the system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="mr-2 h-4 w-4" />
                Student Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-gray-500 mt-1">Students currently assigned to tutors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Reviews Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-gray-500 mt-1">Case studies waiting for review</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tutors</CardTitle>
            <CardDescription>Manage tutors and their student assignments</CardDescription>
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
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={tutor.avatar_url || ""} alt={tutor.name || ""} />
                        <AvatarFallback>{tutor.name?.slice(0, 2).toUpperCase() || "TU"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>
                      {Math.floor((new Date().getTime() - new Date(tutor.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewTutor(tutor.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTutor(tutor.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit tutor</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: 'Assign Students', description: 'Opening student assignment interface...' })}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Assign students</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTutor(tutor.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove tutor</span>
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

export default TutorsPage;
