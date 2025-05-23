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
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          voiceflow_api_key: string | null
          voiceflow_project_id: string | null
          voiceflow_config: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          voiceflow_api_key?: string | null
          voiceflow_project_id?: string | null
          voiceflow_config?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          voiceflow_api_key?: string | null
          voiceflow_project_id?: string | null
          voiceflow_config?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
} 
