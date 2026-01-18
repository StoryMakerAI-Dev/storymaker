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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_usage_logs: {
        Row: {
          created_at: string
          function_name: string
          id: string
          model_used: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          function_name: string
          id?: string
          model_used?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          function_name?: string
          id?: string
          model_used?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      character_library: {
        Row: {
          backstory: string | null
          created_at: string
          description: string
          id: string
          name: string
          traits: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backstory?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          traits?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backstory?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          traits?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collection_stories: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          story_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          story_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_stories_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "story_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      export_archives: {
        Row: {
          created_at: string
          expires_at: string
          export_format: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          schedule_id: string | null
          story_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          export_format: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          schedule_id?: string | null
          story_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          export_format?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          schedule_id?: string | null
          story_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_archives_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "export_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      export_schedules: {
        Row: {
          cloud_provider: string | null
          created_at: string
          cron_expression: string
          delivery_email: string | null
          delivery_method: string
          export_format: string
          id: string
          is_active: boolean
          last_run_at: string | null
          next_run_at: string | null
          schedule_name: string
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cloud_provider?: string | null
          created_at?: string
          cron_expression: string
          delivery_email?: string | null
          delivery_method?: string
          export_format?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_name: string
          template_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cloud_provider?: string | null
          created_at?: string
          cron_expression?: string
          delivery_email?: string | null
          delivery_method?: string
          export_format?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_name?: string
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          function_name: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          function_name: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          function_name?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          model_used: string | null
          params: Json
          parent_story_id: string | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          model_used?: string | null
          params: Json
          parent_story_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          model_used?: string | null
          params?: Json
          parent_story_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_parent_story_id_fkey"
            columns: ["parent_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      story_templates: {
        Row: {
          age_group: string
          created_at: string
          description: string
          genre: string
          id: string
          name: string
          starter_text: string
        }
        Insert: {
          age_group: string
          created_at?: string
          description: string
          genre: string
          id?: string
          name: string
          starter_text: string
        }
        Update: {
          age_group?: string
          created_at?: string
          description?: string
          genre?: string
          id?: string
          name?: string
          starter_text?: string
        }
        Relationships: []
      }
      subscription_tiers_config: {
        Row: {
          chat_limit_per_day: number
          chat_limit_per_month: number
          created_at: string
          display_name: string
          id: string
          image_limit_per_day: number
          image_limit_per_month: number
          story_limit_per_day: number
          story_limit_per_month: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          chat_limit_per_day?: number
          chat_limit_per_month?: number
          created_at?: string
          display_name: string
          id?: string
          image_limit_per_day?: number
          image_limit_per_month?: number
          story_limit_per_day?: number
          story_limit_per_month?: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          chat_limit_per_day?: number
          chat_limit_per_month?: number
          created_at?: string
          display_name?: string
          id?: string
          image_limit_per_day?: number
          image_limit_per_month?: number
          story_limit_per_day?: number
          story_limit_per_month?: number
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      usage_alerts: {
        Row: {
          alert_type: string
          email_sent: boolean | null
          function_name: string | null
          id: string
          message: string
          sent_at: string
          threshold_percentage: number | null
          user_id: string
        }
        Insert: {
          alert_type: string
          email_sent?: boolean | null
          function_name?: string | null
          id?: string
          message: string
          sent_at?: string
          threshold_percentage?: number | null
          user_id: string
        }
        Update: {
          alert_type?: string
          email_sent?: boolean | null
          function_name?: string | null
          id?: string
          message?: string
          sent_at?: string
          threshold_percentage?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications_enabled: boolean
          id: string
          preferred_ai_model: string
          rate_limit_warning_threshold: number
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          preferred_ai_model?: string
          rate_limit_warning_threshold?: number
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          preferred_ai_model?: string
          rate_limit_warning_threshold?: number
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      writing_goals: {
        Row: {
          created_at: string
          current_count: number
          goal_type: string
          id: string
          period_end: string
          period_start: string
          target_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          goal_type: string
          id?: string
          period_end: string
          period_start?: string
          target_count: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          goal_type?: string
          id?: string
          period_end?: string
          period_start?: string
          target_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_tier: "free" | "basic" | "pro" | "enterprise"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      subscription_tier: ["free", "basic", "pro", "enterprise"],
    },
  },
} as const
