
import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "./types";

export const fetchStock = async (): Promise<Ingredient[]> => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory data");
  }

  return data || [];
};

export const getStockHistory = async (ingredientId: string) => {
  const { data, error } = await supabase
    .from("inventory_transactions")
    .select("*")
    .eq("ingredient_id", ingredientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock history:", error);
    throw new Error("Failed to fetch stock history");
  }

  return data || [];
};

export const getStockAnalytics = async () => {
  // Simplified example - in a real app, you might want to compute this server-side
  const { data: ingredients, error: ingredientsError } = await supabase
    .from("ingredients")
    .select("*");

  if (ingredientsError) {
    console.error("Error fetching ingredients for analytics:", ingredientsError);
    throw new Error("Failed to fetch ingredients for analytics");
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("inventory_transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (transactionsError) {
    console.error("Error fetching transactions for analytics:", transactionsError);
    throw new Error("Failed to fetch transactions for analytics");
  }

  // Count ingredients by category
  const categoryCountMap: Record<string, number> = {};
  ingredients?.forEach(ingredient => {
    const category = ingredient.category || "Uncategorized";
    categoryCountMap[category] = (categoryCountMap[category] || 0) + 1;
  });

  // Calculate stock status counts
  let normal = 0;
  let low = 0;
  let outOfStock = 0;

  ingredients?.forEach(ingredient => {
    const stock = ingredient.stock_quantity || 0;
    const reorderLevel = ingredient.reorder_level || 0;

    if (stock <= 0) {
      outOfStock++;
    } else if (stock <= reorderLevel) {
      low++;
    } else {
      normal++;
    }
  });

  return {
    totalIngredients: ingredients?.length || 0,
    categoryCounts: categoryCountMap,
    stockStatus: {
      normal,
      low,
      outOfStock
    },
    recentTransactions: transactions || []
  };
};

export const addStockItem = async (item: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> => {
  const { data, error } = await supabase
    .from("ingredients")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error adding stock item:", error);
    throw new Error("Failed to add stock item");
  }

  // Create a transaction record for initial stock if quantity > 0
  if (item.stock_quantity && item.stock_quantity > 0) {
    const { error: transactionError } = await supabase
      .from("inventory_transactions")
      .insert([{
        ingredient_id: data.id,
        transaction_type: "initial",
        quantity: item.stock_quantity,
        previous_quantity: 0,
        new_quantity: item.stock_quantity,
        unit: item.unit,
        notes: "Initial inventory setup",
      }]);

    if (transactionError) {
      console.error("Error recording initial transaction:", transactionError);
      // We don't throw here because the item was created successfully
    }
  }

  return data;
};

export const updateStockItem = async (id: string, updates: Partial<Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>>): Promise<Ingredient> => {
  // First, get the current stock level
  const { data: currentItem, error: fetchError } = await supabase
    .from("ingredients")
    .select("stock_quantity")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching current item:", fetchError);
    throw new Error("Failed to update stock item");
  }

  // Update the item
  const { data, error } = await supabase
    .from("ingredients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating stock item:", error);
    throw new Error("Failed to update stock item");
  }

  // If stock quantity was changed, record a transaction
  if (updates.stock_quantity !== undefined && 
      currentItem.stock_quantity !== updates.stock_quantity) {
    const { error: transactionError } = await supabase
      .from("inventory_transactions")
      .insert([{
        ingredient_id: id,
        transaction_type: "adjustment",
        quantity: updates.stock_quantity - currentItem.stock_quantity,
        previous_quantity: currentItem.stock_quantity,
        new_quantity: updates.stock_quantity,
        unit: updates.unit || data.unit,
        notes: "Manual stock adjustment",
      }]);

    if (transactionError) {
      console.error("Error recording adjustment transaction:", transactionError);
      // We don't throw here because the item was updated successfully
    }
  }

  return data;
};

export const adjustStockQuantity = async (
  id: string, 
  quantity: number, 
  notes: string = "", 
  type: 'adjustment' | 'waste' = 'adjustment'
): Promise<boolean> => {
  // Get current stock
  const { data: currentItem, error: fetchError } = await supabase
    .from("ingredients")
    .select("stock_quantity, unit")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching current item:", fetchError);
    throw new Error("Failed to adjust stock quantity");
  }

  const currentQuantity = currentItem.stock_quantity || 0;
  const newQuantity = type === 'adjustment' ? currentQuantity + quantity : currentQuantity - Math.abs(quantity);
  
  // Don't allow negative stock
  const finalQuantity = Math.max(0, newQuantity);

  // Update the stock quantity
  const { error: updateError } = await supabase
    .from("ingredients")
    .update({ stock_quantity: finalQuantity })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating stock quantity:", updateError);
    throw new Error("Failed to adjust stock quantity");
  }

  // Record the transaction
  const { error: transactionError } = await supabase
    .from("inventory_transactions")
    .insert([{
      ingredient_id: id,
      transaction_type: type,
      quantity: type === 'adjustment' ? quantity : -Math.abs(quantity),
      previous_quantity: currentQuantity,
      new_quantity: finalQuantity,
      unit: currentItem.unit,
      notes: notes || `Manual ${type}`,
    }]);

  if (transactionError) {
    console.error("Error recording transaction:", transactionError);
    throw new Error("Failed to record stock adjustment");
  }

  return true;
};

export const addCategory = async (categoryName: string): Promise<void> => {
  // In this implementation, we're adding a placeholder ingredient with the new category
  // which will then make the category available in the dropdown
  // In a production app, you might have a separate categories table
  const { error } = await supabase
    .from("ingredients")
    .insert([{
      name: `${categoryName} Template`,
      category: categoryName,
      unit: 'pcs',
      stock_quantity: 0,
      reorder_level: 0,
    }]);

  if (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }
};
