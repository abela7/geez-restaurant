
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DishCostHistory } from "@/types/dishCost";

export const useDishCostHistory = () => {
  const [costHistory, setCostHistory] = useState<DishCostHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCostHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
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
      setError(err instanceof Error ? err : new Error('Unknown error loading cost history'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCostHistory();
  }, [loadCostHistory]);

  const addHistoryEntry = async (entry: {
    dish_cost_id: string;
    previous_cost: number;
    new_cost: number;
    reason?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('dish_cost_history')
        .insert({
          dish_cost_id: entry.dish_cost_id,
          previous_cost: entry.previous_cost,
          new_cost: entry.new_cost,
          reason: entry.reason || 'Cost update'
        });
      
      if (error) {
        console.error("Error creating dish cost history entry:", error);
        throw error;
      }
      
      await loadCostHistory();
    } catch (err) {
      console.error("Error adding history entry:", err);
      throw err;
    }
  };

  return {
    costHistory,
    isLoading,
    error,
    loadCostHistory,
    addHistoryEntry
  };
};
