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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean
          emoji: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          emoji?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          emoji?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      cities: {
        Row: {
          active: boolean
          city_name: string
          created_at: string
          delivery_fee: number
          delivery_time_max: number | null
          delivery_time_min: number | null
          free_shipping_min: number | null
          id: string
          slug: string
          state: string
        }
        Insert: {
          active?: boolean
          city_name: string
          created_at?: string
          delivery_fee?: number
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          free_shipping_min?: number | null
          id?: string
          slug: string
          state: string
        }
        Update: {
          active?: boolean
          city_name?: string
          created_at?: string
          delivery_fee?: number
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          free_shipping_min?: number | null
          id?: string
          slug?: string
          state?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          expires_at: string | null
          first_order_only: boolean
          id: string
          max_uses: number | null
          min_order: number | null
          type: string
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          expires_at?: string | null
          first_order_only?: boolean
          id?: string
          max_uses?: number | null
          min_order?: number | null
          type: string
          used_count?: number
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          expires_at?: string | null
          first_order_only?: boolean
          id?: string
          max_uses?: number | null
          min_order?: number | null
          type?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      occasions: {
        Row: {
          active: boolean
          emoji: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          emoji?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          active?: boolean
          emoji?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address_cep: string
          address_city: string
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string
          address_state: string
          address_street: string
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string
          card_message: string | null
          city_slug: string | null
          coupon_code: string | null
          created_at: string
          delivery_date: string | null
          delivery_fee: number
          delivery_period: string | null
          discount: number
          id: string
          items: Json
          order_number: string
          payment_method: string | null
          payment_status: string
          recipient_name: string
          recipient_phone: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address_cep: string
          address_city: string
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number: string
          address_state: string
          address_street: string
          buyer_email?: string | null
          buyer_name: string
          buyer_phone: string
          card_message?: string | null
          city_slug?: string | null
          coupon_code?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_fee?: number
          delivery_period?: string | null
          discount?: number
          id?: string
          items?: Json
          order_number: string
          payment_method?: string | null
          payment_status?: string
          recipient_name: string
          recipient_phone?: string | null
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address_cep?: string
          address_city?: string
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string
          address_state?: string
          address_street?: string
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string
          card_message?: string | null
          city_slug?: string | null
          coupon_code?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_fee?: number
          delivery_period?: string | null
          discount?: number
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string | null
          payment_status?: string
          recipient_name?: string
          recipient_phone?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          badge: string | null
          category_slug: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          images: string[]
          name: string
          occasion_slugs: string[]
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          slug: string
          stock_qty: number | null
          stock_unlimited: boolean
          tags: string[]
        }
        Insert: {
          active?: boolean
          badge?: string | null
          category_slug?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          name: string
          occasion_slugs?: string[]
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          slug: string
          stock_qty?: number | null
          stock_unlimited?: boolean
          tags?: string[]
        }
        Update: {
          active?: boolean
          badge?: string | null
          category_slug?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          name?: string
          occasion_slugs?: string[]
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          slug?: string
          stock_qty?: number | null
          stock_unlimited?: boolean
          tags?: string[]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          buyer_name: string
          comment: string | null
          created_at: string
          id: string
          image_url: string | null
          product_slug: string | null
          rating: number
        }
        Insert: {
          approved?: boolean
          buyer_name: string
          comment?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          product_slug?: string | null
          rating: number
        }
        Update: {
          approved?: boolean
          buyer_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          product_slug?: string | null
          rating?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_coupon_by_code: {
        Args: { _code: string }
        Returns: {
          code: string
          expires_at: string
          first_order_only: boolean
          min_order: number
          type: string
          value: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
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
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
