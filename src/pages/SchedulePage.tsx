
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDetailedScheduleSlots } from '@/lib/mock-data';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import { format, isSameDay } from 'date-fns';
import { CalendarDays, Download, FileText, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SchedulePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  
  // Filter schedule slots based on selected date and department
  const filteredSlots = mockDetailedScheduleSlots.filter(slot => {
    // If no date is selected, show all
    const dateMatch = date ? isSameDay(new Date(slot.date), date) : true;
    
    // If 'all' is selected for department, show all departments
    const departmentMatch = selectedDepartment === 'all' || slot.department_id === selectedDepartment;
    
    return dateMatch && departmentMatch;
  });

  // Handle booking a slot
  const handleBookSlot = (slotId: string) => {
    console.log(`Booking slot ${slotId}`);
    // This would be implemented with Supabase in a real app
  };

  // Get all unique departments from the mock data
  const departments = Array.from(
    new Set(mockDetailedScheduleSlots.map(slot => slot.department_id))
  ).map(id => {
    const department = mockDetailedScheduleSlots.find(slot => slot.department_id === id)?.department;
    return {
      id,
      name: department?.name || 'Unknown'
    };
  });

  // Function to get schedule events for calendar highlighting
  const getHighlightedDays = () => {
    return mockDetailedScheduleSlots.map(slot => new Date(slot.date));
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clinical Rotation Schedule</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setView('calendar')} 
                    className={view === 'calendar' ? 'bg-clinical-100' : ''}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button variant="outline" onClick={() => setView('list')}
                    className={view === 'list' ? 'bg-clinical-100' : ''}>
              <FileText className="h-4 w-4 mr-2" />
              List View
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <div className="mt-2 border rounded-md">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{ highlighted: getHighlightedDays() }}
                    modifiersStyles={{
                      highlighted: {
                        backgroundColor: 'rgba(209, 213, 219, 0.2)',
                        fontWeight: 'bold',
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            {view === 'calendar' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {date ? (
                      <>Schedule for {format(date, 'MMMM d, yyyy')}</>
                    ) : (
                      <>All Scheduled Slots</>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredSlots.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {filteredSlots.map(slot => (
                        <ScheduleCard 
                          key={slot.id} 
                          slot={slot}
                          onBookSlot={handleBookSlot}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No schedule slots found for the selected filters.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => { setDate(undefined); setSelectedDepartment('all'); }}
                      >
                        <Filter className="h-4 w-4 mr-2" /> Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSlots.length > 0 ? (
                      filteredSlots.map(slot => (
                        <div key={slot.id} className="p-4 border rounded-md flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{slot.department?.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              <span>{format(new Date(slot.date), 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Badge variant="outline" className="mt-1">
                                {slot.start_time} - {slot.end_time}
                              </Badge>
                              <Badge variant="outline" className="ml-2 mt-1">
                                {slot.booked_count}/{slot.capacity} booked
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBookSlot(slot.id)}
                            disabled={slot.booked_count >= slot.capacity}
                            variant="outline"
                            className="ml-4"
                          >
                            {slot.booked_count >= slot.capacity ? "Full" : "Book Slot"}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No schedule slots found for the selected filters.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => { setDate(undefined); setSelectedDepartment('all'); }}
                        >
                          <Filter className="h-4 w-4 mr-2" /> Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SchedulePage;
