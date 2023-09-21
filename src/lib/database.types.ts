export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Category: {
        Row: {
          color: string | null
          created_at: string | null
          updated_at: string
          user_id: string
          uuid: string
          value: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          updated_at?: string
          user_id: string
          uuid?: string
          value: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          updated_at?: string
          user_id?: string
          uuid?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "Category_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "User"
            referencedColumns: ["uuid"]
          }
        ]
      }
      Invoice: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          currency: string
          currency_decimal: number
          email_content: string
          email_created: string
          email_id: string
          is_deleted: boolean
          is_valid: boolean
          other_amounts: number[]
          parser: string
          sender_email_id: string | null
          token_size: number | null
          updated_at: string
          user_id: string
          uuid: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          currency: string
          currency_decimal: number
          email_content: string
          email_created: string
          email_id: string
          is_deleted?: boolean
          is_valid?: boolean
          other_amounts: number[]
          parser?: string
          sender_email_id?: string | null
          token_size?: number | null
          updated_at?: string
          user_id: string
          uuid?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          currency?: string
          currency_decimal?: number
          email_content?: string
          email_created?: string
          email_id?: string
          is_deleted?: boolean
          is_valid?: boolean
          other_amounts?: number[]
          parser?: string
          sender_email_id?: string | null
          token_size?: number | null
          updated_at?: string
          user_id?: string
          uuid?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Invoice_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "Category"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "Invoice_sender_email_id_fkey"
            columns: ["sender_email_id"]
            referencedRelation: "SenderEmail"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "Invoice_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "User"
            referencedColumns: ["uuid"]
          }
        ]
      }
      SenderEmail: {
        Row: {
          category_id: string | null
          created_at: string | null
          email: string
          filter_id: string
          is_deleted: boolean
          remove_from_inbox: boolean
          updated_at: string
          user_email: string | null
          user_id: string
          uuid: string
          word_filter: string[] | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          email: string
          filter_id: string
          is_deleted?: boolean
          remove_from_inbox?: boolean
          updated_at?: string
          user_email?: string | null
          user_id: string
          uuid?: string
          word_filter?: string[] | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          email?: string
          filter_id?: string
          is_deleted?: boolean
          remove_from_inbox?: boolean
          updated_at?: string
          user_email?: string | null
          user_id?: string
          uuid?: string
          word_filter?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "SenderEmail_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "Category"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "SenderEmail_user_email_fkey"
            columns: ["user_email"]
            referencedRelation: "UserEmail"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "SenderEmail_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "User"
            referencedColumns: ["uuid"]
          }
        ]
      }
      Task: {
        Row: {
          created_at: string | null
          is_active: boolean
          last_run: string
          schedule: string
          timezone: string
          updated_at: string
          user_email_id: string
          user_id: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          is_active?: boolean
          last_run?: string
          schedule: string
          timezone: string
          updated_at?: string
          user_email_id: string
          user_id?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          is_active?: boolean
          last_run?: string
          schedule?: string
          timezone?: string
          updated_at?: string
          user_email_id?: string
          user_id?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Task_user_email_id_fkey"
            columns: ["user_email_id"]
            referencedRelation: "UserEmail"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "Task_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "User"
            referencedColumns: ["uuid"]
          }
        ]
      }
      User: {
        Row: {
          created_at: string | null
          currency: string
          currency_object: string | null
          email: string
          first_name: string
          last_name: string
          save_email_content: boolean
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string | null
          currency: string
          currency_object?: string | null
          email: string
          first_name: string
          last_name: string
          save_email_content?: boolean
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          currency_object?: string | null
          email?: string
          first_name?: string
          last_name?: string
          save_email_content?: boolean
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      UserEmail: {
        Row: {
          created_at: string | null
          email: string
          updated_at: string
          user_id: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          email: string
          updated_at?: string
          user_id?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          updated_at?: string
          user_id?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserEmail_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "User"
            referencedColumns: ["uuid"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_average_amount_in_date_range: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: number
      }
      calculate_total_invoice_amount: {
        Args: {
          after_date: string
        }
        Returns: number
      }
      calculate_total_invoice_amount_by_category: {
        Args: {
          after_date: string
        }
        Returns: {
          category_name: string
          total_amount: number
          category_color: string
        }[]
      }
      get_invoice_line_graph_data: {
        Args: {
          after_date: string
        }
        Returns: {
          total_amount: number
          invoice_date: string
        }[]
      }
      get_invoice_with_category_and_sender: {
        Args: {
          category_filter?: string[]
          vendor_filter?: string
          date_filter_start?: string
          date_filter_end?: string
          sender_filter?: string[]
        }
        Returns: {
          row_count: number
          uuid: string
          email_created: string
          amount: number
          vendor: string
          category: string
          color: string
          sender_email: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
