
import { AttendanceStatus } from '@/lib/types';

export const mockAttendanceData = [
  {
    id: '1',
    student_id: '101',
    student_name: 'John Smith',
    date: '2023-11-15',
    status: 'present' as AttendanceStatus,
    department: 'Emergency Care',
    marked_by: 'Dr. Johnson',
    marker_role: 'tutor',
    remarks: 'Arrived on time',
    created_at: '2023-11-15T08:00:00Z',
    updated_at: '2023-11-15T08:00:00Z'
  },
  {
    id: '2',
    student_id: '102',
    student_name: 'Emily Davis',
    date: '2023-11-15',
    status: 'absent' as AttendanceStatus,
    department: 'Pediatrics',
    marked_by: 'Dr. Williams',
    marker_role: 'tutor',
    remarks: 'Called in sick',
    created_at: '2023-11-15T08:05:00Z',
    updated_at: '2023-11-15T08:05:00Z'
  },
  {
    id: '3',
    student_id: '103',
    student_name: 'Michael Johnson',
    date: '2023-11-15',
    status: 'late' as AttendanceStatus,
    department: 'Surgery',
    marked_by: 'Dr. Brown',
    marker_role: 'tutor',
    remarks: 'Arrived 15 minutes late',
    created_at: '2023-11-15T08:10:00Z',
    updated_at: '2023-11-15T08:10:00Z'
  },
  {
    id: '4',
    student_id: '101',
    student_name: 'John Smith',
    date: '2023-11-16',
    status: 'present' as AttendanceStatus,
    department: 'Emergency Care',
    marked_by: 'Dr. Johnson',
    marker_role: 'tutor',
    remarks: '',
    created_at: '2023-11-16T08:00:00Z',
    updated_at: '2023-11-16T08:00:00Z'
  },
  {
    id: '5',
    student_id: '102',
    student_name: 'Emily Davis',
    date: '2023-11-16',
    status: 'present' as AttendanceStatus,
    department: 'Pediatrics',
    marked_by: 'Dr. Williams',
    marker_role: 'tutor',
    remarks: '',
    created_at: '2023-11-16T08:05:00Z',
    updated_at: '2023-11-16T08:05:00Z'
  }
];
