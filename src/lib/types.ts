
export type UserRole = 'student' | 'tutor' | 'nursing_head' | 'hospital_admin' | 'principal';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  capacity: number;
}

export interface ScheduleSlot {
  id: string;
  departmentId: string;
  departmentName: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
}

export interface Booking {
  id: string;
  slotId: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface CaseStudy {
  id: string;
  studentId: string;
  title: string;
  description: string;
  department: string;
  date: string;
  learningOutcomes: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

export interface Attendance {
  id: string;
  bookingId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

// Mock data
export const mockScheduleSlots: ScheduleSlot[] = [
  {
    id: '1',
    departmentId: '101',
    departmentName: 'Emergency Care',
    date: '2023-10-15',
    startTime: '08:00',
    endTime: '14:00',
    capacity: 5,
    bookedCount: 3
  },
  {
    id: '2',
    departmentId: '102',
    departmentName: 'Pediatrics',
    date: '2023-10-16',
    startTime: '09:00',
    endTime: '15:00',
    capacity: 4,
    bookedCount: 2
  },
  {
    id: '3',
    departmentId: '103',
    departmentName: 'Surgery',
    date: '2023-10-17',
    startTime: '07:30',
    endTime: '13:30',
    capacity: 3,
    bookedCount: 3
  },
  {
    id: '4',
    departmentId: '104',
    departmentName: 'Oncology',
    date: '2023-10-18',
    startTime: '10:00',
    endTime: '16:00',
    capacity: 5,
    bookedCount: 1
  }
];

export const mockDepartments: Department[] = [
  {
    id: '101',
    name: 'Emergency Care',
    description: 'Acute care and emergency response training',
    capacity: 10
  },
  {
    id: '102',
    name: 'Pediatrics',
    description: 'Child and adolescent healthcare',
    capacity: 8
  },
  {
    id: '103',
    name: 'Surgery',
    description: 'Surgical procedures and perioperative care',
    capacity: 6
  },
  {
    id: '104',
    name: 'Oncology',
    description: 'Cancer treatment and care',
    capacity: 5
  }
];
