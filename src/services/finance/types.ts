
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

// Ingredient type for expense-inventory integration
export type Ingredient = {
  id: string;
  name: string;
  category?: string;
  unit: string;
  quantity?: number;
  reorder_level?: number;
  stock_quantity?: number;
  supplier?: string;
  type?: string;
  cost?: number;
  origin?: string;
  allergens?: string[];
  dietary?: string[];
  created_at?: string;
  updated_at?: string;
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

// Supplier type for expense-inventory integration
export type Supplier = {
  id: string;
  name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  payment_terms?: string;
  website?: string;
  active?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

// Purchase order types
export type PurchaseOrderStatus = 'pending' | 'ordered' | 'in transit' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'unpaid';

export type PurchaseOrder = {
  id: string;
  supplier_id: string;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  status: PurchaseOrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  supplier?: Supplier;
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  received_quantity?: number;
  created_at?: string;
  updated_at?: string;
  ingredient?: Ingredient;
};

// Inventory transaction type
export type InventoryTransaction = {
  id: string;
  ingredient_id: string;
  transaction_type: 'purchase' | 'consumption' | 'adjustment' | 'waste';
  quantity: number;
  previous_quantity?: number;
  new_quantity: number;
  unit: string;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  ingredient?: Ingredient;
};
