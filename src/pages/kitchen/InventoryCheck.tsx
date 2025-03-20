
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, RefreshCw, AlertCircle, AlertTriangle, Ban } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type definition for our inventory item
type InventoryItem = {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  status: "Normal" | "Low" | "Critical" | "Out of Stock";
  lastUpdated: string;
  reorder_level: number | null;
};

// Determine the inventory status based on quantity and reorder level
const getInventoryStatus = (quantity: number, reorderLevel: number | null): InventoryItem["status"] => {
  if (quantity <= 0) return "Out of Stock";
  if (!reorderLevel) return "Normal";
  
  if (quantity <= reorderLevel * 0.3) return "Critical";
  if (quantity <= reorderLevel * 0.7) return "Low";
  return "Normal";
};

// Format the date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    // Check if it's within the last week
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return 'Last Week';
    } else {
      return date.toLocaleDateString();
    }
  }
};

const InventoryCheck = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const { t } = useLanguage();

  // Fetch inventory data from Supabase
  const { data: inventoryItems, isLoading, error, refetch } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Transform the data
      return data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: Number(item.quantity),
        unit: item.unit,
        status: getInventoryStatus(Number(item.quantity), item.reorder_level),
        lastUpdated: formatDate(item.updated_at),
        reorder_level: item.reorder_level
      }));
    }
  });

  // Handle refetch with toast notification
  const handleRefetch = async () => {
    toast.promise(refetch(), {
      loading: 'Refreshing inventory data...',
      success: 'Inventory data updated successfully',
      error: 'Failed to refresh inventory data'
    });
  };

  // Filter items based on search term and selected category
  const filteredItems = inventoryItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = currentCategory === "all" || item.category?.toLowerCase() === currentCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories from the data
  const categories = inventoryItems 
    ? ["all", ...new Set(inventoryItems.map(item => item.category).filter(Boolean))]
    : ["all"];

  // Handle report to admin (placeholder for now)
  const handleReportToAdmin = (item: InventoryItem) => {
    toast.info(`Reported ${item.name} low stock to admin`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Kitchen Inventory" />}
        description={<T text="Check and manage current inventory levels" />}
        actions={
          <Button size="sm" onClick={handleRefetch} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <T text="Refresh Data" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search inventory...")}
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <Card className="p-6">
          <div className="text-center text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2"><T text="Error Loading Inventory" /></h3>
            <p>{error.message}</p>
          </div>
        </Card>
      ) : (
        <Tabs value={currentCategory} onValueChange={setCurrentCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                <T text={category === "all" ? "All" : category} />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={currentCategory}>
            <Card>
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full mb-4"></div>
                  <p><T text="Loading inventory data..." /></p>
                </div>
              ) : filteredItems && filteredItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Item" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Quantity" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                      <TableHead><T text="Last Updated" /></TableHead>
                      <TableHead><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category || '-'}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {item.status === "Critical" && <AlertCircle className="h-4 w-4 text-destructive" />}
                            {item.status === "Low" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                            {item.status === "Out of Stock" && <Ban className="h-4 w-4 text-destructive" />}
                            <Badge 
                              variant={
                                item.status === "Normal" ? "default" : 
                                item.status === "Low" ? "outline" : 
                                "destructive"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell>
                          {(item.status === "Low" || item.status === "Critical" || item.status === "Out of Stock") && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleReportToAdmin(item)}
                            >
                              <T text="Report to Admin" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <T text="Update" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p><T text="No inventory items found" /></p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {inventoryItems && inventoryItems.filter(item => item.status !== "Normal").length > 0 && (
        <div className="mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Inventory Alerts" /></h3>
            <div className="space-y-4">
              {inventoryItems.filter(item => item.status !== "Normal").map((item) => (
                <div key={item.id} className={`p-4 rounded-md border ${
                  item.status === "Critical" || item.status === "Out of Stock" ? 'border-destructive bg-destructive/10' : 'border-amber-500 bg-amber-500/10'
                }`}>
                  <div className="flex items-start gap-3">
                    {item.status === "Critical" || item.status === "Out of Stock" ? (
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">{item.name} - {item.status}</h4>
                      <p className="text-sm mt-1">
                        {item.status === "Out of Stock" 
                          ? <T text={`${item.name} is currently out of stock. This may affect menu availability.`} />
                          : <T text={`${item.name} is running low (${item.quantity} ${item.unit} remaining). Consider reordering soon.`} />
                        }
                      </p>
                      <div className="mt-3">
                        <Button 
                          size="sm" 
                          variant={item.status === "Critical" || item.status === "Out of Stock" ? "destructive" : "outline"}
                          onClick={() => handleReportToAdmin(item)}
                        >
                          <T text="Report to Admin" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InventoryCheck;
