
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FoodItem, MenuCategory } from "@/types/menu";

export const useFoodManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState<Omit<FoodItem, "id">>({
    name: "",
    description: null,
    price: 0,
    image_url: null,
    category_id: null,
    available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    preparation_time: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadFoodItems(), loadCategories()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data from the database");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFoodItems(data as FoodItem[]);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Failed to load food items");
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("active", true);

      if (error) throw error;
      setCategories(data as MenuCategory[]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setFormData({
      name: "",
      description: null,
      price: 0,
      image_url: null,
      category_id: null,
      available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      preparation_time: null,
    });
    setOpenDialog(true);
  };

  const handleEditFoodItem = (item: FoodItem) => {
    setEditMode(true);
    setSelectedFoodItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category_id: item.category_id,
      available: item.available,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_spicy: item.is_spicy,
      preparation_time: item.preparation_time,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const addFoodItem = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("food_items")
        .insert([formData])
        .select();

      if (error) throw error;

      toast.success("Food item added successfully");
      loadFoodItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFoodItem = async () => {
    if (!selectedFoodItem) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("food_items")
        .update(formData)
        .eq("id", selectedFoodItem.id);

      if (error) throw error;

      toast.success("Food item updated successfully");
      loadFoodItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFoodItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setIsLoading(true);

      const { error } = await supabase.from("food_items").delete().eq("id", id);

      if (error) throw error;

      toast.success("Food item deleted successfully");
      loadFoodItems();
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      setIsLoading(true);
  
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentAvailability })
        .eq('id', id);
  
      if (error) throw error;
  
      setFoodItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, available: !currentAvailability } : item
        )
      );
  
      toast.success(`Food item ${!currentAvailability ? 'activated' : 'deactivated'}`);
  
    } catch (error) {
      console.error('Error updating food item:', error);
      toast.error('Failed to update food item');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    isLoading,
    foodItems: filteredFoodItems,
    categories,
    searchQuery,
    setSearchQuery,
    openDialog,
    editMode,
    formData,
    handleOpenDialog,
    handleEditFoodItem,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleAvailability,
  };
};
