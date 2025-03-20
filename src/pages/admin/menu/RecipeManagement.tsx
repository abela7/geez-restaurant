
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, ChevronLeft, Calculator, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RecipeManagement = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  
  // Form states
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeServes, setNewRecipeServes] = useState(2);
  const [newRecipeCategory, setNewRecipeCategory] = useState("");
  const [newIngredientId, setNewIngredientId] = useState("");
  const [newIngredientQuantity, setNewIngredientQuantity] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("kg");
  
  const foodId = searchParams.get("foodId");
  
  // Load recipes data from Supabase
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            id, 
            name, 
            serves, 
            total_cost, 
            cost_per_serving,
            food_item_id,
            food_items (
              id,
              name,
              category_id,
              menu_categories (
                name
              )
            )
          `);
        
        if (error) throw error;
        
        const formattedRecipes = data.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          foodItemId: recipe.food_item_id,
          foodName: recipe.food_items?.name || recipe.name,
          category: recipe.food_items?.menu_categories?.name || "Uncategorized",
          serves: recipe.serves,
          totalCost: recipe.total_cost,
          costPerServing: recipe.cost_per_serving
        }));
        
        setRecipes(formattedRecipes);
        
        // If a foodId is provided, find the corresponding recipe and select it
        if (foodId) {
          const recipe = formattedRecipes.find(r => r.foodItemId === foodId);
          if (recipe) {
            setSelectedRecipe(recipe);
            setActiveTab("ingredients");
            // Load recipe ingredients
            fetchRecipeIngredients(recipe.id);
          }
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    }
    
    async function fetchIngredients() {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('id, name, category, cost, unit, stock_quantity');
        
        if (error) throw error;
        
        setIngredients(data.map(ingredient => ({
          id: ingredient.id,
          name: ingredient.name,
          category: ingredient.category,
          cost: ingredient.cost,
          unit: ingredient.unit,
          stock: ingredient.stock_quantity
        })));
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        toast.error('Failed to load ingredients');
      }
    }
    
    fetchRecipes();
    fetchIngredients();
  }, [foodId]);
  
  // Fetch recipe ingredients when a recipe is selected
  async function fetchRecipeIngredients(recipeId) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select(`
          id,
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          cost,
          ingredients (name)
        `)
        .eq('recipe_id', recipeId);
      
      if (error) throw error;
      
      const formattedIngredients = data.map(item => ({
        id: item.id,
        recipeId: item.recipe_id,
        ingredientId: item.ingredient_id,
        name: item.ingredients.name,
        quantity: item.quantity,
        unit: item.unit,
        cost: item.cost
      }));
      
      setRecipeIngredients(formattedIngredients);
    } catch (error) {
      console.error('Error fetching recipe ingredients:', error);
      toast.error('Failed to load recipe ingredients');
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handle creating a new recipe
  const handleCreateRecipe = async () => {
    if (!newRecipeName || !newRecipeServes) {
      toast.error('Please enter recipe name and servings');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First, check if this is connected to a food item
      let foodItemId = null;
      
      if (newRecipeCategory) {
        // Find or create a food item for this recipe
        const { data: foodItem, error: foodItemError } = await supabase
          .from('food_items')
          .insert({
            name: newRecipeName,
            category_id: newRecipeCategory,
            price: 0, // Default values since this is just for recipe tracking
            cost: 0,
            available: true
          })
          .select('id')
          .single();
        
        if (foodItemError) throw foodItemError;
        foodItemId = foodItem.id;
      }
      
      // Then create the recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          name: newRecipeName,
          serves: newRecipeServes,
          food_item_id: foodItemId,
          total_cost: 0,
          cost_per_serving: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Recipe created successfully');
      
      // Update local state
      const newRecipe = {
        id: data.id,
        name: data.name,
        foodItemId: data.food_item_id,
        foodName: data.name,
        category: "Uncategorized", // We'll need to fetch this in the reload
        serves: data.serves,
        totalCost: data.total_cost,
        costPerServing: data.cost_per_serving
      };
      
      setRecipes([...recipes, newRecipe]);
      
      // Reset form
      setNewRecipeName("");
      setNewRecipeServes(2);
      setNewRecipeCategory("");
      
      // Select the new recipe
      setSelectedRecipe(newRecipe);
      setActiveTab("ingredients");
      
      // Reload all recipes to get the complete data
      await fetchRecipes();
      
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding an ingredient to the recipe
  const handleAddIngredient = async () => {
    if (!selectedRecipe || !newIngredientId || !newIngredientQuantity) {
      toast.error('Please select an ingredient and enter quantity');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Find the ingredient to calculate cost
      const ingredient = ingredients.find(i => i.id === newIngredientId);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
      
      // Calculate ingredient cost
      const quantity = parseFloat(newIngredientQuantity);
      const ingredientCost = quantity * (ingredient.cost || 0);
      
      // Add the ingredient to the recipe
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: selectedRecipe.id,
          ingredient_id: newIngredientId,
          quantity: quantity,
          unit: newIngredientUnit,
          cost: ingredientCost
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Ingredient added to recipe');
      
      // Update the recipe's total cost
      await updateRecipeCost(selectedRecipe.id);
      
      // Reload ingredients for this recipe
      await fetchRecipeIngredients(selectedRecipe.id);
      
      // Reset form
      setNewIngredientId("");
      setNewIngredientQuantity("");
      setNewIngredientUnit("kg");
      
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Failed to add ingredient');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the recipe's total cost and cost per serving
  const updateRecipeCost = async (recipeId) => {
    try {
      // Get all ingredients for this recipe
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('cost')
        .eq('recipe_id', recipeId);
      
      if (error) throw error;
      
      // Calculate total cost
      const totalCost = data.reduce((sum, item) => sum + (item.cost || 0), 0);
      
      // Get recipe servings
      const recipe = recipes.find(r => r.id === recipeId);
      const serves = recipe?.serves || 1;
      
      // Calculate cost per serving
      const costPerServing = totalCost / serves;
      
      // Update the recipe
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          total_cost: totalCost,
          cost_per_serving: costPerServing
        })
        .eq('id', recipeId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setRecipes(recipes.map(r => 
        r.id === recipeId 
          ? { ...r, totalCost, costPerServing } 
          : r
      ));
      
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe({
          ...selectedRecipe,
          totalCost,
          costPerServing
        });
      }
      
    } catch (error) {
      console.error('Error updating recipe cost:', error);
    }
  };
  
  // Handle removing an ingredient from the recipe
  const handleRemoveIngredient = async (ingredientId) => {
    if (!selectedRecipe || !ingredientId) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('id', ingredientId);
      
      if (error) throw error;
      
      toast.success('Ingredient removed from recipe');
      
      // Update the recipe's total cost
      await updateRecipeCost(selectedRecipe.id);
      
      // Reload ingredients for this recipe
      await fetchRecipeIngredients(selectedRecipe.id);
      
    } catch (error) {
      console.error('Error removing ingredient:', error);
      toast.error('Failed to remove ingredient');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Recipe Management" />}
          description={<T text="Manage recipes, ingredients, and portion costs" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/food">
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Food Management" />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Recipe" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle><T text="Add New Recipe" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name"><T text="Recipe Name" /></Label>
                        <Input 
                          id="name" 
                          placeholder={t("Enter recipe name")} 
                          value={newRecipeName}
                          onChange={(e) => setNewRecipeName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category"><T text="Category" /></Label>
                        <Select value={newRecipeCategory} onValueChange={setNewRecipeCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {/* We'll fetch these from the database once we have the categories table */}
                            <SelectItem value="Main Dishes">Main Dishes</SelectItem>
                            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="Appetizers">Appetizers</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Desserts">Desserts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serves"><T text="Serves" /></Label>
                        <Input 
                          id="serves" 
                          type="number" 
                          placeholder="2"
                          value={newRecipeServes}
                          onChange={(e) => setNewRecipeServes(parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateRecipe} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      <T text="Create Recipe" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
          <TabsList>
            <TabsTrigger value="recipes"><T text="Recipes" /></TabsTrigger>
            <TabsTrigger value="ingredients" disabled={!selectedRecipe}><T text="Ingredients" /></TabsTrigger>
          </TabsList>
          <TabsContent value="recipes">
            <div className="mb-6 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search recipes...")}
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Recipe" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Total Cost" /></TableHead>
                      <TableHead><T text="Cost per Serving" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecipes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          {searchQuery ? (
                            <T text="No recipes found matching your search" />
                          ) : (
                            <T text="No recipes found. Create your first recipe!" />
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecipes.map((recipe) => (
                        <TableRow key={recipe.id}>
                          <TableCell className="font-medium">{recipe.name}</TableCell>
                          <TableCell>{recipe.category}</TableCell>
                          <TableCell>${recipe.totalCost ? recipe.totalCost.toFixed(2) : '0.00'}</TableCell>
                          <TableCell>${recipe.costPerServing ? recipe.costPerServing.toFixed(2) : '0.00'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedRecipe(recipe);
                                setActiveTab("ingredients");
                                fetchRecipeIngredients(recipe.id);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <T text="Edit Recipe" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="ingredients">
            {selectedRecipe && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedRecipe.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      <T text="Manage ingredients for this recipe" />
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        <T text="Add Ingredient" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle><T text="Add New Ingredient" /></DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="ingredient"><T text="Ingredient" /></Label>
                          <Select value={newIngredientId} onValueChange={setNewIngredientId}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("Select ingredient")} />
                            </SelectTrigger>
                            <SelectContent>
                              {ingredients.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id}>
                                  {ingredient.name} ({ingredient.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity"><T text="Quantity" /></Label>
                          <Input 
                            id="quantity" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00"
                            value={newIngredientQuantity}
                            onChange={(e) => setNewIngredientQuantity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit"><T text="Unit" /></Label>
                          <Select value={newIngredientUnit} onValueChange={setNewIngredientUnit}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder={t("Select unit")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="l">l</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="unit">unit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddIngredient} disabled={isLoading}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          <T text="Add Ingredient" />
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><T text="Ingredient" /></TableHead>
                          <TableHead><T text="Quantity" /></TableHead>
                          <TableHead><T text="Unit" /></TableHead>
                          <TableHead><T text="Cost" /></TableHead>
                          <TableHead className="text-right"><T text="Actions" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recipeIngredients.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <T text="No ingredients added to this recipe yet" />
                            </TableCell>
                          </TableRow>
                        ) : (
                          recipeIngredients.map((ingredient) => (
                            <TableRow key={ingredient.id}>
                              <TableCell className="font-medium">{ingredient.name}</TableCell>
                              <TableCell>{ingredient.quantity}</TableCell>
                              <TableCell>{ingredient.unit}</TableCell>
                              <TableCell>${ingredient.cost ? ingredient.cost.toFixed(2) : '0.00'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveIngredient(ingredient.id)}
                                    disabled={isLoading}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RecipeManagement;
