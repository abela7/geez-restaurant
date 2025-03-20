
import { supabase } from "@/integrations/supabase/client";
import { ExpenseCategory } from "./types";

/**
 * Fetches all expense categories from the database
 */
export const fetchExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching expense categories:", error);
    throw new Error(error.message);
  }

  // Add default type if not present (shouldn't be needed anymore after migration)
  return data.map(category => ({
    ...category,
    type: category.type || "operational"
  }));
};

/**
 * Adds a new expense category
 */
export const addExpenseCategory = async (
  category: Omit<ExpenseCategory, "id" | "created_at" | "updated_at">
): Promise<ExpenseCategory> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("Error adding expense category:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an existing expense category
 */
export const updateExpenseCategory = async (
  id: string,
  updates: Partial<Omit<ExpenseCategory, "id" | "created_at" | "updated_at">>
): Promise<ExpenseCategory> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense category:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Deletes an expense category
 */
export const deleteExpenseCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("expense_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense category:", error);
    throw new Error(error.message);
  }
};
