
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format as formatDate } from 'date-fns';

interface ScheduleSlotProps {
  id: string;
  department_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: string;
    name: string;
    description: string;
    capacity: number;
    created_at: string;
    updated_at: string;
  };
  is_booked?: boolean;
  description?: string;
}

interface ScheduleBookingDialogProps {
  slot: ScheduleSlotProps | null;
  isOpen: boolean;
  open: boolean;
  onClose: () => void;
  onBook: (slotId: string) => void;
}

const ScheduleBookingDialog: React.FC<ScheduleBookingDialogProps> = ({ 
  slot, 
  isOpen, 
  open,
  onClose,
  onBook
}) => {
  if (!slot) return null;
  
  const availableSpots = slot.capacity - slot.booked_count;
  const isFull = availableSpots <= 0;
  
  const handleBooking = () => {
    onBook(slot.id);
  };
  
  return (
    <Dialog open={open || isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{slot.department?.name || 'Unknown Department'}</DialogTitle>
          <DialogDescription>
            Review the schedule details before booking
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(new Date(slot.date), 'MMM dd, yyyy')}
            </Badge>
            
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-2" />
              {slot.start_time} - {slot.end_time}
            </Badge>
          </div>
          
          <div className="bg-muted p-3 rounded-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Department</span>
              </div>
              <span className="text-sm">{slot.department?.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Booked Spots</span>
              </div>
              <span className="text-sm">{slot.booked_count}/{slot.capacity}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <UserX className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Available Spots</span>
              </div>
              <span className="text-sm">{availableSpots}</span>
            </div>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${isFull ? "bg-gray-400" : "bg-blue-500"}`}
              style={{ width: `${(slot.booked_count / slot.capacity) * 100}%` }}
            ></div>
          </div>

          {slot.description && (
            <div className="text-sm text-gray-600 mt-2">
              {slot.description}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBooking}
            disabled={isFull || slot.is_booked}
            className={isFull || slot.is_booked ? "bg-gray-400 cursor-not-allowed" : ""}
          >
            {slot.is_booked ? "Already Booked" : (isFull ? "No Available Spots" : "Confirm Booking")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleBookingDialog;
