
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Filter, FilePdf, Printer, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import { formatDate, cn } from '@/lib/utils';
import { ScheduleSlot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock department data
const mockDepartments = [
  { id: 'dept1', name: 'Cardiology' },
  { id: 'dept2', name: 'Pediatrics' },
  { id: 'dept3', name: 'Neurology' },
  { id: 'dept4', name: 'Emergency' },
  { id: 'dept5', name: 'Surgery' },
  { id: 'dept6', name: 'Obstetrics' },
];

// Generate mock schedule data
const generateMockSchedules = () => {
  const schedules: ScheduleSlot[] = [];
  const today = new Date();
  
  // Generate 50 random schedule slots across departments and dates
  for (let i = 0; i < 50; i++) {
    const departmentIndex = Math.floor(Math.random() * mockDepartments.length);
    const department = mockDepartments[departmentIndex];
    
    // Random date within +/- 30 days
    const randomDayOffset = Math.floor(Math.random() * 60) - 30;
    const date = new Date(today);
    date.setDate(today.getDate() + randomDayOffset);
    
    // Random capacity between 3 and 10
    const capacity = Math.floor(Math.random() * 8) + 3;
    
    // Random booked count between 0 and capacity
    const booked_count = Math.floor(Math.random() * (capacity + 1));
    
    // Generate random start time between 8 AM and 5 PM
    const startHour = Math.floor(Math.random() * 10) + 8;
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    
    // End time is start time + 2-4 hours
    const durationHours = Math.floor(Math.random() * 3) + 2;
    const endHour = startHour + durationHours;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    
    schedules.push({
      id: `schedule-${i}`,
      department_id: department.id,
      department: department,
      date: format(date, 'yyyy-MM-dd'),
      start_time: startTime,
      end_time: endTime,
      capacity,
      booked_count,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return schedules;
};

const SchedulePage: React.FC = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<string>('calendar');
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load mock data
  useEffect(() => {
    const mockData = generateMockSchedules();
    setSchedules(mockData);
    filterSchedules(mockData, selectedDepartment, selectedDate);
  }, []);
  
  // Filter schedules based on selected department and date
  const filterSchedules = (
    data: ScheduleSlot[],
    department: string,
    date?: Date
  ) => {
    let filtered = [...data];
    
    // Filter by department
    if (department !== 'all') {
      filtered = filtered.filter(slot => slot.department_id === department);
    }
    
    // Filter by date
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      filtered = filtered.filter(slot => slot.date === dateStr);
    }
    
    setFilteredSchedules(filtered);
  };
  
  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    filterSchedules(schedules, value, selectedDate);
  };
  
  // Handle date change
  const handleDateChange = (date?: Date) => {
    setSelectedDate(date);
    filterSchedules(schedules, selectedDepartment, date);
  };
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Handle booking a slot
  const handleBookSlot = (slotId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Find the slot and update its booked count
      const updatedSchedules = schedules.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            booked_count: slot.booked_count + 1
          };
        }
        return slot;
      });
      
      setSchedules(updatedSchedules);
      setBookedSlots([...bookedSlots, slotId]);
      
      // Update filtered schedules
      filterSchedules(updatedSchedules, selectedDepartment, selectedDate);
      
      setIsDialogOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Slot Booked",
        description: "You have successfully booked this time slot.",
      });
    }, 1000);
  };
  
  // Handle slot click
  const handleSlotClick = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };
  
  // Handle printing the schedule
  const handlePrint = () => {
    window.print();
  };
  
  // Handle exporting to PDF
  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF is being generated and will download shortly.",
    });
    
    // Simulate PDF generation delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your schedule has been exported to PDF.",
      });
    }, 2000);
  };
  
  // Get schedules for a specific day
  const getDaySchedules = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return schedules.filter(slot => slot.date === dateStr);
  };
  
  // Calculate calendar days
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Schedule Management</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FilePdf className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate.toISOString()) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">View</label>
              <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const daySchedules = getDaySchedules(day);
                  const hasSchedules = daySchedules.length > 0;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[100px] p-2 border rounded-md",
                        hasSchedules ? "hover:bg-gray-50 cursor-pointer" : "",
                        isSameDay(day, selectedDate || new Date()) && "bg-blue-50 border-blue-200"
                      )}
                      onClick={() => handleDateChange(day)}
                    >
                      <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                      {hasSchedules && (
                        <div className="space-y-1">
                          {daySchedules.slice(0, 2).map((slot) => (
                            <div
                              key={slot.id}
                              className={cn(
                                "text-xs p-1 rounded-sm",
                                bookedSlots.includes(slot.id)
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              )}
                            >
                              {slot.department?.name.substring(0, 10)}{slot.department?.name.length > 10 ? '...' : ''} - {slot.start_time}
                            </div>
                          ))}
                          {daySchedules.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{daySchedules.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSchedules.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No slots available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your filters or selecting a different date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSchedules.map((slot) => (
                    <ScheduleCard
                      key={slot.id}
                      slot={slot}
                      isBooked={bookedSlots.includes(slot.id)}
                      onClick={() => handleSlotClick(slot)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Schedule Slot</DialogTitle>
            <DialogDescription>
              Review the details below and confirm your booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Department:</span>
                <span>{selectedSlot.department?.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(selectedSlot.date)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Time:</span>
                <span>{selectedSlot.start_time} - {selectedSlot.end_time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Availability:</span>
                <Badge variant={bookedSlots.includes(selectedSlot.id) ? "outline" : selectedSlot.capacity - selectedSlot.booked_count > 0 ? "default" : "secondary"}>
                  {bookedSlots.includes(selectedSlot.id)
                    ? "Already Booked"
                    : selectedSlot.capacity - selectedSlot.booked_count > 0
                      ? `${selectedSlot.capacity - selectedSlot.booked_count} spots available`
                      : "Full"}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedSlot && handleBookSlot(selectedSlot.id)}
              disabled={!selectedSlot || bookedSlots.includes(selectedSlot.id) || (selectedSlot.capacity - selectedSlot.booked_count <= 0) || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
