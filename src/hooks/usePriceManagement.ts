
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FoodItem, MenuCategory } from "@/types/menu";

export interface PriceHistory {
  id: string;
  food_item_id: string;
  old_price: number;
  new_price: number;
  change_date: string;
  reason: string | null;
  foodName?: string;
}

export const usePriceManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [priceChanges, setPriceChanges] = useState<PriceHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [priceChangeReason, setPriceChangeReason] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadFoodItems(),
        loadPriceHistory(),
        loadCategories()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFoodItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        *,
        menu_categories(id, name)
      `);
    
    if (error) {
      throw error;
    }
    
    const formattedItems = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      cost: item.cost,
      profit_margin: item.profit_margin,
      category_id: item.category_id,
      categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
    })) as FoodItem[];
    
    setFoodItems(formattedItems);
  };

  const loadPriceHistory = async () => {
    const { data, error } = await supabase
      .from('price_history')
      .select(`
        *,
        food_items(name)
      `)
      .order('change_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    const formattedHistory = data.map(item => ({
      id: item.id,
      food_item_id: item.food_item_id,
      old_price: item.old_price,
      new_price: item.new_price,
      change_date: item.change_date,
      reason: item.reason,
      foodName: item.food_items ? item.food_items.name : "Unknown Item"
    }));
    
    setPriceChanges(formattedHistory);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('id, name')
      .eq('active', true);
    
    if (error) {
      throw error;
    }
    
    setCategories(data);
  };

  const handlePriceUpdate = async () => {
    if (!currentItem) return;
    
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First record the price change in history
      const { error: historyError } = await supabase
        .from('price_history')
        .insert({
          food_item_id: currentItem.id,
          old_price: currentItem.price,
          new_price: priceValue,
          change_date: new Date().toISOString(),
          reason: priceChangeReason
        });
      
      if (historyError) throw historyError;
      
      // Calculate new profit margin
      let newProfitMargin = null;
      if (currentItem.cost && currentItem.cost > 0) {
        newProfitMargin = Math.round(((priceValue - currentItem.cost) / priceValue) * 100);
      }
      
      // Then update the food item price
      const { error: updateError } = await supabase
        .from('food_items')
        .update({ 
          price: priceValue,
          profit_margin: newProfitMargin
        })
        .eq('id', currentItem.id);
      
      if (updateError) throw updateError;
      
      // Refresh data
      await Promise.all([
        loadFoodItems(),
        loadPriceHistory()
      ]);
      
      toast.success("Price updated successfully");
      setShowEditDialog(false);
      
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (item: FoodItem) => {
    setCurrentItem(item);
    setNewPrice(item.price.toString());
    setPriceChangeReason("");
    setShowEditDialog(true);
  };

  const getFilteredFoodItems = () => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === "all" || item.category_id === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  return {
    isLoading,
    foodItems: getFilteredFoodItems(),
    allFoodItems: foodItems,
    priceChanges,
    categories,
    searchQuery,
    setSearchQuery,
    showEditDialog,
    setShowEditDialog,
    currentItem,
    newPrice,
    setNewPrice,
    priceChangeReason,
    setPriceChangeReason,
    activeTab,
    setActiveTab,
    filterCategory,
    setFilterCategory,
    openEditDialog,
    handlePriceUpdate,
    loadData
  };
};
