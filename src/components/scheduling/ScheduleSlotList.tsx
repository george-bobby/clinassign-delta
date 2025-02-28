
import React from 'react';
import { ScheduleSlot } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ScheduleCard from '@/components/dashboard/ScheduleCard';

interface ScheduleSlotListProps {
  slots: ScheduleSlot[];
  userBookedSlotIds?: string[];
  onBookSlot?: (slotId: string) => void;
  showBookingOptions?: boolean;
}

const ScheduleSlotList: React.FC<ScheduleSlotListProps> = ({
  slots,
  userBookedSlotIds = [],
  onBookSlot,
  showBookingOptions = true
}) => {
  const { isRole } = useAuth();
  const isStudent = isRole('student');
  
  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, ScheduleSlot[]>);
  
  // Sort dates
  const sortedDates = Object.keys(slotsByDate).sort();
  
  if (slots.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No schedule slots available.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date} className="space-y-4">
          <h3 className="text-lg font-medium">{formatDate(date)}</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slotsByDate[date].map(slot => (
              <ScheduleCard
                key={slot.id}
                slot={slot}
                onBookSlot={isStudent && showBookingOptions ? onBookSlot : undefined}
                isBooked={userBookedSlotIds.includes(slot.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleSlotList;
