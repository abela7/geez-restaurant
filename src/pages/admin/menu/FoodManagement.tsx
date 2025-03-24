import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Search,
  Plus,
  ChevronLeft,
  Loader2,
  Pencil,
  Trash2,
  ImagePlus,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodItem, MenuCategory } from "@/types/menu";
import { MenuNav } from "@/components/menu/MenuNav";

const FoodManagement = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(
    null
  );
  const [formData, setFormData] = useState<Omit<FoodItem, "id">>({
    name: "",
    description: null,
    price: 0,
    image_url: null,
    category_id: null,
    available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    preparation_time: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadFoodItems(), loadCategories()]);
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
        .from("food_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFoodItems(data as FoodItem[]);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Failed to load food items");
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("active", true);

      if (error) throw error;
      setCategories(data as MenuCategory[]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setFormData({
      name: "",
      description: null,
      price: 0,
      image_url: null,
      category_id: null,
      available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      preparation_time: null,
    });
    setOpenDialog(true);
  };

  const handleEditFoodItem = (item: FoodItem) => {
    setEditMode(true);
    setSelectedFoodItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category_id: item.category_id,
      available: item.available,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      is_spicy: item.is_spicy,
      preparation_time: item.preparation_time,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const addFoodItem = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("food_items")
        .insert([formData])
        .select();

      if (error) throw error;

      toast.success("Food item added successfully");
      loadFoodItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFoodItem = async () => {
    if (!selectedFoodItem) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("food_items")
        .update(formData)
        .eq("id", selectedFoodItem.id);

      if (error) throw error;

      toast.success("Food item updated successfully");
      loadFoodItems();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFoodItem = async (id: string) => {
    if (!window.confirm(t("Are you sure you want to delete this item?")))
      return;

    try {
      setIsLoading(true);

      const { error } = await supabase.from("food_items").delete().eq("id", id);

      if (error) throw error;

      toast.success("Food item deleted successfully");
      loadFoodItems();
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      setIsLoading(true);
  
      const { error } = await supabase
        .from('food_items')
        .update({ available: !currentAvailability })
        .eq('id', id);
  
      if (error) throw error;
  
      setFoodItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, available: !currentAvailability } : item
        )
      );
  
      toast.success(`Food item ${!currentAvailability ? 'activated' : 'deactivated'}`);
  
    } catch (error) {
      console.error('Error updating food item:', error);
      toast.error('Failed to update food item');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Food Management" />}
        description={<T text="Manage your restaurant's food items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Food Item" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mb-4">
        <Input
          type="search"
          placeholder={t("Search food items...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <Badge variant="secondary">
                    {item.available ? t("Available") : t("Unavailable")}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-amber-600">
                    £{item.price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFoodItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => deleteFoodItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAvailability(item.id, item.available)}
                    >
                      {item.available ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">
                        {item.available ? t("Deactivate") : t("Activate")}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? <T text="Edit Food Item" /> : <T text="Add Food Item" />}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <T text="Name" />
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("Enter food item name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                <T text="Price" />
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder={t("Enter price")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">
                <T text="Description" />
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder={t("Enter description")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">
                <T text="Category" />
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
                defaultValue={formData.category_id || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select a category")} />
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
              <Label htmlFor="image_url">
                <T text="Image URL" />
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleInputChange}
                placeholder={t("Enter image URL")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={handleSwitchChange("available")}
              />
              <Label htmlFor="available">
                <T text="Available" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_vegetarian"
                checked={formData.is_vegetarian}
                onCheckedChange={handleSwitchChange("is_vegetarian")}
              />
              <Label htmlFor="is_vegetarian">
                <T text="Vegetarian" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_vegan"
                checked={formData.is_vegan}
                onCheckedChange={handleSwitchChange("is_vegan")}
              />
              <Label htmlFor="is_vegan">
                <T text="Vegan" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_gluten_free"
                checked={formData.is_gluten_free}
                onCheckedChange={handleSwitchChange("is_gluten_free")}
              />
              <Label htmlFor="is_gluten_free">
                <T text="Gluten Free" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_spicy"
                checked={formData.is_spicy}
                onCheckedChange={handleSwitchChange("is_spicy")}
              />
              <Label htmlFor="is_spicy">
                <T text="Spicy" />
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preparation_time">
                <T text="Preparation Time (minutes)" />
              </Label>
              <Input
                type="number"
                id="preparation_time"
                name="preparation_time"
                value={formData.preparation_time || ""}
                onChange={handleInputChange}
                placeholder={t("Enter preparation time")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              <T text="Cancel" />
            </Button>
            <Button
              type="button"
              onClick={editMode ? updateFoodItem : addFoodItem}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editMode ? <T text="Update Food Item" /> : <T text="Add Food Item" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodManagement;
