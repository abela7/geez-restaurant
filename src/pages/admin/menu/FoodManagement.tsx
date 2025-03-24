import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, ChevronLeft, Plus, Edit, Trash2, Loader2, Filter, MoreHorizontal, Eye } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MenuNav } from "@/components/menu/MenuNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FoodItem, MenuCategory } from "@/types/menu";

const FoodManagement = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    preparation_time: "",
    image_url: ""
  });

  useEffect(() => {
    loadData();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      preparation_time: "",
      image_url: ""
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const newItem = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        available: formData.available,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        is_gluten_free: formData.is_gluten_free,
        is_spicy: formData.is_spicy,
        preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : null,
        image_url: formData.image_url || null
      };
      
      const { error } = await supabase
        .from('food_items')
        .insert([newItem]);
      
      if (error) throw error;
      
      await loadFoodItems();
      setShowAddDialog(false);
      resetForm();
      toast.success("Food item added successfully");
      
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: FoodItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category_id: item.category_id || "",
      available: item.available,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_spicy: item.is_spicy,
      preparation_time: item.preparation_time ? item.preparation_time.toString() : "",
      image_url: item.image_url || ""
    });
    setShowEditDialog(true);
  };

  const confirmEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentItem) return;
    
    try {
      setIsLoading(true);
      
      const updatedItem = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        available: formData.available,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        is_gluten_free: formData.is_gluten_free,
        is_spicy: formData.is_spicy,
        preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : null,
        image_url: formData.image_url || null
      };
      
      const { error } = await supabase
        .from('food_items')
        .update(updatedItem)
        .eq('id', currentItem.id);
      
      if (error) throw error;
      
      await loadFoodItems();
      setShowEditDialog(false);
      toast.success("Food item updated successfully");
      
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (item: FoodItem) => {
    setCurrentItem(item);
    setShowDeleteDialog(true);
  };

  const confirmDeleteItem = async () => {
    if (!currentItem) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', currentItem.id);
      
      if (error) throw error;
      
      await loadFoodItems();
      setShowDeleteDialog(false);
      toast.success("Food item deleted successfully");
      
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (item: FoodItem) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ available: !item.available })
        .eq('id', item.id);
      
      if (error) throw error;
      
      await loadFoodItems();
      toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
      
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || item.category_id === filterCategory;
    
    const matchesAvailability = 
      filterAvailability === "all" || 
      (filterAvailability === "available" && item.available) || 
      (filterAvailability === "unavailable" && !item.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Food Management" />}
        description={<T text="Create and manage food items in your menu" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Food Item" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mb-6 flex flex-col md:flex-row gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search food items...")}
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("Filter by category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Categories")}</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterAvailability} onValueChange={(value) => setFilterAvailability(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("Filter by availability")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Items")}</SelectItem>
            <SelectItem value="available">{t("Available Only")}</SelectItem>
            <SelectItem value="unavailable">{t("Unavailable Only")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Name" /></TableHead>
                <TableHead><T text="Category" /></TableHead>
                <TableHead><T text="Price" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead><T text="Dietary" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? (
                      <T text="No food items found matching your search" />
                    ) : (
                      <T text="No food items found" />
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.categoryName}</Badge>
                    </TableCell>
                    <TableCell>£{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={item.available ? "success" : "secondary"}>
                        {item.available ? t("Available") : t("Unavailable")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {item.is_vegetarian && <Badge className="bg-green-500 text-white">V</Badge>}
                        {item.is_vegan && <Badge className="bg-green-600 text-white">VG</Badge>}
                        {item.is_gluten_free && <Badge className="bg-blue-500 text-white">GF</Badge>}
                        {item.is_spicy && <Badge className="bg-red-500 text-white">S</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            <T text="Edit" />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleAvailability(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {item.available ? <T text="Mark as Unavailable" /> : <T text="Mark as Available" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteItem(item)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            <T text="Delete" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add Food Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><T text="Add New Food Item" /></DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name"><T text="Name" /></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price"><T text="Price (£)" /></Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description"><T text="Description" /></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id"><T text="Category" /></Label>
                  <Select name="category_id" value={formData.category_id} onValueChange={(value) => handleInputChange({ target: { name: "category_id", value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("Uncategorized")}</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preparation_time"><T text="Preparation Time (min)" /></Label>
                  <Input
                    id="preparation_time"
                    name="preparation_time"
                    type="number"
                    min="0"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url"><T text="Image URL" /></Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-3">
                <Label><T text="Availability & Dietary Options" /></Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => handleSwitchChange("available", checked)}
                    />
                    <Label htmlFor="available"><T text="Available" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onCheckedChange={(checked) => handleSwitchChange("is_vegetarian", checked)}
                    />
                    <Label htmlFor="is_vegetarian"><T text="Vegetarian" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegan"
                      checked={formData.is_vegan}
                      onCheckedChange={(checked) => handleSwitchChange("is_vegan", checked)}
                    />
                    <Label htmlFor="is_vegan"><T text="Vegan" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_gluten_free"
                      checked={formData.is_gluten_free}
                      onCheckedChange={(checked) => handleSwitchChange("is_gluten_free", checked)}
                    />
                    <Label htmlFor="is_gluten_free"><T text="Gluten Free" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_spicy"
                      checked={formData.is_spicy}
                      onCheckedChange={(checked) => handleSwitchChange("is_spicy", checked)}
                    />
                    <Label htmlFor="is_spicy"><T text="Spicy" /></Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                <T text="Cancel" />
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                <T text="Add Food Item" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Food Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle><T text="Edit Food Item" /></DialogTitle>
          </DialogHeader>
          <form onSubmit={confirmEditItem}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name"><T text="Name" /></Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price"><T text="Price (£)" /></Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description"><T text="Description" /></Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category_id"><T text="Category" /></Label>
                  <Select name="category_id" value={formData.category_id} onValueChange={(value) => handleInputChange({ target: { name: "category_id", value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("Uncategorized")}</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-preparation_time"><T text="Preparation Time (min)" /></Label>
                  <Input
                    id="edit-preparation_time"
                    name="preparation_time"
                    type="number"
                    min="0"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image_url"><T text="Image URL" /></Label>
                <Input
                  id="edit-image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-3">
                <Label><T text="Availability & Dietary Options" /></Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-available"
                      checked={formData.available}
                      onCheckedChange={(checked) => handleSwitchChange("available", checked)}
                    />
                    <Label htmlFor="edit-available"><T text="Available" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_vegetarian"
                      checked={formData.is_vegetarian}
                      onCheckedChange={(checked) => handleSwitchChange("is_vegetarian", checked)}
                    />
                    <Label htmlFor="edit-is_vegetarian"><T text="Vegetarian" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_vegan"
                      checked={formData.is_vegan}
                      onCheckedChange={(checked) => handleSwitchChange("is_vegan", checked)}
                    />
                    <Label htmlFor="edit-is_vegan"><T text="Vegan" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_gluten_free"
                      checked={formData.is_gluten_free}
                      onCheckedChange={(checked) => handleSwitchChange("is_gluten_free", checked)}
                    />
                    <Label htmlFor="edit-is_gluten_free"><T text="Gluten Free" /></Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-is_spicy"
                      checked={formData.is_spicy}
                      onCheckedChange={(checked) => handleSwitchChange("is_spicy", checked)}
                    />
                    <Label htmlFor="edit-is_spicy"><T text="Spicy" /></Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                <T text="Cancel" />
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                <T text="Update Food Item" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Delete Food Item" /></DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              <T text="Are you sure you want to delete" /> <strong>{currentItem?.name}</strong>?
              <T text="This action cannot be undone." />
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              <T text="Delete" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodManagement;
