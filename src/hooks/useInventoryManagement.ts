
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";

export const useInventoryManagement = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stockFilter, setStockFilter] = useState<"all" | "normal" | "low" | "out-of-stock">("all");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  
  // Calculate stock status
  const getStockStatus = (item: Ingredient): "normal" | "low" | "out-of-stock" => {
    const quantity = item.stock_quantity || 0;
    const reorderLevel = item.reorder_level || 0;
    
    if (quantity <= 0) return "out-of-stock";
    if (quantity <= reorderLevel) return "low";
    return "normal";
  };
  
  // Query inventory data
  const { data: inventoryItems = [], isLoading, refetch } = useQuery({
    queryKey: ["kitchen-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data as Ingredient[];
    },
  });
  
  // Filter inventory based on search, category, and stock status
  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category?.toLowerCase() === activeCategory;
    
    // Filter by stock status
    const stockStatus = getStockStatus(item);
    const matchesStockFilter = stockFilter === "all" || 
                              (stockFilter === "normal" && stockStatus === "normal") ||
                              (stockFilter === "low" && stockStatus === "low") ||
                              (stockFilter === "out-of-stock" && stockStatus === "out-of-stock");
    
    return matchesSearch && matchesCategory && matchesStockFilter;
  });
  
  // Get unique categories for tabs
  const categories = ["all", ...new Set(inventoryItems.map(item => item.category?.toLowerCase() || "uncategorized"))];
  
  // Get low stock items
  const lowStockItems = inventoryItems.filter(
    item => getStockStatus(item) === "low" || getStockStatus(item) === "out-of-stock"
  );
  
  // Report low stock to admin
  const reportToAdmin = async (item: Ingredient) => {
    try {
      // Using inventory_transactions table to record alerts
      await supabase.from("inventory_transactions").insert({
        ingredient_id: item.id,
        transaction_type: "alert",
        quantity: 0, // Not changing quantity, just reporting
        previous_quantity: item.stock_quantity || 0,
        new_quantity: item.stock_quantity || 0,
        unit: item.unit,
        notes: `${item.name} ${t("stock is")} ${t(getStockStatus(item))}. ${t("Current level")}: ${item.stock_quantity} ${item.unit}`,
        created_by: "kitchen-staff" // Would use actual user ID in production
      });
      
      toast.success(t("Alert sent to administration"));
    } catch (error) {
      console.error("Error reporting to admin:", error);
      toast.error(t("Failed to send alert"));
    }
  };
  
  // Handle stock adjustment
  const handleAdjustStock = async (
    adjustType: "add" | "subtract",
    adjustQuantity: number,
    adjustNote: string
  ) => {
    if (!selectedItem) return;
    
    try {
      // Get current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from("ingredients")
        .select("stock_quantity")
        .eq("id", selectedItem.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new quantity
      const currentQuantity = currentItem.stock_quantity || 0;
      const finalQuantity = adjustType === "add" 
        ? currentQuantity + adjustQuantity 
        : Math.max(0, currentQuantity - adjustQuantity);
      
      // Update the stock quantity
      const { error: updateError } = await supabase
        .from("ingredients")
        .update({ stock_quantity: finalQuantity })
        .eq("id", selectedItem.id);
      
      if (updateError) throw updateError;
      
      // Log the transaction
      await supabase.from("inventory_transactions").insert({
        ingredient_id: selectedItem.id,
        transaction_type: "adjustment",
        quantity: adjustType === "add" ? adjustQuantity : -adjustQuantity,
        previous_quantity: currentQuantity,
        new_quantity: finalQuantity,
        unit: selectedItem.unit,
        notes: adjustNote || `${t("Stock manually")} ${adjustType === "add" ? t("increased") : t("decreased")} ${t("by kitchen staff")}`,
        created_by: "kitchen-staff" // Would use actual user ID in production
      });
      
      toast.success(t("Stock updated successfully"));
      refetch(); // Refresh inventory data
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error(t("Failed to update stock"));
      throw error;
    }
  };
  
  // Open adjustment dialog for an item
  const openAdjustDialog = (item: Ingredient) => {
    setSelectedItem(item);
    setAdjustDialogOpen(true);
  };
  
  // Request new item from admin
  const requestNewItem = () => {
    // In a real app, this would open a form to request new items
    toast.info(t("Item request functionality will be implemented soon"));
  };

  return {
    inventoryItems,
    filteredInventory,
    categories,
    lowStockItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    viewMode,
    setViewMode,
    stockFilter,
    setStockFilter,
    adjustDialogOpen,
    setAdjustDialogOpen,
    selectedItem,
    setSelectedItem,
    getStockStatus,
    reportToAdmin,
    handleAdjustStock,
    openAdjustDialog,
    refetch,
    requestNewItem
  };
};
