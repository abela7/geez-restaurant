
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Clock, Edit, Save, Trash2, ArrowUp, ArrowDown, DollarSign, Percent } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDishCosts } from "@/hooks/useDishCosts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodItem } from "@/types/menu";
import { DishCost } from "@/types/dishCost";

const DishProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { dishCosts } = useDishCosts();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [editedFood, setEditedFood] = useState<Partial<FoodItem>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [relatedDishCost, setRelatedDishCost] = useState<DishCost | null>(null);

  // Load food item details and categories
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadFoodItemDetails(),
          loadCategories()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load food item details");
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadFoodItemDetails = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          menu_categories(id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching food item:", error);
        toast.error("Failed to load food item details");
        return;
      }
      
      const item = {
        ...data,
        categoryName: data.menu_categories ? data.menu_categories.name : "Uncategorized"
      };
      
      setFoodItem(item);
      setEditedFood(item);
    };
    
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('id, name')
        .eq('active', true);
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      setCategories(data);
    };
    
    loadData();
  }, [id]);
  
  // Find related dish cost
  useEffect(() => {
    if (id && dishCosts && dishCosts.length > 0) {
      const matchingDishCost = dishCosts.find(dc => dc.food_item_id === id);
      setRelatedDishCost(matchingDishCost || null);
    }
  }, [id, dishCosts]);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setEditedFood(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save food item changes
  const saveChanges = async () => {
    if (!id || !editedFood) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('food_items')
        .update(editedFood)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Food item updated successfully");
      
      // Update local state
      setFoodItem(prev => prev ? { ...prev, ...editedFood } : null);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to dish cost
  const navigateToDishCost = () => {
    if (relatedDishCost) {
      navigate('/admin/menu/dish-cost', { state: { selectedDishId: relatedDishCost.id } });
    } else {
      navigate('/admin/menu/dish-cost', { state: { createForFoodItem: foodItem } });
    }
  };

  if (isLoading && !foodItem) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="container mx-auto p-4">
        <PageHeader 
          title={<T text="Dish Not Found" />}
          description={<T text="The dish you are looking for could not be found" />}
          actions={
            <Button variant="outline" onClick={() => navigate('/admin/menu/dishes')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <T text="Back to Dishes" />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <PageHeader 
        title={isEditing ? <T text="Edit Dish" /> : foodItem.name}
        description={
          isEditing 
            ? <T text="Make changes to dish details" />
            : foodItem.description || <T text="Detailed information about this dish" />
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/menu/dishes')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <T text="Back to Dishes" />
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  <T text="Cancel" />
                </Button>
                <Button onClick={saveChanges} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  <T text="Save Changes" />
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <T text="Edit Dish" />
              </Button>
            )}
          </>
        }
      />
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details"><T text="Details" /></TabsTrigger>
          <TabsTrigger value="cost"><T text="Cost & Pricing" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle><T text="Dish Information" /></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  // Edit mode
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name"><T text="Name" /></Label>
                      <Input 
                        id="name" 
                        value={editedFood.name || ""} 
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description"><T text="Description" /></Label>
                      <Textarea 
                        id="description" 
                        value={editedFood.description || ""} 
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category"><T text="Category" /></Label>
                      <Select 
                        value={editedFood.category_id || ""}
                        onValueChange={(value) => handleInputChange("category_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a category")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preparation_time"><T text="Preparation Time (minutes)" /></Label>
                      <Input 
                        id="preparation_time" 
                        type="number"
                        value={editedFood.preparation_time || ""} 
                        onChange={(e) => handleInputChange("preparation_time", e.target.value === "" ? null : Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image_url"><T text="Image URL" /></Label>
                      <Input 
                        id="image_url" 
                        value={editedFood.image_url || ""} 
                        onChange={(e) => handleInputChange("image_url", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_vegetarian"
                            checked={editedFood.is_vegetarian}
                            onCheckedChange={(checked) => handleInputChange("is_vegetarian", checked)}
                          />
                          <Label htmlFor="is_vegetarian"><T text="Vegetarian" /></Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_vegan"
                            checked={editedFood.is_vegan}
                            onCheckedChange={(checked) => handleInputChange("is_vegan", checked)}
                          />
                          <Label htmlFor="is_vegan"><T text="Vegan" /></Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_gluten_free"
                            checked={editedFood.is_gluten_free}
                            onCheckedChange={(checked) => handleInputChange("is_gluten_free", checked)}
                          />
                          <Label htmlFor="is_gluten_free"><T text="Gluten Free" /></Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_spicy"
                            checked={editedFood.is_spicy}
                            onCheckedChange={(checked) => handleInputChange("is_spicy", checked)}
                          />
                          <Label htmlFor="is_spicy"><T text="Spicy" /></Label>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {foodItem.is_vegetarian && <Badge className="bg-green-500"><T text="Vegetarian" /></Badge>}
                      {foodItem.is_vegan && <Badge className="bg-green-600"><T text="Vegan" /></Badge>}
                      {foodItem.is_gluten_free && <Badge className="bg-blue-500"><T text="Gluten Free" /></Badge>}
                      {foodItem.is_spicy && <Badge className="bg-red-500"><T text="Spicy" /></Badge>}
                      <Badge variant="outline">{foodItem.categoryName}</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500"><T text="Description" /></h3>
                        <p className="mt-1">{foodItem.description || t("No description available")}</p>
                      </div>
                      
                      {foodItem.preparation_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <span><T text="Preparation Time" />: {foodItem.preparation_time} <T text="minutes" /></span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              {/* Image and availability card */}
              <CardContent className="p-0 overflow-hidden">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={foodItem.image_url || "/placeholder.svg"} 
                    alt={foodItem.name} 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium"><T text="Availability" /></h3>
                    {isEditing ? (
                      <Switch 
                        checked={editedFood.available}
                        onCheckedChange={(checked) => handleInputChange("available", checked)}
                      />
                    ) : (
                      <Badge 
                        variant={foodItem.available ? "default" : "destructive"}
                        className={foodItem.available ? "bg-green-500" : ""}
                      >
                        {foodItem.available ? t("Available") : t("Unavailable")}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2"><T text="Price" /></h3>
                    <div className="text-3xl font-bold text-amber-600">£{foodItem.price.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cost">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Cost & Pricing Information" /></CardTitle>
                <CardDescription>
                  {relatedDishCost 
                    ? <T text="This dish has detailed cost information available" />
                    : <T text="No detailed cost information available for this dish" />
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1"><T text="Cost" /></div>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="h-5 w-5 text-amber-500 mr-1" />
                        £{relatedDishCost ? relatedDishCost.total_cost.toFixed(2) : (foodItem.cost || 0).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1"><T text="Price" /></div>
                      <div className="text-2xl font-bold flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                        £{foodItem.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1"><T text="Profit Margin" /></div>
                      <div className="text-2xl font-bold flex items-center">
                        <Percent className="h-5 w-5 text-blue-500 mr-1" />
                        {relatedDishCost ? relatedDishCost.profit_margin : (foodItem.profit_margin || 0)}%
                      </div>
                    </div>
                  </div>
                  
                  {relatedDishCost && (
                    <>
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="font-medium"><T text="Cost Breakdown" /></h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div><T text="Ingredient Costs" /></div>
                            <div className="font-medium">£{relatedDishCost.total_ingredient_cost.toFixed(2)}</div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div><T text="Overhead Costs" /></div>
                            <div className="font-medium">£{relatedDishCost.total_overhead_cost.toFixed(2)}</div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <div className="font-bold"><T text="Total Cost" /></div>
                            <div className="font-bold">£{relatedDishCost.total_cost.toFixed(2)}</div>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <div><T text="Suggested Price" /></div>
                            <div>£{relatedDishCost.suggested_price.toFixed(2)}</div>
                          </div>
                          
                          {relatedDishCost.use_manual_price && relatedDishCost.manual_price && (
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <div><T text="Manual Price" /></div>
                              <div>£{relatedDishCost.manual_price.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={navigateToDishCost}
                  className="w-full"
                >
                  {relatedDishCost 
                    ? <T text="View/Edit Cost Details" />
                    : <T text="Create Cost Analysis" />
                  }
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DishProfile;
