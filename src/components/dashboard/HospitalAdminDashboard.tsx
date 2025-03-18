import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Check,
  Clock,
  GraduationCap,
  Users
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const HospitalAdminDashboard: React.FC = () => {
  return (
    <div>
      <DashboardHeader
        title="Hospital Admin Dashboard"
        description="Manage schedules and track student attendance"
      />

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Rotations</CardTitle>
            <Calendar className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled this week</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Check className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-gray-500 mt-1">Overall this month</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-gray-500 mt-1">Rotations tomorrow</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Department Occupancy</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>

        <div className="space-y-4">
          {[
            { name: "Emergency Care", occupancy: 85, capacity: 20, students: 17 },
            { name: "Pediatrics", occupancy: 60, capacity: 15, students: 9 },
            { name: "Surgery", occupancy: 90, capacity: 10, students: 9 },
            { name: "Oncology", occupancy: 40, capacity: 10, students: 4 }
          ].map((dept, index) => (
            <Card key={index} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <span className={`text-sm font-medium ${dept.occupancy > 80
                    ? 'text-amber-600'
                    : dept.occupancy > 50
                      ? 'text-clinical-600'
                      : 'text-gray-600'
                    }`}>
                    {dept.occupancy}% Full
                  </span>
                </div>

                <Progress
                  value={dept.occupancy}
                  className={`h-2 ${dept.occupancy > 80
                    ? 'bg-amber-100'
                    : dept.occupancy > 50
                      ? 'bg-clinical-100'
                      : 'bg-gray-100'
                    }`}
                  indicatorClassName={
                    dept.occupancy > 80
                      ? 'bg-amber-500'
                      : dept.occupancy > 50
                        ? 'bg-clinical-500'
                        : 'bg-gray-500'
                  }
                />

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">{dept.students} students assigned</span>
                  <span className="text-xs text-gray-500">Capacity: {dept.capacity}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tutor Overview</h2>
          <Button variant="outline" size="sm">Manage Tutors</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Dr. Smith", department: "Emergency Care", students: 8, load: 75 },
            { name: "Dr. Johnson", department: "Pediatrics", students: 6, load: 60 },
            { name: "Dr. Williams", department: "Surgery", students: 9, load: 90 },
            { name: "Dr. Brown", department: "Oncology", students: 4, load: 40 },
            { name: "Dr. Davis", department: "Cardiology", students: 7, load: 70 },
            { name: "Dr. Miller", department: "Neurology", students: 5, load: 50 }
          ].map((tutor, index) => (
            <Card key={index} className="animate-fade-in">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{tutor.department}</p>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Workload</span>
                    <span className={`text-xs font-medium ${tutor.load > 80
                      ? 'text-amber-600'
                      : tutor.load > 50
                        ? 'text-clinical-600'
                        : 'text-gray-600'
                      }`}>
                      {tutor.load}%
                    </span>
                  </div>

                  <Progress
                    value={tutor.load}
                    className={`h-1.5 ${tutor.load > 80
                      ? 'bg-amber-100'
                      : tutor.load > 50
                        ? 'bg-clinical-100'
                        : 'bg-gray-100'
                      }`}
                    indicatorClassName={
                      tutor.load > 80
                        ? 'bg-amber-500'
                        : tutor.load > 50
                          ? 'bg-clinical-500'
                          : 'bg-gray-500'
                    }
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="text-xs text-gray-500">{tutor.students} students assigned</span>
                  <Button variant="ghost" size="sm" className="text-clinical-600 hover:text-clinical-700 -mr-2">
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

export default HospitalAdminDashboard;