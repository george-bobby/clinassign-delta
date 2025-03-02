export type UserRole = 'student' | 'tutor' | 'nursing_head' | 'hospital_admin' | 'principal';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type CaseStudyStatus = 'draft' | 'submitted' | 'reviewed' | 'approved';
export type StudentYear = 'first' | 'second' | 'third' | 'fourth';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  student_id: string;
  year: StudentYear;
  start_date: string;
  end_date: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentYearRequirement {
  id: string;
  department_id: string;
  year: StudentYear;
  required_hours: number;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface ScheduleSlot {
  id: string;
  department_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Booking {
  id: string;
  slot_id: string;
  student_id: string;
  status: BookingStatus;
  hours_logged: number;
  created_at: string;
  updated_at: string;
  slot?: ScheduleSlot;
  student?: Profile;
}

export interface CaseStudy {
  id: string;
  student_id: string;
  title: string;
  description: string;
  department_id: string;
  date: string;
  learning_outcomes: string;
  grade: string | null;
  status: CaseStudyStatus;
  created_at: string;
  updated_at: string;
  department?: Department;
  student?: Profile;
}

export interface Attendance {
  id: string;
  booking_id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  marked_by: string | null;
  created_at: string;
  updated_at: string;
  booking?: Booking;
  student?: Profile;
  marker?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  conversation_id: string;
  message_text: string;
  timestamp: string;
  attachments?: any;
  is_read: boolean;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  name?: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_time?: string;
  participants?: ConversationParticipant[];
  messages?: Message[];
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  user?: Profile;
}

// Mock data for UI development
export const mockScheduleSlots: ScheduleSlot[] = [
  {
    id: '1',
    department_id: '101',
    date: '2023-10-15',
    start_time: '08:00',
    end_time: '14:00',
    capacity: 5,
    booked_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    department_id: '102',
    date: '2023-10-16',
    start_time: '09:00',
    end_time: '15:00',
    capacity: 4,
    booked_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    department_id: '103',
    date: '2023-10-17',
    start_time: '07:30',
    end_time: '13:30',
    capacity: 3,
    booked_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    department_id: '104',
    date: '2023-10-18',
    start_time: '10:00',
    end_time: '16:00',
    capacity: 5,
    booked_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockDepartments: Department[] = [
  {
    id: '101',
    name: 'Emergency Care',
    description: 'Acute care and emergency response training',
    capacity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '102',
    name: 'Pediatrics',
    description: 'Child and adolescent healthcare',
    capacity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '103',
    name: 'Surgery',
    description: 'Surgical procedures and perioperative care',
    capacity: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '104',
    name: 'Oncology',
    description: 'Cancer treatment and care',
    capacity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
