
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Mocked data - in a real app, this would come from Supabase
const MOCK_STUDENTS = [
  { id: '1', name: 'John Student', department: 'General Medicine', departmentId: '1' },
  { id: '2', name: 'Jane Student', department: 'Cardiology', departmentId: '2' },
  { id: '3', name: 'Sam Student', department: 'Pediatrics', departmentId: '3' },
  { id: '4', name: 'Mary Student', department: 'Surgery', departmentId: '4' },
];

const MOCK_ATTENDANCE_RECORDS = [
  { id: '1', studentId: '1', studentName: 'John Student', departmentId: '1', department: 'General Medicine', date: new Date('2023-07-01'), status: 'present', markedBy: 'Tom Tutor' },
  { id: '2', studentId: '1', studentName: 'John Student', departmentId: '1', department: 'General Medicine', date: new Date('2023-07-02'), status: 'absent', markedBy: 'Tom Tutor' },
  { id: '3', studentId: '2', studentName: 'Jane Student', departmentId: '2', department: 'Cardiology', date: new Date('2023-07-01'), status: 'present', markedBy: 'Nancy Nursing' },
  { id: '4', studentId: '3', studentName: 'Sam Student', departmentId: '3', department: 'Pediatrics', date: new Date('2023-07-01'), status: 'late', markedBy: 'Tom Tutor' },
  { id: '5', studentId: '4', studentName: 'Mary Student', departmentId: '4', department: 'Surgery', date: new Date('2023-07-01'), status: 'present', markedBy: 'Nancy Nursing' },
  { id: '6', studentId: '2', studentName: 'Jane Student', departmentId: '2', department: 'Cardiology', date: new Date('2023-07-02'), status: 'late', markedBy: 'Nancy Nursing' },
  { id: '7', studentId: '3', studentName: 'Sam Student', departmentId: '3', department: 'Pediatrics', date: new Date('2023-07-02'), status: 'absent', markedBy: 'Tom Tutor' },
  { id: '8', studentId: '4', studentName: 'Mary Student', departmentId: '4', department: 'Surgery', date: new Date('2023-07-02'), status: 'present', markedBy: 'Nancy Nursing' },
];

interface AttendanceTableProps {
  canMark?: boolean;
  markerView?: boolean;
  filterDate?: Date;
  filterDepartment?: string;
  filterStudent?: string;
  filterStatus?: string;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  canMark = false, 
  markerView = false,
  filterDate,
  filterDepartment,
  filterStudent,
  filterStatus
}) => {
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState(MOCK_ATTENDANCE_RECORDS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // In a real app, this would fetch data from Supabase
  useEffect(() => {
    // This would call a Supabase query to get attendance records
    console.log("Fetching attendance records with filters:", { 
      filterDate, filterDepartment, filterStudent, filterStatus 
    });
    
    // For demo, we're just filtering the mock data
    let filtered = [...MOCK_ATTENDANCE_RECORDS];
    
    if (filterDate) {
      filtered = filtered.filter(record => 
        record.date.toDateString() === filterDate.toDateString()
      );
    }
    
    if (filterDepartment) {
      filtered = filtered.filter(record => 
        record.departmentId === filterDepartment
      );
    }
    
    if (filterStudent) {
      filtered = filtered.filter(record => 
        record.studentId === filterStudent
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(record => 
        record.status === filterStatus
      );
    }
    
    setAttendanceRecords(filtered);
  }, [filterDate, filterDepartment, filterStudent, filterStatus]);
  
  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    // In a real app, this would be a Supabase mutation
    const newRecord = {
      id: Math.random().toString(36).substring(7),
      studentId,
      studentName: MOCK_STUDENTS.find(s => s.id === studentId)?.name || '',
      departmentId: MOCK_STUDENTS.find(s => s.id === studentId)?.departmentId || '',
      department: MOCK_STUDENTS.find(s => s.id === studentId)?.department || '',
      date: selectedDate,
      status,
      markedBy: 'Current User'
    };
    
    toast({
      title: "Attendance marked",
      description: `Marked ${newRecord.studentName} as ${status} for ${format(selectedDate, 'PPP')}`,
    });
    
    // Update our local state
    setAttendanceRecords(prev => {
      // Check if there's already a record for this student on this date
      const existingIndex = prev.findIndex(
        r => r.studentId === studentId && r.date.toDateString() === selectedDate.toDateString()
      );
      
      if (existingIndex >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        // Add new record
        return [...prev, newRecord];
      }
    });
  };
  
  const markBulkAttendance = (status: 'present' | 'absent' | 'late') => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to mark attendance",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be a batch mutation to Supabase
    selectedStudents.forEach(studentId => {
      markAttendance(studentId, status);
    });
    
    // Clear selection after marking
    setSelectedStudents([]);
    
    toast({
      title: "Bulk attendance marked",
      description: `Marked ${selectedStudents.length} students as ${status}`,
    });
  };
  
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(MOCK_STUDENTS.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };
  
  const exportAttendance = () => {
    toast({
      title: "Export initiated",
      description: "Your attendance data is being prepared for download",
    });
    
    // In a real app, this would generate a CSV or PDF file
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Attendance data has been downloaded",
      });
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Late</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const renderTableHeader = () => {
    if (markerView) {
      return (
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedStudents.length === MOCK_STUDENTS.length} 
                onCheckedChange={handleSelectAll} 
              />
            </TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      );
    }
    
    return (
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Marked By</TableHead>
          {canMark && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
    );
  };
  
  const renderTableContent = () => {
    if (markerView) {
      return (
        <TableBody>
          {MOCK_STUDENTS.map(student => (
            <TableRow key={student.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedStudents.includes(student.id)} 
                  onCheckedChange={() => toggleStudentSelection(student.id)} 
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-clinical-100 text-clinical-700">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>{student.name}</div>
                </div>
              </TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => markAttendance(student.id, 'present')}
                >
                  <Check className="h-4 w-4 mr-1" /> Present
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => markAttendance(student.id, 'late')}
                >
                  <Clock className="h-4 w-4 mr-1" /> Late
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => markAttendance(student.id, 'absent')}
                >
                  <X className="h-4 w-4 mr-1" /> Absent
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    return (
      <TableBody>
        {attendanceRecords.length === 0 ? (
          <TableRow>
            <TableCell colSpan={canMark ? 6 : 5} className="text-center py-8 text-gray-500">
              No attendance records found. Adjust your filters or add new records.
            </TableCell>
          </TableRow>
        ) : (
          attendanceRecords.map(record => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-clinical-100 text-clinical-700">
                      {record.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>{record.studentName}</div>
                </div>
              </TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>{format(record.date, 'PPP')}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>{record.markedBy}</TableCell>
              {canMark && (
                <TableCell className="text-right">
                  <Select
                    defaultValue={record.status}
                    onValueChange={(value) => 
                      markAttendance(
                        record.studentId, 
                        value as 'present' | 'absent' | 'late'
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    );
  };
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {markerView && (
        <div className="p-4 border-b flex justify-between items-center">
          <div className="text-sm">
            {selectedStudents.length} of {MOCK_STUDENTS.length} students selected
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => markBulkAttendance('present')}
              disabled={selectedStudents.length === 0}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-1" /> Mark All Present
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => markBulkAttendance('late')}
              disabled={selectedStudents.length === 0}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <Clock className="h-4 w-4 mr-1" /> Mark All Late
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => markBulkAttendance('absent')}
              disabled={selectedStudents.length === 0}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" /> Mark All Absent
            </Button>
          </div>
        </div>
      )}
      
      {!markerView && (
        <div className="p-4 border-b flex justify-between items-center">
          <div className="text-sm">
            Showing {attendanceRecords.length} attendance records
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportAttendance}
          >
            <Download className="h-4 w-4 mr-1" /> Export Data
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          {renderTableHeader()}
          {renderTableContent()}
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
