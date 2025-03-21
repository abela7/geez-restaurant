
export type OrderType = "dine-in" | "takeout" | "delivery";

export type OrderStep = 
  | "order-type" 
  | "table-selection" 
  | "customer-info" 
  | "menu-selection" 
  | "order-review";

export interface OrderItem {
  id: string;
  foodItem: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    category_id: string | null;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
    is_spicy: boolean;
    categoryName?: string;
    preparation_time?: number;
  };
  quantity: number;
  special_instructions?: string;
  modifiers?: any[];
  status?: string;
}

export interface Order {
  id: string;
  table_id?: string;
  customer_name?: string;
  order_type: OrderType;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  server_id?: string;
  items?: OrderItem[];
}
