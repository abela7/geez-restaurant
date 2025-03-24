
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id?: string;
  food_item_id: string;
  name: string;
  serves: number;
  ingredients?: RecipeIngredient[];
}

// Fetch a recipe by food item ID
export const fetchRecipeByFoodItem = async (foodItemId: string) => {
  try {
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*, recipe_ingredients(*, ingredient:ingredients(*))")
      .eq("food_item_id", foodItemId)
      .single();

    if (error) {
      console.error("Error fetching recipe:", error);
      return null;
    }

    return recipe;
  } catch (error) {
    console.error("Unexpected error fetching recipe:", error);
    return null;
  }
};

// Create a new recipe
export const createRecipe = async (recipe: Recipe) => {
  try {
    // First create the recipe
    const { data: newRecipe, error } = await supabase
      .from("recipes")
      .insert({
        food_item_id: recipe.food_item_id,
        name: recipe.name,
        serves: recipe.serves
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe");
      return null;
    }

    // Then add the ingredients if provided
    if (recipe.ingredients && recipe.ingredients.length > 0 && newRecipe.id) {
      const recipeIngredients = recipe.ingredients.map((ingredient) => ({
        recipe_id: newRecipe.id,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      }));

      const { error: ingredientError } = await supabase
        .from("recipe_ingredients")
        .insert(recipeIngredients);

      if (ingredientError) {
        console.error("Error adding recipe ingredients:", ingredientError);
        toast.error("Recipe created but failed to add ingredients");
        return newRecipe;
      }
    }

    toast.success("Recipe created successfully");
    return newRecipe;
  } catch (error) {
    console.error("Unexpected error creating recipe:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Update recipe ingredients
export const updateRecipeIngredients = async (recipeId: string, ingredients: RecipeIngredient[]) => {
  try {
    // First delete existing ingredients
    const { error: deleteError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", recipeId);

    if (deleteError) {
      console.error("Error deleting existing ingredients:", deleteError);
      toast.error("Failed to update recipe ingredients");
      return false;
    }

    // Then add the new ingredients
    const recipeIngredients = ingredients.map((ingredient) => ({
      recipe_id: recipeId,
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    }));

    const { error: insertError } = await supabase
      .from("recipe_ingredients")
      .insert(recipeIngredients);

    if (insertError) {
      console.error("Error adding recipe ingredients:", insertError);
      toast.error("Failed to update recipe ingredients");
      return false;
    }

    toast.success("Recipe ingredients updated successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error updating recipe ingredients:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};

// Update stock based on order
export const deductIngredientsFromStock = async (foodItemId: string, quantity: number) => {
  try {
    // First get the recipe
    const recipe = await fetchRecipeByFoodItem(foodItemId);
    
    if (!recipe || !recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
      console.warn(`No recipe found for food item ${foodItemId} or no ingredients defined`);
      return false;
    }

    // For each ingredient in the recipe, deduct from stock
    for (const recipeIngredient of recipe.recipe_ingredients) {
      const totalQuantityNeeded = (recipeIngredient.quantity * quantity) / recipe.serves;
      
      // Get current stock level
      const { data: ingredient, error: getError } = await supabase
        .from("ingredients")
        .select("stock_quantity")
        .eq("id", recipeIngredient.ingredient_id)
        .single();

      if (getError) {
        console.error(`Error getting ingredient ${recipeIngredient.ingredient_id}:`, getError);
        continue;
      }

      const currentStock = ingredient.stock_quantity || 0;
      const newStock = Math.max(0, currentStock - totalQuantityNeeded);

      // Update the stock
      const { error: updateError } = await supabase
        .from("ingredients")
        .update({ stock_quantity: newStock })
        .eq("id", recipeIngredient.ingredient_id);

      if (updateError) {
        console.error(`Error updating stock for ingredient ${recipeIngredient.ingredient_id}:`, updateError);
        continue;
      }

      // Log the transaction
      await supabase.from("inventory_transactions").insert({
        ingredient_id: recipeIngredient.ingredient_id,
        transaction_type: "consumption",
        quantity: -totalQuantityNeeded,
        previous_quantity: currentStock,
        new_quantity: newStock,
        unit: recipeIngredient.unit,
        notes: `Used in order for food item: ${foodItemId}`,
        reference_id: foodItemId,
        reference_type: "food_item"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deducting ingredients from stock:", error);
    return false;
  }
};
