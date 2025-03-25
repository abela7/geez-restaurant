
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, Plus, Minus, Trash2, Coffee, Utensils, Loader2 } from "lucide-react";
import { OrderItem } from '@/types/order';
import { FoodItem } from '@/types/menu';
import { supabase } from "@/integrations/supabase/client";

interface MenuSelectionStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onAddItem: (item: FoodItem) => void;
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export const MenuSelectionStep: React.FC<MenuSelectionStepProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onAddItem,
  orderItems,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  
  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('food_categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch menu items with their categories
        const { data: itemsData, error: itemsError } = await supabase
          .from('food_items')
          .select(`
            *,
            category:food_categories(id, name)
          `)
          .eq('is_available', true)
          .order('name');
        
        if (itemsError) throw itemsError;
        
        setCategories(categoriesData || []);
        setMenuItems(itemsData || []);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter menu items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesCategory = selectedCategory !== 'all'
      ? item.category_id === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Check if an item is already in the order
  const getOrderItemQuantity = (foodItemId: string): number => {
    let totalQuantity = 0;
    orderItems.forEach(item => {
      if (item.foodItem.id === foodItemId) {
        totalQuantity += item.quantity;
      }
    });
    return totalQuantity;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Select Menu Items" /></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Menu Items Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search menu items...")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <ScrollArea className="w-full" orientation="horizontal">
              <TabsList className="mb-4">
                <TabsTrigger value="all"><T text="All Items" /></TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {t(category.name)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            
            <TabsContent value={selectedCategory} className="mt-0">
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
                  {filteredItems.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-muted-foreground">
                      <T text="No items found" />
                    </div>
                  ) : (
                    filteredItems.map(item => {
                      const quantity = getOrderItemQuantity(item.id);
                      
                      return (
                        <Card 
                          key={item.id} 
                          className={`overflow-hidden hover:shadow-md transition-all border-border ${
                            quantity > 0 ? 'ring-1 ring-primary' : ''
                          }`}
                        >
                          <div className="relative">
                            <div 
                              className="h-32 bg-muted bg-cover bg-center" 
                              style={{ 
                                backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                                backgroundColor: !item.image_url ? 'hsl(var(--muted))' : undefined
                              }}
                            />
                            <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                              {item.is_vegetarian && (
                                <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500 text-xs">
                                  <T text="Veg" />
                                </Badge>
                              )}
                              {item.is_spicy && (
                                <Badge variant="outline" className="bg-red-500/20 text-red-700 border-red-500 text-xs">
                                  <T text="Spicy" />
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <CardContent className="p-3">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-sm">{t(item.name)}</h3>
                                {item.description && (
                                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
                                    {t(item.description)}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-primary">£{item.price.toFixed(2)}</div>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex justify-between items-center">
                              {quantity > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const orderItem = orderItems.find(oi => oi.foodItem.id === item.id);
                                      if (orderItem) {
                                        onUpdateQuantity(orderItem.id, orderItem.quantity - 1);
                                      }
                                    }}
                                  >
                                    {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                  </Button>
                                  <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const orderItem = orderItems.find(oi => oi.foodItem.id === item.id);
                                      if (orderItem) {
                                        onUpdateQuantity(orderItem.id, orderItem.quantity + 1);
                                      } else {
                                        onAddItem(item);
                                      }
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => onAddItem(item)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  <T text="Add" />
                                </Button>
                              )}
                              
                              <div className="flex gap-1">
                                {item.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {t(item.category.name)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Current Order Section */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium flex items-center">
                <Utensils className="h-4 w-4 mr-2" />
                <T text="Current Order" /> ({orderItems.reduce((acc, item) => acc + item.quantity, 0)} <T text="items" />)
              </h3>
              
              {orderItems.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  <T text="No items added yet" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="space-y-2">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t(item.foodItem.name)}</div>
                          {item.special_instructions && (
                            <div className="text-xs text-muted-foreground italic">
                              {item.special_instructions}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right w-16 text-sm">
                            £{(item.foodItem.price * item.quantity).toFixed(2)}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between font-medium">
                      <span><T text="Total" /></span>
                      <span>£{orderItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
