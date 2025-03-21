import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BadgeWithStatus } from "@/components/ui/badge-with-status";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, FilePen, DollarSign, ChevronLeft, Trash2, Calculator, Loader2, Utensils } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  profit_margin: number | null;
  image_url: string | null;
  category_id: string | null;
  available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  categoryName?: string;
  preparation_time?: number | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const FoodManagement = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image_url: "/placeholder.svg",
    available: true,
    is_vegetarian: false,
    is_vegan: false, 
    is_gluten_free: false,
    is_spicy: false,
    preparation_time: 15
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadFoodItems(),
          loadCategories()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data from the database");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          menu_categories(id, name)
        `);
      
      if (error) throw error;
      
      const formattedItems = data.map(item => ({
        ...item,
        categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
      }));
      
      setFoodItems(formattedItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      throw error;
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setNewItem(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const calculateProfitMargin = (price: number, cost: number): number => {
    if (!cost || cost === 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const handleAddFoodItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Name and price are required");
      return;
    }
    
    try {
      setIsLoading(true);
      
      let profitMargin = null;
      if (newItem.cost && newItem.cost > 0) {
        profitMargin = calculateProfitMargin(newItem.price, newItem.cost);
      }
      
      const foodItemData = {
        name: newItem.name,
        description: newItem.description || null,
        price: newItem.price,
        cost: newItem.cost || null,
        profit_margin: profitMargin,
        image_url: newItem.image_url || null,
        category_id: newItem.category_id || null,
        available: newItem.available,
        is_vegetarian: newItem.is_vegetarian,
        is_vegan: newItem.is_vegan,
        is_gluten_free: newItem.is_gluten_free,
        is_spicy: newItem.is_spicy
      };
      
      const { data, error } = await supabase
        .from('food_items')
        .insert(foodItemData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Food item added successfully");
      
      await loadFoodItems();
      
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category_id: "",
        image_url: "/placeholder.svg",
        available: true,
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_spicy: false
      });
      setShowAddFoodDialog(false);
      
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFoodAvailability = async (id: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setFoodItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        )
      );
      
      toast.success(`Food item ${!currentStatus ? 'enabled' : 'disabled'}`);
      
    } catch (error) {
      console.error("Error updating food availability:", error);
      toast.error("Failed to update food availability");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFoodAvailability = async (id: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setFoodItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        )
      );
      
      toast.success(`Food item ${!currentStatus ? 'enabled' : 'disabled'}`);
      
    } catch (error) {
      console.error("Error updating food availability:", error);
      toast.error("Failed to update food availability");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const uniqueCategories = Array.from(new Set(foodItems.map(item => item.categoryName).filter(Boolean))) as string[];

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <PageHeader 
          title={<T text="Food Management" />}
          description={<T text="Create and manage dishes with recipes, ingredients, and costs" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/dishes">
                  <Utensils className="mr-2 h-4 w-4" />
                  <T text="View Dishes" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/recipes">
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Recipe Management" />
                </Link>
              </Button>
              <Dialog open={showAddFoodDialog} onOpenChange={setShowAddFoodDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Food Item" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle><T text="Add New Food Item" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name"><T text="Food Name" /></Label>
                        <Input 
                          id="name" 
                          name="name"
                          value={newItem.name}
                          onChange={handleInputChange}
                          placeholder={t("Enter food name")} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category_id"><T text="Category" /></Label>
                        <Select 
                          value={newItem.category_id} 
                          onValueChange={(value) => handleSelectChange("category_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price"><T text="Price" /></Label>
                        <Input 
                          id="price" 
                          name="price"
                          value={newItem.price}
                          onChange={handleNumericChange}
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost"><T text="Cost" /></Label>
                        <Input 
                          id="cost" 
                          name="cost"
                          value={newItem.cost || ""}
                          onChange={handleNumericChange}
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url"><T text="Image URL" /></Label>
                        <Input 
                          id="image_url" 
                          name="image_url"
                          value={newItem.image_url}
                          onChange={handleInputChange}
                          placeholder="/placeholder.svg" 
                        />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="available"
                            checked={newItem.available}
                            onCheckedChange={(checked) => handleSwitchChange("available", checked)}
                          />
                          <Label htmlFor="available"><T text="Available" /></Label>
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="description"><T text="Description" /></Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          value={newItem.description || ""}
                          onChange={handleInputChange}
                          placeholder={t("Enter food description")}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label><T text="Dietary Information" /></Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_vegetarian"
                              checked={newItem.is_vegetarian}
                              onCheckedChange={(checked) => handleSwitchChange("is_vegetarian", checked)}
                            />
                            <Label htmlFor="is_vegetarian"><T text="Vegetarian" /></Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_vegan"
                              checked={newItem.is_vegan}
                              onCheckedChange={(checked) => handleSwitchChange("is_vegan", checked)}
                            />
                            <Label htmlFor="is_vegan"><T text="Vegan" /></Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_gluten_free"
                              checked={newItem.is_gluten_free}
                              onCheckedChange={(checked) => handleSwitchChange("is_gluten_free", checked)}
                            />
                            <Label htmlFor="is_gluten_free"><T text="Gluten Free" /></Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="is_spicy"
                              checked={newItem.is_spicy}
                              onCheckedChange={(checked) => handleSwitchChange("is_spicy", checked)}
                            />
                            <Label htmlFor="is_spicy"><T text="Spicy" /></Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddFoodItem} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      <T text="Create Food Item" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search food items...")}
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <div className="grid grid-cols-2 gap-1 h-4 w-4 mr-2">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                <T text="Grid" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <div className="flex flex-col space-y-1 h-4 w-4 mr-2">
                  <div className="bg-current rounded-sm h-[2px]"></div>
                  <div className="bg-current rounded-sm h-[2px]"></div>
                  <div className="bg-current rounded-sm h-[2px]"></div>
                </div>
                <T text="List" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <Button 
              variant={searchQuery === "" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSearchQuery("")}
              className={searchQuery === "" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <T text="All Categories" />
            </Button>
            {uniqueCategories.map((category) => (
              <Button 
                key={category} 
                variant={searchQuery === category ? "default" : "outline"} 
                size="sm"
                onClick={() => setSearchQuery(category)}
                className={searchQuery === category ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12 bg-white rounded-lg shadow">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <Tabs defaultValue="available" className="space-y-4">
            <TabsList className="bg-amber-50">
              <TabsTrigger value="available" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <T text="Available Items" />
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <T text="All Items" />
              </TabsTrigger>
              <TabsTrigger value="unavailable" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <T text="Unavailable Items" />
              </TabsTrigger>
            </TabsList>
            
            {["available", "all", "unavailable"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoodItems
                      .filter(item => 
                        tab === "all" ? true : 
                        tab === "available" ? item.available : 
                        !item.available
                      )
                      .length === 0 ? (
                      <div className="col-span-full text-center p-12 bg-white rounded-lg shadow">
                        <p className="text-muted-foreground">
                          {searchQuery ? (
                            <T text="No food items found matching your search" />
                          ) : (
                            <T text="No food items found. Create your first food item!" />
                          )}
                        </p>
                      </div>
                    ) : (
                      filteredFoodItems
                        .filter(item => 
                          tab === "all" ? true : 
                          tab === "available" ? item.available : 
                          !item.available
                        )
                        .map((item) => (
                          <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${!item.available ? 'opacity-70' : ''} border-t-4 ${item.available ? 'border-t-green-500' : 'border-t-red-500'}`}>
                            <AspectRatio ratio={16 / 9}>
                              <img 
                                src={item.image_url || "/placeholder.svg"} 
                                alt={item.name} 
                                className="object-cover w-full h-full"
                              />
                            </AspectRatio>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-medium">{item.name}</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="outline" className="bg-amber-50">{item.categoryName}</Badge>
                                    {!item.available && <Badge variant="destructive"><T text="Unavailable" /></Badge>}
                                    {item.is_vegetarian && <Badge variant="secondary" className="bg-green-100 text-green-800"><T text="Vegetarian" /></Badge>}
                                    {item.is_vegan && <Badge variant="secondary" className="bg-green-100 text-green-800"><T text="Vegan" /></Badge>}
                                    {item.is_gluten_free && <Badge variant="secondary" className="bg-blue-100 text-blue-800"><T text="Gluten Free" /></Badge>}
                                    {item.is_spicy && <Badge variant="secondary" className="bg-red-100 text-red-800"><T text="Spicy" /></Badge>}
                                  </div>
                                </div>
                                <div className="text-lg font-bold text-amber-600">£{(item.price || 0).toFixed(2)}</div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                              
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  <T text="Cost" />: £{(item.cost || 0).toFixed(2)} | 
                                  <T text="Margin" />: {item.profit_margin || 0}%
                                </div>
                              </div>
                              <div className="flex justify-between mt-4">
                                <Button 
                                  variant={item.available ? "outline" : "default"}
                                  size="sm"
                                  className={item.available ? "" : "bg-green-500 hover:bg-green-600"}
                                  onClick={() => handleToggleFoodAvailability(item.id, item.available)}
                                >
                                  {item.available ? <T text="Mark Unavailable" /> : <T text="Mark Available" />}
                                </Button>
                                
                                <Button variant="outline" size="sm" className="hover:bg-amber-50" asChild>
                                  <Link to={`/admin/menu/recipes?foodId=${item.id}`}>
                                    <FilePen className="h-4 w-4 mr-2" />
                                    <T text="Edit Recipe" />
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                ) : (
                  <Card>
                    <Table>
                      <TableHeader className="bg-amber-50">
                        <TableRow>
                          <TableHead><T text="Name" /></TableHead>
                          <TableHead><T text="Category" /></TableHead>
                          <TableHead><T text="Price" /></TableHead>
                          <TableHead><T text="Cost" /></TableHead>
                          <TableHead><T text="Margin" /></TableHead>
                          <TableHead><T text="Status" /></TableHead>
                          <TableHead className="text-right"><T text="Actions" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFoodItems
                          .filter(item => 
                            tab === "all" ? true : 
                            tab === "available" ? item.available : 
                            !item.available
                          )
                          .length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              {searchQuery ? (
                                <T text="No food items found matching your search" />
                              ) : (
                                <T text="No food items found. Create your first food item!" />
                              )}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredFoodItems
                            .filter(item => 
                              tab === "all" ? true : 
                              tab === "available" ? item.available : 
                              !item.available
                            )
                            .map((item) => (
                              <TableRow key={item.id} className={!item.available ? 'opacity-70' : ''}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.categoryName}</TableCell>
                                <TableCell className="font-semibold text-amber-600">£{(item.price || 0).toFixed(2)}</TableCell>
                                <TableCell>£{(item.cost || 0).toFixed(2)}</TableCell>
                                <TableCell>{item.profit_margin || 0}%</TableCell>
                                <TableCell>
                                  <BadgeWithStatus variant={item.available ? "success" : "destructive"}>
                                    {item.available ? <T text="Available" /> : <T text="Unavailable" />}
                                  </BadgeWithStatus>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant={item.available ? "outline" : "default"}
                                      size="sm"
                                      className={item.available ? "" : "bg-green-500 hover:bg-green-600"}
                                      onClick={() => handleToggleFoodAvailability(item.id, item.available)}
                                    >
                                      {item.available ? <T text="Mark Unavailable" /> : <T text="Mark Available" />}
                                    </Button>
                                    
                                    <Button variant="outline" size="sm" className="hover:bg-amber-50" asChild>
                                      <Link to={`/admin/menu/recipes?foodId=${item.id}`}>
                                        <FilePen className="h-4 w-4 mr-2" />
                                        <T text="Edit" />
                                      </Link>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default FoodManagement;
