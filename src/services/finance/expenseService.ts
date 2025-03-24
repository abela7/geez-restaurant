
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseWithCategory } from "./types";

/**
 * Fetches expenses with optional filtering
 */
export const fetchExpenses = async (
  searchTerm?: string,
  categoryFilter?: string,
  dateFilter?: string,
  dateRange?: { from: string; to: string }
): Promise<ExpenseWithCategory[]> => {
  let query = supabase
    .from("expenses")
    .select(`
      *,
      category:expense_categories(id, name, type, description, created_at, updated_at)
    `)
    .order("date", { ascending: false });

  // Apply search filter
  if (searchTerm) {
    query = query.or(`payee.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Apply category filter
  if (categoryFilter && categoryFilter !== "All") {
    query = query.eq("category_id", categoryFilter);
  }

  // Apply predefined date filter
  if (dateFilter && dateFilter !== "All") {
    const now = new Date();
    
    switch (dateFilter) {
      case "Today":
        const today = new Date().toISOString().split("T")[0];
        query = query.gte("date", today);
        break;
      case "This Week":
        const lastWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte("date", lastWeek);
        break;
      case "This Month":
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        query = query.gte("date", lastMonth);
        break;
      default:
        break;
    }
  }

  // Apply custom date range filter if provided
  if (dateRange?.from && dateRange?.to) {
    // Make inclusive date range
    const startDate = `${dateRange.from}T00:00:00`;
    const endDate = `${dateRange.to}T23:59:59`;
    
    query = query
      .gte("date", startDate)
      .lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error(error.message);
  }

  // Make sure the returned data matches the ExpenseWithCategory type
  // by ensuring all expected fields are present
  return data.map(expense => ({
    ...expense,
    category: expense.category || {
      id: '',
      name: 'Uncategorized',
      type: 'uncategorized',
      description: null,
      created_at: null,
      updated_at: null
    }
  })) as ExpenseWithCategory[];
};

/**
 * Adds a new expense
 */
export const addExpense = async (
  expense: Omit<Expense, "id" | "created_at" | "updated_at">
): Promise<Expense> => {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing expense
 */
export const updateExpense = async (
  id: string,
  updates: Partial<Omit<Expense, "id" | "created_at" | "updated_at">>
): Promise<Expense> => {
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Deletes an expense
 */
export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error(error.message);
  }
};
