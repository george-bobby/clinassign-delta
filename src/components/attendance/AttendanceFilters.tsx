import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Search, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
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

interface AttendanceFiltersProps {
  showMarkControls?: boolean;
  onFilterChange?: (filters: any) => void;
}

const AttendanceFilters = ({ 
  showMarkControls = false,
  onFilterChange 
}: AttendanceFiltersProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    // Fetch departments from Supabase
    const fetchDepartments = async () => {
      try {
        const response = await supabase
          .from('departments')
          .select('*')
          .order('name')
          .execute();
          
        if (response.error) {
          console.error('Error fetching departments:', response.error);
        } else {
          setDepartments(response.data || []);
        }
      } catch (error) {
        console.error('Exception fetching departments:', error);
      }
    };

    // Fetch students from Supabase
    const fetchStudents = async () => {
      try {
        const response = await supabase
          .from('students')
          .select('*')
          .order('name')
          .execute();
          
        if (response.error) {
          console.error('Error fetching students:', response.error);
        } else {
          setStudents(response.data || []);
        }
      } catch (error) {
        console.error('Exception fetching students:', error);
      }
    };

    fetchDepartments();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        date: date ? formatDate(date, 'yyyy-MM-dd') : null,
        department,
        status,
        studentId: selectedStudent
      });
    }
  }, [date, department, status, selectedStudent, onFilterChange]);

  const clearFilters = () => {
    setDate(null);
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
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
              <SelectItem value="all_departments">All Departments</SelectItem>
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
              <SelectItem value="all_statuses">All Statuses</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
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
              <SelectItem value="all_students">All Students</SelectItem>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
