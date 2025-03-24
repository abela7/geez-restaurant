import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem, MenuCategory } from "@/types/menu";
import { toast } from "sonner";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { MenuNotification } from "@/types/menuNotifications";

const MenuAvailability = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const queryClient = useQueryClient();
  
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ["kitchen-menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_items")
        .select("*, menu_categories(id, name)")
        .order("name");
        
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        categoryName: item.menu_categories ? item.menu_categories.name : null,
        available: item.available !== false,
      })) as FoodItem[];
    },
  });
  
  const { data: categories = [] } = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("active", true)
        .order("name");
        
      if (error) throw error;
      return data as MenuCategory[];
    },
  });
  
  const createNotification = useMutation({
    mutationFn: async (notification: Omit<MenuNotification, "id" | "created_at" | "read">) => {
      try {
        const { error } = await supabase
          .from("menu_notifications")
          .insert(notification);
          
        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t("Notification sent to waiters"));
    },
    onError: (error) => {
      console.error("Error creating notification:", error);
      toast.error(t("Failed to send notification"));
    }
  });
  
  const updateItemAvailability = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { data, error } = await supabase
        .from("food_items")
        .update({ available })
        .eq("id", id);
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["kitchen-menu-items"] });
      
      const item = menuItems.find(item => item.id === variables.id);
      if (!item) return;
      
      createNotification.mutate({
        title: variables.available ? t("Menu Item Available") : t("Menu Item Unavailable"),
        message: variables.available 
          ? `${item.name} ${t("is now available")}` 
          : `${item.name} ${t("is no longer available")}`,
        type: variables.available ? "success" : "warning",
        for_role: "waiter",
        created_by: "kitchen"
      });
    }
  });
  
  const toggleAvailability = (id: string, currentValue: boolean) => {
    updateItemAvailability.mutate({ id, available: !currentValue });
  };
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || item.category_id === activeTab;
    return matchesSearch && matchesCategory;
  });
  
  const availableItems = filteredItems.filter(item => item.available);
  const unavailableItems = filteredItems.filter(item => !item.available);
  
  const menuCategories = [{ id: "all", name: t("All Items") }, ...categories];

  if (menuLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <PageHeader
        title={<T text="Menu Availability" />}
        description={<T text="Manage which items are available to order" />}
        className="mb-4"
      />
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search menu items...")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 w-auto inline-flex">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-3 py-1.5 whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        <TabsContent value={activeTab} className="mt-0 space-y-4">
          {availableItems.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  <T text="Available Items" />
                  <Badge variant="outline" className="ml-2">{availableItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="divide-y">
                    {availableItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.categoryName} • {item.price.toFixed(2)} ETB
                            {item.preparation_time && ` • ${item.preparation_time} ${t("min")}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleAvailability(item.id, item.available || false)}
                            aria-label={t("Toggle availability")}
                          />
                          <span className="text-sm text-green-600 font-medium">
                            <T text="Available" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
          
          {unavailableItems.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  <T text="Unavailable Items" />
                  <Badge variant="outline" className="ml-2">{unavailableItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="divide-y">
                    {unavailableItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.categoryName} • {item.price.toFixed(2)} ETB
                            {item.preparation_time && ` • ${item.preparation_time} ${t("min")}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleAvailability(item.id, item.available || false)}
                            aria-label={t("Toggle availability")}
                          />
                          <span className="text-sm text-amber-600 font-medium">
                            <T text="Unavailable" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
          
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
              <p><T text="No menu items found" /></p>
              <p className="text-sm mt-2"><T text="Try adjusting your search or category filter" /></p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuAvailability;
