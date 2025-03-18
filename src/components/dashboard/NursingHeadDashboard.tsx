import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Hospital, GraduationCap, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NursingHeadDashboard: React.FC = () => {
  return (
    <div>
      <DashboardHeader
        title="Nursing Head Dashboard"
        description="Manage departments, tutors, and student rotations"
      />

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Hospital className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500 mt-1">Active departments</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tutors</CardTitle>
            <Users className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Managing rotations</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-gray-500 mt-1">Assigned to rotations</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500 mt-1">Active rotations</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Rotations</h2>
          <Button variant="outline" size="sm">Mark All Present</Button>
        </div>

        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="morning">Morning (8AM-12PM)</TabsTrigger>
            <TabsTrigger value="afternoon">Afternoon (1PM-5PM)</TabsTrigger>
            <TabsTrigger value="evening">Evening (6PM-10PM)</TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-fade-in">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-clinical-100 text-clinical-700">
                          {`S${item}`}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {["John Doe", "Jane Smith", "Alex Johnson"][item - 1]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {["Emergency Care", "Pediatrics", "Surgery"][item - 1]} • 8:00 AM - 12:00 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        Absent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Late
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      >
                        Present
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="afternoon" className="space-y-4">
            {[1, 2].map((item) => (
              <Card key={item} className="animate-fade-in">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-clinical-100 text-clinical-700">
                          {`S${item + 3}`}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {["Emily Wilson", "Michael Brown"][item - 1]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {["Oncology", "Emergency Care"][item - 1]} • 1:00 PM - 5:00 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        Absent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Late
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      >
                        Present
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="evening">
            <div className="p-8 text-center">
              <p className="text-gray-500">No rotations scheduled for evening slots today.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Department Status</h2>
          <Button variant="outline" size="sm">Manage Schedules</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Emergency Care", slots: 5, students: 12, status: "Active" },
            { name: "Pediatrics", slots: 3, students: 8, status: "Active" },
            { name: "Surgery", slots: 2, students: 6, status: "Full" },
            { name: "Oncology", slots: 4, students: 4, status: "Available" }
          ].map((dept, index) => (
            <Card key={index} className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900">{dept.name}</h3>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rotation Slots:</span>
                    <span className="font-medium">{dept.slots}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students Today:</span>
                    <span className="font-medium">{dept.students}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === "Full"
                    ? "bg-amber-100 text-amber-800"
                    : dept.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-clinical-100 text-clinical-800"
                    }`}>
                    {dept.status}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-clinical-600 hover:text-clinical-700"
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NursingHeadDashboard;