
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

// This interface maps between the database structure and our application's OrderItem interface
export interface DbOrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
  food_item: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    category_id: string | null;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
    is_spicy: boolean;
    preparation_time?: number;
  };
}

// Helper function to convert database order items to application order items
export function mapDbOrderItemToOrderItem(dbItem: DbOrderItem): OrderItem {
  return {
    id: dbItem.id,
    foodItem: {
      id: dbItem.food_item.id,
      name: dbItem.food_item.name,
      description: dbItem.food_item.description,
      price: dbItem.food_item.price,
      category_id: dbItem.food_item.category_id,
      is_vegetarian: dbItem.food_item.is_vegetarian,
      is_vegan: dbItem.food_item.is_vegan,
      is_gluten_free: dbItem.food_item.is_gluten_free,
      is_spicy: dbItem.food_item.is_spicy,
      preparation_time: dbItem.food_item.preparation_time
    },
    quantity: dbItem.quantity,
    special_instructions: dbItem.special_instructions || undefined,
    status: dbItem.status
  };
}
