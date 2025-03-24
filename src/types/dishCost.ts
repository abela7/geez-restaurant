
export interface DishCostCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DishCost {
  id: string;
  dish_name: string;
  food_item_id: string | null;
  total_ingredient_cost: number;
  total_overhead_cost: number;
  total_cost: number;
  profit_margin: number;
  suggested_price: number;
  manual_price: number | null;
  use_manual_price: boolean;
  created_at: string;
  updated_at: string;
  food_item?: {
    name: string;
    category_id: string | null;
    menu_categories?: {
      name: string;
    };
  };
  dish_ingredients?: DishIngredient[];
  dish_overhead_costs?: DishOverheadCost[];
}

export interface DishIngredient {
  id: string;
  dish_cost_id: string;
  ingredient_id: string | null;
  ingredient_name: string;
  quantity: number;
  unit_type: string;
  unit_cost: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface DishOverheadCost {
  id: string;
  dish_cost_id: string;
  category: string;
  description: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface DishCostHistory {
  id: string;
  dish_cost_id: string;
  previous_cost: number;
  new_cost: number;
  change_date: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
  dish?: {
    dish_name: string;
  };
}

export interface MeasurementUnit {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  description: string | null;
  base_unit_id: string | null;
  conversion_factor: number | null;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  cost: number;
  quantity: number;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewDishIngredient {
  ingredient_id: string | null;
  ingredient_name: string;
  quantity: number;
  unit_type: string;
  unit_cost: number;
  total_cost: number;
}

export interface NewDishOverheadCost {
  category: string;
  description: string;
  cost: number;
}

export interface NewDishCost {
  dish_name: string;
  food_item_id?: string | null;
  profit_margin: number;
  ingredients: NewDishIngredient[];
  overhead_costs: NewDishOverheadCost[];
  manual_price?: number | null;
  use_manual_price: boolean;
}
