
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModifierGroup } from "@/hooks/useModifierManagement";

export const useFoodItemModifiers = (foodItemId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableModifierGroups, setAvailableModifierGroups] = useState<ModifierGroup[]>([]);
  const [selectedModifierGroups, setSelectedModifierGroups] = useState<string[]>([]);

  // Use useCallback to make these functions stable for useEffect dependencies
  const loadAvailableModifierGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: groups, error: groupsError } = await supabase
        .from('modifier_groups')
        .select(`
          *,
          options:modifier_options(*)
        `)
        .order('name');
      
      if (groupsError) throw groupsError;
      
      setAvailableModifierGroups(groups || []);
      
    } catch (error) {
      console.error('Error loading modifier groups:', error);
      toast.error('Failed to load modifier groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadModifierData = useCallback(async () => {
    if (!foodItemId) return;

    try {
      setIsLoading(true);
      
      // Load all available modifier groups
      await loadAvailableModifierGroups();
      
      // Load the selected modifier groups for this food item
      const { data: foodItemModifiers, error: modifiersError } = await supabase
        .from('food_item_modifiers')
        .select('modifier_group_id')
        .eq('food_item_id', foodItemId);
      
      if (modifiersError) throw modifiersError;
      
      // Extract just the modifier group IDs
      const selectedIds = foodItemModifiers?.map(item => item.modifier_group_id) || [];
      setSelectedModifierGroups(selectedIds);
      
    } catch (error) {
      console.error('Error loading food item modifiers:', error);
      toast.error('Failed to load modifier information');
    } finally {
      setIsLoading(false);
    }
  }, [foodItemId, loadAvailableModifierGroups]);

  useEffect(() => {
    if (foodItemId) {
      loadModifierData();
    } else {
      loadAvailableModifierGroups();
    }
  }, [foodItemId, loadModifierData, loadAvailableModifierGroups]);

  const saveModifierGroups = async (foodItemId: string) => {
    try {
      setIsLoading(true);
      
      // First, delete existing associations
      const { error: deleteError } = await supabase
        .from('food_item_modifiers')
        .delete()
        .eq('food_item_id', foodItemId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new associations
      if (selectedModifierGroups.length > 0) {
        const modifierRecords = selectedModifierGroups.map(modifierGroupId => ({
          food_item_id: foodItemId,
          modifier_group_id: modifierGroupId
        }));
        
        const { error: insertError } = await supabase
          .from('food_item_modifiers')
          .insert(modifierRecords);
        
        if (insertError) throw insertError;
      }
      
      toast.success('Food item modifiers saved successfully');
      
    } catch (error) {
      console.error('Error saving food item modifiers:', error);
      toast.error('Failed to save modifiers');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModifierGroup = (modifierGroupId: string) => {
    setSelectedModifierGroups(prev => {
      if (prev.includes(modifierGroupId)) {
        return prev.filter(id => id !== modifierGroupId);
      } else {
        return [...prev, modifierGroupId];
      }
    });
  };

  return {
    isLoading,
    availableModifierGroups,
    selectedModifierGroups,
    toggleModifierGroup,
    saveModifierGroups,
    loadModifierData,
    loadAvailableModifierGroups
  };
};
