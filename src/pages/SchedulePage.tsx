
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDetailedScheduleSlots } from '@/lib/mock-data';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import { format, isSameDay, addDays, addMonths, isBefore, isAfter } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Download, FileText, Filter, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScheduleBookingDialog from '@/components/schedule/ScheduleBookingDialog';
import { ScheduleSlot } from '@/lib/types';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SchedulePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<'week' | 'month'>('week');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  // Get date range based on selection (week or month)
  const getDateRange = () => {
    if (!date) return [];
    
    const dates = [];
    const endDate = selectedDateRange === 'week' ? addDays(date, 6) : addMonths(date, 1);
    
    let currentDate = new Date(date);
    while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };
  
  // Navigate to previous/next period (week or month)
  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (!date) return;
    
    const days = selectedDateRange === 'week' ? 7 : 30;
    const newDate = direction === 'prev' 
      ? addDays(date, -days) 
      : addDays(date, days);
      
    setDate(newDate);
  };
  
  // Filter schedule slots based on selected date, date range, and department
  const filteredSlots = mockDetailedScheduleSlots.filter(slot => {
    const slotDate = new Date(slot.date);
    
    // For week/month view, check if the date is within the range
    const dateMatch = date
      ? selectedDateRange === 'week' || selectedDateRange === 'month'
        ? getDateRange().some(d => isSameDay(slotDate, d))
        : isSameDay(slotDate, date)
      : true;
    
    // If 'all' is selected for department, show all departments
    const departmentMatch = selectedDepartment === 'all' || slot.department_id === selectedDepartment;
    
    return dateMatch && departmentMatch;
  });

  // Handle booking a slot
  const handleBookSlot = (slotId: string) => {
    console.log(`Booking slot ${slotId}`);
    // In a real app, this would make a Supabase call
    setBookedSlots(prev => [...prev, slotId]);
    toast.success("Schedule slot booked successfully!");
  };
  
  // Handle opening the booking dialog
  const handleOpenBookingDialog = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  // Handle generating a PDF report
  const handleGeneratePDF = () => {
    toast.success("Generating PDF report...");
    // In a real app, this would generate and download a PDF
  };

  // Handle printing the schedule
  const handlePrintSchedule = () => {
    toast.success("Preparing schedule for printing...");
    window.print();
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
      <div className="container mx-auto py-6 space-y-6 print:py-2 print:space-y-2">
        <div className="flex justify-between items-center print:hidden">
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleGeneratePDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handlePrintSchedule}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Schedule
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 print:grid-cols-1">
          <Card className="md:col-span-1 print:hidden">
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
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex justify-between items-center mt-2 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDateRange('week')}
                    className={selectedDateRange === 'week' ? 'bg-clinical-100' : ''}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDateRange('month')}
                    className={selectedDateRange === 'month' ? 'bg-clinical-100' : ''}
                  >
                    Monthly
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigatePeriod('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {date && (
                      selectedDateRange === 'week'
                        ? `Week of ${format(date, 'MMM d, yyyy')}`
                        : `${format(date, 'MMMM yyyy')}`
                    )}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigatePeriod('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
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
                <CardHeader className="print:py-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>
                      {date ? (
                        selectedDateRange === 'week'
                          ? `Schedule for Week of ${format(date, 'MMMM d, yyyy')}`
                          : `Schedule for ${format(date, 'MMMM yyyy')}`
                      ) : (
                        'All Scheduled Slots'
                      )}
                    </span>
                    <span className="text-sm text-gray-500 font-normal print:hidden">
                      {filteredSlots.length} {filteredSlots.length === 1 ? 'slot' : 'slots'} found
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="print:pt-0">
                  {filteredSlots.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4 print:grid-cols-3 print:gap-2">
                      {filteredSlots.map(slot => (
                        <div key={slot.id} onClick={() => handleOpenBookingDialog(slot)} className="cursor-pointer">
                          <ScheduleCard 
                            slot={slot}
                            isBooked={bookedSlots.includes(slot.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 print:py-4">
                      <p className="text-gray-500">No schedule slots found for the selected filters.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 print:hidden"
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
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Schedule List</span>
                    <span className="text-sm text-gray-500 font-normal">
                      {filteredSlots.length} {filteredSlots.length === 1 ? 'slot' : 'slots'} found
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSlots.length > 0 ? (
                      filteredSlots.map(slot => (
                        <div 
                          key={slot.id} 
                          className="p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleOpenBookingDialog(slot)}
                        >
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
                              <Badge variant={slot.booked_count >= slot.capacity ? "destructive" : "outline"} className="ml-2 mt-1">
                                {slot.booked_count}/{slot.capacity} booked
                              </Badge>
                              {bookedSlots.includes(slot.id) && (
                                <Badge variant="secondary" className="ml-2 mt-1">
                                  You booked this slot
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening the dialog
                              handleBookSlot(slot.id);
                            }}
                            disabled={slot.booked_count >= slot.capacity || bookedSlots.includes(slot.id)}
                            variant="outline"
                            className="ml-4"
                          >
                            {bookedSlots.includes(slot.id) ? "Booked" : slot.booked_count >= slot.capacity ? "Full" : "Book Slot"}
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
      
      {/* Booking Dialog */}
      <ScheduleBookingDialog 
        slot={selectedSlot} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onBook={handleBookSlot}
      />
    </Layout>
  );
};

export default SchedulePage;
