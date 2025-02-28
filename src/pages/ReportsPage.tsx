
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  BarChart, 
  PieChart, 
  Users, 
  Calendar as CalendarIcon,
  Printer,
  Filter,
  Building
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

// Mock report data
const mockReports = [
  {
    id: '1',
    name: 'Attendance Summary',
    description: 'Summary of student attendance across all departments',
    type: 'attendance',
    lastUpdated: '2023-07-15T10:30:00Z',
    downloadCount: 24
  },
  {
    id: '2',
    name: 'Department Allocation',
    description: 'Current student allocation per department',
    type: 'department',
    lastUpdated: '2023-07-14T15:45:00Z',
    downloadCount: 18
  },
  {
    id: '3',
    name: 'Student Performance',
    description: 'Performance metrics for all students',
    type: 'performance',
    lastUpdated: '2023-07-13T09:15:00Z',
    downloadCount: 32
  },
  {
    id: '4',
    name: 'Case Studies Analysis',
    description: 'Analysis of case studies submitted by students',
    type: 'performance',
    lastUpdated: '2023-07-12T14:20:00Z',
    downloadCount: 15
  },
  {
    id: '5',
    name: 'Clinical Hours Summary',
    description: 'Summary of clinical hours completed by department',
    type: 'department',
    lastUpdated: '2023-07-11T11:10:00Z',
    downloadCount: 27
  },
  {
    id: '6',
    name: 'Attendance Trends',
    description: 'Attendance trends over the last semester',
    type: 'attendance',
    lastUpdated: '2023-07-10T16:35:00Z',
    downloadCount: 21
  },
  {
    id: '7',
    name: 'Student Progress Report',
    description: 'Detailed progress report for all students',
    type: 'performance',
    lastUpdated: '2023-07-09T13:45:00Z',
    downloadCount: 29
  },
  {
    id: '8',
    name: 'Department Utilization',
    description: 'Utilization metrics for all departments',
    type: 'department',
    lastUpdated: '2023-07-08T10:20:00Z',
    downloadCount: 16
  }
];

// Mock departments
const mockDepartments = [
  'All Departments',
  'General Medicine',
  'Surgery',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'ICU',
  'Emergency'
];

interface ReportCardProps {
  report: {
    id: string;
    name: string;
    description: string;
    type: string;
    lastUpdated: string;
    downloadCount: number;
  };
  onDownload: (reportId: string) => void;
  onPrint: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload, onPrint }) => {
  // Get icon based on report type
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <FileText className="h-10 w-10 text-blue-500" />;
      case 'department': return <Building className="h-10 w-10 text-green-500" />;
      case 'performance': return <BarChart className="h-10 w-10 text-purple-500" />;
      default: return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-medium">{report.name}</CardTitle>
          <CardDescription className="mt-1">{report.description}</CardDescription>
        </div>
        {getReportIcon(report.type)}
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 mt-2">
          Last updated: {format(new Date(report.lastUpdated), 'PPP')}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Downloaded {report.downloadCount} times
        </div>
      </CardContent>
      
      <div className="p-4 pt-0 mt-auto flex gap-2">
        <Button className="flex-1" onClick={() => onDownload(report.id)}>
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="icon" onClick={() => onPrint(report.id)}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter reports based on filters and active tab
  const getFilteredReports = () => {
    let filtered = mockReports;
    
    // Filter by type if not "all"
    if (activeTab !== 'all') {
      filtered = filtered.filter(report => report.type === activeTab);
    }
    
    return filtered;
  };
  
  const filteredReports = getFilteredReports();
  
  // Handle download report
  const handleDownload = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Downloading "${report.name}" report...`);
      // In a real application, you would trigger a download here
    }
  };
  
  // Handle print report
  const handlePrint = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Preparing to print "${report.name}" report...`);
      // In a real application, you would open a print dialog here
    }
  };
  
  // Handle generate custom report
  const handleGenerateReport = () => {
    toast.success(`Generating custom report for date range: ${format(startDate, 'PP')} - ${format(endDate, 'PP')}`);
    
    // In a real application, you would generate and download a report here
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Reports</h1>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>
                  Select a date range and department to generate a custom report
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                          disabled={(date) => date < startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Department
                    </label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepartments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleGenerateReport}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    All Reports
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger value="department" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Performance
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                    />
                  ))}
                </div>
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There are no reports available in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="attendance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                    />
                  ))}
                </div>
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No attendance reports</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There are no attendance reports available at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="department" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                    />
                  ))}
                </div>
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No department reports</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There are no department reports available at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onDownload={handleDownload}
                      onPrint={handlePrint}
                    />
                  ))}
                </div>
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No performance reports</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      There are no performance reports available at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
