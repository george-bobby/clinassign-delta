
import React from 'react';
import { ScheduleSlot } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

interface ScheduleCardProps {
  slot: ScheduleSlot;
  onBookSlot?: (slotId: string) => void;
  isBooked?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  slot, 
  onBookSlot,
  isBooked = false 
}) => {
  const availableSpots = slot.capacity - slot.bookedCount;
  const isFull = availableSpots <= 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 animate-scale-in">
      <div className={cn(
        "h-2",
        isFull ? "bg-gray-400" : "bg-clinical-500"
      )} />
      <CardContent className="p-5">
        <h3 className="font-semibold text-gray-900">{slot.departmentName}</h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-clinical-500" />
            <span>{formatDate(slot.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-2 h-4 w-4 text-clinical-500" />
            <span>{slot.startTime} - {slot.endTime}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">
              {isFull ? (
                <span className="text-gray-500">No spots available</span>
              ) : (
                <span className="text-clinical-700">{availableSpots} spots available</span>
              )}
            </span>
            <span className="text-xs text-gray-500">
              {slot.bookedCount}/{slot.capacity} booked
            </span>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={cn(
                "h-1.5 rounded-full",
                isFull ? "bg-gray-400" : "bg-clinical-500"
              )}
              style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-gray-50">
        {onBookSlot && (
          <Button
            onClick={() => onBookSlot(slot.id)}
            disabled={isFull || isBooked}
            variant={isBooked ? "outline" : "default"}
            className={cn(
              "w-full transition-all",
              isBooked 
                ? "border-clinical-500 text-clinical-700" 
                : isFull 
                  ? "bg-gray-400 hover:bg-gray-500" 
                  : "bg-clinical-600 hover:bg-clinical-700"
            )}
          >
            {isBooked ? "Already Booked" : isFull ? "Full" : "Book Slot"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScheduleCard;
