
import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "./types";

/**
 * Fetches all ingredients from the database
 */
export const fetchIngredients = async (): Promise<Ingredient[]> => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching ingredients:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates an ingredient's quantity
 */
export const updateIngredientQuantity = async (
  ingredientId: string,
  quantity: number
): Promise<void> => {
  const { data: ingredient, error: fetchError } = await supabase
    .from("ingredients")
    .select("stock_quantity")
    .eq("id", ingredientId)
    .single();

  if (fetchError) {
    console.error("Error fetching ingredient:", fetchError);
    throw new Error(fetchError.message);
  }

  const newQuantity = ingredient ? (parseFloat(ingredient.stock_quantity.toString()) || 0) + quantity : quantity;

  const { error: updateError } = await supabase
    .from("ingredients")
    .update({ stock_quantity: newQuantity })
    .eq("id", ingredientId);

  if (updateError) {
    console.error("Error updating ingredient quantity:", updateError);
    throw new Error(updateError.message);
  }

  // Create inventory transaction record
  const { error: transactionError } = await supabase
    .from("inventory_transactions")
    .insert({
      ingredient_id: ingredientId,
      transaction_type: "purchase",
      quantity: quantity,
      previous_quantity: ingredient?.stock_quantity || 0,
      new_quantity: newQuantity,
      unit: "unit", // This should be dynamic based on the ingredient
      notes: "Added through expense tracking"
    });

  if (transactionError) {
    console.error("Error recording inventory transaction:", transactionError);
    throw new Error(transactionError.message);
  }
};

/**
 * Returns a mapping of expense categories to ingredient categories
 * to help with filtering ingredients by expense category
 */
export const getCategoryIngredientMapping = (): Record<string, string> => {
  return {
    "Food Purchases": "food",
    "Beverages": "beverage",
    "Produce": "produce",
    "Meat and Fish": "protein",
    "Dairy": "dairy",
    "Dry Goods": "dry",
    "Kitchen Supplies": "kitchen",
    "Cleaning Supplies": "cleaning"
  };
};
