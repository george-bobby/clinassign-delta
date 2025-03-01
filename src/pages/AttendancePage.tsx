import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Check, Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AttendanceStatus } from '@/lib/types';

const mockAttendanceData = [
  { id: '1', studentId: '101', studentName: 'John Doe', date: '2023-07-15', status: 'present', departmentName: 'General Medicine' },
  { id: '2', studentId: '102', studentName: 'Alice Brown', date: '2023-07-15', status: 'absent', departmentName: 'Surgery' },
  { id: '3', studentId: '103', studentName: 'Robert Wilson', date: '2023-07-15', status: 'present', departmentName: 'Pediatrics' },
  { id: '4', studentId: '104', studentName: 'Emily Clark', date: '2023-07-15', status: 'late', departmentName: 'Cardiology' },
  { id: '5', studentId: '105', studentName: 'Michael Scott', date: '2023-07-16', status: 'present', departmentName: 'Orthopedics' },
  { id: '6', studentId: '106', studentName: 'Sara Johnson', date: '2023-07-16', status: 'absent', departmentName: 'Neurology' },
  { id: '7', studentId: '107', studentName: 'David Lee', date: '2023-07-16', status: 'present', departmentName: 'Emergency' },
  { id: '8', studentId: '108', studentName: 'Jessica Taylor', date: '2023-07-16', status: 'late', departmentName: 'ICU' },
];

const departments = [
  { id: '1', name: 'General Medicine' },
  { id: '2', name: 'Surgery' },
  { id: '3', name: 'Pediatrics' },
  { id: '4', name: 'Cardiology' },
  { id: '5', name: 'Orthopedics' },
  { id: '6', name: 'Neurology' },
  { id: '7', name: 'Emergency' },
  { id: '8', name: 'ICU' },
];

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: string;
  departmentName: string;
  isSelected?: boolean;
}

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AttendanceRecord, direction: 'asc' | 'desc' } | null>(null);
  
  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !selectedDate || record.date === format(selectedDate, 'yyyy-MM-dd');
    const matchesDepartment = !selectedDepartment || record.departmentName === selectedDepartment;
    const matchesStatus = !selectedStatus || record.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesDepartment && matchesStatus;
  });
  
  const sortedData = sortConfig 
    ? [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;
  
  const requestSort = (key: keyof AttendanceRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleMarkAttendance = (recordId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, status } 
          : record
      )
    );
    
    toast.success(`Attendance marked as ${status}`);
  };
  
  const handleBulkAction = (status: AttendanceStatus) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.isSelected 
          ? { ...record, status, isSelected: false } 
          : record
      )
    );
    
    toast.success(`Bulk attendance marked as ${status}`);
  };
  
  const toggleSelection = (recordId: string) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, isSelected: !record.isSelected } 
          : record
      )
    );
  };
  
  const toggleSelectAll = () => {
    const allSelected = sortedData.every(record => record.isSelected);
    
    setAttendanceData(prev => 
      prev.map(record => 
        sortedData.some(r => r.id === record.id)
          ? { ...record, isSelected: !allSelected } 
          : record
      )
    );
  };
  
  const hasSelected = attendanceData.some(record => record.isSelected);
  
  const selectedCount = attendanceData.filter(record => record.isSelected).length;
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate(new Date());
    setSelectedDepartment('');
    setSelectedStatus('');
    setSortConfig(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Attendance Management</h1>
              
              {hasSelected && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{selectedCount} selected</span>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleBulkAction('present')}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark Present
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction('absent')}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Mark Absent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('late')}
                  >
                    Mark Late
                  </Button>
                </div>
              )}
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Attendance Filters</CardTitle>
                <CardDescription>
                  Filter attendance records by date, department, or status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label htmlFor="search" className="text-sm font-medium block mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="search"
                        placeholder="Search by name or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Department
                    </label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
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
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
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
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  {sortedData.length} records found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="select-all"
                              checked={sortedData.length > 0 && sortedData.every(record => record.isSelected)}
                              onCheckedChange={toggleSelectAll}
                            />
                            <label htmlFor="select-all" className="text-sm font-medium">
                              Select All
                            </label>
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => requestSort('studentName')}
                            className="font-medium"
                          >
                            Student Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="py-3 px-4 text-left">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => requestSort('departmentName')}
                            className="font-medium"
                          >
                            Department
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="py-3 px-4 text-left">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => requestSort('date')}
                            className="font-medium"
                          >
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="py-3 px-4 text-left">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => requestSort('status')}
                            className="font-medium"
                          >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.length > 0 ? (
                        sortedData.map((record) => (
                          <tr key={record.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Checkbox 
                                checked={record.isSelected} 
                                onCheckedChange={() => toggleSelection(record.id)}
                              />
                            </td>
                            <td className="py-3 px-4 font-medium">{record.studentName}</td>
                            <td className="py-3 px-4">{record.departmentName}</td>
                            <td className="py-3 px-4">{format(new Date(record.date), 'PP')}</td>
                            <td className="py-3 px-4">
                              <div className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                record.status === 'present' && "bg-green-100 text-green-800",
                                record.status === 'absent' && "bg-red-100 text-red-800",
                                record.status === 'late' && "bg-yellow-100 text-yellow-800"
                              )}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => handleMarkAttendance(record.id, 'present')}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => handleMarkAttendance(record.id, 'absent')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                  onClick={() => handleMarkAttendance(record.id, 'late')}
                                >
                                  Late
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No attendance records found matching your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
