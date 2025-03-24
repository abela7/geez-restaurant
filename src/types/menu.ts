
export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  itemCount?: number; // Add this property to fix the type error
}

export interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  menu_categories?: {
    id: string;
    name: string;
  };
  available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  preparation_time?: number | null;
  categoryName?: string;
}
