
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Search, Calendar as CalendarIcon, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format as formatDate } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { mockDepartments } from '@/lib/types';

interface AttendanceFiltersProps {
  showMarkControls?: boolean;
  onFilterChange?: (filters: any) => void;
}

const AttendanceFilters = ({ 
  showMarkControls = false,
  onFilterChange 
}: AttendanceFiltersProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    // Fetch departments from Supabase
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching departments:', error);
        // Fallback to mock data
        setDepartments(mockDepartments);
      } else {
        setDepartments(data || mockDepartments);
      }
    };

    // Fetch students from Supabase
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching students:', error);
        // Create mock students as fallback
        setStudents([
          { id: '101', name: 'John Smith' },
          { id: '102', name: 'Emily Davis' },
          { id: '103', name: 'Michael Johnson' },
          { id: '104', name: 'Sarah Williams' },
          { id: '105', name: 'David Brown' }
        ]);
      } else {
        setStudents(data || []);
      }
    };

    fetchDepartments();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        date: date ? formatDate(date, 'yyyy-MM-dd') : null,
        startDate: startDate ? formatDate(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? formatDate(endDate, 'yyyy-MM-dd') : null,
        department,
        status,
        studentId: selectedStudent
      });
    }
  }, [date, startDate, endDate, department, status, selectedStudent, onFilterChange]);

  const clearFilters = () => {
    setDate(null);
    setStartDate(null);
    setEndDate(null);
    setDepartment('');
    setStatus('');
    setStudentName('');
    setSelectedStudent('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">
          {showMarkControls ? "Mark Attendance" : "Filter Attendance Records"}
        </h3>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 
              <ChevronUp className="h-4 w-4 mr-2" /> : 
              <ChevronDown className="h-4 w-4 mr-2" />
            }
            {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date">Single Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!!(startDate || endDate)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Department Filter */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
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
        
        {/* Student Filter */}
        <div className="space-y-2">
          <Label htmlFor="student">Student</Label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger id="student">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Students</SelectItem>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range Start */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date Range (Start)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!!date}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, 'PPP') : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={!!date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Date Range End */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date Range (End)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!!date}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, 'PPP') : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={!!date}
                    fromDate={startDate || undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
      
      {showMarkControls && (
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="search" className="mb-2 block">Quick Student Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search student by name..."
                  className="pl-9"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;
