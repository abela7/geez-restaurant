
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Search, AlertCircle, Check, X, Filter, CupSoda, Utensils } from "lucide-react";
import { FoodItem } from "@/types/menu";

const MenuAvailability = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("food");

  // Fetch menu items
  const { data: menuItems = [], isLoading, refetch } = useQuery({
    queryKey: ["kitchen-menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_items")
        .select(`
          *,
          menu_categories(id, name)
        `)
        .order("name");
        
      if (error) throw error;
      
      const formattedItems = data.map((item: any) => ({
        ...item,
        categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
      }));
      
      return formattedItems as FoodItem[];
    },
  });
  
  // Get categories
  const categories = ["all", ...new Set(menuItems.map(item => item.categoryName || "uncategorized"))];
  
  // Handle toggling item availability
  const toggleItemAvailability = async (item: FoodItem) => {
    try {
      const { error } = await supabase
        .from("food_items")
        .update({ available: !item.available })
        .eq("id", item.id);
        
      if (error) throw error;
      
      toast.success(
        item.available 
          ? t(`${item.name} marked as unavailable`) 
          : t(`${item.name} marked as available`)
      );
      
      // Notify waiters via realtime or through a notification table
      await supabase
        .from("staff_notifications")
        .insert({
          title: "Menu Item Availability Change",
          message: `${item.name} is now ${!item.available ? 'available' : 'unavailable'}`,
          type: "menu_update",
          for_role: "waiter",
          created_by: "kitchen"
        })
        .select();
      
      refetch();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error(t("Failed to update availability"));
    }
  };
  
  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.categoryName?.toLowerCase() === activeCategory.toLowerCase();
    const matchesType = activeTab === "all" 
      || (activeTab === "food" && !item.is_beverage)
      || (activeTab === "drinks" && item.is_beverage);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="container mx-auto p-4">
      <PageHeader 
        title="Menu Availability Management" 
        description="Control which menu items are available for ordering"
      />
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu items..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-shrink-0">
          <select 
            className="w-full p-2 border rounded-md" 
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Tabs defaultValue="food" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="food">
            <Utensils className="h-4 w-4 mr-2" />
            <T text="Food Items" />
          </TabsTrigger>
          <TabsTrigger value="drinks">
            <CupSoda className="h-4 w-4 mr-2" />
            <T text="Drinks" />
          </TabsTrigger>
          <TabsTrigger value="all">
            <T text="All Items" />
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                <T text="Menu Items" />
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex gap-1">
                  <Check className="h-3.5 w-3.5 text-green-500" /> <T text="Available" />
                </Badge>
                <Badge variant="outline" className="flex gap-1">
                  <X className="h-3.5 w-3.5 text-red-500" /> <T text="Unavailable" />
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          {isLoading ? (
            <CardContent className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full mx-auto mb-4"></div>
              <p><T text="Loading menu items..." /></p>
            </CardContent>
          ) : filteredItems.length === 0 ? (
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p><T text="No menu items found" /></p>
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Price" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.categoryName}</Badge>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.available ? (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3.5 w-3.5 mr-1" /> <T text="Available" />
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-3.5 w-3.5 mr-1" /> <T text="Unavailable" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={item.available ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleItemAvailability(item)}
                      >
                        {item.available ? (
                          <><X className="h-4 w-4 mr-2" /><T text="Mark Unavailable" /></>
                        ) : (
                          <><Check className="h-4 w-4 mr-2" /><T text="Mark Available" /></>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Tabs>
    </div>
  );
};

export default MenuAvailability;
