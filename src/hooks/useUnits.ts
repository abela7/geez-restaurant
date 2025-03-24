
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MeasurementUnit } from "@/types/dishCost";
import { toast } from "sonner";

export const useUnits = () => {
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Improved loading with caching
  const loadUnits = useCallback(async () => {
    try {
      console.log("Fetching measurement units...");
      // Specific columns for better performance
      const { data, error } = await supabase
        .from('measurement_units')
        .select(`
          id,
          name,
          abbreviation,
          type,
          description,
          base_unit_id,
          conversion_factor,
          created_at,
          updated_at
        `)
        .order('name');
      
      if (error) {
        console.error("Supabase error loading measurement units:", error);
        throw error;
      }
      
      console.log(`Loaded ${data?.length || 0} measurement units successfully`);
      setUnits(data || []);
      return data;
    } catch (err) {
      console.error("Error loading measurement units:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading measurement units'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  // Create unit with validation
  const createUnit = async (unit: { name: string; abbreviation: string; type: string; description?: string }) => {
    try {
      setIsLoading(true);
      console.log("Creating new measurement unit:", unit.name);
      
      // Validate unit data
      if (!unit.name || !unit.abbreviation || !unit.type) {
        throw new Error("Name, abbreviation, and type are required for measurement units");
      }
      
      // Check for duplicate abbreviations
      const { data: existingUnits, error: checkError } = await supabase
        .from('measurement_units')
        .select('id')
        .eq('abbreviation', unit.abbreviation)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingUnits && existingUnits.length > 0) {
        throw new Error(`A unit with abbreviation '${unit.abbreviation}' already exists`);
      }
      
      const { error } = await supabase
        .from('measurement_units')
        .insert(unit);
      
      if (error) throw error;
      
      const result = await loadUnits();
      toast.success(`Unit "${unit.name}" created successfully`);
      return result;
      
    } catch (err) {
      console.error("Error creating unit:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create unit");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update unit with proper validation
  const updateUnit = async (id: string, updates: Partial<MeasurementUnit>) => {
    try {
      setIsLoading(true);
      console.log("Updating measurement unit:", id);
      
      // Validate unit data
      if (updates.abbreviation === "") {
        throw new Error("Abbreviation cannot be empty");
      }
      
      // Check for duplicate abbreviations if updating abbreviation
      if (updates.abbreviation) {
        const { data: existingUnits, error: checkError } = await supabase
          .from('measurement_units')
          .select('id')
          .eq('abbreviation', updates.abbreviation)
          .neq('id', id)
          .limit(1);
          
        if (checkError) throw checkError;
        
        if (existingUnits && existingUnits.length > 0) {
          throw new Error(`A unit with abbreviation '${updates.abbreviation}' already exists`);
        }
      }
      
      const { error } = await supabase
        .from('measurement_units')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      const result = await loadUnits();
      toast.success("Unit updated successfully");
      return result;
      
    } catch (err) {
      console.error("Error updating unit:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update unit");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced delete with dependency checking
  const deleteUnit = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Checking dependencies before deleting unit:", id);
      
      // Get the unit abbreviation for checking usage
      const { data: unitData, error: unitError } = await supabase
        .from('measurement_units')
        .select('abbreviation')
        .eq('id', id)
        .single();
      
      if (unitError) throw unitError;
      
      if (!unitData) {
        throw new Error("Unit not found");
      }
      
      // Check if unit is used in any ingredient
      const { data: usedInIngredients, error: checkIngredientsError } = await supabase
        .from('ingredients')
        .select('id')
        .eq('unit', unitData.abbreviation)
        .limit(1);
      
      if (checkIngredientsError) throw checkIngredientsError;
      
      if (usedInIngredients && usedInIngredients.length > 0) {
        throw new Error("Cannot delete unit that is used by ingredients");
      }
      
      // Check if unit is used in any dish ingredient
      const { data: usedInDishIngredients, error: checkDishIngredientsError } = await supabase
        .from('dish_ingredients')
        .select('id')
        .eq('unit_type', unitData.abbreviation)
        .limit(1);
      
      if (checkDishIngredientsError) throw checkDishIngredientsError;
      
      if (usedInDishIngredients && usedInDishIngredients.length > 0) {
        throw new Error("Cannot delete unit that is used in dish ingredients");
      }
      
      // Delete the unit
      const { error } = await supabase
        .from('measurement_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const result = await loadUnits();
      toast.success("Unit deleted successfully");
      return result;
      
    } catch (err) {
      console.error("Error deleting unit:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete unit");
      }
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
