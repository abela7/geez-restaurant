
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, Plus, Minus, Trash2, Coffee, Utensils, LayoutGrid, List, Loader2 } from "lucide-react";
import { OrderItem } from '@/types/order';
import { FoodItem } from '@/types/menu';
import { supabase } from "@/integrations/supabase/client";
import { useMenuItems } from '@/hooks/useMenuItems';

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
  image_url?: string;
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModifiers, setShowModifiers] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch menu items with their categories
        const { data: itemsData, error: itemsError } = await supabase
          .from('food_items')
          .select(`
            *,
            menu_categories(id, name)
          `)
          .eq('available', true)
          .order('name');
        
        if (itemsError) throw itemsError;
        
        // Transform the data to match the expected format
        const typedCategories: FoodCategory[] = categoriesData || [];
        setCategories(typedCategories);
        
        // Process menu items to include category information
        const typedMenuItems: FoodItem[] = (itemsData || []).map(item => ({
          ...item,
          categoryName: item.menu_categories?.name || "Uncategorized"
        }));
        
        setMenuItems(typedMenuItems);
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
  
  const handleFoodItemClick = (item: FoodItem) => {
    setSelectedFood(item);
    // In a real app, you would check if this item has modifiers and show them
    // For now, we'll just add the item directly
    onAddItem(item);
  };
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold"><T text="Select Menu Items" /></h2>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            <T text="Grid" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            <T text="List" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categories and Menu Items */}
        <div className="md:col-span-3">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search menu items...")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3"><T text="Categories" /></h3>
            
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2" 
              : "space-y-2"
            }>
              <Card 
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedCategory === 'all' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                <CardContent className={viewMode === 'grid' 
                  ? "p-3 text-center" 
                  : "p-3 flex justify-between items-center"
                }>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="h-8 flex items-center justify-center">
                        <Utensils className="h-6 w-6 text-primary" />
                      </div>
                      <div className="font-medium mt-1"><T text="All Items" /></div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium"><T text="All Items" /></span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {filteredItems.length}
                      </Badge>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {categories.map(category => {
                const itemsInCategory = menuItems.filter(item => 
                  item.category_id === category.id
                );
                
                return (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className={viewMode === 'grid' 
                      ? "p-3 text-center" 
                      : "p-3 flex justify-between items-center"
                    }>
                      {viewMode === 'grid' ? (
                        <>
                          <div className="h-8 flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-primary" />
                          </div>
                          <div className="font-medium mt-1">{t(category.name)}</div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <Coffee className="h-5 w-5 text-primary mr-2" />
                            <span className="font-medium">{t(category.name)}</span>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {itemsInCategory.length}
                          </Badge>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <h3 className="text-sm font-medium mb-3">
            <T text="Menu Items" /> - {
              selectedCategory === 'all' 
                ? t('All Categories') 
                : t(categories.find(c => c.id === selectedCategory)?.name || '')
            }
          </h3>
          
          <ScrollArea className="h-[calc(100vh-480px)]">
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" 
              : "space-y-2"
            }>
              {filteredItems.length === 0 ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                  <T text="No items found" />
                </div>
              ) : (
                filteredItems.map(item => {
                  const quantity = getOrderItemQuantity(item.id);
                  
                  return viewMode === 'grid' ? (
                    <Card 
                      key={item.id} 
                      className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                        quantity > 0 ? 'ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleFoodItemClick(item)}
                    >
                      <div 
                        className="h-24 bg-muted bg-cover bg-center" 
                        style={{ 
                          backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                          backgroundColor: !item.image_url ? 'hsl(var(--muted))' : undefined
                        }}
                      />
                      <CardContent className="p-2">
                        <div className="font-medium text-sm">{t(item.name)}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm font-medium text-primary">£{item.price.toFixed(2)}</div>
                          {quantity > 0 && (
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {quantity}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card 
                      key={item.id} 
                      className={`hover:shadow-md transition-all cursor-pointer ${
                        quantity > 0 ? 'ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleFoodItemClick(item)}
                    >
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          {item.image_url && (
                            <div 
                              className="h-10 w-10 rounded bg-muted bg-cover bg-center mr-3" 
                              style={{ backgroundImage: `url(${item.image_url})` }}
                            />
                          )}
                          <div>
                            <div className="font-medium">{t(item.name)}</div>
                            <div className="text-sm text-primary">£{item.price.toFixed(2)}</div>
                          </div>
                        </div>
                        {quantity > 0 && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {quantity}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Current Order Section */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium flex items-center">
                <Utensils className="h-4 w-4 mr-2" />
                <T text="Current Order" />
                <Badge className="ml-2" variant="outline">
                  {orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                </Badge>
              </h3>
              
              {orderItems.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  <T text="No items added yet" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-480px)]">
                  <div className="space-y-2">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t(item.foodItem.name)}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.id, item.quantity - 1);
                              }}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="h-3 w-3 text-destructive" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </Button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right w-16 text-sm">
                            £{(item.foodItem.price * item.quantity).toFixed(2)}
                          </div>
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
