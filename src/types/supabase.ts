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
          email: string
          full_name: string | null
          avatar_url: string | null
          study_goal: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          study_goal?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          study_goal?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          start_time: string
          end_time: string | null
          duration: number | null
          is_productive: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          start_time: string
          end_time?: string | null
          duration?: number | null
          is_productive?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          is_productive?: boolean
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}