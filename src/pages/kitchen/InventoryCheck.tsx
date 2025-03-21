
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
import { Search, RefreshCw, AlertCircle, AlertTriangle, Ban, ArrowUpFromLine } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Ingredient } from "@/services/inventory/types";

const InventoryCheck = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
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

  // Filter inventory based on search and category
  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category?.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
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
      // Instead of using inventory_alerts table, we'll use the built-in transactions table
      // to record alerts about low inventory
      await supabase.from("inventory_transactions").insert({
        ingredient_id: item.id,
        transaction_type: "alert",
        quantity: 0, // Not changing quantity, just reporting
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
              {/* Fixed the T component to only use text prop */}
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
                        
                        {(status === "low" || status === "out-of-stock") && (
                          <div className="mt-3">
                            <Button 
                              variant={status === "out-of-stock" ? "destructive" : "default"}
                              size="sm"
                              className="w-full"
                              onClick={() => reportToAdmin(item)}
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <T text="Report to Admin" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InventoryCheck;
