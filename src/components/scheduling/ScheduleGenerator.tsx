
import React, { useState } from 'react';
import { useScheduleGenerator } from '@/hooks/use-schedule-generator';
import { useScheduling } from '@/hooks/use-scheduling';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { StudentYear, ScheduleSlot } from '@/lib/types';
import { CalendarIcon, CheckIcon, XIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScheduleSlotList from './ScheduleSlotList';

interface ScheduleGeneratorProps {
  onScheduleGenerated?: (slots: ScheduleSlot[]) => void;
}

const ScheduleGenerator: React.FC<ScheduleGeneratorProps> = ({ onScheduleGenerated }) => {
  const [selectedYear, setSelectedYear] = useState<StudentYear | ''>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  const { isGenerating, generatedSlots, generateSchedule } = useScheduleGenerator();
  const { isLoading, createScheduleSlots } = useScheduling();
  
  const handleGenerateSchedule = async () => {
    if (!selectedYear || !startDate || !endDate) {
      toast.error('Please select a year, start date, and end date to generate a schedule.');
      return;
    }
    
    if (endDate < startDate) {
      toast.error('End date must be after start date.');
      return;
    }
    
    const slots = await generateSchedule({
      year: selectedYear as StudentYear,
      startDate,
      endDate
    });
    
    if (slots.length > 0) {
      setShowPreview(true);
      if (onScheduleGenerated) {
        onScheduleGenerated(slots);
      }
    }
  };
  
  const handleSaveSchedule = async () => {
    if (generatedSlots.length === 0) {
      toast.error('No schedule slots to save.');
      return;
    }
    
    const success = await createScheduleSlots(generatedSlots);
    if (success) {
      setShowPreview(false);
      setSelectedYear('');
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };
  
  const handleCancelPreview = () => {
    setShowPreview(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Clinical Schedule</CardTitle>
        <CardDescription>
          Create a schedule based on academic year requirements.
          Third Saturdays and Sundays will be excluded automatically.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showPreview ? (
          <>
            <div className="space-y-2">
              <label htmlFor="year-select" className="text-sm font-medium">
                Academic Year
              </label>
              <Select
                value={selectedYear}
                onValueChange={(value) => setSelectedYear(value as StudentYear)}
              >
                <SelectTrigger id="year-select">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Year</SelectItem>
                  <SelectItem value="second">Second Year</SelectItem>
                  <SelectItem value="third">Third Year</SelectItem>
                  <SelectItem value="fourth">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Schedule Preview</h3>
              <div className="text-sm text-muted-foreground">
                {generatedSlots.length} slots generated
              </div>
            </div>
            
            <ScheduleSlotList slots={generatedSlots} showBookingOptions={false} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {!showPreview ? (
          <Button 
            onClick={handleGenerateSchedule} 
            disabled={!selectedYear || !startDate || !endDate || isGenerating}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Schedule
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={handleCancelPreview}
              disabled={isLoading}
            >
              <XIcon className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSchedule}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="mr-2 h-4 w-4" />
              )}
              Save Schedule
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScheduleGenerator;
