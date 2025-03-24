import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge-extended";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  AlertTriangle, 
  Truck,
  Plus, 
  RefreshCw, 
  AlertCircle,
  SlidersHorizontal,
  BarChart2,
  Search,
  Plus as PlusIcon,
  Edit,
  History,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryExport } from "@/components/inventory/InventoryExport";
import { IngredientForm } from "@/components/inventory/IngredientForm";
import { StockAdjustmentForm } from "@/components/inventory/StockAdjustmentForm";
import { InventoryTransactionList } from "@/components/inventory/InventoryTransactionList";
import { 
  Ingredient,
  InventoryTransaction
} from "@/services/inventory";
import {
  fetchStock,
  addStockItem,
  updateStockItem,
  adjustStockQuantity,
  getStockHistory,
  getStockAnalytics
} from "@/services/inventory/stockService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Colors for chart
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StockLevels = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Array.from(new Set(ingredients.map(ing => ing.category).filter(Boolean) as string[]));

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [ingredients, searchTerm, categoryFilter, statusFilter]);

  const loadIngredients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStock();
      setIngredients(data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast({
        title: "Error",
        description: "Failed to load ingredients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async (ingredientId: string) => {
    setIsTransactionsLoading(true);
    try {
      const data = await getStockHistory(ingredientId);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setIsAnalyticsLoading(true);
    try {
      const data = await getStockAnalytics();
      if (data) {
        setAnalytics(data);
        setIsAnalyticsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast({
        title: "Error",
        description: "Failed to generate analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  const filterIngredients = () => {
    let filtered = [...ingredients];
    
    if (searchTerm) {
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ing.category && ing.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(ing => ing.category === categoryFilter);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(ing => {
        const stockLevel = ing.stock_quantity || 0;
        const reorderLevel = ing.reorder_level || 0;
        
        if (statusFilter === "critical") {
          return stockLevel <= reorderLevel * 0.25;
        } else if (statusFilter === "low") {
          return stockLevel <= reorderLevel && stockLevel > reorderLevel * 0.25;
        } else if (statusFilter === "normal") {
          return stockLevel > reorderLevel;
        }
        return true;
      });
    }
    
    setFilteredIngredients(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const handleAddIngredient = async (ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      const newItem = await addStockItem(ingredient);
      if (newItem) {
        await loadIngredients();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to add ingredient. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIngredient = async (ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedIngredient) return;
    
    setIsSubmitting(true);
    try {
      const updatedItem = await updateStockItem(selectedIngredient.id, ingredient);
      if (updatedItem) {
        await loadIngredients();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to update ingredient. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdjustStock = async (type: 'adjustment' | 'waste', quantity: number, notes: string) => {
    if (!selectedIngredient) return;
    
    setIsSubmitting(true);
    try {
      const success = await adjustStockQuantity(
        selectedIngredient.id, 
        quantity, 
        notes, 
        type
      );
      
      if (success) {
        await loadIngredients();
        setIsAdjustDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewHistory = async (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    await loadTransactions(ingredient.id);
    setIsHistoryDialogOpen(true);
  };

  const handleExport = (format: string, includeTransactions: boolean) => {
    console.log(`Exporting in ${format} format with transactions: ${includeTransactions}`);
    
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} export is being prepared and will download shortly.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your inventory data has been exported successfully.",
      });
    }, 1500);
  };

  const getIngredientStatus = (ingredient: Ingredient) => {
    const stockLevel = ingredient.stock_quantity || 0;
    const reorderLevel = ingredient.reorder_level || 0;
    
    if (stockLevel <= reorderLevel * 0.25) {
      return { status: "critical", label: t("Critical"), variant: "destructive" };
    } else if (stockLevel <= reorderLevel) {
      return { status: "low", label: t("Low"), variant: "warning" };
    } else {
      return { status: "normal", label: t("Normal"), variant: "success" };
    }
  };

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lowStockCount = ingredients.filter(ing => {
    const stockLevel = ing.stock_quantity || 0;
    const reorderLevel = ing.reorder_level || 0;
    return stockLevel <= reorderLevel;
  }).length;
  
  const criticalStockCount = ingredients.filter(ing => {
    const stockLevel = ing.stock_quantity || 0;
    const reorderLevel = ing.reorder_level || 0;
    return stockLevel <= reorderLevel * 0.25;
  }).length;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Stock Levels" />}
        description={<T text="Monitor and manage inventory stock levels" />}
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={loadIngredients}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <T text="Refresh" />
            </Button>
            <InventoryExport onExport={handleExport} />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Item" />
            </Button>
          </>
        }
      />

      <InventoryNav />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Items"
          value={ingredients.length.toString()}
          icon={<Package size={18} />}
        />
        <StatCard 
          title="Low Stock Items"
          value={lowStockCount.toString()}
          isPositive={false}
          icon={<AlertTriangle size={18} />}
        />
        <StatCard 
          title="Critical Stock"
          value={criticalStockCount.toString()}
          isPositive={false}
          icon={<AlertCircle size={18} />}
        />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
