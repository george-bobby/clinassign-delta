
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AttendanceMarkButtonProps {
  studentId: string;
  studentName: string;
  department: string;
  onSuccess?: () => void;
  status?: 'present' | 'absent' | 'late';
}

export function AttendanceMarkButton({ 
  studentId, 
  studentName, 
  department, 
  onSuccess,
  status = 'present' 
}: AttendanceMarkButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMarkAttendance = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to mark attendance.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('attendance')
        .insert({
          student_id: studentId,
          status: status,
          marked_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Attendance Marked',
        description: `${studentName} marked as ${status}.`,
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix variant by using only supported values
  const getButtonVariant = () => {
    if (status === 'present') return 'default';
    if (status === 'late') return 'secondary';
    return 'destructive';
  };

  return (
    <Button 
      onClick={handleMarkAttendance} 
      disabled={isSubmitting}
      variant={getButtonVariant()}
      size="sm"
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Mark {status}
    </Button>
  );
}
