
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Book, Calendar, GraduationCap, Users } from 'lucide-react';

const TutorDashboard: React.FC = () => {
  return (
    <div>
      <DashboardHeader
        title="Tutor Dashboard"
        description="Manage your students and review case studies"
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assigned Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">Across 3 departments</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Case Reviews</CardTitle>
            <Book className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500 mt-1">Pending your review</p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-clinical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled this week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Pending Case Reviews</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-clinical-100 text-clinical-700">
                        {`S${item}`}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {["Respiratory Assessment", "Wound Care Protocol", "Patient Interview Techniques"][item - 1]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {["John Doe", "Jane Smith", "Alex Johnson"][item - 1]} • {["Emergency", "Surgery", "Pediatrics"][item - 1]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-clinical-100 text-clinical-800">
                    Awaiting Review
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="default" size="sm" className="bg-clinical-600 hover:bg-clinical-700">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">My Students</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="bg-clinical-100 text-clinical-700">
                      {`S${item}`}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {["John Doe", "Jane Smith", "Alex Johnson", "Emily Wilson"][item - 1]}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Year {[3, 2, 3, 4][item - 1]} • {["Emergency", "Pediatrics", "Surgery", "Oncology"][item - 1]}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-1.5 rounded-full bg-clinical-500"
                          style={{ width: `${[80, 65, 90, 45][item - 1]}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {[80, 65, 90, 45][item - 1]}% complete
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
