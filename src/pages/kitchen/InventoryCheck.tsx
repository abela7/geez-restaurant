
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample inventory data
const inventoryCategories = ["All Items", "Protein", "Spice", "Dairy", "Vegetable", "Culture"];

const inventoryItems = [
  { id: 1, name: "Beef", category: "Protein", stock: 12, unit: "kg", status: "In Stock" },
  { id: 2, name: "Chicken", category: "Protein", stock: 8, unit: "kg", status: "In Stock" },
  { id: 3, name: "Salt", category: "Spice", stock: 5, unit: "kg", status: "In Stock" },
  { id: 4, name: "Berbere", category: "Spice", stock: 2, unit: "kg", status: "Low Stock" },
  { id: 5, name: "Butter", category: "Dairy", stock: 4, unit: "kg", status: "In Stock" },
  { id: 6, name: "Milk", category: "Dairy", stock: 6, unit: "L", status: "In Stock" },
  { id: 7, name: "Tomato", category: "Vegetable", stock: 10, unit: "kg", status: "In Stock" },
  { id: 8, name: "Onion", category: "Vegetable", stock: 15, unit: "kg", status: "In Stock" },
  { id: 9, name: "Garlic", category: "Vegetable", stock: 1, unit: "kg", status: "Low Stock" },
  { id: 10, name: "Injera", category: "Culture", stock: 25, unit: "pcs", status: "In Stock" },
  { id: 11, name: "Kocho", category: "Culture", stock: 0, unit: "kg", status: "Out of Stock" },
];

const InventoryCheck = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Items");
  
  // Filter items based on search and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "All Items" || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });
  
  // Count low stock items
  const lowStockCount = inventoryItems.filter(item => 
    item.status === "Low Stock" || item.status === "Out of Stock"
  ).length;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <PageHeader
        title={<T text="Inventory Check" />}
        description={<T text="Review current stock levels and inventory status" />}
        className="mb-4"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search inventory...")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-none">
          <div className="relative">
            <select className="w-full h-10 pl-3 pr-10 py-2 border rounded-md bg-background text-foreground">
              <option value="all">{t("All stock")}</option>
              <option value="low">{t("Low stock")}</option>
              <option value="out">{t("Out of stock")}</option>
            </select>
          </div>
        </div>
      </div>
      
      {lowStockCount > 0 && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-600 dark:text-red-400 font-medium">
              <T text="There are" /> {lowStockCount} <T text="ingredients that need attention" />
            </p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="All Items" value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 inline-flex w-auto">
            {inventoryCategories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="px-3 py-1.5 whitespace-nowrap"
              >
                {t(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className={item.status === "Out of Stock" ? "border-red-300 dark:border-red-900" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{t(item.category)}</p>
                    </div>
                    <Badge variant={
                      item.status === "In Stock" ? "outline" :
                      item.status === "Low Stock" ? "secondary" : "destructive"
                    }>
                      {t(item.status)}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        <T text="Current" />
                      </div>
                      <div className="text-2xl font-semibold">
                        {item.stock} {item.unit}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <T text="Update" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                <p><T text="No inventory items found" /></p>
                <p className="text-sm mt-2"><T text="Try adjusting your search or category filter" /></p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryCheck;
