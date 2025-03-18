
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/lib/types';

const getRoleDisplay = (role: UserRole): string => {
  switch (role) {
    case 'student': return 'Student';
    case 'tutor': return 'Tutor';
    case 'nursing_head': return 'Nursing Head';
    case 'hospital_admin': return 'Hospital Administrator';
    case 'principal': return 'Principal';
    default: return 'User';
  }
};

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
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
  
  const userInitials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            <DashboardHeader title="Profile" description="View and manage your profile information" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="text-xl bg-clinical-600 text-white">{userInitials}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{getRoleDisplay(user.role)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="truncate">{user.id}</p>
                      </div>
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your profile details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <Separator className="my-2" />
                        <dl className="space-y-4 mt-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                            <dd className="mt-1 sm:mt-0 text-gray-900">{user.name}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                            <dd className="mt-1 sm:mt-0 text-gray-900">{user.email}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                            <dd className="mt-1 sm:mt-0 text-gray-900">{getRoleDisplay(user.role)}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Account Status</h3>
                        <Separator className="my-2" />
                        <div className="mt-4">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <span className="ml-2 text-gray-900">Account Active</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Your account is currently active and in good standing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
