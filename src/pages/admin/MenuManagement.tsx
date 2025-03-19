import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Edit, BarChart2, Utensils, Info, DollarSign, Settings } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const menuTabs = [
  { id: "items", label: "Menu Items" },
  { id: "categories", label: "Categories" },
  { id: "modifiers", label: "Modifiers & Options" },
  { id: "recipes", label: "Recipes & Costs" },
  { id: "design", label: "Menu Design" }
];

const menuCategories = ["Main Dishes", "Vegetarian", "Appetizers", "Beverages", "Desserts"];

const menuItems = [
  { id: 1, name: "Doro Wat", category: "Main Dishes", price: 18.99, cost: 7.45, profit: 11.54, available: true, image: "/placeholder.svg", description: "Spicy chicken stew with berbere sauce and hard-boiled eggs" },
  { id: 2, name: "Kitfo", category: "Main Dishes", price: 19.99, cost: 8.75, profit: 11.24, available: true, image: "/placeholder.svg", description: "Minced raw beef seasoned with mitmita and niter kibbeh" },
  { id: 3, name: "Tibs", category: "Main Dishes", price: 17.99, cost: 7.25, profit: 10.74, available: true, image: "/placeholder.svg", description: "Sautéed meat with vegetables and spices" },
  { id: 4, name: "Shiro", category: "Vegetarian", price: 14.99, cost: 4.25, profit: 10.74, available: true, image: "/placeholder.svg", description: "Spiced chickpea stew with injera" },
  { id: 5, name: "Misir Wat", category: "Vegetarian", price: 13.99, cost: 3.75, profit: 10.24, available: true, image: "/placeholder.svg", description: "Spiced red lentil stew" },
  { id: 6, name: "Sambusa", category: "Appetizers", price: 8.99, cost: 2.55, profit: 6.44, available: false, image: "/placeholder.svg", description: "Fried pastry with spiced filling" },
];

const MenuManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("items");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      cost: "",
      available: true,
      image: ""
    }
  });

  const handleAddItem = (data) => {
    console.log("New menu item:", data);
    setShowAddItemDialog(false);
    form.reset();
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Menu Management" />}
        description={<T text="Create and manage your restaurant's menu items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu/food">
                <Utensils className="mr-2 h-4 w-4" />
                <T text="Food Management" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/menu/recipes">
                <DollarSign className="mr-2 h-4 w-4" />
                <T text="Recipe Costing" />
              </Link>
            </Button>
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              <T text="Menu Analytics" />
            </Button>
            <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Item" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle><T text="Add New Menu Item" /></DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T text="Item Name" /></FormLabel>
                            <FormControl>
                              <Input placeholder={t("Enter item name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T text="Category" /></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("Select category")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {menuCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T text="Price" /></FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T text="Cost" /></FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel><T text="Description" /></FormLabel>
                            <FormControl>
                              <Input placeholder={t("Enter item description")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T text="Image URL" /></FormLabel>
                            <FormControl>
                              <Input placeholder="/placeholder.svg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel><T text="Available" /></FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit"><T text="Add Item" /></Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search menu items...")}
            className="w-full pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <Button variant="outline" size="sm">
            <T text="All Categories" />
          </Button>
          {menuCategories.map((category) => (
            <Button key={category} variant="outline" size="sm">
              <T text={category} />
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4 flex overflow-x-auto hide-scrollbar">
          {menuTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <T text={tab.label} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="items" className="space-y-4">
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
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <T text="Cost" />: ${item.cost.toFixed(2)} | 
                      <T text="Profit" />: ${item.profit.toFixed(2)}
                    </div>
                  </div>
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

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium"><T text="Categories" /></h3>
            <Button asChild>
              <Link to="/admin/menu/categories">
                <T text="Manage Categories" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuCategories.map((category, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {menuItems.filter(item => item.category === category).length} <T text="items" />
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    <T text="Edit" />
                  </Button>
                </div>
              </Card>
            ))}
            <Card className="p-4 border-dashed flex justify-center items-center h-32">
              <Button variant="ghost">
                <Plus className="h-5 w-5 mr-2" />
                <T text="Add Category" />
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modifiers">
          <div className="text-center p-8 text-muted-foreground">
            <Settings className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2"><T text="Modifiers & Options" /></h3>
            <p className="max-w-md mx-auto mb-4"><T text="Define modifiers like spice level, sides, and cooking preferences for your menu items." /></p>
            <Button asChild>
              <Link to="/admin/menu/modifiers">
                <T text="Manage Modifiers" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recipes">
          <div className="text-center p-8 text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2"><T text="Recipe Management & Cost Tracking" /></h3>
            <p className="max-w-md mx-auto mb-4"><T text="Manage detailed recipes, track ingredient costs, and calculate profitability for each menu item." /></p>
            <Button asChild>
              <Link to="/admin/menu/recipes">
                <T text="Go to Recipe Management" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="design">
          <div className="text-center p-8 text-muted-foreground">
            <Utensils className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2"><T text="Menu Design" /></h3>
            <p className="max-w-md mx-auto mb-4"><T text="Customize how your menu looks to customers with layouts, themes, and featured items." /></p>
            <Button asChild>
              <Link to="/admin/menu/design">
                <T text="Customize Menu Design" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuManagement;
