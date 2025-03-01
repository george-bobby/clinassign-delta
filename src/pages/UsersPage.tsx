
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Mail, 
  User,
  GraduationCap,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { UserRole } from '@/lib/types';

// Mock user data
const mockUsers = [
  { 
    id: '1', 
    name: 'Dr. Sophia Williams', 
    email: 'principal@university.edu', 
    role: 'principal' as UserRole, 
    department: null,
    status: 'active',
    avatar: null
  },
  { 
    id: '2', 
    name: 'Dr. Rajesh Kumar', 
    email: 'rajesh.kumar@university.edu', 
    role: 'nursing_head' as UserRole, 
    department: 'General Medicine',
    status: 'active',
    avatar: null
  },
  { 
    id: '3', 
    name: 'Dr. Emily Carter', 
    email: 'emily.carter@university.edu', 
    role: 'nursing_head' as UserRole, 
    department: 'ICU',
    status: 'active',
    avatar: null
  },
  { 
    id: '4', 
    name: 'Prof. Alan Smith', 
    email: 'alan.smith@university.edu', 
    role: 'tutor' as UserRole, 
    department: 'General Medicine',
    status: 'active',
    avatar: null
  },
  { 
    id: '5', 
    name: 'Prof. Susan Lee', 
    email: 'susan.lee@university.edu', 
    role: 'tutor' as UserRole, 
    department: 'Cardiology',
    status: 'inactive',
    avatar: null
  },
  { 
    id: '6', 
    name: 'Michael Admin', 
    email: 'admin@xyzhospital.com', 
    role: 'hospital_admin' as UserRole, 
    department: null,
    status: 'active',
    avatar: null
  },
  { 
    id: '7', 
    name: 'John Doe', 
    email: 'john.doe@university.edu', 
    role: 'student' as UserRole, 
    department: 'General Medicine',
    status: 'active',
    avatar: null
  },
  { 
    id: '8', 
    name: 'Alice Brown', 
    email: 'alice.brown@university.edu', 
    role: 'student' as UserRole, 
    department: 'Cardiology',
    status: 'active',
    avatar: null
  },
  { 
    id: '9', 
    name: 'Robert Wilson', 
    email: 'robert.wilson@university.edu', 
    role: 'student' as UserRole, 
    department: 'Pediatrics',
    status: 'active',
    avatar: null
  },
  { 
    id: '10', 
    name: 'Emily Clark', 
    email: 'emily.clark@university.edu', 
    role: 'student' as UserRole, 
    department: 'Neurology',
    status: 'inactive',
    avatar: null
  },
];

// Mock departments
const mockDepartments = [
  'General Medicine',
  'Surgery',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'ICU',
  'Emergency'
];

interface UserItemProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string | null;
    status: string;
    avatar: string | null;
  };
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete }) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Get role display name
  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'principal': return 'Principal';
      case 'nursing_head': return 'Nursing Head';
      case 'tutor': return 'Tutor';
      case 'hospital_admin': return 'Hospital Admin';
      case 'student': return 'Student';
      default: return role;
    }
  };
  
  // Get role color
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'principal': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'nursing_head': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'tutor': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'hospital_admin': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'student': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {user.department && (
          <Badge variant="outline" className="bg-gray-50 text-gray-800">
            {user.department}
          </Badge>
        )}
        
        <Badge className={getRoleColor(user.role)}>
          {getRoleDisplay(user.role)}
        </Badge>
        
        <Badge variant="outline" className={user.status === 'active' 
          ? 'bg-green-50 text-green-700 border-green-200' 
          : 'bg-red-50 text-red-700 border-red-200'
        }>
          {user.status === 'active' ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Inactive
            </>
          )}
        </Badge>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(user.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(user.id)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Filter users based on filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesDepartment = !selectedDepartment || user.department === selectedDepartment;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });
  
  // Group users by role for tabs
  const usersByRole = {
    all: filteredUsers,
    principal: filteredUsers.filter(u => u.role === 'principal'),
    nursing_head: filteredUsers.filter(u => u.role === 'nursing_head'),
    tutor: filteredUsers.filter(u => u.role === 'tutor'),
    hospital_admin: filteredUsers.filter(u => u.role === 'hospital_admin'),
    student: filteredUsers.filter(u => u.role === 'student'),
  };
  
  // Handle edit user
  const handleEditUser = (userId: string) => {
    toast.info(`Edit user functionality will be implemented soon. (User ID: ${userId})`);
  };
  
  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };
  
  // Confirm delete user
  const confirmDeleteUser = () => {
    if (userToDelete) {
      toast.success(`User deleted successfully.`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedStatus('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">User Management</h1>
              
              <Button onClick={() => toast.info("Add user feature will be implemented soon")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter users by role, department, or status</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="search" className="text-sm font-medium block mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="search"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Role
                    </label>
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="nursing_head">Nursing Head</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                        <SelectItem value="hospital_admin">Hospital Admin</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Department
                    </label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {mockDepartments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  All
                  <Badge variant="secondary" className="ml-1">{usersByRole.all.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="principal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Principal
                  <Badge variant="secondary" className="ml-1">{usersByRole.principal.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="nursing_head" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nursing Heads
                  <Badge variant="secondary" className="ml-1">{usersByRole.nursing_head.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="tutor" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Tutors
                  <Badge variant="secondary" className="ml-1">{usersByRole.tutor.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="hospital_admin" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Admins
                  <Badge variant="secondary" className="ml-1">{usersByRole.hospital_admin.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Students
                  <Badge variant="secondary" className="ml-1">{usersByRole.student.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6 space-y-4">
                {usersByRole.all.length > 0 ? (
                  usersByRole.all.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any users matching your criteria.
                    </p>
                    {(searchQuery || selectedRole || selectedDepartment || selectedStatus) && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="principal" className="mt-6 space-y-4">
                {usersByRole.principal.length > 0 ? (
                  usersByRole.principal.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No principals found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any principals matching your criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="nursing_head" className="mt-6 space-y-4">
                {usersByRole.nursing_head.length > 0 ? (
                  usersByRole.nursing_head.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No nursing heads found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any nursing heads matching your criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tutor" className="mt-6 space-y-4">
                {usersByRole.tutor.length > 0 ? (
                  usersByRole.tutor.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No tutors found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any tutors matching your criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="hospital_admin" className="mt-6 space-y-4">
                {usersByRole.hospital_admin.length > 0 ? (
                  usersByRole.hospital_admin.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No admins found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any hospital admins matching your criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="student" className="mt-6 space-y-4">
                {usersByRole.student.length > 0 ? (
                  usersByRole.student.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser} 
                      onDelete={handleDeleteUser} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No students found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We couldn't find any students matching your criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteUser}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
