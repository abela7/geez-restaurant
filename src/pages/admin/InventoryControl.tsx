
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, AlertTriangle, Package, Truck, BarChart2, Filter, ArrowDownUp, RefreshCw } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryStockForm } from "@/components/inventory/InventoryStockForm";
import { InventoryAnalytics } from "@/components/inventory/InventoryAnalytics";
import { InventoryHistoryDialog } from "@/components/inventory/InventoryHistoryDialog";
import { SideModal } from "@/components/ui/side-modal";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStock, getStockHistory, getStockAnalytics } from "@/services/inventory/stockService";
import { Ingredient } from "@/services/inventory/types";

const InventoryControl = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItem, setEditItem] = useState<Ingredient | null>(null);
  const [historyItem, setHistoryItem] = useState<Ingredient | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: 'name',
    direction: 'asc'
  });
  const [analytics, setAnalytics] = useState<any>(null);

  // Track statistics
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    lowStockItems: 0,
    pendingOrders: 0
  });

  // Extract unique categories from inventory
  const categories = ['All', ...new Set(inventory.map(item => item.category || 'Uncategorized'))];

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, selectedCategory, activeTab, sortOrder]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStock();
      setInventory(data);
      // Calculate statistics
      const lowStock = data.filter(item => 
        item.stock_quantity !== undefined && 
        item.reorder_level !== undefined && 
        item.stock_quantity <= item.reorder_level
      ).length;
      
      setStatistics({
        totalItems: data.length,
        lowStockItems: lowStock,
        pendingOrders: 3 // This would be from purchase orders in a real implementation
      });
      
      // Load analytics
      const analyticsData = await getStockAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load inventory data"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = [...inventory];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply tab filter
    if (activeTab === 'low') {
      filtered = filtered.filter(item => 
        item.stock_quantity !== undefined && 
        item.reorder_level !== undefined && 
        item.stock_quantity <= item.reorder_level && 
        item.stock_quantity > 0
      );
    } else if (activeTab === 'out') {
      filtered = filtered.filter(item => 
        item.stock_quantity !== undefined && 
        item.stock_quantity === 0
      );
    } else if (activeTab === 'normal') {
      filtered = filtered.filter(item => 
        item.stock_quantity !== undefined && 
        item.reorder_level !== undefined && 
        item.stock_quantity > item.reorder_level
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortOrder.field as keyof Ingredient];
      let bValue: any = b[sortOrder.field as keyof Ingredient];
      
      // Handle undefined values
      if (aValue === undefined) aValue = sortOrder.field === 'name' ? '' : 0;
      if (bValue === undefined) bValue = sortOrder.field === 'name' ? '' : 0;
      
      if (sortOrder.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredInventory(filtered);
  };

  const handleSort = (field: string) => {
    setSortOrder(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleItemUpdate = () => {
    loadInventory();
    setEditItem(null);
  };

  const handleAddItem = () => {
    setEditItem(null);
    setAddItemOpen(true);
  };

  const handleEditItem = (item: Ingredient) => {
    setEditItem(item);
    setAddItemOpen(true);
  };

  const handleViewHistory = async (item: Ingredient) => {
    setHistoryItem(item);
  };

  const closeHistoryDialog = () => {
    setHistoryItem(null);
  };

  const handleApplyFilters = (filters: any) => {
    setSelectedCategory(filters.category);
    setActiveTab(filters.status === 'all' ? 'all' : 
                 filters.status === 'low' ? 'low' : 
                 filters.status === 'critical' ? 'out' : 'normal');
    setSortOrder({
      field: filters.sortBy.split('-')[0],
      direction: filters.sortBy.includes('-desc') ? 'desc' : 'asc'
    });
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Inventory Control" />}
        description={<T text="Track and manage your restaurant inventory" />}
        actions={
          <>
            <Button variant="outline" size="sm" className="md:flex hidden" onClick={loadInventory}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <T text="Refresh" />
            </Button>
            <Button variant="outline" size="sm" className="md:flex hidden" onClick={() => setShowAnalytics(true)}>
              <BarChart2 className="mr-2 h-4 w-4" />
              <T text="Analytics" />
            </Button>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Item" />
            </Button>
          </>
        }
      />

      <InventoryNav />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title={<T text="Total Items" />}
          value={statistics.totalItems.toString()}
          icon={<Package size={18} />}
        />
        <StatCard 
          title={<T text="Low Stock Items" />}
          value={statistics.lowStockItems.toString()}
          change={statistics.lowStockItems > 0 ? `+${statistics.lowStockItems}` : "0"}
          isPositive={false}
          icon={<AlertTriangle size={18} />}
        />
        <StatCard 
          title={<T text="Pending Orders" />}
          value={statistics.pendingOrders.toString()}
          icon={<Truck size={18} />}
        />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search inventory...")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("All Categories")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
            <Filter className="mr-2 h-4 w-4" />
            <T text="More Filters" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('name')}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            <T text="Sort" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Items" /></TabsTrigger>
          <TabsTrigger value="normal"><T text="Normal Stock" /></TabsTrigger>
          <TabsTrigger value="low"><T text="Low Stock" /></TabsTrigger>
          <TabsTrigger value="out"><T text="Out of Stock" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <InventoryTable 
              inventory={filteredInventory} 
              isLoading={isLoading} 
              onEdit={handleEditItem}
              onViewHistory={handleViewHistory}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="normal" className="mt-0">
          <Card>
            <InventoryTable 
              inventory={filteredInventory} 
              isLoading={isLoading} 
              onEdit={handleEditItem}
              onViewHistory={handleViewHistory}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="low" className="mt-0">
          <Card>
            <InventoryTable 
              inventory={filteredInventory} 
              isLoading={isLoading} 
              onEdit={handleEditItem}
              onViewHistory={handleViewHistory}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="out" className="mt-0">
          <Card>
            <InventoryTable 
              inventory={filteredInventory} 
              isLoading={isLoading} 
              onEdit={handleEditItem}
              onViewHistory={handleViewHistory}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Item Modal */}
      <SideModal
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        title={editItem ? <T text="Edit Inventory Item" /> : <T text="Add Inventory Item" />}
        width="lg"
      >
        <InventoryStockForm
          item={editItem}
          onSave={handleItemUpdate}
          onCancel={() => setAddItemOpen(false)}
        />
      </SideModal>
      
      {/* Item History Dialog */}
      <InventoryHistoryDialog 
        item={historyItem} 
        onClose={closeHistoryDialog} 
      />
      
      {/* Inventory Filters */}
      <InventoryFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        categories={categories}
        initialFilters={{
          category: selectedCategory,
          status: activeTab === 'all' ? 'all' : 
                 activeTab === 'low' ? 'low' : 
                 activeTab === 'out' ? 'critical' : 'normal',
          sortBy: `${sortOrder.field}${sortOrder.direction === 'desc' ? '-desc' : ''}`,
          view: 'list'
        }}
        onApplyFilters={handleApplyFilters}
      />
      
      {/* Analytics Modal */}
      <SideModal
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
        title={<T text="Inventory Analytics" />}
        width="lg"
      >
        <InventoryAnalytics 
          analytics={analytics} 
          isLoading={isLoading} 
        />
      </SideModal>
    </div>
  );
};

export default InventoryControl;
