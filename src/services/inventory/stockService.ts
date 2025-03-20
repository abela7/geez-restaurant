
import { supabase } from "@/integrations/supabase/client";
import { Ingredient, InventoryTransaction } from "./types";
import { toast } from "sonner";

// Fetch all ingredients with stock information
export const fetchStock = async (): Promise<Ingredient[]> => {
  try {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching stock:", error);
      toast.error("Failed to load stock items");
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching stock:", error);
    toast.error("An unexpected error occurred");
    return [];
  }
};

// Add a new ingredient to stock
export const addStockItem = async (ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient | null> => {
  try {
    const { data, error } = await supabase
      .from("ingredients")
      .insert(ingredient)
      .select()
      .single();

    if (error) {
      console.error("Error adding stock item:", error);
      toast.error("Failed to add new item");
      return null;
    }

    toast.success("Item added successfully");
    return data;
  } catch (error) {
    console.error("Unexpected error adding stock item:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Update an existing stock item
export const updateStockItem = async (id: string, updates: Partial<Ingredient>): Promise<Ingredient | null> => {
  try {
    const { data, error } = await supabase
      .from("ingredients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating stock item:", error);
      toast.error("Failed to update item");
      return null;
    }

    toast.success("Item updated successfully");
    return data;
  } catch (error) {
    console.error("Unexpected error updating stock item:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Adjust stock quantity and log transaction
export const adjustStockQuantity = async (
  id: string,
  adjustmentQuantity: number,
  reason: string,
  transactionType: 'adjustment' | 'waste' | 'consumption' | 'purchase' = 'adjustment'
): Promise<boolean> => {
  try {
    // First get current stock quantity
    const { data: ingredient, error: fetchError } = await supabase
      .from("ingredients")
      .select("stock_quantity, unit")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current stock:", fetchError);
      toast.error("Failed to fetch current stock level");
      return false;
    }

    const currentQuantity = ingredient.stock_quantity || 0;
    const newQuantity = currentQuantity + adjustmentQuantity;

    if (newQuantity < 0) {
      toast.error("Cannot reduce stock below zero");
      return false;
    }

    // Update the stock quantity
    const { error: updateError } = await supabase
      .from("ingredients")
      .update({ 
        stock_quantity: newQuantity, 
        updated_at: new Date().toISOString() // Convert Date to string
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating stock quantity:", updateError);
      toast.error("Failed to update stock quantity");
      return false;
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from("inventory_transactions")
      .insert({
        ingredient_id: id,
        transaction_type: transactionType,
        quantity: adjustmentQuantity,
        previous_quantity: currentQuantity,
        new_quantity: newQuantity,
        unit: ingredient.unit,
        notes: reason,
        created_by: "admin" // Would be replaced with actual user ID in production
      });

    if (logError) {
      console.error("Error logging transaction:", logError);
      toast.warning("Stock updated but transaction log failed");
      // Still return true since the stock update was successful
      return true;
    }

    toast.success("Stock quantity adjusted successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error adjusting stock:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};

// Get inventory transaction history
export const getStockHistory = async (ingredientId: string): Promise<InventoryTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from("inventory_transactions")
      .select(`
        *,
        ingredient:ingredients(id, name, unit)
      `)
      .eq("ingredient_id", ingredientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching stock history:", error);
      toast.error("Failed to load transaction history");
      return [];
    }

    // Cast the transaction_type to the expected enum type
    const typedData = data?.map(item => ({
      ...item,
      transaction_type: item.transaction_type as 'purchase' | 'adjustment' | 'waste' | 'consumption'
    }));

    return typedData || [];
  } catch (error) {
    console.error("Unexpected error fetching stock history:", error);
    toast.error("An unexpected error occurred");
    return [];
  }
};

// Generate stock analytics
export const getStockAnalytics = async (): Promise<any> => {
  try {
    // Get ingredients with their stock status
    const { data: ingredients, error: ingredientsError } = await supabase
      .from("ingredients")
      .select("*");

    if (ingredientsError) {
      console.error("Error fetching ingredients for analytics:", ingredientsError);
      toast.error("Failed to generate analytics");
      return null;
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("inventory_transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (transactionsError) {
      console.error("Error fetching transactions for analytics:", transactionsError);
      toast.error("Failed to generate transaction analytics");
      return null;
    }

    // Process data for analytics
    const categoryCounts = ingredients.reduce((acc: {[key: string]: number}, ingredient) => {
      const category = ingredient.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const stockStatus = {
      normal: ingredients.filter(i => (i.stock_quantity || 0) > (i.reorder_level || 0)).length,
      low: ingredients.filter(i => {
        const stock = i.stock_quantity || 0;
        const reorder = i.reorder_level || 0;
        return stock <= reorder && stock > 0;
      }).length,
      outOfStock: ingredients.filter(i => (i.stock_quantity || 0) === 0).length
    };

    // Ensure transaction_type is cast to the expected enum values
    const typedTransactions = transactions.map(tx => ({
      ...tx,
      transaction_type: tx.transaction_type as 'purchase' | 'adjustment' | 'waste' | 'consumption'
    }));

    const transactionTypes = typedTransactions.reduce((acc: {[key: string]: number}, tx) => {
      acc[tx.transaction_type] = (acc[tx.transaction_type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalItems: ingredients.length,
      categoryCounts,
      stockStatus,
      transactionTypes,
      recentTransactions: typedTransactions.slice(0, 10)
    };
  } catch (error) {
    console.error("Unexpected error generating analytics:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};
