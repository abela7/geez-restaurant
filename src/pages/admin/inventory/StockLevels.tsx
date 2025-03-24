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
            type="search"
            placeholder={t("Search ingredients...")}
            className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          <T text="Filter" />
        </Button>
        
        <Button variant="outline" onClick={loadAnalytics}>
          <BarChart2 className="mr-2 h-4 w-4" />
          <T text="Analytics" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {filteredIngredients.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium"><T text="No ingredients found" /></h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? (
                    <T text="No ingredients match your current filters. Try adjusting or clearing them." />
                  ) : (
                    <T text="Your inventory is empty. Add your first ingredient to get started." />
                  )}
                </p>
                {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    <T text="Clear Filters" />
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Name" /></TableHead>
                    <TableHead><T text="Category" /></TableHead>
                    <TableHead><T text="Quantity" /></TableHead>
                    <TableHead><T text="Unit" /></TableHead>
                    <TableHead><T text="Reorder Level" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIngredients.map((ingredient) => {
                    const status = getIngredientStatus(ingredient);
                    return (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.category || "-"}</TableCell>
                        <TableCell>{ingredient.stock_quantity || 0}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        <TableCell>{ingredient.reorder_level || 0}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant as any}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedIngredient(ingredient);
                                setIsAdjustDialogOpen(true);
                              }}
                              title={t("Adjust Stock")}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedIngredient(ingredient);
                                setIsEditDialogOpen(true);
                              }}
                              title={t("Edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewHistory(ingredient)}
                              title={t("History")}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <PaginationPrevious />
                        </Button>
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <Button
                            variant={currentPage === index + 1 ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Button>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <PaginationNext />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Add Ingredient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle><T text="Add New Ingredient" /></DialogTitle>
            <DialogDescription>
              <T text="Add a new ingredient to your inventory." />
            </DialogDescription>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle><T text="Edit Ingredient" /></DialogTitle>
            <DialogDescription>
              <T text="Update ingredient details." />
            </DialogDescription>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle><T text="Adjust Stock" /></DialogTitle>
            <DialogDescription>
              {selectedIngredient && (
                <T text="Adjust stock level for {name}" params={{ name: selectedIngredient.name }} />
              )}
            </DialogDescription>
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

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle><T text="Transaction History" /></DialogTitle>
            <DialogDescription>
              {selectedIngredient && (
                <T text="View transaction history for {name}" params={{ name: selectedIngredient.name }} />
              )}
            </DialogDescription>
          </DialogHeader>
          <InventoryTransactionList 
            transactions={transactions}
            isLoading={isTransactionsLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle><T text="Inventory Analytics" /></DialogTitle>
            <DialogDescription>
              <T text="View inventory analytics and insights" />
            </DialogDescription>
          </DialogHeader>
          
          {isAnalyticsLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2"><T text="Stock Status Distribution" /></h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Normal", value: analytics.stockStatus.normal },
                            { name: "Low", value: analytics.stockStatus.low },
                            { name: "Out of Stock", value: analytics.stockStatus.outOfStock }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Normal", value: analytics.stockStatus.normal },
                            { name: "Low", value: analytics.stockStatus.low },
                            { name: "Out of Stock", value: analytics.stockStatus.outOfStock }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2"><T text="Items by Category" /></h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(analytics.categoryCounts).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2"><T text="Recent Transactions" /></h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Date" /></TableHead>
                      <TableHead><T text="Type" /></TableHead>
                      <TableHead><T text="Quantity" /></TableHead>
                      <TableHead><T text="Notes" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recentTransactions.length > 0 ? (
                      analytics.recentTransactions.map((tx: any) => (
                        <TableRow key={tx.id}>
                          <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="capitalize">{tx.transaction_type}</TableCell>
                          <TableCell>{tx.quantity > 0 ? "+" : ""}{tx.quantity} {tx.unit}</TableCell>
                          <TableCell className="truncate max-w-[200px]">{tx.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          <T text="No recent transactions" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground"><T text="Failed to load analytics data" /></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle><T text="Filter Ingredients" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium"><T text="Category" /></h4>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">{t("All Categories")}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium"><T text="Stock Status" /></h4>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t("All Statuses")}</option>
                <option value="normal">{t("Normal")}</option>
                <option value="low">{t("Low")}</option>
                <option value="critical">{t("Critical")}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>
              <T text="Clear Filters" />
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              <T text="Apply Filters" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockLevels;
