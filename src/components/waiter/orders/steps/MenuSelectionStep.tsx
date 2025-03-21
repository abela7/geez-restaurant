
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, Tag, Plus, Minus } from "lucide-react";
import { FoodItem } from "@/hooks/useMenuItems";
import { OrderItem } from "@/hooks/useOrderManagement";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import { QuickOrder } from "@/hooks/useQuickOrders";

interface MenuSelectionStepProps {
  menuItems: FoodItem[];
  categories: { id: string; name: string; description: string | null; }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  orderItems: OrderItem[];
  handleAddToOrder: (item: FoodItem) => void;
  handleQuantityChange: (itemId: string, newQuantity: number) => void;
  handleQuickOrderAdd: (quickOrder: QuickOrder) => void;
}

export const MenuSelectionStep: React.FC<MenuSelectionStepProps> = ({
  menuItems,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  orderItems,
  handleAddToOrder,
  handleQuantityChange,
  handleQuickOrderAdd
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("menu");

  // Filter menu items based on search and category
  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || item.categoryName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Organize items by category for display
  const itemsByCategory = React.useMemo(() => {
    const filteredItems = getFilteredMenuItems();
    return filteredItems.reduce((acc, item) => {
      const category = item.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);
  }, [menuItems, searchQuery, selectedCategory]);

  // Check if an item is already in the order
  const getItemQuantityInOrder = (itemId: string): number => {
    const item = orderItems.find(item => item.foodItem.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search menu...")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="scrollbar-thin overflow-x-auto pb-2 mb-4">
            <div className="flex gap-2 min-w-max">
              <Button 
                key="all" 
                variant={selectedCategory === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                <T text="All Categories" />
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category.id} 
                  variant={selectedCategory === category.name ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="menu"><T text="Menu Items" /></TabsTrigger>
              <TabsTrigger value="quick"><T text="Quick Orders" /></TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu">
              {Object.keys(itemsByCategory).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <T text="No menu items found matching your criteria" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-400px)] md:h-[400px]">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => {
                          const quantityInOrder = getItemQuantityInOrder(item.id);
                          
                          return (
                            <div key={item.id} className="border rounded-md p-3 hover:bg-accent/5 transition-colors">
                              <div className="flex justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.is_vegetarian && <Badge variant="outline" className="bg-green-50 text-green-800">Vegetarian</Badge>}
                                    {item.is_vegan && <Badge variant="outline" className="bg-green-100 text-green-800">Vegan</Badge>}
                                    {item.is_gluten_free && <Badge variant="outline" className="bg-blue-50 text-blue-800">GF</Badge>}
                                    {item.is_spicy && <Badge variant="outline" className="bg-red-50 text-red-800">Spicy</Badge>}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end ml-3">
                                  <span className="font-bold mb-2">${item.price.toFixed(2)}</span>
                                  {quantityInOrder > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => {
                                          const existingItem = orderItems.find(orderItem => orderItem.foodItem.id === item.id);
                                          if (existingItem) {
                                            handleQuantityChange(existingItem.id, quantityInOrder - 1);
                                          }
                                        }}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-6 text-center">{quantityInOrder}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleAddToOrder(item)}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleAddToOrder(item)}
                                      className="w-full"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      <T text="Add" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
            
            <TabsContent value="quick">
              <QuickOrdersSection onAddToOrder={handleQuickOrderAdd} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mini cart */}
      {orderItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-3 flex items-center justify-between">
              <span><T text="Current Order" /></span>
              <Badge variant="outline">{orderItems.length} items</Badge>
            </h3>
            
            <ScrollArea className="h-[150px]">
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="font-medium">{item.quantity}x {item.foodItem.name}</span>
                    <span>${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
