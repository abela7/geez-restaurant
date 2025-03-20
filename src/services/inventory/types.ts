
export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  stock_quantity?: number;
  reorder_level?: number;
  unit: string;
  cost?: number;
  supplier?: string;
  origin?: string;
  allergens?: string[];
  dietary?: string[];
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryTransaction {
  id: string;
  ingredient_id: string;
  transaction_type: 'purchase' | 'adjustment' | 'waste' | 'consumption';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  unit: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  reference_id?: string;
  reference_type?: string;
  ingredient?: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface InventorySupplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  notes?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  order_date: string;
  delivery_date?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
  notes?: string;
}
