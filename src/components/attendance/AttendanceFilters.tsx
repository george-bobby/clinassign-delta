import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Filter, Search, UserRound, Building, CheckCheck } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

// Mock departments data - in a real app, this would come from Supabase
const MOCK_DEPARTMENTS = [
  { id: '1', name: 'General Medicine' },
  { id: '2', name: 'Cardiology' },
  { id: '3', name: 'Pediatrics' },
  { id: '4', name: 'Surgery' },
  { id: '5', name: 'Orthopedics' },
  { id: '6', name: 'Neurology' },
  { id: '7', name: 'Emergency' },
  { id: '8', name: 'ICU' },
];

interface AttendanceFiltersProps {
  showMarkControls?: boolean;
  onFilter?: (filters: {
    date?: Date;
    department?: string;
    student?: string;
    status?: string;
  }) => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({ 
  showMarkControls = false,
  onFilter
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [department, setDepartment] = useState<string>('');
  const [student, setStudent] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'custom'>('today');
  
  const handleDateRangeChange = (range: 'today' | '7days' | '30days' | 'custom') => {
    setDateRange(range);
    
    const today = new Date();
    
    switch (range) {
      case 'today':
        setDate(today);
        break;
      case '7days':
        // In a real app, this would handle a date range
        setDate(new Date(today.setDate(today.getDate() - 7)));
        break;
      case '30days':
        // In a real app, this would handle a date range
        setDate(new Date(today.setDate(today.getDate() - 30)));
        break;
      case 'custom':
        // Keep current date for custom selection
        break;
    }
  };
  
  const handleFilter = () => {
    if (onFilter) {
      onFilter({
        date,
        department: department || undefined,
        student: student || undefined,
        status: status || undefined
      });
    }
  };
  
  const handleClearFilters = () => {
    setDate(new Date());
    setDepartment('');
    setStudent('');
    setStatus('');
    setDateRange('today');
    
    if (onFilter) {
      onFilter({});
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date-filter" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" /> Date
            </Label>
            
            <div className="flex gap-2 flex-wrap mb-2">
              <Button 
                type="button"
                variant={dateRange === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange('today')}
              >
                Today
              </Button>
              <Button 
                type="button"
                variant={dateRange === '7days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange('7days')}
              >
                Last 7 Days
              </Button>
              <Button 
                type="button"
                variant={dateRange === '30days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange('30days')}
              >
                Last 30 Days
              </Button>
              <Button 
                type="button"
                variant={dateRange === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange('custom')}
              >
                Custom
              </Button>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-filter"
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
            <Label htmlFor="department-filter" className="flex items-center gap-1">
              <Building className="h-4 w-4" /> Department
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {MOCK_DEPARTMENTS.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="student-filter" className="flex items-center gap-1">
              <UserRound className="h-4 w-4" /> Student
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="student-filter"
                placeholder="Search student"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="flex items-center gap-1">
              <CheckCheck className="h-4 w-4" /> Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="flex justify-end mt-6 gap-3">
          <Button
            variant="outline"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4 mr-2" /> Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceFilters;
