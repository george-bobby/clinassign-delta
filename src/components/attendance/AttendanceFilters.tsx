
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceFiltersProps {
  showMarkControls?: boolean;
  onFilterChange?: (filters: any) => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({ 
  showMarkControls = false,
  onFilterChange
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [department, setDepartment] = useState('');
  const [student, setStudent] = useState('');
  const [status, setStatus] = useState('');

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        date,
        department,
        student,
        status
      });
    }
  };

  return (
    <Card className="p-4 shadow-sm bg-white border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              <SelectItem value="1">General Medicine</SelectItem>
              <SelectItem value="2">Cardiology</SelectItem>
              <SelectItem value="3">Pediatrics</SelectItem>
              <SelectItem value="4">Surgery</SelectItem>
              <SelectItem value="5">Orthopedics</SelectItem>
              <SelectItem value="6">Neurology</SelectItem>
              <SelectItem value="7">Emergency</SelectItem>
              <SelectItem value="8">ICU</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="student">Student</Label>
          <Select value={student} onValueChange={setStudent}>
            <SelectTrigger id="student">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Students</SelectItem>
              <SelectItem value="1">John Student</SelectItem>
              <SelectItem value="2">Jane Student</SelectItem>
              <SelectItem value="3">Sam Student</SelectItem>
              <SelectItem value="4">Mary Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        {showMarkControls && (
          <Button variant="outline">
            Mark All Present
          </Button>
        )}
        
        <Button variant="outline" onClick={handleFilterChange}>
          <Filter className="h-4 w-4 mr-2" /> Apply Filters
        </Button>
        
        <Button variant="default">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
    </Card>
  );
};

export default AttendanceFilters;
