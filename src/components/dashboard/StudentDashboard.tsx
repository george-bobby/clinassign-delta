
import React from 'react';
import DashboardHeader from './DashboardHeader';
import ScheduleCard from './ScheduleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockScheduleSlots } from '@/lib/types';
import { Book, Calendar, Clock, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard: React.FC = () => {
  const { toast } = useToast();
  
  const upcomingSlots = mockScheduleSlots.slice(0, 3);
  
  const handleBookSlot = (slotId: string) => {
    toast({
      title: 'Slot Booked',
      description: 'You have successfully booked this rotation slot.',
    });
  };
  
  return (
    <div>
      <DashboardHeader
        title="Student Dashboard"
        description="Track your clinical rotations and case studies"
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Rotations</CardTitle>
            <Calendar className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled for this week</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
            <Book className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1">2 pending review</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Check className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-gray-500 mt-1">Overall attendance rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming Rotation Slots</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingSlots.map((slot, index) => (
            <ScheduleCard 
              key={slot.id}
              slot={slot}
              onBookSlot={handleBookSlot}
              isBooked={index === 1} // For demo: show one as already booked
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Case Studies</h2>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <Card key={item} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item === 1 ? "Respiratory Assessment" : "Wound Care Protocol"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item === 1 
                        ? "Emergency Department" 
                        : "Surgery Department"}
                    </p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-clinical-100 text-clinical-800">
                    {item === 1 ? "Submitted" : "In Progress"}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <Clock className="mr-2 h-3 w-3" />
                  <span>{item === 1 ? "Submitted on Oct 10, 2023" : "Last edited 2 days ago"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
