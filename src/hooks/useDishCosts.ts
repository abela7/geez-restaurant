
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  DishCost, 
  Ingredient, 
  MeasurementUnit, 
  NewDishCost, 
  DishCostHistory 
} from "@/types/dishCost";
import { useDishCostIngredients } from "./useDishCostIngredients";

export const useDishCosts = () => {
  const [dishCosts, setDishCosts] = useState<DishCost[]>([]);
  const [costHistory, setCostHistory] = useState<DishCostHistory[]>([]);
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use our synchronized ingredients hook
  const { 
    ingredients, 
    isLoading: ingredientsLoading, 
    createIngredient: createDishIngredient, 
    updateIngredient: updateDishIngredient, 
    deleteIngredient: deleteDishIngredient,
    loadIngredients
  } = useDishCostIngredients();

  // Improved load function with automatic retry
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading dish cost data, attempt:", retryCount + 1);
      
      await Promise.all([
        loadDishCosts(),
        loadUnits(),
        loadCostHistory()
      ]);
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error("Error loading dish cost data:", err);
      
      // Only show toast on final retry attempt
      if (retryCount >= 2) {
        toast.error("Failed to load dish cost data. Please try again later.");
        setError(err instanceof Error ? err : new Error('Unknown error loading dish cost data'));
      } else {
        // Auto retry after a delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000); // 2 second delay before retry
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Trigger initial load and automatic retries
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Improved data loading functions with better error handling
  const loadDishCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('dish_costs')
        .select(`
          *,
          food_item:food_item_id(name, category_id, menu_categories:category_id(name)),
          dish_ingredients(*),
          dish_overhead_costs(*)
        `)
        .order('dish_name');
      
      if (error) {
        console.error("Supabase error loading dish costs:", error);
        throw error;
      }
      
      setDishCosts(data || []);
    } catch (err) {
      console.error("Error loading dish costs:", err);
      throw err;
    }
  };

  const loadCostHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('dish_cost_history')
        .select(`
          *,
          dish:dish_cost_id(dish_name)
        `)
        .order('change_date', { ascending: false });
      
      if (error) {
        console.error("Supabase error loading cost history:", error);
        throw error;
      }
      
      setCostHistory(data || []);
    } catch (err) {
      console.error("Error loading cost history:", err);
      throw err;
    }
  };

  const loadUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('measurement_units')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Supabase error loading measurement units:", error);
        throw error;
      }
      
      setUnits(data || []);
    } catch (err) {
      console.error("Error loading measurement units:", err);
      throw err;
    }
  };

  const createDishCost = async (newDishCost: NewDishCost) => {
    const { dish_name, food_item_id, profit_margin, ingredients, overhead_costs, use_manual_price, manual_price } = newDishCost;
    
    try {
      setIsLoading(true);
      
      // Calculate totals
      const totalIngredientCost = ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
      const totalOverheadCost = overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
      const totalCost = totalIngredientCost + totalOverheadCost;
      
      // Calculate suggested price based on profit margin
      const suggestedPrice = totalCost > 0 ? totalCost / (1 - (profit_margin / 100)) : 0;
      const finalPrice = use_manual_price && manual_price ? manual_price : suggestedPrice;
      
      // Insert the main dish cost record
      const { data: dishCostData, error: dishCostError } = await supabase
        .from('dish_costs')
        .insert({
          dish_name,
          food_item_id,
          total_ingredient_cost: totalIngredientCost,
          total_overhead_cost: totalOverheadCost,
          total_cost: totalCost,
          profit_margin,
          suggested_price: suggestedPrice,
          manual_price,
          use_manual_price
        })
        .select()
        .single();
      
      if (dishCostError) {
        console.error("Error creating dish cost:", dishCostError);
        throw dishCostError;
      }
      
      // Insert ingredients
      if (ingredients.length > 0) {
        const ingredientsToInsert = ingredients.map(ing => ({
          dish_cost_id: dishCostData.id,
          ingredient_id: ing.ingredient_id,
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity,
          unit_type: ing.unit_type,
          unit_cost: ing.unit_cost,
          total_cost: ing.total_cost
        }));
        
        const { error: ingredientsError } = await supabase
          .from('dish_ingredients')
          .insert(ingredientsToInsert);
        
        if (ingredientsError) {
          console.error("Error inserting ingredients:", ingredientsError);
          throw ingredientsError;
        }
      }
      
      // Insert overhead costs
      if (overhead_costs.length > 0) {
        const costsToInsert = overhead_costs.map(cost => ({
          dish_cost_id: dishCostData.id,
          category: cost.category,
          description: cost.description,
          cost: cost.cost
        }));
        
        const { error: costsError } = await supabase
          .from('dish_overhead_costs')
          .insert(costsToInsert);
        
        if (costsError) {
          console.error("Error inserting overhead costs:", costsError);
          throw costsError;
        }
      }
      
      // Update the food item with the calculated cost if a food_item_id was provided
      if (food_item_id) {
        console.log("Updating food_item with id:", food_item_id);
        console.log("Setting cost to:", totalCost);
        console.log("Setting price to:", finalPrice);
        
        const { error: foodItemError } = await supabase
          .from('food_items')
          .update({ 
            cost: totalCost,
            profit_margin: profit_margin,
            price: finalPrice
          })
          .eq('id', food_item_id);
        
        if (foodItemError) {
          console.error("Error updating food item:", foodItemError);
          throw foodItemError;
        }
      }
      
      // Reload data
      await loadInitialData();
      
      return dishCostData;
    } catch (err) {
      console.error("Error creating dish cost:", err);
      toast.error("Failed to create dish cost. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDishCost = async (id: string, updates: Partial<NewDishCost>) => {
    try {
      setIsLoading(true);
      
      // Get the current dish cost
      const { data: currentDishCost, error: fetchError } = await supabase
        .from('dish_costs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching current dish cost:", fetchError);
        throw fetchError;
      }
      
      // Calculate new totals if ingredients or overhead costs are updated
      let totalIngredientCost = currentDishCost.total_ingredient_cost;
      let totalOverheadCost = currentDishCost.total_overhead_cost;
      let needsHistoryEntry = false;
      
      if (updates.ingredients) {
        totalIngredientCost = updates.ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
        
        // Delete existing ingredients
        const { error: deleteIngredientsError } = await supabase
          .from('dish_ingredients')
          .delete()
          .eq('dish_cost_id', id);
        
        if (deleteIngredientsError) {
          console.error("Error deleting existing ingredients:", deleteIngredientsError);
          throw deleteIngredientsError;
        }
        
        // Insert new ingredients
        const ingredientsToInsert = updates.ingredients.map(ing => ({
          dish_cost_id: id,
          ingredient_id: ing.ingredient_id,
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity,
          unit_type: ing.unit_type,
          unit_cost: ing.unit_cost,
          total_cost: ing.total_cost
        }));
        
        const { error: ingredientsError } = await supabase
          .from('dish_ingredients')
          .insert(ingredientsToInsert);
        
        if (ingredientsError) {
          console.error("Error inserting updated ingredients:", ingredientsError);
          throw ingredientsError;
        }
        
        needsHistoryEntry = true;
      }
      
      if (updates.overhead_costs) {
        totalOverheadCost = updates.overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
        
        // Delete existing overhead costs
        const { error: deleteCostsError } = await supabase
          .from('dish_overhead_costs')
          .delete()
          .eq('dish_cost_id', id);
        
        if (deleteCostsError) {
          console.error("Error deleting existing overhead costs:", deleteCostsError);
          throw deleteCostsError;
        }
        
        // Insert new overhead costs
        const costsToInsert = updates.overhead_costs.map(cost => ({
          dish_cost_id: id,
          category: cost.category,
          description: cost.description,
          cost: cost.cost
        }));
        
        const { error: costsError } = await supabase
          .from('dish_overhead_costs')
          .insert(costsToInsert);
        
        if (costsError) {
          console.error("Error inserting updated overhead costs:", costsError);
          throw costsError;
        }
        
        needsHistoryEntry = true;
      }
      
      const totalCost = totalIngredientCost + totalOverheadCost;
      const profit_margin = updates.profit_margin ?? currentDishCost.profit_margin;
      const suggestedPrice = totalCost > 0 ? totalCost / (1 - (profit_margin / 100)) : 0;
      
      // Update the dish cost record
      const updateData: any = {
        total_ingredient_cost: totalIngredientCost,
        total_overhead_cost: totalOverheadCost,
        total_cost: totalCost,
        suggested_price: suggestedPrice
      };
      
      if (updates.dish_name) updateData.dish_name = updates.dish_name;
      if (updates.food_item_id !== undefined) updateData.food_item_id = updates.food_item_id;
      if (updates.profit_margin !== undefined) updateData.profit_margin = updates.profit_margin;
      if (updates.use_manual_price !== undefined) updateData.use_manual_price = updates.use_manual_price;
      if (updates.manual_price !== undefined) updateData.manual_price = updates.manual_price;
      
      const { error: updateError } = await supabase
        .from('dish_costs')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) {
        console.error("Error updating dish cost:", updateError);
        throw updateError;
      }
      
      // Add a history entry if the cost changed
      if (needsHistoryEntry && currentDishCost.total_cost !== totalCost) {
        const { error: historyError } = await supabase
          .from('dish_cost_history')
          .insert({
            dish_cost_id: id,
            previous_cost: currentDishCost.total_cost,
            new_cost: totalCost,
            reason: 'Cost update'
          });
        
        if (historyError) {
          console.error("Error creating dish cost history entry:", historyError);
          throw historyError;
        }
      }
      
      // Update the food item with the calculated cost if a food_item_id exists
      if (currentDishCost.food_item_id) {
        console.log("Updating food item with id:", currentDishCost.food_item_id);
        
        const useManualPrice = updates.use_manual_price ?? currentDishCost.use_manual_price;
        const manualPrice = updates.manual_price ?? currentDishCost.manual_price;
        const finalPrice = useManualPrice && manualPrice ? manualPrice : suggestedPrice;
        
        console.log("Setting food item price to:", finalPrice);
        console.log("Setting food item cost to:", totalCost);
        console.log("Setting food item profit margin to:", profit_margin);
        
        const { error: foodItemError } = await supabase
          .from('food_items')
          .update({ 
            cost: totalCost,
            profit_margin: profit_margin,
            price: finalPrice
          })
          .eq('id', currentDishCost.food_item_id);
        
        if (foodItemError) {
          console.error("Error updating food item:", foodItemError);
          throw foodItemError;
        }
      }
      
      // Reload data
      await loadInitialData();
      
      toast.success("Dish cost updated successfully");
      
    } catch (err) {
      console.error("Error updating dish cost:", err);
      toast.error("Failed to update dish cost. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDishCost = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('dish_costs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Reload data
      await loadInitialData();
      
    } catch (err) {
      console.error("Error deleting dish cost:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createUnit = async (unit: { name: string; abbreviation: string; type: string; description?: string }) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('measurement_units')
        .insert(unit);
      
      if (error) throw error;
      
      await loadUnits();
      
    } catch (err) {
      console.error("Error creating unit:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUnit = async (id: string, updates: Partial<MeasurementUnit>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('measurement_units')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      await loadUnits();
      
    } catch (err) {
      console.error("Error updating unit:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Check if unit is used in any ingredient
      const { data: usedUnits, error: checkError } = await supabase
        .from('ingredients')
        .select('id')
        .eq('unit', (await supabase.from('measurement_units').select('abbreviation').eq('id', id).single()).data?.abbreviation)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (usedUnits && usedUnits.length > 0) {
        throw new Error("Cannot delete unit that is used by ingredients");
      }
      
      const { error } = await supabase
        .from('measurement_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadUnits();
      
    } catch (err) {
      console.error("Error deleting unit:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createIngredient = async (ingredient: { name: string; unit: string; cost: number; category?: string }) => {
    try {
      setIsLoading(true);
      const result = await createDishIngredient(ingredient);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateIngredient = async (id: string, updates: Partial<Ingredient>) => {
    try {
      setIsLoading(true);
      const result = await updateDishIngredient(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Check if ingredient is used in any dish
      const { data: usedIngredients, error: checkError } = await supabase
        .from('dish_ingredients')
        .select('id')
        .eq('ingredient_id', id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (usedIngredients && usedIngredients.length > 0) {
        throw new Error("Cannot delete ingredient that is used in dishes");
      }
      
      await deleteDishIngredient(id);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return {
    dishCosts,
    ingredients,
    units,
    isLoading: isLoading || ingredientsLoading,
    error,
    createDishCost,
    updateDishCost,
    deleteDishCost,
    createUnit,
    updateUnit,
    deleteUnit,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    loadInitialData
  };
};
