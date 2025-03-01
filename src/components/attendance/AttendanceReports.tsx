
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar as CalendarIcon, BarChart3, PieChart } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const AttendanceReports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('daily');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [format, setFormat] = useState('pdf');
  
  const generateReport = () => {
    toast({
      title: "Generating report",
      description: "Your report is being generated and will be ready for download shortly."
    });
    
    // In a real app, this would call a function to generate and download the report
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your attendance report has been downloaded."
      });
    }, 2000);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-clinical-600" />
            Generate Attendance Report
          </CardTitle>
          <CardDescription>
            Create custom reports based on department, date range, and format
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Report Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={generateReport} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-clinical-600" />
              Attendance Overview
            </CardTitle>
            <CardDescription>
              Key statistics from the attendance records
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Overall Attendance</div>
                <div className="text-2xl font-bold text-clinical-700">85%</div>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Absence Rate</div>
                <div className="text-2xl font-bold text-amber-600">12%</div>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Tardiness</div>
                <div className="text-2xl font-bold text-blue-600">3%</div>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Students</div>
                <div className="text-2xl font-bold text-gray-700">42</div>
                <div className="text-xs text-gray-400">Active in system</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-clinical-600" />
              Department Analysis
            </CardTitle>
            <CardDescription>
              Attendance broken down by department
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'General Medicine', rate: 92, color: 'bg-green-500' },
                { name: 'Cardiology', rate: 88, color: 'bg-blue-500' },
                { name: 'Pediatrics', rate: 95, color: 'bg-purple-500' },
                { name: 'Surgery', rate: 79, color: 'bg-amber-500' },
              ].map(dept => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{dept.name}</span>
                    <span className="font-medium">{dept.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${dept.color}`} 
                      style={{ width: `${dept.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" /> View Full Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceReports;
