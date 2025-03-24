
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem } from "@/types/menu";
import { toast } from "sonner";

export const useFoodItemCrud = (onSuccess: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);

  const addFoodItem = async (
    formData: Partial<FoodItem>, 
    selectedModifiers: string[]
  ) => {
    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("food_items")
        .insert({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url,
          category_id: formData.category_id || null,
          available: formData.available,
          is_vegetarian: formData.is_vegetarian,
          is_vegan: formData.is_vegan,
          is_gluten_free: formData.is_gluten_free,
          is_spicy: formData.is_spicy,
          preparation_time: formData.preparation_time
        })
        .select()
        .single();

      if (error) throw error;

      // Now save the selected modifiers if there are any
      if (selectedModifiers.length > 0 && data) {
        const createdFoodItemId = data.id;
        
        // Create array of records for insertion
        const modifierRecords = selectedModifiers.map(modifierGroupId => ({
          food_item_id: createdFoodItemId,
          modifier_group_id: modifierGroupId
        }));
        
        const { error: modifierError } = await supabase
          .from('food_item_modifiers')
          .insert(modifierRecords);
        
        if (modifierError) throw modifierError;
      }

      toast.success("Food item added successfully");
      await onSuccess();
      return true;
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFoodItem = async (
    formData: Partial<FoodItem>,
    selectedModifiers: string[]
  ) => {
    if (!formData.id || !formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      setIsLoading(true);

      // Update food item
      const { error } = await supabase
        .from("food_items")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url,
          category_id: formData.category_id || null,
          available: formData.available,
          is_vegetarian: formData.is_vegetarian,
          is_vegan: formData.is_vegan,
          is_gluten_free: formData.is_gluten_free,
          is_spicy: formData.is_spicy,
          preparation_time: formData.preparation_time
        })
        .eq("id", formData.id);

      if (error) throw error;

      // Update modifiers for this food item
      // First, delete existing associations
      const { error: deleteError } = await supabase
        .from('food_item_modifiers')
        .delete()
        .eq('food_item_id', formData.id);
      
      if (deleteError) throw deleteError;
      
      // Then insert new associations
      if (selectedModifiers.length > 0) {
        const modifierRecords = selectedModifiers.map(modifierGroupId => ({
          food_item_id: formData.id,
          modifier_group_id: modifierGroupId
        }));
        
        const { error: insertError } = await supabase
          .from('food_item_modifiers')
          .insert(modifierRecords);
        
        if (insertError) throw insertError;
      }

      toast.success("Food item updated successfully");
      await onSuccess();
      return true;
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFoodItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) {
      return;
    }

    try {
      setIsLoading(true);

      // First delete any modifier associations
      await supabase
        .from("food_item_modifiers")
        .delete()
        .eq("food_item_id", id);

      // Then delete the food item
      const { error } = await supabase
        .from("food_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Food item deleted successfully");
      await onSuccess();
      return true;
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id: string, available: boolean) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("food_items")
        .update({ available: !available })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Food item ${!available ? "enabled" : "disabled"}`);
      await onSuccess();
      return true;
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update food item");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleAvailability
  };
};
