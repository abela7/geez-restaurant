
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { 
  AlertCircle, 
  Clipboard, 
  Utensils, 
  BarChart4, 
  DollarSign,
  FileText,
  Loader2,
  ChevronRight,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FoodItemRecipeButton from "@/components/admin/menu/FoodItemRecipeButton";
import { FoodItem } from "@/types/menu";

interface Recipe {
  id: string;
  food_item_id: string;
  name: string;
  serves: number;
  total_cost: number | null;
  cost_per_serving: number | null;
  ingredientCount: number;
  food_item?: {
    name: string;
    category?: {
      name: string;
    }
  };
}

const RecipeManagement = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [foodItemsWithoutRecipes, setFoodItemsWithoutRecipes] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load food items
      const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('id, name, description, price, category_id, menu_categories:category_id(name), available, is_vegetarian, is_vegan, is_gluten_free, is_spicy, image_url, preparation_time')
        .order('name');
      
      if (foodItemsError) throw foodItemsError;
      
      // Format food items with category name
      const formattedFoodItems = foodItemsData.map(item => ({
        ...item,
        category_name: item.menu_categories?.name || "Uncategorized",
        // Ensure all required properties are present
        image_url: item.image_url || null,
        category_id: item.category_id || null,
        available: item.available !== undefined ? item.available : true,
        is_vegetarian: item.is_vegetarian !== undefined ? item.is_vegetarian : false,
        is_vegan: item.is_vegan !== undefined ? item.is_vegan : false,
        is_gluten_free: item.is_gluten_free !== undefined ? item.is_gluten_free : false,
        is_spicy: item.is_spicy !== undefined ? item.is_spicy : false,
        preparation_time: item.preparation_time || null
      })) as FoodItem[];
      
      // Load recipes with ingredient counts
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id, 
          food_item_id, 
          name, 
          serves, 
          total_cost, 
          cost_per_serving,
          food_item:food_item_id(name, category_id, menu_categories:category_id(name))
        `);
      
      if (recipesError) throw recipesError;
      
      // Get count of ingredients for each recipe
      const { data: recipeIngredientsData, error: recipeIngredientsError } = await supabase
        .from('recipe_ingredients')
        .select('recipe_id');
      
      if (recipeIngredientsError) throw recipeIngredientsError;
      
      // Count ingredients per recipe
      const ingredientCount = recipeIngredientsData.reduce((acc, item) => {
        const recipeId = item.recipe_id;
        acc[recipeId] = (acc[recipeId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Add ingredient count to recipes
      const recipesWithCounts = recipesData.map(recipe => ({
        ...recipe,
        ingredientCount: ingredientCount[recipe.id] || 0
      }));
      
      setRecipes(recipesWithCounts);
      setFoodItems(formattedFoodItems);
      
      // Find food items without recipes
      const foodItemsWithRecipes = new Set(recipesData.map(r => r.food_item_id));
      const missingRecipes = formattedFoodItems.filter(item => !foodItemsWithRecipes.has(item.id));
      setFoodItemsWithoutRecipes(missingRecipes);
      
    } catch (error) {
      console.error("Error loading recipe data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.food_item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMissingRecipes = foodItemsWithoutRecipes.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Recipe Management" />}
          description={<T text="Define ingredients and quantities for each dish" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <T text="Back to Menu" />
                </Link>
              </Button>
            </>
          }
        />

        <MenuNav />

        <div className="mt-6 flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Recipe Management" />}
        description={<T text="Define ingredients and quantities for each dish" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/menu/food">
                <T text="Manage Food Items" />
              </Link>
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mt-6 space-y-6">
        {/* Recipe Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg"><T text="Total Recipes" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{recipes.length}</div>
              <p className="text-sm text-muted-foreground">
                <span>{t("of {total} food items", { total: foodItems.length })}</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg"><T text="Missing Recipes" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{foodItemsWithoutRecipes.length}</div>
              <p className="text-sm text-muted-foreground">
                <T text="food items without recipes" />
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg"><T text="Recipe Development Status" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {Math.round((recipes.length / Math.max(foodItems.length, 1)) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">
                <T text="completion rate" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("Search recipes...")}
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Existing Recipes */}
        <Card>
          <CardHeader>
            <CardTitle><T text="Existing Recipes" /></CardTitle>
            <CardDescription>
              <T text="Recipes with defined ingredients and costs" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecipes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Dish Name" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Ingredients" /></TableHead>
                      <TableHead><T text="Serves" /></TableHead>
                      <TableHead><T text="Total Cost" /></TableHead>
                      <TableHead><T text="Cost per Serving" /></TableHead>
                      <TableHead><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.name}</TableCell>
                        <TableCell>{recipe.food_item?.category?.name || "Uncategorized"}</TableCell>
                        <TableCell>{recipe.ingredientCount}</TableCell>
                        <TableCell>{recipe.serves}</TableCell>
                        <TableCell>£{recipe.total_cost?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>£{recipe.cost_per_serving?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <FoodItemRecipeButton 
                              foodItem={{
                                id: recipe.food_item_id,
                                name: recipe.name,
                                description: '',
                                price: 0,
                                image_url: null,
                                category_id: null,
                                available: true,
                                is_vegetarian: false,
                                is_vegan: false,
                                is_gluten_free: false,
                                is_spicy: false,
                                preparation_time: null
                              }} 
                            />
                            <Button variant="ghost" size="icon" title={t("View Dish Cost")} asChild>
                              <Link to={`/admin/menu/dish-cost`}>
                                <DollarSign className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchQuery ? 
                  <T text="No recipes found matching your search" /> : 
                  <T text="No recipes have been created yet" />
                }
              </div>
            )}
          </CardContent>
        </Card>

        {/* Food Items Without Recipes */}
        <Card>
          <CardHeader>
            <CardTitle><T text="Food Items Without Recipes" /></CardTitle>
            <CardDescription>
              <T text="Items that need recipes to be created" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMissingRecipes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Dish Name" /></TableHead>
                      <TableHead><T text="Category" /></TableHead>
                      <TableHead><T text="Current Price" /></TableHead>
                      <TableHead><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMissingRecipes.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category_name}</TableCell>
                        <TableCell>£{item.price?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          <FoodItemRecipeButton foodItem={item} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchQuery ? 
                  <T text="No food items without recipes match your search" /> : 
                  <T text="All food items have recipes" />
                }
              </div>
            )}
          </CardContent>
          {filteredMissingRecipes.length > 0 && (
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/admin/menu/food">
                  <T text="Manage Food Items" />
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Integration Banner */}
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-amber-600" />
              <T text="Recipe & Cost Integration" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              <T text="Recipes are now fully integrated with the dish cost management system:" />
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <Clipboard className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                <span><T text="Recipe ingredients are automatically reflected in dish costs" /></span>
              </li>
              <li className="flex items-start">
                <Utensils className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                <span><T text="Stock levels are tracked when orders are processed" /></span>
              </li>
              <li className="flex items-start">
                <BarChart4 className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                <span><T text="Cost calculations are synchronized across the system" /></span>
              </li>
              <li className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                <span><T text="Food item prices are automatically suggested based on costs and profit margins" /></span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/admin/menu/dish-cost">
                <T text="Manage Dish Costs" />
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/inventory/ingredients">
                <T text="Manage Ingredients" />
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RecipeManagement;
