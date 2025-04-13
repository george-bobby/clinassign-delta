export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          id: string
          marked_at: string | null
          schedule_id: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          id?: string
          marked_at?: string | null
          schedule_id?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          id?: string
          marked_at?: string | null
          schedule_id?: string | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          processed: boolean
          status: string | null
          student_id: string
          submitted_at: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id: string
          processed?: boolean
          status?: string | null
          student_id: string
          submitted_at?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          processed?: boolean
          status?: string | null
          student_id?: string
          submitted_at?: string | null
          text?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          available_slots: number
          created_at: string | null
          id: string
          name: string
          total_capacity: number
          updated_at: string | null
        }
        Insert: {
          available_slots?: number
          created_at?: string | null
          id?: string
          name: string
          total_capacity?: number
          updated_at?: string | null
        }
        Update: {
          available_slots?: number
          created_at?: string | null
          id?: string
          name?: string
          total_capacity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      extracted_features: {
        Row: {
          case_study_id: string
          created_at: string | null
          features: Json
          id: string
          processed: boolean
        }
        Insert: {
          case_study_id: string
          created_at?: string | null
          features: Json
          id?: string
          processed?: boolean
        }
        Update: {
          case_study_id?: string
          created_at?: string | null
          features?: Json
          id?: string
          processed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "extracted_features_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          case_study_id: string
          created_at: string | null
          grade: string
          id: string
        }
        Insert: {
          case_study_id: string
          created_at?: string | null
          grade: string
          id?: string
        }
        Update: {
          case_study_id?: string
          created_at?: string | null
          grade?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_tracker: {
        Row: {
          completed_hours: number
          created_at: string | null
          id: string
          pending_hours: number
          student_id: string
          total_hours: number
          updated_at: string | null
        }
        Insert: {
          completed_hours?: number
          created_at?: string | null
          id?: string
          pending_hours?: number
          student_id: string
          total_hours: number
          updated_at?: string | null
        }
        Update: {
          completed_hours?: number
          created_at?: string | null
          id?: string
          pending_hours?: number
          student_id?: string
          total_hours?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_tracker_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          date: string
          department_id: string
          id: string
          rescheduled_to: string | null
          shift_type: string
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          department_id: string
          id?: string
          rescheduled_to?: string | null
          shift_type: string
          status: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          department_id?: string
          id?: string
          rescheduled_to?: string | null
          shift_type?: string
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          department: string
          department_id: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          department?: string
          department_id?: string | null
          email: string
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Update: {
          created_at?: string | null
          department?: string
          department_id?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      update_student_years: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      attendance_status: "Present" | "Absent" | "Late"
      case_status: "submitted" | "processed"
      student_year: "1st" | "2nd" | "3rd" | "4th"
      user_role:
        | "student"
        | "tutor"
        | "nursing_head"
        | "hospital_admin"
        | "principal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["Present", "Absent", "Late"],
      case_status: ["submitted", "processed"],
      student_year: ["1st", "2nd", "3rd", "4th"],
      user_role: [
        "student",
        "tutor",
        "nursing_head",
        "hospital_admin",
        "principal",
      ],
    },
  },
} as const
