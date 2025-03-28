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
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          bg_color: string | null
          created_at: string
          cta_link: string
          cta_text: string
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          bg_color?: string | null
          created_at?: string
          cta_link: string
          cta_text: string
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          bg_color?: string | null
          created_at?: string
          cta_link?: string
          cta_text?: string
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          category: string
          code: string | null
          created_at: string | null
          description: string
          discount: string
          expiry_date: string | null
          featured: boolean | null
          id: string
          image: string | null
          original_price: string | null
          price: string | null
          product_image: string | null
          store_id: string
          title: string
          type: string | null
          updated_at: string | null
          url: string
          used_count: number | null
          verified: boolean | null
        }
        Insert: {
          category: string
          code?: string | null
          created_at?: string | null
          description: string
          discount: string
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          original_price?: string | null
          price?: string | null
          product_image?: string | null
          store_id: string
          title: string
          type?: string | null
          updated_at?: string | null
          url: string
          used_count?: number | null
          verified?: boolean | null
        }
        Update: {
          category?: string
          code?: string | null
          created_at?: string | null
          description?: string
          discount?: string
          expiry_date?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          original_price?: string | null
          price?: string | null
          product_image?: string | null
          store_id?: string
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string
          used_count?: number | null
          verified?: boolean | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          category: string
          category_id: string | null
          country: string | null
          created_at: string | null
          deal_count: number | null
          description: string | null
          featured: boolean | null
          id: string
          logo: string
          name: string
          store_type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          category: string
          category_id?: string | null
          country?: string | null
          created_at?: string | null
          deal_count?: number | null
          description?: string | null
          featured?: boolean | null
          id?: string
          logo: string
          name: string
          store_type?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string
          category_id?: string | null
          country?: string | null
          created_at?: string | null
          deal_count?: number | null
          description?: string | null
          featured?: boolean | null
          id?: string
          logo?: string
          name?: string
          store_type?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          is_admin: boolean | null
          last_sign_in_at: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_admin?: never
          last_sign_in_at?: string | null
          name?: never
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_admin?: never
          last_sign_in_at?: string | null
          name?: never
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
