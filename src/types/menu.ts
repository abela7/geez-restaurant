
export interface FoodItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category_id: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_beverage?: boolean;
  categoryName?: string;
  preparation_time?: number;
  image_url?: string;
  available?: boolean;
  menu_categories?: {
    id: string;
    name: string;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  active: boolean;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  available?: boolean;
}

export interface MenuNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  for_role: string;
  created_by: string;
  created_at: string;
  read: boolean;
}
