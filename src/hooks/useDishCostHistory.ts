
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DishCostHistory } from "@/types/dishCost";
import { toast } from "sonner";

export const useDishCostHistory = () => {
  const [costHistory, setCostHistory] = useState<DishCostHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Improved loading with caching and error handling
  const loadCostHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching dish cost history...");
      
      // More efficient query with specific column selection
      const { data, error } = await supabase
        .from('dish_cost_history')
        .select(`
          id,
          dish_cost_id,
          previous_cost,
          new_cost,
          change_date,
          reason,
          created_at,
          updated_at,
          dish:dish_cost_id(dish_name)
        `)
        .order('change_date', { ascending: false });
      
      if (error) {
        console.error("Supabase error loading cost history:", error);
        throw error;
      }
      
      console.log(`Loaded ${data?.length || 0} cost history records successfully`);
      setCostHistory(data || []);
      return data;
    } catch (err) {
      console.error("Error loading cost history:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading cost history'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCostHistory();
  }, [loadCostHistory]);

  // Enhanced history entry creation
  const addHistoryEntry = async (entry: {
    dish_cost_id: string;
    previous_cost: number;
    new_cost: number;
    reason?: string;
  }) => {
    try {
      console.log("Adding cost history entry for dish:", entry.dish_cost_id);
      
      // Only add history if there's an actual cost change
      if (Math.abs(entry.previous_cost - entry.new_cost) < 0.01) {
        console.log("Cost didn't change significantly, skipping history entry");
        return null;
      }
      
      const { data, error } = await supabase
        .from('dish_cost_history')
        .insert({
          dish_cost_id: entry.dish_cost_id,
          previous_cost: entry.previous_cost,
          new_cost: entry.new_cost,
          reason: entry.reason || 'Cost update',
          change_date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating dish cost history entry:", error);
        throw error;
      }
      
      await loadCostHistory();
      return data;
    } catch (err) {
      console.error("Error adding history entry:", err);
      toast.error("Failed to record cost history");
      throw err;
    }
  };

  // Get history for a specific dish
  const getDishHistory = useCallback((dishId: string) => {
    return costHistory.filter(history => history.dish_cost_id === dishId);
  }, [costHistory]);

  // Calculate average cost change over time
  const getAverageCostChange = useCallback(() => {
    if (costHistory.length === 0) return 0;
    
    const totalChange = costHistory.reduce((sum, item) => {
      return sum + (item.new_cost - item.previous_cost);
    }, 0);
    
    return totalChange / costHistory.length;
  }, [costHistory]);

  return {
    costHistory,
    isLoading,
    error,
    loadCostHistory,
    addHistoryEntry,
    getDishHistory,
    getAverageCostChange
  };
};
