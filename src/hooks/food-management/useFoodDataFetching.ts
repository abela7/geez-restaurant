
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, MenuCategory } from "@/types/menu";
import { toast } from "sonner";

export const useFoodDataFetching = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

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

  const filterFoodItems = (items: FoodItem[], searchQuery: string) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return {
    isLoading,
    foodItems,
    categories,
    loadData,
    filterFoodItems
  };
};
