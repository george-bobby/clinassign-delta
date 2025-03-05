
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter, Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import { ScheduleBookingDialog } from '@/components/schedule/ScheduleBookingDialog';
import { useAuth } from '@/context/AuthContext';
import { ScheduleSlot } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Mock data for departments
const mockDepartments = [
  { id: "1", name: "Emergency Care" },
  { id: "2", name: "Pediatrics" },
  { id: "3", name: "Obstetrics" },
  { id: "4", name: "Surgery" },
  { id: "5", name: "Mental Health" }
];

// Mock schedule slots
const generateMockScheduleSlots = (): ScheduleSlot[] => {
  const slots: ScheduleSlot[] = [];
  const departments = mockDepartments;
  const currentDate = new Date();
  
  // Generate slots for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    
    // Add 2-3 slots per day across different departments
    const slotsForDay = Math.floor(Math.random() * 2) + 2;
    
    for (let j = 0; j < slotsForDay; j++) {
      const departmentIndex = Math.floor(Math.random() * departments.length);
      const startHour = 8 + Math.floor(Math.random() * 8); // Between 8am and 4pm
      const endHour = startHour + 2 + Math.floor(Math.random() * 2); // 2-3 hours duration
      
      slots.push({
        id: `slot-${i}-${j}`,
        department: departments[departmentIndex],
        date: format(date, 'yyyy-MM-dd'),
        start_time: `${startHour}:00`,
        end_time: `${endHour}:00`,
        capacity: 5 + Math.floor(Math.random() * 6), // 5-10 capacity
        booked_count: Math.floor(Math.random() * 5), // 0-4 bookings
        is_booked: Math.random() > 0.7, // 30% chance of being booked by current user
        description: `Clinical rotation at ${departments[departmentIndex].name}`
      });
    }
  }
  
  return slots;
};

const mockScheduleSlots = generateMockScheduleSlots();

const SchedulePage = () => {
  const { user, isRole } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("weekly");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [scheduleData] = useState<ScheduleSlot[]>(mockScheduleSlots);
  
  const canModifySchedule = user && (isRole('nursing_head') || isRole('hospital_admin') || isRole('principal'));
  
  const filteredSlots = scheduleData.filter(slot => {
    let match = true;
    
    // Filter by date if selected
    if (selectedDate) {
      const slotDate = new Date(slot.date);
      if (viewMode === "daily") {
        match = match && format(slotDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      } else if (viewMode === "weekly") {
        // Get start and end of week
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(selectedDate);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        match = match && 
          slotDate >= startOfWeek && 
          slotDate <= endOfWeek;
      } else if (viewMode === "monthly") {
        match = match && 
          slotDate.getMonth() === selectedDate.getMonth() && 
          slotDate.getFullYear() === selectedDate.getFullYear();
      }
    }
    
    // Filter by department if selected
    if (selectedDepartment !== "all") {
      match = match && slot.department?.name === selectedDepartment;
    }
    
    return match;
  });
  
  const handleSlotClick = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setBookingDialogOpen(true);
  };

  const handleBookSlot = async (slotId: string) => {
    console.log("Booking slot:", slotId);
    // Simulate booking success
    setBookingDialogOpen(false);
    setTimeout(() => {
      alert("Slot booked successfully!");
    }, 500);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const handleExportPDF = () => {
    alert("Exporting PDF... (demo functionality)");
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const navigatePrevious = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (viewMode === "daily") {
        newDate.setDate(newDate.getDate() - 1);
      } else if (viewMode === "weekly") {
        newDate.setDate(newDate.getDate() - 7);
      } else if (viewMode === "monthly") {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setSelectedDate(newDate);
    }
  };
  
  const navigateNext = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (viewMode === "daily") {
        newDate.setDate(newDate.getDate() + 1);
      } else if (viewMode === "weekly") {
        newDate.setDate(newDate.getDate() + 7);
      } else if (viewMode === "monthly") {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setSelectedDate(newDate);
    }
  };
  
  const getDateRangeText = () => {
    if (!selectedDate) return "";
    
    if (viewMode === "daily") {
      return format(selectedDate, 'MMMM d, yyyy');
    } else if (viewMode === "weekly") {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(selectedDate);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
    } else if (viewMode === "monthly") {
      return format(selectedDate, 'MMMM yyyy');
    }
    
    return "";
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-500 mt-1">View and manage clinical schedules</p>
          </div>
          
          <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {mockDepartments.map(department => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <Button variant="ghost" onClick={navigatePrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <h2 className="text-xl font-semibold text-center">
              {getDateRangeText()}
            </h2>
            
            <Button variant="ghost" onClick={navigateNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              {canModifySchedule && <TabsTrigger value="manage">Manage</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              {filteredSlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSlots.map(slot => (
                    <ScheduleCard 
                      key={slot.id} 
                      slot={slot} 
                      onBookSlot={handleBookSlot}
                      isBooked={slot.is_booked}
                      onClick={() => handleSlotClick(slot)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">No schedule slots found for the selected filters.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-7 gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold">
                      {day}
                    </div>
                  ))}
                  
                  {Array(35).fill(null).map((_, index) => {
                    // Generate calendar cells
                    const cellDate = new Date(selectedDate || new Date());
                    const startOfMonth = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
                    const startOffset = startOfMonth.getDay();
                    
                    cellDate.setDate(1 - startOffset + index);
                    
                    const isCurrentMonth = cellDate.getMonth() === (selectedDate?.getMonth() || new Date().getMonth());
                    const isToday = new Date().toDateString() === cellDate.toDateString();
                    
                    // Find slots for this date
                    const slotsForDate = scheduleData.filter(slot => {
                      const slotDate = new Date(slot.date);
                      return slotDate.toDateString() === cellDate.toDateString();
                    });
                    
                    return (
                      <div 
                        key={index} 
                        className={`h-24 border rounded p-1 overflow-hidden ${
                          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                      >
                        <div className="text-right text-sm mb-1">
                          {cellDate.getDate()}
                        </div>
                        <div className="space-y-1">
                          {slotsForDate.slice(0, 2).map(slot => (
                            <div 
                              key={slot.id}
                              className="text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSlotClick(slot)}
                            >
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] ${
                                  slot.is_booked 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {slot.is_booked ? 'Booked' : `${slot.capacity - slot.booked_count} slots`}
                              </Badge>
                              <div className="truncate">{slot.department?.name}</div>
                              <div className="truncate text-gray-500">{slot.start_time}-{slot.end_time}</div>
                            </div>
                          ))}
                          {slotsForDate.length > 2 && (
                            <div className="text-xs text-gray-500 pl-1">
                              +{slotsForDate.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            {canModifySchedule && (
              <TabsContent value="manage" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500 mb-4">
                      Here you can manage, create, and modify the schedule slots.
                    </p>
                    <div className="flex justify-center">
                      <Button>Create New Schedule</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
      
      <ScheduleBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        slot={selectedSlot}
        onConfirm={handleBookSlot}
      />
    </div>
  );
};

export default SchedulePage;
