
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MeasurementUnit } from "@/types/dishCost";
import { toast } from "sonner";

export const useUnits = () => {
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUnits = useCallback(async () => {
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
      setError(err instanceof Error ? err : new Error('Unknown error loading measurement units'));
      throw err;
    }
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

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

  return {
    units,
    isLoading,
    error,
    loadUnits,
    createUnit,
    updateUnit,
    deleteUnit
  };
};
