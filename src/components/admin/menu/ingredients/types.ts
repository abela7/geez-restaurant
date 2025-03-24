
// Shared types for ingredient expenses components
export interface MeasurementUnit {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  category: string;
  unit_id: string;
  cost_per_unit: number;
  stock_quantity?: number;
  reorder_level?: number;
  is_allergen?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IngredientExpense {
  id: string;
  ingredient_id: string;
  ingredient_name?: string;
  unit_id: string;
  unit_name?: string;
  unit_abbreviation?: string;
  quantity: number;
  price_per_unit: number;
  total_cost: number;
  supplier: string;
  purchase_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
