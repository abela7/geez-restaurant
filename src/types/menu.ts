
export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  itemCount?: number;
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
  cost?: number;
  profit_margin?: number;
}

export interface MenuDesignType {
  layout: 'grid' | 'list' | 'compact';
  columns: number;
  showImages: boolean;
  showDescriptions: boolean;
  showPrices: boolean;
  pageSize: 'a4' | 'a5' | 'letter' | 'custom';
  orientation: 'portrait' | 'landscape';
  titleFont: string;
  titleSize: number;
  subtitleFont: string;
  subtitleSize: number;
  bodyFont: string;
  bodySize: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  showBorders: boolean;
  borderColor: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
  headerStyle: 'centered' | 'left-aligned' | 'minimal';
  footerText: string;
  logoPosition: 'top' | 'header' | 'none';
}
