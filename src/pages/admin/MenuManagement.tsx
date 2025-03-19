
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Search, Plus, Edit, BarChart2, Utensils } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample menu categories
const menuCategories = ["Main Dishes", "Vegetarian", "Appetizers", "Beverages", "Desserts"];

// Sample menu items
const menuItems = [
  { id: 1, name: "Doro Wat", category: "Main Dishes", price: 18.99, available: true, image: "/placeholder.svg", description: "Spicy chicken stew with berbere sauce and hard-boiled eggs" },
  { id: 2, name: "Kitfo", category: "Main Dishes", price: 19.99, available: true, image: "/placeholder.svg", description: "Minced raw beef seasoned with mitmita and niter kibbeh" },
  { id: 3, name: "Tibs", category: "Main Dishes", price: 17.99, available: true, image: "/placeholder.svg", description: "Sautéed meat with vegetables and spices" },
  { id: 4, name: "Shiro", category: "Vegetarian", price: 14.99, available: true, image: "/placeholder.svg", description: "Spiced chickpea stew with injera" },
  { id: 5, name: "Misir Wat", category: "Vegetarian", price: 13.99, available: true, image: "/placeholder.svg", description: "Spiced red lentil stew" },
  { id: 6, name: "Sambusa", category: "Appetizers", price: 8.99, available: false, image: "/placeholder.svg", description: "Fried pastry with spiced filling" },
];

const MenuManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Menu Management" 
        description="Create and manage your restaurant's menu items"
        actions={
          <>
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              <T text="Menu Analytics" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Item" />
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu items..."
            className="w-full pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Items" /></TabsTrigger>
          {menuCategories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
              <T text={category} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="text-lg font-bold">${item.price}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch id={`available-${item.id}`} checked={item.available} />
                      <Label htmlFor={`available-${item.id}`}>
                        {item.available ? <T text="Available" /> : <T text="Unavailable" />}
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      <T text="Edit" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* We would repeat similar content for each category tab */}
        {menuCategories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
            <div className="text-center p-8 text-muted-foreground">
              <Utensils className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
              <p><T text={`Filtered view of ${category} would appear here`} /></p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MenuManagement;
