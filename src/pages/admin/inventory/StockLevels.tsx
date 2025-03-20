
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
import AppLayout from "@/components/Layout";
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

  // Extract unique categories
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
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ing.category && ing.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(ing => ing.category === categoryFilter);
    }
    
    // Apply status filter
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
    // A real implementation would generate and download a file
    console.log(`Exporting in ${format} format with transactions: ${includeTransactions}`);
    
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} export is being prepared and will download shortly.`,
    });
    
    // Simulate download
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

  // Pagination
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
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
    <AppLayout interface="admin">
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
              type="search"
              placeholder={t("Search inventory...")}
              className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline"><T text="Filters" /></span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadAnalytics}
              disabled={isAnalyticsLoading}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">
                {isAnalyticsLoading ? <T text="Loading..." /> : <T text="Analytics" />}
              </span>
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Current Stock" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Reorder Level" /></TableHead>
                  <TableHead><T text="Unit Cost" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-2 text-muted-foreground"><T text="Loading ingredients..." /></p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedIngredients.length > 0 ? (
                  paginatedIngredients.map((ingredient) => {
                    const status = getIngredientStatus(ingredient);
                    
                    return (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.category || "-"}</TableCell>
                        <TableCell>{ingredient.stock_quantity || 0} {ingredient.unit}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant as any}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{ingredient.reorder_level || 0} {ingredient.unit}</TableCell>
                        <TableCell>${ingredient.cost?.toFixed(2) || "0.00"}/{ingredient.unit}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedIngredient(ingredient);
                              setIsAdjustDialogOpen(true);
                            }}
                          >
                            <ArrowUpDown className="mr-1 h-4 w-4" />
                            <T text="Adjust" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedIngredient(ingredient);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            <T text="Edit" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewHistory(ingredient)}
                          >
                            <History className="mr-1 h-4 w-4" />
                            <T text="History" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p><T text="No ingredients found" /></p>
                        <p className="text-sm"><T text="Try adjusting your filters or add a new ingredient" /></p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageToShow}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageToShow)}
                          isActive={currentPage === pageToShow}
                        >
                          {pageToShow}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>

        {/* Add Ingredient Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle><T text="Add New Ingredient" /></DialogTitle>
            </DialogHeader>
            <IngredientForm 
              onSubmit={handleAddIngredient}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Ingredient Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle><T text="Edit Ingredient" /></DialogTitle>
            </DialogHeader>
            {selectedIngredient && (
              <IngredientForm 
                initialData={selectedIngredient}
                onSubmit={handleEditIngredient}
                onCancel={() => setIsEditDialogOpen(false)}
                isLoading={isSubmitting}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Adjust Stock Dialog */}
        <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle><T text="Adjust Stock Quantity" /></DialogTitle>
            </DialogHeader>
            {selectedIngredient && (
              <StockAdjustmentForm 
                ingredient={selectedIngredient}
                onSubmit={handleAdjustStock}
                onCancel={() => setIsAdjustDialogOpen(false)}
                isLoading={isSubmitting}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Transaction History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                <T text="Transaction History" /> 
                {selectedIngredient ? `: ${selectedIngredient.name}` : ""}
              </DialogTitle>
            </DialogHeader>
            <InventoryTransactionList 
              transactions={transactions}
              isLoading={isTransactionsLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle><T text="Filter Inventory Items" /></DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium"><T text="Category" /></h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={categoryFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter("all")}
                  >
                    <T text="All Categories" />
                  </Button>
                  {categories.map(category => (
                    <Button 
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium"><T text="Stock Status" /></h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    <T text="All Status" />
                  </Button>
                  <Button 
                    variant={statusFilter === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("normal")}
                  >
                    <T text="Normal" />
                  </Button>
                  <Button 
                    variant={statusFilter === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("low")}
                  >
                    <T text="Low" />
                  </Button>
                  <Button 
                    variant={statusFilter === "critical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("critical")}
                  >
                    <T text="Critical" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClearFilters} size="sm">
                <T text="Clear Filters" />
              </Button>
              <Button onClick={() => setIsFilterDialogOpen(false)}>
                <T text="Apply Filters" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle><T text="Inventory Analytics" /></DialogTitle>
            </DialogHeader>
            
            {isAnalyticsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{analytics.totalItems}</div>
                    <div className="text-sm text-muted-foreground"><T text="Total Items" /></div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{analytics.stockStatus.low}</div>
                    <div className="text-sm text-muted-foreground"><T text="Low Stock Items" /></div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{analytics.stockStatus.outOfStock}</div>
                    <div className="text-sm text-muted-foreground"><T text="Out of Stock" /></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3"><T text="Categories Distribution" /></h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(analytics.categoryCounts).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(analytics.categoryCounts).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip 
                            formatter={(value: any) => [`${value} items`, 'Count']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3"><T text="Transactions by Type" /></h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(analytics.transactionTypes).map(([name, value]) => ({ 
                            name: name.charAt(0).toUpperCase() + name.slice(1), 
                            value 
                          }))}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4f46e5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3"><T text="Recent Transactions" /></h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><T text="Date" /></TableHead>
                          <TableHead><T text="Type" /></TableHead>
                          <TableHead><T text="Ingredient" /></TableHead>
                          <TableHead><T text="Quantity" /></TableHead>
                          <TableHead><T text="Notes" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.recentTransactions.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              {new Date(tx.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                tx.transaction_type === 'purchase' ? 'success' :
                                tx.transaction_type === 'consumption' ? 'warning' :
                                tx.transaction_type === 'adjustment' ? 'default' :
                                'destructive'
                              }>
                                {tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{tx.ingredient?.name || tx.ingredient_id}</TableCell>
                            <TableCell>
                              {tx.quantity > 0 ? '+' : ''}{tx.quantity} {tx.unit}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {tx.notes || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p><T text="No analytics data available" /></p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default StockLevels;
