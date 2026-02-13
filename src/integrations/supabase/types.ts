export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          subject: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          subject?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          subject?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string | null
          exam_date: string
          id: string
          name: string
          notes: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exam_date: string
          id?: string
          name: string
          notes?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exam_date?: string
          id?: string
          name?: string
          notes?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      performance_records: {
        Row: {
          created_at: string | null
          id: string
          marks: number
          record_date: string | null
          subject: string
          test_name: string | null
          total_marks: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          marks: number
          record_date?: string | null
          subject: string
          test_name?: string | null
          total_marks?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          marks?: number
          record_date?: string | null
          subject?: string
          test_name?: string | null
          total_marks?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accent_color: string | null
          created_at: string | null
          daily_study_goal: number | null
          id: string
          name: string | null
          onboarding_completed: boolean | null
          study_pet: string | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          daily_study_goal?: number | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          study_pet?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          daily_study_goal?: number | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          study_pet?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string | null
          duration: number
          ended_at: string | null
          id: string
          started_at: string | null
          subject_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number
          ended_at?: string | null
          id?: string
          started_at?: string | null
          subject_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number
          ended_at?: string | null
          id?: string
          started_at?: string | null
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_streaks: {
        Row: {
          created_at: string | null
          id: string
          streak_count: number | null
          streak_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          streak_count?: number | null
          streak_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          streak_count?: number | null
          streak_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          location: string | null
          start_time: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          location?: string | null
          start_time: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          subject: string
          topic_name: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          subject: string
          topic_name: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          subject?: string
          topic_name?: string
          user_id?: string
        }
        Relationships: []
      }
      water_log: {
        Row: {
          amount_ml: number | null
          id: string
          logged_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml?: number | null
          id?: string
          logged_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number | null
          id?: string
          logged_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
