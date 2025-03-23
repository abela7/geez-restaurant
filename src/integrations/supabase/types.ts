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
      budget_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: string
          id: string
          is_closed: boolean | null
          open_time: string
          updated_at: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: string
          id?: string
          is_closed?: boolean | null
          open_time: string
          updated_at?: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: string
          id?: string
          is_closed?: boolean | null
          open_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      checklist_item_logs: {
        Row: {
          checklist_item_id: string | null
          checklist_log_id: string | null
          created_at: string | null
          id: string
          is_compliant: boolean | null
          notes: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          checklist_log_id?: string | null
          created_at?: string | null
          id?: string
          is_compliant?: boolean | null
          notes?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          checklist_log_id?: string | null
          created_at?: string | null
          id?: string
          is_compliant?: boolean | null
          notes?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_logs_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_item_logs_checklist_log_id_fkey"
            columns: ["checklist_log_id"]
            isOneToOne: false
            referencedRelation: "checklist_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          requires_value: boolean | null
          template_id: string | null
          updated_at: string | null
          value_type: string | null
          value_unit: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          requires_value?: boolean | null
          template_id?: string | null
          updated_at?: string | null
          value_type?: string | null
          value_unit?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          requires_value?: boolean | null
          template_id?: string | null
          updated_at?: string | null
          value_type?: string | null
          value_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_logs: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_logs_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string | null
          frequency: string
          id: string
          name: string
          required_time: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          frequency: string
          id?: string
          name: string
          required_time?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: string
          id?: string
          name?: string
          required_time?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          atmosphere_rating: number | null
          comments: string | null
          created_at: string | null
          customer_id: string | null
          food_rating: number | null
          id: string
          order_id: string | null
          overall_rating: number
          service_rating: number | null
          updated_at: string | null
        }
        Insert: {
          atmosphere_rating?: number | null
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_rating?: number | null
          id?: string
          order_id?: string | null
          overall_rating: number
          service_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          atmosphere_rating?: number | null
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_rating?: number | null
          id?: string
          order_id?: string | null
          overall_rating?: number
          service_rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_promotions: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          promotion_id: string
          redeemed: boolean
          redeemed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          promotion_id: string
          redeemed?: boolean
          redeemed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          promotion_id?: string
          redeemed?: boolean
          redeemed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_promotions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_promotions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          last_visit: string | null
          loyalty_level: string | null
          loyalty_points: number | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          visits: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          loyalty_level?: string | null
          loyalty_points?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          visits?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          loyalty_level?: string | null
          loyalty_points?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          visits?: number | null
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          ingredient_id: string | null
          payee: string
          payment_method: string
          quantity: number | null
          reference: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          ingredient_id?: string | null
          payee: string
          payment_method: string
          quantity?: number | null
          reference?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          ingredient_id?: string | null
          payee?: string
          payment_method?: string
          quantity?: number | null
          reference?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          available: boolean | null
          category_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_gluten_free: boolean | null
          is_spicy: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          preparation_time: number | null
          price: number
          profit_margin: number | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_spicy?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          profit_margin?: number | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_spicy?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          profit_margin?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          allergens: string[] | null
          category: string | null
          cost: number | null
          created_at: string | null
          dietary: string[] | null
          id: string
          name: string
          origin: string | null
          quantity: number | null
          reorder_level: number | null
          stock_quantity: number | null
          supplier: string | null
          type: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          dietary?: string[] | null
          id?: string
          name: string
          origin?: string | null
          quantity?: number | null
          reorder_level?: number | null
          stock_quantity?: number | null
          supplier?: string | null
          type?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          dietary?: string[] | null
          id?: string
          name?: string
          origin?: string | null
          quantity?: number | null
          reorder_level?: number | null
          stock_quantity?: number | null
          supplier?: string | null
          type?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          ingredient_id: string | null
          new_quantity: number
          notes: string | null
          previous_quantity: number | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          ingredient_id?: string | null
          new_quantity: number
          notes?: string | null
          previous_quantity?: number | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          ingredient_id?: string | null
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_notifications: {
        Row: {
          created_at: string | null
          created_by: string
          for_role: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          for_role: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          for_role?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      modifier_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      modifier_options: {
        Row: {
          created_at: string | null
          id: string
          modifier_group_id: string | null
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          modifier_group_id?: string | null
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          modifier_group_id?: string | null
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modifier_options_modifier_group_id_fkey"
            columns: ["modifier_group_id"]
            isOneToOne: false
            referencedRelation: "modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_budgets: {
        Row: {
          actual_amount: number | null
          budget_amount: number
          category_id: string | null
          created_at: string | null
          id: string
          month: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          budget_amount: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          month: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          budget_amount?: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          month?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          food_item_id: string | null
          id: string
          order_id: string | null
          quantity: number
          special_instructions: string | null
          status: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_item_id_fkey"
            columns: ["food_item_id"]
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
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          discount_amount: number | null
          final_amount: number | null
          id: string
          notes: string | null
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          server_id: string | null
          status: string | null
          table_id: string | null
          tax_amount: number | null
          tip_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          server_id?: string | null
          status?: string | null
          table_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          final_amount?: number | null
          id?: string
          notes?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          server_id?: string | null
          status?: string | null
          table_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          change_date: string | null
          created_at: string | null
          food_item_id: string | null
          id: string
          new_price: number
          old_price: number
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          change_date?: string | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          new_price: number
          old_price: number
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          change_date?: string | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          new_price?: number
          old_price?: number
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          attendance: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          dishes_prepared: number | null
          efficiency_rating: number | null
          email: string | null
          first_name: string | null
          gender: string | null
          hiring_date: string | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          last_name: string | null
          password: string | null
          performance: number | null
          phone: string | null
          role: string
          skills: string[] | null
          start_date: string | null
          total_customers_served: number | null
          total_hours_worked: number | null
          total_orders_completed: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          attendance?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          dishes_prepared?: number | null
          efficiency_rating?: number | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          hiring_date?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          password?: string | null
          performance?: number | null
          phone?: string | null
          role: string
          skills?: string[] | null
          start_date?: string | null
          total_customers_served?: number | null
          total_hours_worked?: number | null
          total_orders_completed?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          attendance?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          dishes_prepared?: number | null
          efficiency_rating?: number | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          hiring_date?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          password?: string | null
          performance?: number | null
          phone?: string | null
          role?: string
          skills?: string[] | null
          start_date?: string | null
          total_customers_served?: number | null
          total_hours_worked?: number | null
          total_orders_completed?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          description: string
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          min_purchase: number | null
          name: string
          start_date: string
          status: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          min_purchase?: number | null
          name: string
          start_date: string
          status?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          min_purchase?: number | null
          name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          purchase_order_id: string | null
          quantity: number
          received_quantity: number | null
          total_price: number
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          purchase_order_id?: string | null
          quantity: number
          received_quantity?: number | null
          total_price: number
          unit: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          purchase_order_id?: string | null
          quantity?: number
          received_quantity?: number | null
          total_price?: number
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          payment_status: string | null
          status: string | null
          supplier_id: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          payment_status?: string | null
          status?: string | null
          supplier_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          payment_status?: string | null
          status?: string | null
          supplier_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_orders: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      recent_orders: {
        Row: {
          created_at: string | null
          customer_name: string | null
          id: string
          items_count: number
          order_type: string
          status: string
          table_id: string | null
          total_amount: number
          updated_at: string | null
          waiter_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          items_count: number
          order_type: string
          status: string
          table_id?: string | null
          total_amount: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          id?: string
          items_count?: number
          order_type?: string
          status?: string
          table_id?: string | null
          total_amount?: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recent_orders_waiter_id_fkey"
            columns: ["waiter_id"]
            isOneToOne: false
            referencedRelation: "waiters"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          ingredient_id: string | null
          quantity: number
          recipe_id: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          quantity: number
          recipe_id?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          quantity?: number
          recipe_id?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cost_per_serving: number | null
          created_at: string | null
          food_item_id: string | null
          id: string
          name: string
          serves: number | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          cost_per_serving?: number | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          name: string
          serves?: number | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_per_serving?: number | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          name?: string
          serves?: number | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          end_time: string | null
          id: string
          party_size: number
          reservation_date: string
          special_requests: string | null
          start_time: string
          status: string | null
          table_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          end_time?: string | null
          id?: string
          party_size: number
          reservation_date: string
          special_requests?: string | null
          start_time: string
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          end_time?: string | null
          id?: string
          party_size?: number
          reservation_date?: string
          special_requests?: string | null
          start_time?: string
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_branding: {
        Row: {
          cover_image_url: string | null
          created_at: string
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_profile: {
        Row: {
          address: string | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          email: string | null
          founded_year: number | null
          id: string
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          capacity: number
          created_at: string | null
          group_id: string | null
          height: number | null
          id: string
          location: string | null
          position_x: number | null
          position_y: number | null
          room_id: string | null
          rotation: number | null
          shape: string | null
          status: string | null
          table_number: number
          updated_at: string | null
          width: number | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          group_id?: string | null
          height?: number | null
          id?: string
          location?: string | null
          position_x?: number | null
          position_y?: number | null
          room_id?: string | null
          rotation?: number | null
          shape?: string | null
          status?: string | null
          table_number: number
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          group_id?: string | null
          height?: number | null
          id?: string
          location?: string | null
          position_x?: number | null
          position_y?: number | null
          room_id?: string | null
          rotation?: number | null
          shape?: string | null
          status?: string | null
          table_number?: number
          updated_at?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "table_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_tables_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          name: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          name: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          name?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          hours_worked: number | null
          id: string
          notes: string | null
          staff_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          hours_worked?: number | null
          id?: string
          notes?: string | null
          staff_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          hours_worked?: number | null
          id?: string
          notes?: string | null
          staff_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_payroll: {
        Row: {
          created_at: string | null
          id: string
          overtime_hours: number | null
          pay_period: string
          payment_date: string | null
          payment_status: string | null
          regular_hours: number | null
          staff_id: string
          total_hours: number | null
          total_pay: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          overtime_hours?: number | null
          pay_period: string
          payment_date?: string | null
          payment_status?: string | null
          regular_hours?: number | null
          staff_id: string
          total_hours?: number | null
          total_pay?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          overtime_hours?: number | null
          pay_period?: string
          payment_date?: string | null
          payment_status?: string | null
          regular_hours?: number | null
          staff_id?: string
          total_hours?: number | null
          total_pay?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_payroll_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_schedules: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          shift_id: string | null
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          shift_id?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          shift_id?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_schedules_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_schedules_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_tasks: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          priority: string | null
          staff_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
          staff_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          priority?: string | null
          staff_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_tasks_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_category_mappings: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supplier_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_category_mappings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean | null
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      table_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          room_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          room_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          room_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_groups_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      table_guests: {
        Row: {
          created_at: string | null
          guest_count: number
          id: string
          notes: string | null
          seated_at: string | null
          server_name: string | null
          status: string | null
          table_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_count: number
          id?: string
          notes?: string | null
          seated_at?: string | null
          server_name?: string | null
          status?: string | null
          table_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_count?: number
          id?: string
          notes?: string | null
          seated_at?: string | null
          server_name?: string | null
          status?: string | null
          table_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_guests_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_layouts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          room_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          room_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          room_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_layouts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      test_123: {
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
      translations: {
        Row: {
          am: string
          created_at: string | null
          en: string
          id: string
          key: string
          updated_at: string | null
        }
        Insert: {
          am: string
          created_at?: string | null
          en: string
          id?: string
          key: string
          updated_at?: string | null
        }
        Update: {
          am?: string
          created_at?: string | null
          en?: string
          id?: string
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          role_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          name: string
          role_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          role_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accounts_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity: string
          id: string
          ip_address: string | null
          status: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          activity: string
          id?: string
          ip_address?: string | null
          status?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          activity?: string
          id?: string
          ip_address?: string | null
          status?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      waiters: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      expense_inventory_view: {
        Row: {
          amount: number | null
          category_id: string | null
          category_name: string | null
          category_type: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          ingredient_id: string | null
          ingredient_name: string | null
          ingredient_unit: string | null
          payee: string | null
          payment_method: string | null
          quantity: number | null
          reference: string | null
          unit: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      increment_promotion_usage: {
        Args: {
          promotion_id: string
        }
        Returns: undefined
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
