
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDetailedScheduleSlots, mockDepartments } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

const ManageSchedulePage = () => {
  const { toast } = useToast();
  const [scheduleSlots, setScheduleSlots] = useState(mockDetailedScheduleSlots);
  
  const handleDeleteSlot = (id: string) => {
    setScheduleSlots(scheduleSlots.filter(slot => slot.id !== id));
    toast({
      title: 'Schedule Slot Deleted',
      description: 'The schedule slot has been successfully removed.',
    });
  };

  const handleEditSlot = (id: string) => {
    toast({
      title: 'Edit Schedule Slot',
      description: 'Edit functionality would open a modal to edit this slot.',
    });
  };

  const handleAddSlot = () => {
    toast({
      title: 'Add Schedule Slot',
      description: 'Add functionality would open a modal to create a new slot.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Clinical Rotation Schedule</h1>
          <Button onClick={handleAddSlot} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Slot</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Total Scheduled Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleSlots.length}</div>
              <p className="text-xs text-gray-500 mt-1">Across all departments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Available Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleSlots.reduce((acc, slot) => acc + (slot.capacity - slot.booked_count), 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Student positions available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Upcoming Rotations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleSlots.filter(slot => new Date(slot.date) > new Date()).length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Scheduled for future dates</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{slot.department?.name}</TableCell>
                    <TableCell>{slot.date}</TableCell>
                    <TableCell>{`${slot.start_time} - ${slot.end_time}`}</TableCell>
                    <TableCell>{slot.capacity}</TableCell>
                    <TableCell>
                      <span className={slot.booked_count === slot.capacity ? 'text-red-500' : 'text-green-500'}>
                        {slot.booked_count}/{slot.capacity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditSlot(slot.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageSchedulePage;
