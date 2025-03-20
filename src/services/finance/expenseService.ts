
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseWithCategory } from "./types";

/**
 * Fetches expenses with optional filters
 */
export const fetchExpenses = async (
  searchTerm = "",
  categoryFilter = "All",
  dateFilter = "All"
): Promise<ExpenseWithCategory[]> => {
  let query = supabase
    .from("expenses")
    .select(`*, category:expense_categories(*)`)
    .order("date", { ascending: false });

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `payee.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%`
    );
  }

  // Apply category filter
  if (categoryFilter !== "All") {
    query = query.eq("category_id", categoryFilter);
  }

  // Apply date filter
  const now = new Date();
  if (dateFilter === "Today") {
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("date", `${today}T00:00:00Z`).lt("date", `${today}T23:59:59Z`);
  } else if (dateFilter === "This Week") {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("date", oneWeekAgo);
  } else if (dateFilter === "This Month") {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    query = query.gte("date", firstDayOfMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error(error.message);
  }

  return data as ExpenseWithCategory[];
};

/**
 * Adds a new expense
 */
export const addExpense = async (expense: Omit<Expense, "id" | "created_at" | "updated_at">): Promise<Expense> => {
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
