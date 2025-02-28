
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          role: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      academic_years: {
        Row: {
          id: string
          student_id: string
          year: string
          start_date: string
          end_date: string
        }
        Insert: {
          id?: string
          student_id: string
          year: string
          start_date: string
          end_date: string
        }
        Update: {
          id?: string
          student_id?: string
          year?: string
          start_date?: string
          end_date?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          capacity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      department_year_requirements: {
        Row: {
          id: string
          department_id: string
          year: string
          required_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          department_id: string
          year: string
          required_hours: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          year?: string
          required_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      schedule_slots: {
        Row: {
          id: string
          department_id: string
          date: string
          start_time: string
          end_time: string
          capacity: number
          booked_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          department_id: string
          date: string
          start_time: string
          end_time: string
          capacity: number
          booked_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          date?: string
          start_time?: string
          end_time?: string
          capacity?: number
          booked_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          slot_id: string
          student_id: string
          status: string
          hours_logged: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slot_id: string
          student_id: string
          status?: string
          hours_logged?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slot_id?: string
          student_id?: string
          status?: string
          hours_logged?: number
          created_at?: string
          updated_at?: string
        }
      }
      case_studies: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          department_id: string
          date: string
          learning_outcomes: string | null
          grade: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          department_id: string
          date: string
          learning_outcomes?: string | null
          grade?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          description?: string | null
          department_id?: string
          date?: string
          learning_outcomes?: string | null
          grade?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      attendances: {
        Row: {
          id: string
          booking_id: string
          student_id: string
          date: string
          status: string
          marked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          student_id: string
          date: string
          status: string
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          student_id?: string
          date?: string
          status?: string
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          user_id: string
          title: string
          message: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: 'student' | 'tutor' | 'nursing_head' | 'hospital_admin' | 'principal'
      booking_status: 'pending' | 'approved' | 'rejected' | 'completed'
      attendance_status: 'present' | 'absent' | 'late'
      case_study_status: 'draft' | 'submitted' | 'reviewed' | 'approved'
      student_year: 'first' | 'second' | 'third' | 'fourth'
    }
  }
}
