
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "@/types/dishCost";
import { toast } from "sonner";

export const useDishCostIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch ingredients from stock inventory
      const { data, error } = await supabase
        .from("ingredients")
        .select("*")
        .order("name");

      if (error) throw error;

      // Map the inventory ingredients to the dish cost format
      const mappedIngredients = data.map(item => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        cost: item.cost || 0,
        quantity: item.stock_quantity || 0,
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setIngredients(mappedIngredients);
    } catch (err) {
      console.error("Error loading ingredients:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading ingredients'));
      toast.error("Failed to load ingredients");
    } finally {
      setIsLoading(false);
    }
  };

  const createIngredient = async (ingredient: Partial<Ingredient>) => {
    try {
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

      if (error) throw error;

      // Add the new ingredient to our local state
      setIngredients(prev => [...prev, {
        id: data.id,
        name: data.name,
        unit: data.unit,
        cost: data.cost || 0,
        quantity: data.stock_quantity || 0,
        category: data.category,
        created_at: data.created_at,
        updated_at: data.updated_at
      }]);

      return data;
    } catch (err) {
      console.error("Error creating ingredient:", err);
      throw err;
    }
  };

  const updateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
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

      if (error) throw error;

      // Update the ingredient in our local state
      setIngredients(prev => 
        prev.map(ing => ing.id === id ? {
          ...ing,
          name: data.name,
          unit: data.unit,
          cost: data.cost || 0,
          quantity: data.stock_quantity || 0,
          category: data.category,
          created_at: data.created_at,
          updated_at: data.updated_at
        } : ing)
      );

      return data;
    } catch (err) {
      console.error("Error updating ingredient:", err);
      throw err;
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      // Delete the ingredient from the main inventory table
      const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove the ingredient from our local state
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    } catch (err) {
      console.error("Error deleting ingredient:", err);
      throw err;
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
