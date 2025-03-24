
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Plus, 
  Calculator, 
  ChefHat, 
  Trash2, 
  Edit, 
  Clock, 
  AlertCircle,
  DollarSign, 
  Settings 
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { FoodItem } from "@/types/menu";

interface Ingredient {
  id: string;
  name: string;
  unit_id: string;
  cost_per_unit: number;
  is_allergen: boolean;
  units: {
    abbreviation: string;
    name: string;
  };
}

interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  ingredient_id: string;
  quantity: number;
  cost: number;
  ingredient?: Ingredient;
  unit_abbreviation?: string;
}

interface Recipe {
  id?: string;
  food_item_id: string;
  name: string;
  description?: string;
  serves: number;
  preparation_time?: number;
  cooking_time?: number;
  total_cost?: number;
  cost_per_serving?: number;
  labor_cost_factor?: number;
  overhead_percentage?: number;
  ingredients?: RecipeIngredient[];
  created_at?: string;
  updated_at?: string;
}

interface OperatingCosts {
  overhead_percentage: number;
  labor_cost_factor: number;
}

const RecipeCostCalculator = () => {
  const { t } = useLanguage();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
  const [openIngredientDialog, setOpenIngredientDialog] = useState(false);
  const [openCostSettingsDialog, setOpenCostSettingsDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [operatingCosts, setOperatingCosts] = useState<OperatingCosts>({
    overhead_percentage: 15, // Default values
    labor_cost_factor: 1.5
  });
  
  const [recipeForm, setRecipeForm] = useState<Recipe>({
    food_item_id: "",
    name: "",
    serves: 1,
    preparation_time: 0,
    cooking_time: 0,
    labor_cost_factor: 1.5,
    overhead_percentage: 15,
    ingredients: []
  });
  
  const [ingredientForm, setIngredientForm] = useState<RecipeIngredient>({
    ingredient_id: "",
    quantity: 0,
    cost: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFoodItems(),
        loadIngredients(),
        loadRecipes(),
        loadOperatingCosts()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .order("name");

      if (error) throw error;
      setFoodItems(data || []);
    } catch (error) {
      console.error("Error loading food items:", error);
      toast.error("Failed to load menu items");
      throw error;
    }
  };

  const loadIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_ingredients_extended")
        .select("*")
        .order("name");

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast.error("Failed to load ingredients");
      throw error;
    }
  };

  const loadRecipes = async () => {
    try {
      // Get recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("*");

      if (recipesError) throw recipesError;
      
      // Get recipe ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from("recipe_ingredient_items")
        .select("*");

      if (ingredientsError) throw ingredientsError;
      
      // Map ingredients to recipes
      const updatedRecipes = recipesData.map((recipe: Recipe) => {
        const recipeIngredients = ingredientsData.filter(
          (item: RecipeIngredient) => item.recipe_id === recipe.id
        );
        return { ...recipe, ingredients: recipeIngredients };
      });
      
      setRecipes(updatedRecipes || []);
    } catch (error) {
      console.error("Error loading recipes:", error);
      toast.error("Failed to load recipes");
      throw error;
    }
  };

  const loadOperatingCosts = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_operating_costs")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error - this is fine for default values
        throw error;
      }

      if (data) {
        setOperatingCosts({
          overhead_percentage: data.overhead_percentage,
          labor_cost_factor: data.labor_cost_factor
        });
      }
    } catch (error) {
      console.error("Error loading operating costs:", error);
      toast.error("Failed to load operating cost settings");
      throw error;
    }
  };

  const handleOpenRecipeDialog = (recipe?: Recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe);
      setRecipeForm({
        ...recipe,
        ingredients: [...(recipe.ingredients || [])]
      });
    } else {
      setSelectedRecipe(null);
      setRecipeForm({
        food_item_id: "",
        name: "",
        serves: 1,
        preparation_time: 0,
        cooking_time: 0,
        labor_cost_factor: operatingCosts.labor_cost_factor,
        overhead_percentage: operatingCosts.overhead_percentage,
        ingredients: []
      });
    }
    setOpenRecipeDialog(true);
  };

  const handleOpenIngredientDialog = () => {
    setIngredientForm({
      ingredient_id: "",
      quantity: 0,
      cost: 0
    });
    setOpenIngredientDialog(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    form: "recipe" | "ingredient" | "costs"
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    
    if (form === "recipe") {
      setRecipeForm(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    } else if (form === "ingredient") {
      setIngredientForm(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    } else if (form === "costs") {
      setOperatingCosts(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    }
  };

  const handleSelectChange = (
    name: string,
    form: "recipe" | "ingredient"
  ) => (value: string) => {
    if (form === "recipe") {
      if (name === "food_item_id") {
        const selectedFood = foodItems.find(item => item.id === value);
        if (selectedFood) {
          setRecipeForm(prev => ({
            ...prev,
            [name]: value,
            name: selectedFood.name
          }));
        } else {
          setRecipeForm(prev => ({
            ...prev,
            [name]: value
          }));
        }
      } else {
        setRecipeForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (form === "ingredient") {
      if (name === "ingredient_id") {
        const selectedIngredient = ingredients.find(item => item.id === value);
        if (selectedIngredient) {
          setIngredientForm(prev => ({
            ...prev,
            [name]: value,
            unit_abbreviation: selectedIngredient.units?.abbreviation
          }));
        } else {
          setIngredientForm(prev => ({
            ...prev,
            [name]: value
          }));
        }
      } else {
        setIngredientForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const calculateIngredientCost = () => {
    const selectedIngredient = ingredients.find(
      item => item.id === ingredientForm.ingredient_id
    );
    
    if (selectedIngredient && ingredientForm.quantity) {
      const cost = selectedIngredient.cost_per_unit * ingredientForm.quantity;
      setIngredientForm(prev => ({
        ...prev,
        cost
      }));
    }
  };

  useEffect(() => {
    calculateIngredientCost();
  }, [ingredientForm.ingredient_id, ingredientForm.quantity]);

  const addIngredientToRecipe = () => {
    if (!ingredientForm.ingredient_id || ingredientForm.quantity <= 0) {
      toast.error("Please select an ingredient and specify a quantity");
      return;
    }

    const selectedIngredient = ingredients.find(
      item => item.id === ingredientForm.ingredient_id
    );
    
    if (!selectedIngredient) {
      toast.error("Selected ingredient not found");
      return;
    }

    const newIngredient: RecipeIngredient = {
      ...ingredientForm,
      ingredient: selectedIngredient
    };

    setRecipeForm(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), newIngredient]
    }));

    setOpenIngredientDialog(false);
    calculateTotalCost();
  };

  const removeIngredientFromRecipe = (index: number) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index)
    }));
    calculateTotalCost();
  };

  const calculateTotalCost = () => {
    if (!recipeForm.ingredients || recipeForm.ingredients.length === 0) {
      setRecipeForm(prev => ({
        ...prev,
        total_cost: 0,
        cost_per_serving: 0
      }));
      return;
    }

    // Calculate raw ingredient costs
    const ingredientCosts = recipeForm.ingredients.reduce(
      (sum, item) => sum + (item.cost || 0),
      0
    );

    // Add labor cost based on preparation and cooking time
    const totalTimeInHours = ((recipeForm.preparation_time || 0) + (recipeForm.cooking_time || 0)) / 60;
    const laborCost = totalTimeInHours * (recipeForm.labor_cost_factor || operatingCosts.labor_cost_factor);
    
    // Add overhead percentage
    const overheadFactor = 1 + ((recipeForm.overhead_percentage || operatingCosts.overhead_percentage) / 100);
    const totalCost = (ingredientCosts + laborCost) * overheadFactor;
    
    // Cost per serving
    const costPerServing = totalCost / (recipeForm.serves || 1);
    
    setRecipeForm(prev => ({
      ...prev,
      total_cost: totalCost,
      cost_per_serving: costPerServing
    }));
  };

  useEffect(() => {
    calculateTotalCost();
  }, [
    recipeForm.ingredients, 
    recipeForm.preparation_time, 
    recipeForm.cooking_time, 
    recipeForm.serves,
    recipeForm.labor_cost_factor,
    recipeForm.overhead_percentage
  ]);

  const saveRecipe = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!recipeForm.food_item_id || !recipeForm.name || recipeForm.serves <= 0) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!recipeForm.ingredients || recipeForm.ingredients.length === 0) {
        toast.error("Please add at least one ingredient to the recipe");
        return;
      }

      // Create or update recipe
      let recipeId: string;
      
      if (selectedRecipe?.id) {
        // Update existing recipe
        const { data, error } = await supabase
          .from("recipes")
          .update({
            food_item_id: recipeForm.food_item_id,
            name: recipeForm.name,
            description: recipeForm.description,
            serves: recipeForm.serves,
            preparation_time: recipeForm.preparation_time,
            cooking_time: recipeForm.cooking_time,
            total_cost: recipeForm.total_cost,
            cost_per_serving: recipeForm.cost_per_serving,
            labor_cost_factor: recipeForm.labor_cost_factor,
            overhead_percentage: recipeForm.overhead_percentage
          })
          .eq("id", selectedRecipe.id)
          .select()
          .single();

        if (error) throw error;
        recipeId = selectedRecipe.id;
        
        // Delete existing ingredients
        const { error: deleteError } = await supabase
          .from("recipe_ingredient_items")
          .delete()
          .eq("recipe_id", recipeId);
          
        if (deleteError) throw deleteError;
        
      } else {
        // Create new recipe
        const { data, error } = await supabase
          .from("recipes")
          .insert({
            food_item_id: recipeForm.food_item_id,
            name: recipeForm.name,
            description: recipeForm.description,
            serves: recipeForm.serves,
            preparation_time: recipeForm.preparation_time,
            cooking_time: recipeForm.cooking_time,
            total_cost: recipeForm.total_cost,
            cost_per_serving: recipeForm.cost_per_serving,
            labor_cost_factor: recipeForm.labor_cost_factor,
            overhead_percentage: recipeForm.overhead_percentage
          })
          .select()
          .single();

        if (error) throw error;
        recipeId = data.id;
      }

      // Insert recipe ingredients
      const ingredientsToInsert = recipeForm.ingredients?.map(ingredient => ({
        recipe_id: recipeId,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
        cost: ingredient.cost
      }));

      const { error: ingredientsError } = await supabase
        .from("recipe_ingredient_items")
        .insert(ingredientsToInsert);

      if (ingredientsError) throw ingredientsError;

      // Update food item cost
      const { error: foodItemError } = await supabase
        .from("food_items")
        .update({
          cost: recipeForm.cost_per_serving,
          profit_margin: calculateProfitMargin(recipeForm.food_item_id, recipeForm.cost_per_serving || 0)
        })
        .eq("id", recipeForm.food_item_id);

      if (foodItemError) throw foodItemError;

      toast.success(selectedRecipe ? "Recipe updated successfully" : "Recipe created successfully");
      await loadRecipes();
      await loadFoodItems();
      setOpenRecipeDialog(false);
      
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  const calculateProfitMargin = (foodItemId: string, cost: number): number => {
    const foodItem = foodItems.find(item => item.id === foodItemId);
    if (!foodItem || !foodItem.price || cost <= 0) return 0;
    
    const profitMargin = ((foodItem.price - cost) / foodItem.price) * 100;
    return Math.round(profitMargin);
  };

  const deleteRecipe = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this recipe?"))) return;

    try {
      setLoading(true);
      
      // Delete recipe ingredients first
      const { error: ingredientsError } = await supabase
        .from("recipe_ingredient_items")
        .delete()
        .eq("recipe_id", id);
        
      if (ingredientsError) throw ingredientsError;
      
      // Then delete the recipe
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Recipe deleted successfully");
      await loadRecipes();
      
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setLoading(false);
    }
  };

  const saveOperatingCosts = async () => {
    try {
      setLoading(true);
      
      // Check if we have an existing record
      const { data, error: checkError } = await supabase
        .from("recipe_operating_costs")
        .select("id")
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from("recipe_operating_costs")
          .update({
            overhead_percentage: operatingCosts.overhead_percentage,
            labor_cost_factor: operatingCosts.labor_cost_factor
          })
          .eq("id", data[0].id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from("recipe_operating_costs")
          .insert({
            overhead_percentage: operatingCosts.overhead_percentage,
            labor_cost_factor: operatingCosts.labor_cost_factor
          });
          
        if (error) throw error;
      }
      
      toast.success("Operating costs updated successfully");
      setOpenCostSettingsDialog(false);
      
    } catch (error) {
      console.error("Error saving operating costs:", error);
      toast.error("Failed to save operating costs");
    } finally {
      setLoading(false);
    }
  };

  const getIngredientName = (id: string): string => {
    const ingredient = ingredients.find(item => item.id === id);
    return ingredient ? ingredient.name : "Unknown";
  };

  const getUnitAbbreviation = (id: string): string => {
    const ingredient = ingredients.find(item => item.id === id);
    return ingredient && ingredient.units ? ingredient.units.abbreviation : "";
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Recipe Cost Calculator" />}
        description={<T text="Calculate accurate costs for your menu items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setOpenCostSettingsDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              <T text="Cost Settings" />
            </Button>
            <Button onClick={() => handleOpenRecipeDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="New Recipe" />
            </Button>
          </>
        }
      />

      <MenuNav />

      {loading && !recipes.length ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {recipes.length === 0 ? (
            <Card className="bg-muted/40 mt-6">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No Recipes Found" />
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  <T text="You haven't created any recipes yet. Recipes help you track ingredient costs and calculate accurate pricing for your menu items." />
                </p>
                <Button onClick={() => handleOpenRecipeDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  <T text="Create Your First Recipe" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {recipes.map(recipe => {
                const foodItem = foodItems.find(item => item.id === recipe.food_item_id);
                const profitMargin = foodItem 
                  ? calculateProfitMargin(recipe.food_item_id, recipe.cost_per_serving || 0)
                  : 0;
                
                return (
                  <Card key={recipe.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle>{recipe.name}</CardTitle>
                        <div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenRecipeDialog(recipe)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteRecipe(recipe.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      {recipe.description && (
                        <CardDescription className="mt-2">
                          {recipe.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <div className="grid grid-cols-2 gap-y-2 mb-4">
                        <div className="text-sm text-muted-foreground">
                          <T text="Menu Price" />:
                        </div>
                        <div className="text-sm font-medium text-right">
                          £{foodItem?.price.toFixed(2) || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <T text="Cost Per Serving" />:
                        </div>
                        <div className="text-sm font-medium text-right">
                          £{recipe.cost_per_serving?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <T text="Profit Margin" />:
                        </div>
                        <div className="text-sm font-medium text-right">
                          {profitMargin}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <T text="Servings" />:
                        </div>
                        <div className="text-sm font-medium text-right">
                          {recipe.serves}
                        </div>
                        {(recipe.preparation_time || recipe.cooking_time) && (
                          <>
                            <div className="text-sm text-muted-foreground">
                              <T text="Time" />:
                            </div>
                            <div className="text-sm font-medium text-right flex items-center justify-end">
                              <Clock className="h-3 w-3 mr-1" />
                              {recipe.preparation_time && `${recipe.preparation_time} min prep`}
                              {recipe.preparation_time && recipe.cooking_time && " + "}
                              {recipe.cooking_time && `${recipe.cooking_time} min cook`}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            <T text="Ingredients" /> ({recipe.ingredients.length})
                          </h4>
                          <ul className="text-sm space-y-1">
                            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{getIngredientName(ingredient.ingredient_id)}</span>
                                <span>
                                  {ingredient.quantity} {getUnitAbbreviation(ingredient.ingredient_id)}
                                </span>
                              </li>
                            ))}
                            {recipe.ingredients.length > 3 && (
                              <li className="text-muted-foreground text-xs italic">
                                <T text="And" /> {recipe.ingredients.length - 3} <T text="more" />...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-muted/40 border-t py-3">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-muted-foreground">
                          <T text="Total Cost" />: £{recipe.total_cost?.toFixed(2) || "0.00"}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenRecipeDialog(recipe)}
                        >
                          <T text="Details" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Recipe Dialog */}
      <Dialog open={openRecipeDialog} onOpenChange={setOpenRecipeDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe ? <T text="Edit Recipe" /> : <T text="Create New Recipe" />}
            </DialogTitle>
            <DialogDescription>
              <T text="Define recipe details and ingredients to calculate accurate costs." />
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="food_item_id"><T text="Menu Item" /> *</Label>
                <Select
                  value={recipeForm.food_item_id}
                  onValueChange={handleSelectChange("food_item_id", "recipe")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a menu item")} />
                  </SelectTrigger>
                  <SelectContent>
                    {foodItems.length === 0 ? (
                      <SelectItem value="no-items" disabled>
                        <T text="No menu items available. Please add menu items first." />
                      </SelectItem>
                    ) : (
                      foodItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - £{item.price.toFixed(2)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name"><T text="Recipe Name" /> *</Label>
                <Input
                  id="name"
                  name="name"
                  value={recipeForm.name}
                  onChange={(e) => handleInputChange(e, "recipe")}
                  placeholder={t("Recipe name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description"><T text="Description" /></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={recipeForm.description || ""}
                  onChange={(e) => handleInputChange(e, "recipe")}
                  placeholder={t("Recipe description")}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serves"><T text="Servings" /> *</Label>
                  <Input
                    id="serves"
                    name="serves"
                    type="number"
                    min="1"
                    value={recipeForm.serves}
                    onChange={(e) => handleInputChange(e, "recipe")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preparation_time"><T text="Prep Time (mins)" /></Label>
                  <Input
                    id="preparation_time"
                    name="preparation_time"
                    type="number"
                    min="0"
                    value={recipeForm.preparation_time || 0}
                    onChange={(e) => handleInputChange(e, "recipe")}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cooking_time"><T text="Cook Time (mins)" /></Label>
                  <Input
                    id="cooking_time"
                    name="cooking_time"
                    type="number"
                    min="0"
                    value={recipeForm.cooking_time || 0}
                    onChange={(e) => handleInputChange(e, "recipe")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labor_cost_factor"><T text="Labor Cost Factor" /></Label>
                  <Input
                    id="labor_cost_factor"
                    name="labor_cost_factor"
                    type="number"
                    min="0"
                    step="0.1"
                    value={recipeForm.labor_cost_factor || operatingCosts.labor_cost_factor}
                    onChange={(e) => handleInputChange(e, "recipe")}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overhead_percentage"><T text="Overhead %" /></Label>
                <Input
                  id="overhead_percentage"
                  name="overhead_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={recipeForm.overhead_percentage || operatingCosts.overhead_percentage}
                  onChange={(e) => handleInputChange(e, "recipe")}
                />
              </div>
              
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center">
                    <Calculator className="h-4 w-4 mr-2" />
                    <T text="Cost Summary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span><T text="Ingredient Cost" /></span>
                    <span>
                      £{recipeForm.ingredients?.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span><T text="Labor Cost" /></span>
                    <span>
                      £{(((recipeForm.preparation_time || 0) + (recipeForm.cooking_time || 0)) / 60 * (recipeForm.labor_cost_factor || operatingCosts.labor_cost_factor)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span><T text="Overhead" /> ({recipeForm.overhead_percentage || operatingCosts.overhead_percentage}%)</span>
                    <span>
                      £{(((recipeForm.total_cost || 0) / (1 + ((recipeForm.overhead_percentage || operatingCosts.overhead_percentage) / 100))) * ((recipeForm.overhead_percentage || operatingCosts.overhead_percentage) / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                    <span><T text="Total Cost" /></span>
                    <span>£{recipeForm.total_cost?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span><T text="Cost Per Serving" /></span>
                    <span>£{recipeForm.cost_per_serving?.toFixed(2) || "0.00"}</span>
                  </div>
                  
                  {recipeForm.food_item_id && (
                    <div className="flex justify-between font-medium pt-1 border-t mt-1">
                      <span><T text="Menu Price" /></span>
                      <span>
                        £{foodItems.find(item => item.id === recipeForm.food_item_id)?.price.toFixed(2) || "N/A"}
                      </span>
                    </div>
                  )}
                  
                  {recipeForm.food_item_id && recipeForm.cost_per_serving && (
                    <div className="flex justify-between font-medium">
                      <span><T text="Profit Margin" /></span>
                      <span>
                        {calculateProfitMargin(recipeForm.food_item_id, recipeForm.cost_per_serving)}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  <T text="Ingredients" />
                </h3>
                <Button onClick={handleOpenIngredientDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  <T text="Add Ingredient" />
                </Button>
              </div>
              
              {(!recipeForm.ingredients || recipeForm.ingredients.length === 0) ? (
                <div className="bg-muted/40 border rounded-md p-6 flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center mb-4">
                    <T text="No ingredients added yet. Add ingredients to calculate recipe costs." />
                  </p>
                  <Button variant="outline" onClick={handleOpenIngredientDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    <T text="Add First Ingredient" />
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Ingredient" /></TableHead>
                        <TableHead className="text-right"><T text="Quantity" /></TableHead>
                        <TableHead className="text-right"><T text="Cost" /></TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipeForm.ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {getIngredientName(ingredient.ingredient_id)}
                            {ingredient.ingredient?.is_allergen && (
                              <Badge variant="destructive" className="ml-2">
                                <T text="Allergen" />
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {ingredient.quantity} {getUnitAbbreviation(ingredient.ingredient_id)}
                          </TableCell>
                          <TableCell className="text-right">
                            £{ingredient.cost?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => removeIngredientFromRecipe(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRecipeDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={saveRecipe} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Save Recipe" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ingredient Dialog */}
      <Dialog open={openIngredientDialog} onOpenChange={setOpenIngredientDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <T text="Add Ingredient" />
            </DialogTitle>
            <DialogDescription>
              <T text="Add an ingredient to the recipe." />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient_id"><T text="Ingredient" /> *</Label>
              <Select
                value={ingredientForm.ingredient_id}
                onValueChange={handleSelectChange("ingredient_id", "ingredient")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select an ingredient")} />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.length === 0 ? (
                    <SelectItem value="no-ingredients" disabled>
                      <T text="No ingredients available. Please add ingredients first." />
                    </SelectItem>
                  ) : (
                    ingredients.map(ingredient => (
                      <SelectItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} - £{ingredient.cost_per_unit}/{ingredient.units?.abbreviation}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity"><T text="Quantity" /> *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={ingredientForm.quantity}
                  onChange={(e) => handleInputChange(e, "ingredient")}
                />
                <div className="w-16 text-muted-foreground">
                  {ingredientForm.unit_abbreviation || ""}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost"><T text="Calculated Cost" /></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  readOnly
                  value={ingredientForm.cost.toFixed(2)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenIngredientDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={addIngredientToRecipe} disabled={loading}>
              <T text="Add Ingredient" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cost Settings Dialog */}
      <Dialog open={openCostSettingsDialog} onOpenChange={setOpenCostSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <T text="Operating Cost Settings" />
            </DialogTitle>
            <DialogDescription>
              <T text="Configure default overhead and labor cost settings for recipe costing." />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="overhead_percentage">
                <T text="Default Overhead Percentage" />
              </Label>
              <div className="relative">
                <Input
                  id="overhead_percentage"
                  name="overhead_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={operatingCosts.overhead_percentage}
                  onChange={(e) => handleInputChange(e, "costs")}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <T text="Overhead costs include rent, utilities, equipment, etc." />
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="labor_cost_factor">
                <T text="Labor Cost Factor (£/hour)" />
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                <Input
                  id="labor_cost_factor"
                  name="labor_cost_factor"
                  type="number"
                  min="0"
                  step="0.1"
                  value={operatingCosts.labor_cost_factor}
                  onChange={(e) => handleInputChange(e, "costs")}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <T text="Average hourly cost of kitchen staff." />
              </p>
            </div>
            
            <div className="bg-muted/40 rounded-md p-4 mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <T text="How Cost Calculation Works" />
              </h4>
              <p className="text-sm text-muted-foreground">
                <T text="The total recipe cost is calculated as:" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                (Ingredient Cost + Labor Cost) × (1 + Overhead%)
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <T text="Labor cost is calculated based on preparation and cooking time." />
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCostSettingsDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={saveOperatingCosts} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Save Settings" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeCostCalculator;
