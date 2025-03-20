
// Expense category types
export type ExpenseCategory = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  created_at: string | null;
  updated_at: string | null;
};

// Expense types
export type Expense = {
  id: string;
  category_id: string;
  amount: number;
  payee: string;
  payment_method: string;
  reference: string | null;
  description: string | null;
  date: string;
  created_at: string | null;
  updated_at: string | null;
  ingredient_id?: string | null;
  quantity?: number | null;
  unit?: string | null;
  category?: ExpenseCategory;
};

export type ExpenseWithCategory = Expense & {
  category: ExpenseCategory;
};

// Ingredient type needed for expense-inventory integration
export type Ingredient = {
  id: string;
  name: string;
  category?: string;
  unit: string;
  quantity?: number;
  reorder_level?: number;
  stock_quantity?: number;
};

// Type for the expense-inventory view
export type ExpenseInventoryView = {
  id: string;
  date: string;
  amount: number;
  category_id: string;
  payee: string;
  payment_method: string;
  reference: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  ingredient_id: string | null;
  quantity: number | null;
  unit: string | null;
  category_name: string;
  category_type: string;
  ingredient_name: string | null;
  ingredient_unit: string | null;
};
