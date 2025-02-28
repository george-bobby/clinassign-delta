
import React, { useEffect, useState } from 'react';
import { useScheduling } from '@/hooks/use-scheduling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Booking, Department } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { 
  BadgeCheckIcon, 
  CheckIcon, 
  ClockIcon, 
  FileTextIcon, 
  Loader2, 
  UserIcon, 
  XIcon 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ScheduleGenerator from './ScheduleGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingApprovalCard: React.FC<{
  booking: Booking;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onMarkComplete: (id: string, hours: number) => Promise<void>;
  isLoading: boolean;
}> = ({ booking, onApprove, onReject, onMarkComplete, isLoading }) => {
  const [hours, setHours] = useState<number>(6); // Default 6 hours per slot
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);
  
  const handleComplete = async () => {
    await onMarkComplete(booking.id, hours);
    setShowCompleteDialog(false);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${
        booking.status === 'pending' ? 'bg-yellow-500' : 
        booking.status === 'approved' ? 'bg-green-500' : 
        booking.status === 'rejected' ? 'bg-red-500' : 
        'bg-blue-500'
      }`} />
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-semibold text-lg">
              {booking.slot?.department?.name || 'Unknown Department'}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>
                  {booking.slot ? `${formatDate(booking.slot.date)} (${booking.slot.start_time} - ${booking.slot.end_time})` : 'Unknown date/time'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{booking.student?.name || 'Unknown Student'}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  booking.status === 'pending' ? 'bg-yellow-500' : 
                  booking.status === 'approved' ? 'bg-green-500' : 
                  booking.status === 'rejected' ? 'bg-red-500' : 
                  'bg-blue-500'
                } text-white`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              {booking.status === 'completed' && (
                <div className="mt-1 text-sm">
                  <span className="font-medium">Hours logged: </span>
                  {booking.hours_logged}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {booking.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(booking.id)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4 mr-1" />}
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onReject(booking.id)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XIcon className="h-4 w-4 mr-1" />}
                  Reject
                </Button>
              </>
            )}
            
            {booking.status === 'approved' && (
              <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Clinical Hours</DialogTitle>
                    <DialogDescription>
                      Enter the number of hours the student has completed for this clinical rotation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label htmlFor="hours" className="block text-sm font-medium mb-2">
                      Hours Completed
                    </label>
                    <Input
                      id="hours"
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(parseFloat(e.target.value))}
                      min="1"
                      max="12"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Log Hours
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const {
    isLoading,
    departments,
    fetchDepartments,
    userBookings,
    fetchUserBookings,
    approveBooking,
    rejectBooking,
    markAsCompleted
  } = useScheduling();
  
  useEffect(() => {
    fetchDepartments();
    // We need to adapt here since fetchBookings doesn't exist
    // Instead we'll use a temporary approach to fetch all bookings
    fetchAllBookings();
  }, []);
  
  // Temporary function to fetch all bookings since we don't have fetchBookings
  const fetchAllBookings = async () => {
    // In a real implementation, this would fetch all bookings
    // For now, we'll use the userBookings as a substitute
    // You would need to implement a proper fetchAllBookings function in use-scheduling.ts
    console.log("Fetching all bookings...");
    // Simulate data for now
    setBookings([]); 
  };
  
  const handleApproveBooking = async (bookingId: string) => {
    await approveBooking(bookingId);
    await fetchAllBookings(); // Refresh bookings
  };
  
  const handleRejectBooking = async (bookingId: string) => {
    await rejectBooking(bookingId);
    await fetchAllBookings(); // Refresh bookings
  };
  
  const handleMarkComplete = async (bookingId: string, hours: number) => {
    await markAsCompleted(bookingId, hours);
    await fetchAllBookings(); // Refresh bookings
  };
  
  // Filter bookings by department if selected
  const filteredBookings = selectedDepartment 
    ? bookings.filter(b => b.slot?.department_id === selectedDepartment)
    : bookings;
  
  // Filter bookings by status for different tabs
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const approvedBookings = filteredBookings.filter(b => b.status === 'approved');
  const completedBookings = filteredBookings.filter(b => b.status === 'completed');
  const rejectedBookings = filteredBookings.filter(b => b.status === 'rejected');
  
  return (
    <div className="space-y-8">
      <ScheduleGenerator />
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Clinical Rotations</CardTitle>
          <CardDescription>
            Review, approve, and manage student clinical rotation bookings
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <label htmlFor="department-filter" className="block text-sm font-medium mb-2">
              Filter by Department
            </label>
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending
                {pendingBookings.length > 0 && (
                  <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                    {pendingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingBookings.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No pending bookings to review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingBookings.map(booking => (
                    <BookingApprovalCard
                      key={booking.id}
                      booking={booking}
                      onApprove={handleApproveBooking}
                      onReject={handleRejectBooking}
                      onMarkComplete={handleMarkComplete}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : approvedBookings.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No approved bookings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {approvedBookings.map(booking => (
                    <BookingApprovalCard
                      key={booking.id}
                      booking={booking}
                      onApprove={handleApproveBooking}
                      onReject={handleRejectBooking}
                      onMarkComplete={handleMarkComplete}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completedBookings.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No completed bookings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedBookings.map(booking => (
                    <BookingApprovalCard
                      key={booking.id}
                      booking={booking}
                      onApprove={handleApproveBooking}
                      onReject={handleRejectBooking}
                      onMarkComplete={handleMarkComplete}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rejectedBookings.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No rejected bookings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rejectedBookings.map(booking => (
                    <BookingApprovalCard
                      key={booking.id}
                      booking={booking}
                      onApprove={handleApproveBooking}
                      onReject={handleRejectBooking}
                      onMarkComplete={handleMarkComplete}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;
