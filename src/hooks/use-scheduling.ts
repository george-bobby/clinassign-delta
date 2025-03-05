
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/toaster';
import { ScheduleSlot, Booking, StudentYear, Department } from '@/lib/types';

interface UseSchedulingParams {
  studentId?: string;
  year?: StudentYear;
}

interface UseSchedulingReturn {
  isLoading: boolean;
  scheduleSlots: ScheduleSlot[];
  userBookings: Booking[];
  departments: Department[];
  fetchScheduleSlots: (startDate?: string, endDate?: string, departmentId?: string) => Promise<void>;
  fetchUserBookings: (studentId: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  bookSlot: (slotId: string, studentId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  approveBooking: (bookingId: string) => Promise<boolean>;
  rejectBooking: (bookingId: string) => Promise<boolean>;
  markAsCompleted: (bookingId: string, hoursLogged: number) => Promise<boolean>;
  createScheduleSlots: (slots: Partial<ScheduleSlot>[]) => Promise<boolean>;
}

export const useScheduling = ({ 
  studentId, 
  year 
}: UseSchedulingParams = {}): UseSchedulingReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch schedule slots with optional filters
  const fetchScheduleSlots = async (
    startDate?: string, 
    endDate?: string, 
    departmentId?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('schedule_slots')
        .select('*, departments(*)');
      
      if (startDate) {
        query = query.gte('date', startDate);
      }
      
      if (endDate) {
        query = query.lte('date', endDate);
      }
      
      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }
      
      // If student year is provided, filter by appropriate departments
      if (year) {
        // Get department IDs for this year's requirements
        const { data: yearRequirements } = await supabase
          .from('department_year_requirements')
          .select('department_id')
          .eq('year', year);
          
        if (yearRequirements && yearRequirements.length > 0) {
          const departmentIds = yearRequirements.map(req => req.department_id);
          query = query.in('department_id', departmentIds);
        }
      }
      
      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Transform to match our TypeScript types
      const transformedSlots: ScheduleSlot[] = data.map(slot => ({
        id: slot.id,
        department_id: slot.department_id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        capacity: slot.capacity,
        booked_count: slot.booked_count,
        created_at: slot.created_at,
        updated_at: slot.updated_at,
        department: slot.departments
      }));
      
      setScheduleSlots(transformedSlots);
    } catch (error: any) {
      console.error('Error fetching schedule slots:', error);
      toast.error(`Failed to fetch schedule: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings for a specific student
  const fetchUserBookings = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, schedule_slots(*, departments(*))')
        .eq('student_id', userId);
      
      if (error) {
        throw error;
      }
      
      // Transform to match our TypeScript types
      const transformedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        slot_id: booking.slot_id,
        student_id: booking.student_id,
        status: booking.status as any,
        hours_logged: booking.hours_logged,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        slot: booking.schedule_slots ? {
          id: booking.schedule_slots.id,
          department_id: booking.schedule_slots.department_id,
          date: booking.schedule_slots.date,
          start_time: booking.schedule_slots.start_time,
          end_time: booking.schedule_slots.end_time,
          capacity: booking.schedule_slots.capacity,
          booked_count: booking.schedule_slots.booked_count,
          created_at: booking.schedule_slots.created_at,
          updated_at: booking.schedule_slots.updated_at,
          department: booking.schedule_slots.departments
        } : undefined
      }));
      
      setUserBookings(transformedBookings);
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      toast.error(`Failed to fetch bookings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all departments
  const fetchDepartments = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setDepartments(data as Department[]);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast.error(`Failed to fetch departments: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Book a slot for a student
  const bookSlot = async (slotId: string, userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if slot exists and has capacity
      const { data: slot, error: slotError } = await supabase
        .from('schedule_slots')
        .select('*')
        .eq('id', slotId)
        .single();
      
      if (slotError) {
        throw slotError;
      }
      
      if (slot.booked_count >= slot.capacity) {
        toast.error('This slot is already at full capacity.');
        return false;
      }
      
      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          slot_id: slotId,
          student_id: userId,
          status: 'pending'
        });
      
      if (bookingError) {
        throw bookingError;
      }
      
      toast.success('Successfully booked the slot.');
      
      // Refresh data
      await fetchScheduleSlots();
      if (studentId) {
        await fetchUserBookings(studentId);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error booking slot:', error);
      toast.error(`Failed to book slot: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully cancelled the booking.');
      
      // Refresh bookings
      if (studentId) {
        await fetchUserBookings(studentId);
      }
      await fetchScheduleSlots();
      
      return true;
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(`Failed to cancel booking: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a booking
  const approveBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'approved' })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully approved the booking.');
      
      // Refresh bookings if needed
      if (studentId) {
        await fetchUserBookings(studentId);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error approving booking:', error);
      toast.error(`Failed to approve booking: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject a booking
  const rejectBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully rejected the booking.');
      
      // Refresh bookings if needed
      if (studentId) {
        await fetchUserBookings(studentId);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error rejecting booking:', error);
      toast.error(`Failed to reject booking: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a booking as completed with hours logged
  const markAsCompleted = async (bookingId: string, hoursLogged: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed',
          hours_logged: hoursLogged
        })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully marked booking as completed with ${hoursLogged} hours.`);
      
      // Refresh bookings if needed
      if (studentId) {
        await fetchUserBookings(studentId);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error completing booking:', error);
      toast.error(`Failed to complete booking: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create multiple schedule slots
  const createScheduleSlots = async (slots: Partial<ScheduleSlot>[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Filter out the 'department' and 'id' fields which are not in the database schema
      const dbSlots = slots.map(slot => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { department, id, ...rest } = slot as any;
        return rest;
      });
      
      const { error } = await supabase
        .from('schedule_slots')
        .insert(dbSlots);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully created ${slots.length} schedule slots.`);
      
      // Refresh schedule slots
      await fetchScheduleSlots();
      
      return true;
    } catch (error: any) {
      console.error('Error creating schedule slots:', error);
      toast.error(`Failed to create schedule slots: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    scheduleSlots,
    userBookings,
    departments,
    fetchScheduleSlots,
    fetchUserBookings,
    fetchDepartments,
    bookSlot,
    cancelBooking,
    approveBooking,
    rejectBooking,
    markAsCompleted,
    createScheduleSlots,
  };
};
