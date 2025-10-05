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
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          attempt_count: number | null
          completed_at: string | null
          created_at: string | null
          endpoint_id: string
          error_message: string | null
          event_id: string | null
          id: string
          max_attempts: number | null
          next_retry_at: string | null
          request_headers: Json | null
          request_payload: Json | null
          response_body: string | null
          response_headers: Json | null
          response_status: number | null
          response_time_ms: number | null
          status: Database["public"]["Enums"]["delivery_status"] | null
          user_id: string
        }
        Insert: {
          attempt_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          endpoint_id: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          max_attempts?: number | null
          next_retry_at?: string | null
          request_headers?: Json | null
          request_payload?: Json | null
          response_body?: string | null
          response_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          user_id: string
        }
        Update: {
          attempt_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          endpoint_id?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          max_attempts?: number | null
          next_retry_at?: string | null
          request_headers?: Json | null
          request_payload?: Json | null
          response_body?: string | null
          response_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      endpoints: {
        Row: {
          created_at: string | null
          description: string | null
          failed_deliveries: number | null
          headers: Json | null
          id: string
          last_triggered_at: string | null
          method: Database["public"]["Enums"]["http_method"] | null
          name: string
          retry_config: Json | null
          secret: string | null
          status: Database["public"]["Enums"]["webhook_status"] | null
          successful_deliveries: number | null
          timeout_ms: number | null
          total_deliveries: number | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          failed_deliveries?: number | null
          headers?: Json | null
          id?: string
          last_triggered_at?: string | null
          method?: Database["public"]["Enums"]["http_method"] | null
          name: string
          retry_config?: Json | null
          secret?: string | null
          status?: Database["public"]["Enums"]["webhook_status"] | null
          successful_deliveries?: number | null
          timeout_ms?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          failed_deliveries?: number | null
          headers?: Json | null
          id?: string
          last_triggered_at?: string | null
          method?: Database["public"]["Enums"]["http_method"] | null
          name?: string
          retry_config?: Json | null
          secret?: string | null
          status?: Database["public"]["Enums"]["webhook_status"] | null
          successful_deliveries?: number | null
          timeout_ms?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          event_type: string
          headers: Json | null
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          headers?: Json | null
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          headers?: Json | null
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
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
      delivery_status: "pending" | "success" | "failed" | "retrying"
      http_method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
      webhook_status: "active" | "inactive" | "paused"
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
      delivery_status: ["pending", "success", "failed", "retrying"],
      http_method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      webhook_status: ["active", "inactive", "paused"],
    },
  },
} as const
