
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "@/types/dishCost";
import { toast } from "sonner";

export const useDishCostIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // More efficient loading with specific columns and caching
  const loadIngredients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching ingredients data...");
      
      // More efficient query with specific column selection
      const { data, error } = await supabase
        .from("ingredients")
        .select(`
          id, 
          name, 
          unit, 
          cost, 
          stock_quantity, 
          category,
          created_at,
          updated_at
        `)
        .order("name");
      
      if (error) {
        console.error("Supabase error loading ingredients:", error);
        throw error;
      }
      
      // Map the inventory ingredients to the dish cost format
      const mappedIngredients: Ingredient[] = data.map(item => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        cost: item.cost || 0,
        quantity: item.stock_quantity || 0,
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log(`Loaded ${mappedIngredients.length} ingredients successfully`);
      setIngredients(mappedIngredients);
    } catch (err) {
      console.error("Error loading ingredients:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading ingredients'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // Create ingredient with proper type handling
  const createIngredient = async (ingredient: Partial<Ingredient>) => {
    try {
      setIsLoading(true);
      console.log("Creating new ingredient:", ingredient.name);
      
      // Ensure unit consistency
      if (!ingredient.unit) {
        throw new Error("Unit type is required for ingredients");
      }
      
      // Insert the ingredient into the main inventory table
      const { data, error } = await supabase
        .from("ingredients")
        .insert({
          name: ingredient.name,
          unit: ingredient.unit,
          cost: ingredient.cost || 0,
          stock_quantity: ingredient.quantity || 0,
          category: ingredient.category
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating ingredient:", error);
        throw error;
      }

      // Add the new ingredient to our local state with proper types
      const newIngredient: Ingredient = {
        id: data.id,
        name: data.name,
        unit: data.unit,
        cost: data.cost || 0,
        quantity: data.stock_quantity || 0,
        category: data.category,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setIngredients(prev => [...prev, newIngredient]);
      toast.success(`Ingredient "${data.name}" created successfully`);
      
      return data;
    } catch (err) {
      console.error("Error creating ingredient:", err);
      toast.error("Failed to create ingredient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update ingredient with unit type consistency
  const updateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
      setIsLoading(true);
      console.log("Updating ingredient:", id);
      
      // Ensure unit consistency
      if (updates.unit === "") {
        throw new Error("Unit type cannot be empty");
      }
      
      // Update the ingredient in the main inventory table
      const { data, error } = await supabase
        .from("ingredients")
        .update({
          name: updates.name,
          unit: updates.unit,
          cost: updates.cost,
          stock_quantity: updates.quantity,
          category: updates.category
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating ingredient:", error);
        throw error;
      }

      // Update the ingredient in our local state with correct types
      setIngredients(prev => 
        prev.map(ing => ing.id === id ? {
          ...ing,
          name: data.name,
          unit: data.unit,
          cost: data.cost || 0,
          quantity: data.stock_quantity || 0,
          category: data.category,
          updated_at: data.updated_at
        } : ing)
      );
      
      toast.success(`Ingredient "${data.name}" updated successfully`);
      return data;
    } catch (err) {
      console.error("Error updating ingredient:", err);
      toast.error("Failed to update ingredient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ingredient with dependency checking
  const deleteIngredient = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Checking if ingredient is used before deleting:", id);
      
      // First check if the ingredient is being used in any dish costs
      const { data: usedInDishes, error: checkError } = await supabase
        .from('dish_ingredients')
        .select('id')
        .eq('ingredient_id', id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (usedInDishes && usedInDishes.length > 0) {
        throw new Error("Cannot delete ingredient that is used in dish costs");
      }
      
      // Delete the ingredient from the inventory
      const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting ingredient:", error);
        throw error;
      }

      // Remove the ingredient from our local state
      setIngredients(prev => prev.filter(ing => ing.id !== id));
      toast.success("Ingredient deleted successfully");
    } catch (err) {
      console.error("Error deleting ingredient:", err);
      if (err instanceof Error && err.message.includes("used in dish costs")) {
        toast.error("Cannot delete ingredient that is used in dish costs");
      } else {
        toast.error("Failed to delete ingredient");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ingredients,
    isLoading,
    error,
    loadIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient
  };
};
