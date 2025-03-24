
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FoodItem, MenuCategory } from "@/types/menu";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          menu_categories(id, name)
        `)
        .eq('available', true);
      
      if (error) {
        throw error;
      }
      
      const formattedItems = data.map(item => ({
        ...item,
        categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized",
        available: true // Ensure the available property is set
      }));
      
      setMenuItems(formattedItems);
    } catch (err) {
      console.error("Error loading menu items:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading menu items'));
      toast.error("Failed to load menu items");
      throw err;
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true);
      
      if (error) {
        throw error;
      }
      
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading categories'));
      toast.error("Failed to load menu categories");
      throw err;
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadMenuItems(),
        loadCategories()
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
      // Error is already set in the individual load functions
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    menuItems,
    categories,
    isLoading,
    error,
    refresh: loadInitialData
  };
};
