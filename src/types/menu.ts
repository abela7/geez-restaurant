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
