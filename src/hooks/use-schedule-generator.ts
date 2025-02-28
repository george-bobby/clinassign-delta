
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/toaster';
import { StudentYear, DepartmentYearRequirement, ScheduleSlot } from '@/lib/types';

interface UseScheduleGeneratorParams {
  year: StudentYear;
  startDate: Date;
  endDate: Date;
}

interface UseScheduleGeneratorReturn {
  isGenerating: boolean;
  generatedSlots: ScheduleSlot[];
  generateSchedule: (params: UseScheduleGeneratorParams) => Promise<ScheduleSlot[]>;
}

/**
 * Hook to generate clinical rotation schedules based on year requirements
 */
export const useScheduleGenerator = (): UseScheduleGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSlots, setGeneratedSlots] = useState<ScheduleSlot[]>([]);

  // Helper function to check if a date is a third Saturday or Sunday
  const isThirdSaturdayOrSunday = (date: Date): boolean => {
    const day = date.getDay();
    const dayOfMonth = date.getDate();
    
    // Check if it's a Sunday (0)
    if (day === 0) return true;
    
    // Check if it's a Saturday (6) and in the 3rd week of the month
    if (day === 6 && dayOfMonth > 14 && dayOfMonth <= 21) return true;
    
    return false;
  };

  // Function to add days to a date
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Generate schedule based on requirements
  const generateSchedule = async ({ 
    year, 
    startDate, 
    endDate 
  }: UseScheduleGeneratorParams): Promise<ScheduleSlot[]> => {
    setIsGenerating(true);
    try {
      // 1. Get department requirements for the specified year
      const { data: requirements, error: reqError } = await supabase
        .from('department_year_requirements')
        .select('*, departments(*)')
        .eq('year', year);

      if (reqError) {
        throw reqError;
      }

      if (!requirements || requirements.length === 0) {
        toast.warning(`No department requirements found for ${year} year students.`);
        setIsGenerating(false);
        return [];
      }

      // 2. Calculate total days available for scheduling
      const generatedSlots: ScheduleSlot[] = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      const availableDays: Date[] = [];

      // Collect all available days (excluding third Saturdays and Sundays)
      while (currentDate <= end) {
        if (!isThirdSaturdayOrSunday(currentDate)) {
          availableDays.push(new Date(currentDate));
        }
        currentDate = addDays(currentDate, 1);
      }

      if (availableDays.length === 0) {
        toast.error('No available days found in the date range.');
        setIsGenerating(false);
        return [];
      }

      // 3. Calculate slots per department based on requirements
      for (const requirement of requirements) {
        const departmentId = requirement.department_id;
        const requiredHours = requirement.required_hours;
        const department = requirement.departments;
        
        // Assuming each slot is 6 hours of clinical practice
        const slotsNeeded = Math.ceil(requiredHours / 6);
        
        // Distribute slots evenly across available days
        const slotsPerDayMax = Math.ceil(slotsNeeded / availableDays.length);
        let slotsCreated = 0;
        let dayIndex = 0;

        while (slotsCreated < slotsNeeded && dayIndex < availableDays.length) {
          const date = availableDays[dayIndex];
          const dateStr = date.toISOString().split('T')[0];
          
          // Create morning slot (8:00 - 14:00)
          if (slotsCreated < slotsNeeded) {
            generatedSlots.push({
              id: `gen_${departmentId}_${dateStr}_morning`,
              department_id: departmentId,
              date: dateStr,
              start_time: '08:00',
              end_time: '14:00',
              capacity: department?.capacity || 10,
              booked_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              department: department
            });
            slotsCreated++;
          }
          
          // Create afternoon slot (14:00 - 20:00) if needed
          if (slotsCreated < slotsNeeded && slotsPerDayMax > 1) {
            generatedSlots.push({
              id: `gen_${departmentId}_${dateStr}_afternoon`,
              department_id: departmentId,
              date: dateStr,
              start_time: '14:00',
              end_time: '20:00',
              capacity: department?.capacity || 10,
              booked_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              department: department
            });
            slotsCreated++;
          }
          
          dayIndex++;
        }
      }

      setGeneratedSlots(generatedSlots);
      toast.success(`Successfully generated ${generatedSlots.length} schedule slots.`);
      return generatedSlots;
    } catch (error: any) {
      console.error('Error generating schedule:', error);
      toast.error(`Failed to generate schedule: ${error.message}`);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedSlots,
    generateSchedule,
  };
};
