export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      wordbooks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          language: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          language: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          language: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wordbooks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string | null
          definition: string
          id: string
          notes: string | null
          part_of_speech: string | null
          term: string
          updated_at: string | null
          wordbook_id: string | null
        }
        Insert: {
          created_at?: string | null
          definition: string
          id?: string
          notes?: string | null
          part_of_speech?: string | null
          term: string
          updated_at?: string | null
          wordbook_id?: string | null
        }
        Update: {
          created_at?: string | null
          definition: string
          id?: string
          notes?: string | null
          part_of_speech?: string | null
          term: string
          updated_at?: string | null
          wordbook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "words_wordbook_id_fkey"
            columns: ["wordbook_id"]
            referencedRelation: "wordbooks"
            referencedColumns: ["id"]
          },
        ]
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

