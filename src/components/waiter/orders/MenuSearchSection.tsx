
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Tag, Loader2, Plus } from "lucide-react";
import { Search } from "lucide-react";

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
}

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  categoryName?: string;
}

interface MenuSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: MenuCategory[];
  itemsByCategory: Record<string, FoodItem[]>;
  isLoading: boolean;
  handleAddToOrder: (item: FoodItem) => void;
  handleQuickOrderAdd: (quickOrder: any) => void;
}

export const MenuSearchSection: React.FC<MenuSearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  itemsByCategory,
  isLoading,
  handleAddToOrder,
  handleQuickOrderAdd
}) => {
  const { t } = useLanguage();

  return (
    <Card className="mb-6">
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

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="menu" className="w-full">
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
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => (
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
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAddToOrder(item)}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  <T text="Add" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
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
        )}
      </CardContent>
    </Card>
  );
};
