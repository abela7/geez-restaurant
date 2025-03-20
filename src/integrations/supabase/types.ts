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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          ambience_rating: number | null
          comments: string | null
          created_at: string
          customer_id: string | null
          food_quality: number | null
          id: string
          order_id: string | null
          service_rating: number | null
        }
        Insert: {
          ambience_rating?: number | null
          comments?: string | null
          created_at?: string
          customer_id?: string | null
          food_quality?: number | null
          id?: string
          order_id?: string | null
          service_rating?: number | null
        }
        Update: {
          ambience_rating?: number | null
          comments?: string | null
          created_at?: string
          customer_id?: string | null
          food_quality?: number | null
          id?: string
          order_id?: string | null
          service_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          available: boolean
          category_id: string | null
          cost: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          category_id?: string | null
          cost: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          category_id?: string | null
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          quantity: number
          reorder_level: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          quantity: number
          reorder_level?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          quantity?: number
          reorder_level?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          ingredient_id: string
          notes: string | null
          quantity: number
          reference_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          ingredient_id: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          ingredient_id?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          food_id: string
          id: string
          order_id: string
          price: number
          quantity: number
          special_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          order_id: string
          price: number
          quantity: number
          special_instructions?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          order_id?: string
          price?: number
          quantity?: number
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          status: string
          table_id: string | null
          total_amount: number
          updated_at: string
          waiter_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          status: string
          table_id?: string | null
          total_amount?: number
          updated_at?: string
          waiter_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          status?: string
          table_id?: string | null
          total_amount?: number
          updated_at?: string
          waiter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_waiter_id_fkey"
            columns: ["waiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          attendance: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          hiring_date: string | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          last_name: string | null
          performance: number | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          attendance?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          hiring_date?: string | null
          hourly_rate?: number | null
          id: string
          image_url?: string | null
          last_name?: string | null
          performance?: number | null
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          attendance?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          hiring_date?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          performance?: number | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          food_id: string
          id: string
          ingredient_id: string
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          ingredient_id: string
          quantity: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          floor: number
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          is_active: boolean
          is_guest_table: boolean
          name: string
          room_id: string | null
          status: string
          table_number: number
          updated_at: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          capacity: number
          created_at?: string
          id?: string
          is_active?: boolean
          is_guest_table?: boolean
          name: string
          room_id?: string | null
          status: string
          table_number: number
          updated_at?: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean
          is_guest_table?: boolean
          name?: string
          room_id?: string | null
          status?: string
          table_number?: number
          updated_at?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_table_columns: {
        Args: {
          tablename: string
          schema: string
        }
        Returns: {
          name: string
          data_type: string
          is_nullable: boolean
          column_default: string
        }[]
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          schema: string
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
