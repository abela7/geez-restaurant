import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DishCost, NewDishCost } from "@/types/dishCost";
import { useDishCostIngredients } from "./useDishCostIngredients";
import { useUnits } from "./useUnits";
import { useDishCostHistory } from "./useDishCostHistory";

export const useDishCostManagement = () => {
  const [dishCosts, setDishCosts] = useState<DishCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    ingredients, 
    isLoading: ingredientsLoading, 
    createIngredient, 
    updateIngredient,
    deleteIngredient
  } = useDishCostIngredients();
  
  const {
    units,
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useUnits();
  
  const {
    costHistory,
    isLoading: historyLoading,
    addHistoryEntry
  } = useDishCostHistory();

  const loadDishCosts = useCallback(async () => {
    try {
      console.log("Fetching dish costs data from database...");
      
      const { data, error } = await supabase
        .from('dish_costs')
        .select(`
          id,
          dish_name,
          food_item_id,
          total_ingredient_cost,
          total_overhead_cost,
          total_cost,
          profit_margin,
          suggested_price,
          manual_price,
          use_manual_price,
          created_at,
          updated_at,
          food_item:food_item_id(id, name, category_id, menu_categories:category_id(name)),
          dish_ingredients(id, dish_cost_id, ingredient_id, ingredient_name, quantity, unit_type, unit_cost, total_cost, created_at, updated_at),
          dish_overhead_costs(id, dish_cost_id, category, description, cost, created_at, updated_at)
        `)
        .order('dish_name');
      
      if (error) {
        console.error("Supabase error loading dish costs:", error);
        throw error;
      }
      
      console.log(`Loaded ${data?.length || 0} dish costs successfully`);
      
      const typedData = data as unknown as DishCost[];
      setDishCosts(typedData);
    } catch (err) {
      console.error("Error loading dish costs:", err);
      throw err;
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading dish cost data, attempt:", retryCount + 1);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 15000)
      );
      
      await Promise.race([
        loadDishCosts(),
        timeoutPromise
      ]);
      
      setRetryCount(0);
    } catch (err) {
      console.error("Error loading dish cost data:", err);
      
      if (retryCount >= 2) {
        toast.error("Failed to load dish cost data. Please try again later.");
        setError(err instanceof Error ? err : new Error('Unknown error loading dish cost data'));
      } else {
        const backoffTime = Math.min(2000 * Math.pow(2, retryCount), 10000);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, backoffTime);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, loadDishCosts]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const createDishCost = async (newDishCost: NewDishCost) => {
    const { dish_name, food_item_id, profit_margin, ingredients, overhead_costs, use_manual_price, manual_price } = newDishCost;
    
    try {
      setIsLoading(true);
      
      const totalIngredientCost = ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
      const totalOverheadCost = overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
      const totalCost = totalIngredientCost + totalOverheadCost;
      
      const suggestedPrice = totalCost > 0 ? totalCost / (1 - (profit_margin / 100)) : 0;
      const finalPrice = use_manual_price && manual_price ? manual_price : suggestedPrice;
      
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
      
      const { data: currentDishCost, error: fetchError } = await supabase
        .from('dish_costs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching current dish cost:", fetchError);
        throw fetchError;
      }
      
      let totalIngredientCost = currentDishCost.total_ingredient_cost;
      let totalOverheadCost = currentDishCost.total_overhead_cost;
      let needsHistoryEntry = false;
      
      if (updates.ingredients) {
        totalIngredientCost = updates.ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
        
        const { error: deleteIngredientsError } = await supabase
          .from('dish_ingredients')
          .delete()
          .eq('dish_cost_id', id);
        
        if (deleteIngredientsError) {
          console.error("Error deleting existing ingredients:", deleteIngredientsError);
          throw deleteIngredientsError;
        }
        
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
        
        const { error: deleteCostsError } = await supabase
          .from('dish_overhead_costs')
          .delete()
          .eq('dish_cost_id', id);
        
        if (deleteCostsError) {
          console.error("Error deleting existing overhead costs:", deleteCostsError);
          throw deleteCostsError;
        }
        
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
      
      if (needsHistoryEntry && currentDishCost.total_cost !== totalCost) {
        await addHistoryEntry({
          dish_cost_id: id,
          previous_cost: currentDishCost.total_cost,
          new_cost: totalCost,
          reason: 'Cost update'
        });
      }
      
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
      
      await loadInitialData();
      
    } catch (err) {
      console.error("Error deleting dish cost:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dishCosts,
    ingredients,
    units,
    costHistory,
    isLoading: isLoading || ingredientsLoading || unitsLoading || historyLoading,
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
