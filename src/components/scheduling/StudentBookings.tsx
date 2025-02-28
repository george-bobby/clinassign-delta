
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScheduling } from '@/hooks/use-scheduling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { Booking, BookingStatus } from '@/lib/types';
import { CalendarIcon, ClockIcon, BadgeCheckIcon, XIcon, Loader2 } from 'lucide-react';
import ScheduleSlotList from './ScheduleSlotList';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isLoading: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, isLoading }) => {
  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: BookingStatus): string => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'completed': return 'Completed';
      default: return 'Unknown Status';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${getStatusColor(booking.status)}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {booking.slot?.department?.name || 'Unknown Department'}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{booking.slot ? formatDate(booking.slot.date) : 'Unknown date'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="mr-2 h-4 w-4" />
                <span>
                  {booking.slot ? `${booking.slot.start_time} - ${booking.slot.end_time}` : 'Unknown time'}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)} text-white`}>
                  {getStatusText(booking.status)}
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
          
          {booking.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCancel(booking.id)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const StudentBookings: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    scheduleSlots, 
    userBookings, 
    fetchScheduleSlots, 
    fetchUserBookings, 
    bookSlot, 
    cancelBooking 
  } = useScheduling({ studentId: user?.id });
  
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserBookings(user.id);
      fetchScheduleSlots();
    }
  }, [user?.id]);
  
  const handleBookSlot = async (slotId: string) => {
    if (!user?.id) return;
    
    setBookingInProgress(true);
    try {
      await bookSlot(slotId, user.id);
      await fetchUserBookings(user.id);
      await fetchScheduleSlots(); // Refresh available slots
    } finally {
      setBookingInProgress(false);
    }
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
    if (user?.id) {
      await fetchUserBookings(user.id);
      await fetchScheduleSlots(); // Refresh available slots
    }
  };
  
  // Filter slots that are already booked by the user
  const userBookedSlotIds = userBookings.map(booking => booking.slot_id);
  
  // Filter bookings by status for different tabs
  const pendingBookings = userBookings.filter(b => b.status === 'pending');
  const approvedBookings = userBookings.filter(b => b.status === 'approved');
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  const rejectedBookings = userBookings.filter(b => b.status === 'rejected');
  
  // Determine if there are any bookings to display
  const hasBookings = userBookings.length > 0;
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>My Clinical Rotations</CardTitle>
          <CardDescription>
            View your bookings and schedule status
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Available Slots
              </TabsTrigger>
              <TabsTrigger value="bookings">
                My Bookings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-2">
              <h3 className="text-lg font-medium mb-4">Available Clinical Slots</h3>
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScheduleSlotList 
                  slots={scheduleSlots.filter(slot => slot.booked_count < slot.capacity)} 
                  userBookedSlotIds={userBookedSlotIds}
                  onBookSlot={bookingInProgress ? undefined : handleBookSlot}
                />
              )}
            </TabsContent>
            
            <TabsContent value="bookings">
              <div className="space-y-6">
                {!hasBookings && !isLoading && (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">You have no clinical rotations booked yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Find available slots
                    </Button>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                {!isLoading && pendingBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <BadgeCheckIcon className="mr-2 h-5 w-5 text-yellow-500" />
                      Pending Approval
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {pendingBookings.map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleCancelBooking}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {!isLoading && approvedBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <BadgeCheckIcon className="mr-2 h-5 w-5 text-green-500" />
                      Approved Rotations
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {approvedBookings.map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleCancelBooking}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {!isLoading && completedBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <BadgeCheckIcon className="mr-2 h-5 w-5 text-blue-500" />
                      Completed Rotations
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {completedBookings.map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleCancelBooking}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {!isLoading && rejectedBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <XIcon className="mr-2 h-5 w-5 text-red-500" />
                      Rejected Rotations
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {rejectedBookings.map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleCancelBooking}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBookings;
