
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  UserX,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { mockAttendanceData } from '@/lib/mock-attendance-data';

interface AttendanceTableProps {
  canMark?: boolean;
  markerView?: boolean;
  data?: any[];
  isLoading?: boolean;
  onDataChange?: () => void;
}

const AttendanceTable = ({ 
  canMark = false, 
  markerView = false,
  data = [],
  isLoading = false,
  onDataChange
}: AttendanceTableProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('Present');
  const [editRemarks, setEditRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null }>({
    open: false,
    id: null
  });
  const [viewRemarksDialog, setViewRemarksDialog] = useState<{ open: boolean, remarks: string | null }>({
    open: false,
    remarks: null
  });

  // Use mock data if no real data is provided
  const displayData = data && data.length > 0 ? data : mockAttendanceData;

  const handleEditStatus = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('attendance_records')
        .update({ 
          status: editStatus.toLowerCase(),
          remarks: editRemarks,
          updated_at: new Date().toISOString(),
          marked_by: user?.id
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Status Updated',
        description: 'Attendance status has been updated successfully.'
      });
      
      setEditingId(null);
      if (onDataChange) onDataChange();
      
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the attendance status.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttendance = async () => {
    if (!deleteDialog.id) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', deleteDialog.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Record Deleted',
        description: 'Attendance record has been deleted successfully.'
      });
      
      setDeleteDialog({ open: false, id: null });
      if (onDataChange) onDataChange();
      
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting the attendance record.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMarkAttendance = async (studentId: string, studentName: string, status: string, department: string, remarks: string = '') => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          student_id: studentId,
          student_name: studentName,
          date: new Date().toISOString().split('T')[0],
          status: status.toLowerCase(),
          department,
          remarks,
          marked_by: user?.id,
          marker_role: user?.role
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Attendance Marked',
        description: `${studentName} marked as ${status}.`
      });
      
      if (onDataChange) onDataChange();
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: 'Failed to Mark Attendance',
        description: 'There was an error recording the attendance.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'present') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Present
        </span>
      );
    } else if (statusLower === 'late') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Late
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Absent
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No attendance records found</h3>
        <p className="text-gray-500 mb-4">
          {markerView 
            ? "Start marking attendance by selecting students from the list" 
            : "No attendance records match your current filters"}
        </p>
        {canMark && !markerView && (
          <Button variant="outline" onClick={() => window.location.href = "#mark"}>
            Go to Mark Attendance
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>
            {markerView 
              ? "Mark attendance for students" 
              : "List of attendance records"
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              {canMark && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.student_name}</TableCell>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell>
                  {editingId === record.id ? (
                    <Select 
                      value={editStatus} 
                      onValueChange={setEditStatus}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <StatusBadge status={record.status} />
                  )}
                </TableCell>
                <TableCell>
                  {editingId === record.id ? (
                    <Textarea 
                      value={editRemarks} 
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="Add remarks..."
                      className="min-h-[80px]"
                    />
                  ) : (
                    <div className="flex items-center">
                      {record.remarks ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewRemarksDialog({
                            open: true,
                            remarks: record.remarks
                          })}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">No remarks</span>
                      )}
                    </div>
                  )}
                </TableCell>
                {canMark && (
                  <TableCell className="text-right">
                    {editingId === record.id ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditStatus(record.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingId(null)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setEditingId(record.id);
                            setEditStatus(record.status.charAt(0).toUpperCase() + record.status.slice(1));
                            setEditRemarks(record.remarks || '');
                          }}
                          disabled={isSubmitting}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {user?.role === 'nursing_head' || user?.role === 'hospital_admin' || user?.role === 'principal' ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-800 hover:bg-red-50" 
                            onClick={() => setDeleteDialog({ open: true, id: record.id })}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Attendance Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this attendance record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAttendance}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewRemarksDialog.open} onOpenChange={(open) => setViewRemarksDialog({ ...viewRemarksDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance Remarks</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p>{viewRemarksDialog.remarks || 'No remarks available.'}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewRemarksDialog({ open: false, remarks: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceTable;
