
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
  category?: ExpenseCategory;
};

export type ExpenseWithCategory = Expense & {
  category: ExpenseCategory;
};
