export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
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
      Follow: {
        Row: {
          createdAt: string
          fromId: string
          id: number
          level: number
          toId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          fromId: string
          id?: number
          level?: number
          toId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          fromId?: string
          id?: number
          level?: number
          toId?: string
          updatedAt?: string
        }
      }
      Groupe: {
        Row: {
          createdAt: string
          id: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          updatedAt?: string
          userId?: string
        }
      }
      Permission: {
        Row: {
          createdAt: string
          id: number
          level: number
          postId: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          level?: number
          postId: number
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          level?: number
          postId?: number
          updatedAt?: string
          userId?: string
        }
      }
      Post: {
        Row: {
          authorId: string
          createdAt: string
          follower: number
          id: number
          public: number
          text: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          createdAt?: string
          follower?: number
          id?: number
          public?: number
          text: string
          updatedAt?: string
        }
        Update: {
          authorId?: string
          createdAt?: string
          follower?: number
          id?: number
          public?: number
          text?: string
          updatedAt?: string
        }
      }
      User: {
        Row: {
          bio: string | null
          createdAt: string
          id: string
          name: string | null
          profilePhotoURL: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
          username: string
        }
        Insert: {
          bio?: string | null
          createdAt?: string
          id: string
          name?: string | null
          profilePhotoURL?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
          username?: string
        }
        Update: {
          bio?: string | null
          createdAt?: string
          id?: string
          name?: string | null
          profilePhotoURL?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
          username?: string
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
      Role: "USER" | "ADMIN"
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
          public?: boolean | null
          updated_at?: string | null
        }
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
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
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
        Returns: string[]
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

