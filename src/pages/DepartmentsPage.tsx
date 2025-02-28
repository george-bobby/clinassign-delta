
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Users, FileText, ArrowRight, Plus } from 'lucide-react';
import { toast } from '@/components/ui/toaster';

// Mock department data
const mockDepartments = [
  { 
    id: '1', 
    name: 'General Medicine', 
    description: 'Deals with diagnosis, treatment, and prevention of various diseases.',
    capacity: 20,
    studentsAssigned: 18,
    nursingHeads: ['Dr. Rajesh Kumar'],
    activeCases: 12,
  },
  { 
    id: '2', 
    name: 'Surgery', 
    description: 'Performs surgical procedures and perioperative care.',
    capacity: 15,
    studentsAssigned: 12,
    nursingHeads: ['Dr. Emily Carter'],
    activeCases: 8,
  },
  { 
    id: '3', 
    name: 'Pediatrics', 
    description: 'Specialized care for infants, children, and adolescents.',
    capacity: 18,
    studentsAssigned: 14,
    nursingHeads: ['Dr. Sarah Wilson'],
    activeCases: 10,
  },
  { 
    id: '4', 
    name: 'Cardiology', 
    description: 'Diagnoses and treats heart-related conditions.',
    capacity: 12,
    studentsAssigned: 10,
    nursingHeads: ['Dr. John Smith', 'Dr. Maria Garcia'],
    activeCases: 15,
  },
  { 
    id: '5', 
    name: 'Orthopedics', 
    description: 'Treats musculoskeletal issues including bones, joints, and muscles.',
    capacity: 14,
    studentsAssigned: 8,
    nursingHeads: ['Dr. Robert Brown'],
    activeCases: 6,
  },
  { 
    id: '6', 
    name: 'Neurology', 
    description: 'Diagnoses and treats disorders of the nervous system.',
    capacity: 10,
    studentsAssigned: 7,
    nursingHeads: ['Dr. Jennifer Thomas'],
    activeCases: 9,
  },
  { 
    id: '7', 
    name: 'Emergency & ICU', 
    description: 'Provides immediate care for critical and life-threatening conditions.',
    capacity: 25,
    studentsAssigned: 22,
    nursingHeads: ['Dr. Michael Lee', 'Dr. Amanda Johnson'],
    activeCases: 18,
  },
  { 
    id: '8', 
    name: 'Burns & Plastic Surgery', 
    description: 'Specialized care for burn injuries and reconstructive procedures.',
    capacity: 8,
    studentsAssigned: 5,
    nursingHeads: ['Dr. David Clark'],
    activeCases: 4,
  },
];

const DepartmentsPage: React.FC = () => {
  const { user, isRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter departments based on search query
  const filteredDepartments = mockDepartments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if user can edit departments
  const canEditDepartments = isRole('principal') || isRole('nursing_head') || isRole('hospital_admin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Departments</h1>
              
              {canEditDepartments && (
                <Button onClick={() => toast.info("Add Department feature will be implemented soon")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              )}
            </div>
            
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map(dept => (
                <Card key={dept.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{dept.name}</CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                        {dept.studentsAssigned}/{dept.capacity}
                      </Badge>
                    </div>
                    <CardDescription>{dept.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Nursing Heads</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {dept.nursingHeads.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Active Cases</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            {dept.activeCases} ongoing case studies
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium">Capacity</h4>
                          <div className="mt-1 text-sm text-gray-600">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${(dept.studentsAssigned / dept.capacity) * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {Math.round((dept.studentsAssigned / dept.capacity) * 100)}% occupied
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => toast.info(`Details view for ${dept.name} will be implemented soon`)}
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredDepartments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No departments found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We couldn't find any departments matching your search query.
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepartmentsPage;
