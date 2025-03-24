
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  DishCost, 
  Ingredient, 
  MeasurementUnit, 
  NewDishCost, 
  DishCostHistory 
} from "@/types/dishCost";

export const useDishCosts = () => {
  const [dishCosts, setDishCosts] = useState<DishCost[]>([]);
  const [costHistory, setCostHistory] = useState<DishCostHistory[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadDishCosts(),
        loadIngredients(),
        loadUnits(),
        loadCostHistory()
      ]);
    } catch (err) {
      console.error("Error loading dish cost data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading dish cost data'));
      toast.error("Failed to load dish cost data");
    } finally {
      setIsLoading(false);
    }
  };

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
      
      if (error) throw error;
      
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
      
      if (error) throw error;
      
      setCostHistory(data || []);
    } catch (err) {
      console.error("Error loading cost history:", err);
      throw err;
    }
  };

  const loadIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setIngredients(data || []);
    } catch (err) {
      console.error("Error loading ingredients:", err);
      throw err;
    }
  };

  const loadUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('measurement_units')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
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
      
      if (dishCostError) throw dishCostError;
      
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
        
        if (ingredientsError) throw ingredientsError;
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
        
        if (costsError) throw costsError;
      }
      
      // Update the food item with the calculated cost if a food_item_id was provided
      if (food_item_id) {
        const finalPrice = use_manual_price && manual_price ? manual_price : suggestedPrice;
        const profitMargin = totalCost > 0 ? Math.round(((finalPrice - totalCost) / finalPrice) * 100) : profit_margin;
        
        const { error: foodItemError } = await supabase
          .from('food_items')
          .update({ 
            cost: totalCost,
            profit_margin: profitMargin
          })
          .eq('id', food_item_id);
        
        if (foodItemError) throw foodItemError;
      }
      
      // Reload data
      await loadInitialData();
      
      toast.success("Dish cost added successfully!");
      return dishCostData;
    } catch (err) {
      console.error("Error creating dish cost:", err);
      toast.error("Failed to add dish cost");
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
      
      if (fetchError) throw fetchError;
      
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
        
        if (deleteIngredientsError) throw deleteIngredientsError;
        
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
        
        if (ingredientsError) throw ingredientsError;
        
        needsHistoryEntry = true;
      }
      
      if (updates.overhead_costs) {
        totalOverheadCost = updates.overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
        
        // Delete existing overhead costs
        const { error: deleteCostsError } = await supabase
          .from('dish_overhead_costs')
          .delete()
          .eq('dish_cost_id', id);
        
        if (deleteCostsError) throw deleteCostsError;
        
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
        
        if (costsError) throw costsError;
        
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
      
      if (updateError) throw updateError;
      
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
        
        if (historyError) throw historyError;
      }
      
      // Update the food item with the calculated cost if a food_item_id exists
      if (currentDishCost.food_item_id) {
        const useManualPrice = updates.use_manual_price ?? currentDishCost.use_manual_price;
        const manualPrice = updates.manual_price ?? currentDishCost.manual_price;
        const finalPrice = useManualPrice && manualPrice ? manualPrice : suggestedPrice;
        const profitMargin = totalCost > 0 ? Math.round(((finalPrice - totalCost) / finalPrice) * 100) : profit_margin;
        
        const { error: foodItemError } = await supabase
          .from('food_items')
          .update({ 
            cost: totalCost,
            profit_margin: profitMargin
          })
          .eq('id', currentDishCost.food_item_id);
        
        if (foodItemError) throw foodItemError;
      }
      
      // Reload data
      await loadInitialData();
      
      toast.success("Dish cost updated successfully!");
    } catch (err) {
      console.error("Error updating dish cost:", err);
      toast.error("Failed to update dish cost");
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
      
      toast.success("Dish cost deleted successfully!");
    } catch (err) {
      console.error("Error deleting dish cost:", err);
      toast.error("Failed to delete dish cost");
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
      
      toast.success("Unit added successfully!");
    } catch (err) {
      console.error("Error creating unit:", err);
      toast.error("Failed to add unit");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createIngredient = async (ingredient: { name: string; unit: string; cost: number; category?: string }) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('ingredients')
        .insert(ingredient);
      
      if (error) throw error;
      
      await loadIngredients();
      
      toast.success("Ingredient added successfully!");
    } catch (err) {
      console.error("Error creating ingredient:", err);
      toast.error("Failed to add ingredient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dishCosts,
    costHistory,
    ingredients,
    units,
    isLoading,
    error,
    loadInitialData,
    createDishCost,
    updateDishCost,
    deleteDishCost,
    createUnit,
    createIngredient
  };
};
