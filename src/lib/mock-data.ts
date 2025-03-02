import { CaseStudy, Profile, ScheduleSlot } from "./types";

// Mock student profiles
export const mockStudents: Profile[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.j@nursing.edu",
    role: "student",
    avatar_url: "https://i.pravatar.cc/150?u=emma",
    created_at: "2023-01-15T08:30:00Z",
    updated_at: "2023-05-10T14:20:00Z"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@nursing.edu",
    role: "student",
    avatar_url: "https://i.pravatar.cc/150?u=michael",
    created_at: "2023-02-05T10:15:00Z",
    updated_at: "2023-06-12T11:45:00Z"
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "sophia.r@nursing.edu",
    role: "student",
    avatar_url: "https://i.pravatar.cc/150?u=sophia",
    created_at: "2023-01-28T09:20:00Z",
    updated_at: "2023-05-22T15:30:00Z"
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.w@nursing.edu",
    role: "student",
    avatar_url: "https://i.pravatar.cc/150?u=james",
    created_at: "2023-03-10T11:40:00Z",
    updated_at: "2023-06-05T12:10:00Z"
  },
  {
    id: "5",
    name: "Olivia Thompson",
    email: "olivia.t@nursing.edu",
    role: "student",
    avatar_url: "https://i.pravatar.cc/150?u=olivia",
    created_at: "2023-02-18T13:25:00Z",
    updated_at: "2023-05-30T10:55:00Z"
  }
];

// Mock tutor profiles
export const mockTutors: Profile[] = [
  {
    id: "t1",
    name: "Dr. Sarah Mitchell",
    email: "dr.mitchell@nursing.edu",
    role: "tutor",
    avatar_url: "https://i.pravatar.cc/150?u=sarah",
    created_at: "2022-08-15T08:30:00Z",
    updated_at: "2023-04-10T14:20:00Z"
  },
  {
    id: "t2",
    name: "Prof. David Kim",
    email: "prof.kim@nursing.edu",
    role: "tutor",
    avatar_url: "https://i.pravatar.cc/150?u=david",
    created_at: "2022-09-05T10:15:00Z",
    updated_at: "2023-03-12T11:45:00Z"
  },
  {
    id: "t3",
    name: "Dr. Emily Turner",
    email: "dr.turner@nursing.edu",
    role: "tutor",
    avatar_url: "https://i.pravatar.cc/150?u=emily",
    created_at: "2022-07-28T09:20:00Z",
    updated_at: "2023-04-22T15:30:00Z"
  }
];

// Mock case studies
export const mockCaseStudies: CaseStudy[] = [
  {
    id: "cs1",
    student_id: "1",
    title: "Pediatric Respiratory Assessment",
    description: "A comprehensive case study on pediatric respiratory assessments for children with asthma",
    department_id: "101", // Referencing Pediatrics department from mockDepartments
    date: "2023-09-15",
    learning_outcomes: "Demonstrated proper assessment techniques for pediatric patients with respiratory distress",
    grade: null,
    status: "submitted",
    created_at: "2023-09-10T14:30:00Z",
    updated_at: "2023-09-15T09:45:00Z",
    student: mockStudents[0]
  },
  {
    id: "cs2",
    student_id: "2",
    title: "Emergency Room Triage Protocol",
    description: "Analysis of ER triage protocols for multiple trauma patients",
    department_id: "101", // Referencing Emergency Care department from mockDepartments
    date: "2023-09-12",
    learning_outcomes: "Developed effective triage decision-making skills in high-pressure situations",
    grade: "B+",
    status: "reviewed",
    created_at: "2023-09-05T10:20:00Z",
    updated_at: "2023-09-12T16:15:00Z",
    student: mockStudents[1]
  },
  {
    id: "cs3",
    student_id: "3",
    title: "Post-Surgical Wound Care",
    description: "Detailed wound care management for post-operative patients",
    department_id: "103", // Referencing Surgery department from mockDepartments
    date: "2023-09-08",
    learning_outcomes: "Mastered aseptic technique and wound assessment methodologies",
    grade: null,
    status: "submitted",
    created_at: "2023-09-02T13:10:00Z",
    updated_at: "2023-09-08T11:30:00Z",
    student: mockStudents[2]
  },
  {
    id: "cs4",
    student_id: "4",
    title: "Oncology Patient Pain Management",
    description: "Case study on effective pain management strategies for cancer patients",
    department_id: "104", // Referencing Oncology department from mockDepartments
    date: "2023-09-05",
    learning_outcomes: "Demonstrated understanding of pain assessment tools and pharmacological interventions",
    grade: "A",
    status: "approved",
    created_at: "2023-08-30T09:45:00Z",
    updated_at: "2023-09-05T15:20:00Z",
    student: mockStudents[3]
  },
  {
    id: "cs5",
    student_id: "5",
    title: "Diabetes Management in Pediatric Patients",
    description: "Analysis of type 1 diabetes management in adolescent patients",
    department_id: "102", // Referencing Pediatrics department from mockDepartments
    date: "2023-09-01",
    learning_outcomes: "Developed comprehensive care plans for adolescent diabetic patients",
    grade: "A-",
    status: "approved",
    created_at: "2023-08-25T11:30:00Z",
    updated_at: "2023-09-01T14:10:00Z",
    student: mockStudents[4]
  }
];

// Mock schedule slots with more comprehensive data
export const mockDetailedScheduleSlots: ScheduleSlot[] = [
  {
    id: "ss1",
    department_id: "101",
    date: "2023-10-15",
    start_time: "08:00",
    end_time: "14:00",
    capacity: 5,
    booked_count: 3,
    created_at: "2023-09-01T10:00:00Z",
    updated_at: "2023-09-01T10:00:00Z",
    department: {
      id: "101",
      name: "Emergency Care",
      description: "Acute care and emergency response training",
      capacity: 10,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "ss2",
    department_id: "102",
    date: "2023-10-16",
    start_time: "09:00",
    end_time: "15:00",
    capacity: 4,
    booked_count: 2,
    created_at: "2023-09-01T10:15:00Z",
    updated_at: "2023-09-01T10:15:00Z",
    department: {
      id: "102",
      name: "Pediatrics",
      description: "Child and adolescent healthcare",
      capacity: 8,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "ss3",
    department_id: "103",
    date: "2023-10-17",
    start_time: "07:30",
    end_time: "13:30",
    capacity: 3,
    booked_count: 3,
    created_at: "2023-09-01T10:30:00Z",
    updated_at: "2023-09-01T10:30:00Z",
    department: {
      id: "103",
      name: "Surgery",
      description: "Surgical procedures and perioperative care",
      capacity: 6,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "ss4",
    department_id: "104",
    date: "2023-10-18",
    start_time: "10:00",
    end_time: "16:00",
    capacity: 5,
    booked_count: 1,
    created_at: "2023-09-01T10:45:00Z",
    updated_at: "2023-09-01T10:45:00Z",
    department: {
      id: "104",
      name: "Oncology",
      description: "Cancer treatment and care",
      capacity: 5,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "ss5",
    department_id: "101",
    date: "2023-10-20",
    start_time: "08:30",
    end_time: "14:30",
    capacity: 5,
    booked_count: 0,
    created_at: "2023-09-01T11:00:00Z",
    updated_at: "2023-09-01T11:00:00Z",
    department: {
      id: "101",
      name: "Emergency Care",
      description: "Acute care and emergency response training",
      capacity: 10,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  },
  {
    id: "ss6",
    department_id: "102",
    date: "2023-10-22",
    start_time: "09:30",
    end_time: "15:30",
    capacity: 4,
    booked_count: 1,
    created_at: "2023-09-01T11:15:00Z",
    updated_at: "2023-09-01T11:15:00Z",
    department: {
      id: "102",
      name: "Pediatrics",
      description: "Child and adolescent healthcare",
      capacity: 8,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  }
];

// Mock department data
export const mockDepartments = [
  {
    id: "101",
    name: "Emergency Care",
    description: "Acute care and emergency response training",
    capacity: 10,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "102",
    name: "Pediatrics",
    description: "Child and adolescent healthcare",
    capacity: 8,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "103",
    name: "Surgery",
    description: "Surgical procedures and perioperative care",
    capacity: 6,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "104",
    name: "Oncology",
    description: "Cancer treatment and care",
    capacity: 5,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "105",
    name: "Obstetrics",
    description: "Pregnancy, childbirth, and postpartum care",
    capacity: 7,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];
