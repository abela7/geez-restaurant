
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, MenuCategory } from "@/types/menu";
import { toast } from "sonner";
import { useFoodItemModifiers } from "@/hooks/useFoodItemModifiers";

export const useFoodManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<FoodItem>>({});
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch food items with their categories
      const { data: items, error: itemsError } = await supabase
        .from("food_items")
        .select(`
          *,
          menu_categories (
            id,
            name
          )
        `)
        .order("name");

      if (itemsError) throw itemsError;

      // Process the food items to include the category name
      const processedItems = items.map(item => ({
        ...item,
        categoryName: item.menu_categories?.name || "Uncategorized"
      }));

      setFoodItems(processedItems);

      // Fetch categories
      const { data: cats, error: catsError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("active", true)
        .order("name");

      if (catsError) throw catsError;

      setCategories(cats);
    } catch (error) {
      console.error("Error loading food items:", error);
      toast.error("Failed to load food items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDialog = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category_id: "",
      available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      preparation_time: undefined
    });
    setSelectedModifiers([]);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditFoodItem = (item: FoodItem) => {
    setFormData(item);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModifiersChange = (modifiers: string[]) => {
    setSelectedModifiers(modifiers);
  };

  const addFoodItem = async () => {
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
      handleCloseDialog();
      await loadData();
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFoodItem = async () => {
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
      handleCloseDialog();
      await loadData();
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
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
      await loadData();
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
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
      await loadData();
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoodItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    isLoading,
    foodItems: filteredFoodItems,
    categories,
    searchQuery,
    setSearchQuery,
    openDialog,
    setOpenDialog,
    editMode,
    formData,
    selectedModifiers,
    handleOpenDialog,
    handleEditFoodItem,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleModifiersChange,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleAvailability
  };
};
