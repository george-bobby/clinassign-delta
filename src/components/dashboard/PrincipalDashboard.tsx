
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, GraduationCap, Users, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PrincipalDashboard: React.FC = () => {
  return (
    <div>
      <DashboardHeader
        title="Principal Dashboard"
        description="Overview of the clinical assignment system"
      />
      
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hospital Partners</CardTitle>
            <Hospital className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1">Active partnerships</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-500 mt-1">Enrolled in clinical rotations</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-gray-500 mt-1">Tutors and administrators</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">New messages today</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Hospital Partnerships</h2>
          <Button variant="outline" size="sm">Manage Partnerships</Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Memorial Hospital", departments: 8, students: 62, satisfaction: 92 },
            { name: "City Medical Center", departments: 6, students: 45, satisfaction: 88 },
            { name: "University Hospital", departments: 10, students: 35, satisfaction: 95 },
            { name: "Children's Medical", departments: 4, students: 25, satisfaction: 90 },
            { name: "Regional Health Center", departments: 5, students: 15, satisfaction: 85 }
          ].map((hospital, index) => (
            <Card key={index} className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Departments:</span>
                    <span className="font-medium">{hospital.departments}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students Placed:</span>
                    <span className="font-medium">{hospital.students}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Satisfaction Rate</span>
                      <span className="text-xs font-medium text-clinical-700">
                        {hospital.satisfaction}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={hospital.satisfaction} 
                      className="h-1.5 bg-clinical-100"
                      indicatorClassName="bg-clinical-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-clinical-600 hover:text-clinical-700"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">System Performance</h2>
          <Button variant="outline" size="sm">View Reports</Button>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <Card className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">System Overview</h3>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Student Placement Rate</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-clinical-700">94%</span>
                      <span className="text-xs text-green-600">+2.5% from last semester</span>
                    </div>
                    <Progress value={94} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Rotation Completion</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-clinical-700">88%</span>
                      <span className="text-xs text-green-600">+1.2% from last semester</span>
                    </div>
                    <Progress value={88} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Case Study Submission</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-clinical-700">76%</span>
                      <span className="text-xs text-amber-600">-3.1% from last semester</span>
                    </div>
                    <Progress value={76} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="animate-fade-in">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Department Distribution</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Emergency Care", percentage: 24 },
                      { name: "Pediatrics", percentage: 18 },
                      { name: "Surgery", percentage: 15 },
                      { name: "Oncology", percentage: 12 },
                      { name: "Cardiology", percentage: 11 }
                    ].map((dept, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">{dept.name}</span>
                          <span className="text-xs font-medium text-gray-700">{dept.percentage}%</span>
                        </div>
                        <Progress 
                          value={dept.percentage} 
                          className="h-1.5 bg-gray-100"
                          indicatorClassName="bg-clinical-500"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  
                  <div className="space-y-4">
                    {[
                      { action: "New hospital partnership established", time: "2 days ago" },
                      { action: "25 new students enrolled in rotations", time: "1 week ago" },
                      { action: "System update: Added case study templates", time: "2 weeks ago" },
                      { action: "Quarterly review meeting", time: "3 weeks ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-clinical-500"></div>
                        <div>
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <Card className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Student Performance Overview</h3>
                
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Attendance Rate</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">92%</span>
                      </div>
                      <Progress value={92} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Case Study Quality</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">85%</span>
                      </div>
                      <Progress value={85} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Tutor Evaluations</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">88%</span>
                      </div>
                      <Progress value={88} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                  </div>
                  
                  <Button className="bg-clinical-600 hover:bg-clinical-700">
                    View Detailed Student Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff">
            <Card className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Staff Performance Overview</h3>
                
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Case Review Rate</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">89%</span>
                      </div>
                      <Progress value={89} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Student Feedback</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">91%</span>
                      </div>
                      <Progress value={91} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Response Time</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">82%</span>
                      </div>
                      <Progress value={82} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                  </div>
                  
                  <Button className="bg-clinical-600 hover:bg-clinical-700">
                    View Staff Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hospitals">
            <Card className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Hospital Partnership Overview</h3>
                
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Student Placement</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">96%</span>
                      </div>
                      <Progress value={96} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Hospital Satisfaction</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">90%</span>
                      </div>
                      <Progress value={90} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Department Utilization</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-clinical-700">87%</span>
                      </div>
                      <Progress value={87} className="h-1.5 bg-clinical-100" indicatorClassName="bg-clinical-500" />
                    </div>
                  </div>
                  
                  <Button className="bg-clinical-600 hover:bg-clinical-700">
                    View Hospital Relationships
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
