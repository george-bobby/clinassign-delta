import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar as CalendarIcon, BarChart3, PieChart, Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format as formatDate } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Define types for department stats
interface DepartmentStat {
  name: string;
  total: number;
  present: number;
  rate: number;
}

// Define type for report statistics
interface ReportStats {
  overallAttendance: number;
  absenceRate: number;
  tardiness: number;
  totalStudents: number;
  departmentStats: DepartmentStat[];
}

const AttendanceReports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('daily');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [fileFormat, setFileFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats>({
    overallAttendance: 0,
    absenceRate: 0,
    tardiness: 0,
    totalStudents: 0,
    departmentStats: []
  });
  
  useEffect(() => {
    // Fetch departments for the dropdown
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
    
    fetchDepartments();
    loadReportStats();
  }, []);
  
  const loadReportStats = async () => {
    try {
      setIsLoading(true);
      
      // Get attendance statistics for the dashboard
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Mock attendance data for demonstration
      const attendanceData = [
        { department: 'Emergency Care', status: 'Present' },
        { department: 'Emergency Care', status: 'Present' },
        { department: 'Emergency Care', status: 'Absent' },
        { department: 'Pediatrics', status: 'Present' },
        { department: 'Pediatrics', status: 'Late' },
        { department: 'Surgery', status: 'Present' },
        { department: 'Surgery', status: 'Present' },
        { department: 'Surgery', status: 'Present' },
        { department: 'Surgery', status: 'Absent' },
        { department: 'Oncology', status: 'Present' },
        { department: 'Oncology', status: 'Late' },
        { department: 'Oncology', status: 'Absent' },
      ];
      
      // Get total number of students - mock value for demo
      const studentCount = 24;
      
      // Calculate statistics
      if (attendanceData) {
        const totalRecords = attendanceData.length;
        const presentRecords = attendanceData.filter(r => r.status === 'Present').length;
        const absentRecords = attendanceData.filter(r => r.status === 'Absent').length;
        const lateRecords = attendanceData.filter(r => r.status === 'Late').length;
        
        // Calculate department stats
        const deptStats: Record<string, DepartmentStat> = {};
        attendanceData.forEach(record => {
          if (!deptStats[record.department]) {
            deptStats[record.department] = {
              name: record.department,
              total: 0,
              present: 0,
              rate: 0
            };
          }
          
          deptStats[record.department].total++;
          if (record.status === 'Present') {
            deptStats[record.department].present++;
          }
        });
        
        // Calculate attendance rates for departments
        Object.values(deptStats).forEach(dept => {
          dept.rate = dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0;
        });
        
        setReportStats({
          overallAttendance: totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0,
          absenceRate: totalRecords > 0 ? Math.round((absentRecords / totalRecords) * 100) : 0,
          tardiness: totalRecords > 0 ? Math.round((lateRecords / totalRecords) * 100) : 0,
          totalStudents: studentCount || 0,
          departmentStats: Object.values(deptStats).sort((a, b) => b.rate - a.rate).slice(0, 4)
        });
      }
    } catch (error) {
      console.error('Error loading report stats:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateReport = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Generating report",
        description: "Your report is being generated and will be ready for download shortly."
      });
      
      // Format dates for the API request
      const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd');
      const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd');
      
      // Mock the edge function call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulating success for demo purposes
      toast({
        title: "Report ready",
        description: "Your attendance report has been downloaded."
      });
        
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report generation failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                <SelectItem value="department">Department Report</SelectItem>
                <SelectItem value="student">Student Report</SelectItem>
                <SelectItem value="custom">Custom Report</SelectItem>
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
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
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
                    {startDate ? formatDate(startDate, 'PPP') : <span>Pick a date</span>}
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
                    {endDate ? formatDate(endDate, 'PPP') : <span>Pick a date</span>}
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
            <Select value={fileFormat} onValueChange={setFileFormat}>
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
          <Button onClick={generateReport} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Generate Report
              </>
            )}
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
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-clinical-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Overall Attendance</div>
                  <div className="text-2xl font-bold text-clinical-700">{reportStats.overallAttendance}%</div>
                  <div className="text-xs text-gray-400">Last 30 days</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Absence Rate</div>
                  <div className="text-2xl font-bold text-amber-600">{reportStats.absenceRate}%</div>
                  <div className="text-xs text-gray-400">Last 30 days</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Tardiness</div>
                  <div className="text-2xl font-bold text-blue-600">{reportStats.tardiness}%</div>
                  <div className="text-xs text-gray-400">Last 30 days</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Total Students</div>
                  <div className="text-2xl font-bold text-gray-700">{reportStats.totalStudents}</div>
                  <div className="text-xs text-gray-400">Active in system</div>
                </div>
              </div>
            )}
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
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-clinical-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {reportStats.departmentStats.length > 0 ? (
                  reportStats.departmentStats.map((dept, index) => {
                    // Assign different colors based on index
                    const colors = [
                      'bg-green-500',
                      'bg-blue-500',
                      'bg-purple-500',
                      'bg-amber-500'
                    ];
                    return (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="font-medium">{dept.rate}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index % colors.length]}`} 
                            style={{ width: `${dept.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No department data available
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={loadReportStats} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" />
              )} 
              Refresh Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceReports;
