
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage: React.FC = () => {
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
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-slide-in">
            <DashboardHeader title="Settings" description="Manage your account settings and preferences" />
            
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="bg-muted">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <Separator className="my-2" />
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <input 
                              id="name" 
                              type="text" 
                              className="w-full p-2 border rounded" 
                              value={user.name}
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <input 
                              id="email" 
                              type="email" 
                              className="w-full p-2 border rounded" 
                              value={user.email}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Privacy Settings</h3>
                      <Separator className="my-2" />
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-profile">Show my profile to others</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow other users to view your profile information
                            </p>
                          </div>
                          <Switch id="show-profile" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="activity-tracking">Activity tracking</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow tracking of your activity for better recommendations
                            </p>
                          </div>
                          <Switch id="activity-tracking" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <Separator className="my-2" />
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="new-messages">New messages</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications when you get new messages
                            </p>
                          </div>
                          <Switch id="new-messages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="schedule-updates">Schedule updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about schedule changes
                            </p>
                          </div>
                          <Switch id="schedule-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="system-updates">System updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive important system announcements
                            </p>
                          </div>
                          <Switch id="system-updates" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Theme</h3>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer bg-white shadow-sm">
                          <div className="w-full h-24 bg-white border rounded mb-2"></div>
                          <span>Light</span>
                        </div>
                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer">
                          <div className="w-full h-24 bg-gray-900 border rounded mb-2"></div>
                          <span>Dark</span>
                        </div>
                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer">
                          <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 border rounded mb-2"></div>
                          <span>System</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <Separator className="my-2" />
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <input 
                            id="current-password" 
                            type="password" 
                            className="w-full p-2 border rounded" 
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <input 
                            id="new-password" 
                            type="password" 
                            className="w-full p-2 border rounded" 
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <input 
                            id="confirm-password" 
                            type="password" 
                            className="w-full p-2 border rounded" 
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="font-medium">Enable two-factor authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="two-factor" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
