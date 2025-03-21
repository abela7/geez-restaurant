
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  RefreshCw, 
  AlertCircle, 
  AlertTriangle, 
  Ban, 
  ArrowUpFromLine,
  Grid,
  List,
  Plus,
  Minus
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Ingredient } from "@/services/inventory/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const InventoryCheck = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stockFilter, setStockFilter] = useState<"all" | "normal" | "low" | "out-of-stock">("all");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustNote, setAdjustNote] = useState<string>("");
  
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
  
  // Calculate stock status
  const getStockStatus = (item: Ingredient) => {
    const quantity = item.stock_quantity || 0;
    const reorderLevel = item.reorder_level || 0;
    
    if (quantity <= 0) return "out-of-stock";
    if (quantity <= reorderLevel) return "low";
    return "normal";
  };
  
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
        notes: `${item.name} stock is ${getStockStatus(item)}. Current level: ${item.stock_quantity} ${item.unit}`,
        created_by: "kitchen-staff" // Would use actual user ID in production
      });
      
      toast.success(t("Alert sent to administration"));
    } catch (error) {
      console.error("Error reporting to admin:", error);
      toast.error(t("Failed to send alert"));
    }
  };
  
  // Get low stock items
  const lowStockItems = inventoryItems.filter(
    item => getStockStatus(item) === "low" || getStockStatus(item) === "out-of-stock"
  );

  // Handle stock adjustment
  const handleAdjustStock = async () => {
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
        notes: adjustNote || `Stock manually ${adjustType === "add" ? "increased" : "decreased"} by kitchen staff`,
        created_by: "kitchen-staff" // Would use actual user ID in production
      });
      
      toast.success(t("Stock updated successfully"));
      refetch(); // Refresh inventory data
      setAdjustDialogOpen(false);
      resetAdjustForm();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error(t("Failed to update stock"));
    }
  };
  
  // Reset the adjustment form
  const resetAdjustForm = () => {
    setSelectedItem(null);
    setAdjustQuantity(0);
    setAdjustType("add");
    setAdjustNote("");
  };
  
  // Open adjustment dialog for an item
  const openAdjustDialog = (item: Ingredient) => {
    setSelectedItem(item);
    setAdjustDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Layout interface="kitchen">
        <div className="p-4 flex justify-center items-center h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout interface="kitchen">
      <div className="p-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search inventory...")}
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t("All stock")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All stock" /></SelectItem>
                <SelectItem value="normal"><T text="In stock" /></SelectItem>
                <SelectItem value="low"><T text="Low stock" /></SelectItem>
                <SelectItem value="out-of-stock"><T text="Out of stock" /></SelectItem>
              </SelectContent>
            </Select>
            
            <div className="border rounded-md flex">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="icon" 
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="icon" 
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}><T text="Refresh" /></span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                // In a real app, this would open a form to request new items
                toast.info(t("Item request functionality will be implemented soon"));
              }}
              className="flex items-center gap-1"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}><T text="Request Item" /></span>
            </Button>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <T text={`There are ${lowStockItems.length} ingredients that need attention`} />
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 overflow-auto flex w-full justify-start px-0 py-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize px-3 py-1.5 text-xs sm:text-sm"
              >
                <T text={category === "all" ? "All Items" : category} />
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-260px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredInventory.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Ban className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-muted-foreground">
                        <T text="No inventory items found" />
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <Card key={item.id} className={`
                        ${status === 'out-of-stock' ? 'border-destructive/50 bg-destructive/5' : 
                          status === 'low' ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : ''}
                      `}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-base">{item.name}</h3>
                              <div className="text-sm text-muted-foreground mt-1">{item.category}</div>
                            </div>
                            <Badge 
                              variant={
                                status === "normal" ? "outline" : 
                                status === "low" ? "default" : 
                                "destructive"
                              }
                              className="capitalize"
                            >
                              {status === "out-of-stock" ? t("Out of Stock") : 
                                status === "low" ? t("Low Stock") : t("In Stock")}
                            </Badge>
                          </div>
                          
                          <div className="mt-3 text-sm">
                            <div className="flex justify-between">
                              <span><T text="Current" /></span>
                              <span className="font-medium">{item.stock_quantity || 0} {item.unit}</span>
                            </div>
                            {item.reorder_level !== undefined && (
                              <div className="flex justify-between mt-1">
                                <span><T text="Reorder At" /></span>
                                <span>{item.reorder_level} {item.unit}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openAdjustDialog(item)}
                            >
                              <T text="Adjust Stock" />
                            </Button>
                            
                            {(status === "low" || status === "out-of-stock") && (
                              <Button 
                                variant={status === "out-of-stock" ? "destructive" : "default"}
                                size="sm"
                                className="flex-1"
                                onClick={() => reportToAdmin(item)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                <T text="Report" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            ) : (
              // List view
              <div className="space-y-2">
                {filteredInventory.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Ban className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-muted-foreground">
                        <T text="No inventory items found" />
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <Card key={item.id} className={`
                        ${status === 'out-of-stock' ? 'border-destructive/50 bg-destructive/5' : 
                          status === 'low' ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : ''}
                      `}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <div className="text-sm text-muted-foreground">{item.category}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-2">
                                <div className="font-medium">{item.stock_quantity || 0} {item.unit}</div>
                                <div className="text-xs text-muted-foreground">
                                  <T text="Reorder at" />: {item.reorder_level} {item.unit}
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  status === "normal" ? "outline" : 
                                  status === "low" ? "default" : 
                                  "destructive"
                                }
                              >
                                {status === "out-of-stock" ? t("Out") : 
                                  status === "low" ? t("Low") : t("OK")}
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => openAdjustDialog(item)}>
                                <T text="Adjust" />
                              </Button>
                              {(status === "low" || status === "out-of-stock") && (
                                <Button 
                                  size="sm" 
                                  variant={status === "out-of-stock" ? "destructive" : "default"}
                                  onClick={() => reportToAdmin(item)}
                                >
                                  <T text="Report" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><T text="Adjust Stock Quantity" /></DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{selectedItem.stock_quantity || 0} {selectedItem.unit}</div>
                    <div className="text-xs text-muted-foreground"><T text="Current stock" /></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label><T text="Operation" /></Label>
                  <Select value={adjustType} onValueChange={(value) => setAdjustType(value as "add" | "subtract")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4 text-green-500" />
                          <T text="Add Stock" />
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center">
                          <Minus className="mr-2 h-4 w-4 text-red-500" />
                          <T text="Subtract Stock" />
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label><T text="Quantity" /></Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label><T text="Note (optional)" /></Label>
                <Input
                  placeholder={t("Reason for adjustment")}
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                {adjustType === "add" ? (
                  <div className="text-sm">
                    <T text="New stock level will be" />: <span className="font-medium">{(selectedItem.stock_quantity || 0) + adjustQuantity} {selectedItem.unit}</span>
                  </div>
                ) : (
                  <div className="text-sm">
                    <T text="New stock level will be" />: <span className="font-medium">{Math.max(0, (selectedItem.stock_quantity || 0) - adjustQuantity)} {selectedItem.unit}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button 
              onClick={handleAdjustStock}
              disabled={!selectedItem || adjustQuantity <= 0}
            >
              <T text="Update Stock" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default InventoryCheck;
