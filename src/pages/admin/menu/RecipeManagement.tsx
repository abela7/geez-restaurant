
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
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

interface Recipe {
  id: string;
  food_item_id: string;
  name: string;
  serves: number;
  total_cost: number | null;
  cost_per_serving: number | null;
  ingredientCount: number;
}

const RecipeManagement = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [foodItemsWithoutRecipes, setFoodItemsWithoutRecipes] = useState<FoodItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load food items
      const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('id, name, description, price')
        .order('name');
      
      if (foodItemsError) throw foodItemsError;
      
      // Load recipes with ingredient counts
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id, 
          food_item_id, 
          name, 
          serves, 
          total_cost, 
          cost_per_serving
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
      setFoodItems(foodItemsData);
      
      // Find food items without recipes
      const foodItemsWithRecipes = new Set(recipesData.map(r => r.food_item_id));
      const missingRecipes = foodItemsData.filter(item => !foodItemsWithRecipes.has(item.id));
      setFoodItemsWithoutRecipes(missingRecipes);
      
    } catch (error) {
      console.error("Error loading recipe data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <T text="of {total} food items" params={{ total: foodItems.length }} />
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

        {/* Coming Soon Notice */}
        {recipes.length === 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                <T text="Recipe Management Coming Soon" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                <T text="The full recipe management system is under development. Soon you'll be able to:" />
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <Clipboard className="h-4 w-4 mr-2 mt-1 text-amber-500" />
                  <span><T text="Create detailed recipes for each food item" /></span>
                </li>
                <li className="flex items-start">
                  <Utensils className="h-4 w-4 mr-2 mt-1 text-amber-500" />
                  <span><T text="Specify ingredients and quantities" /></span>
                </li>
                <li className="flex items-start">
                  <BarChart4 className="h-4 w-4 mr-2 mt-1 text-amber-500" />
                  <span><T text="Track ingredient usage and inventory" /></span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="h-4 w-4 mr-2 mt-1 text-amber-500" />
                  <span><T text="Calculate recipe costs and profit margins" /></span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/admin/inventory/ingredients">
                  <T text="Manage Ingredients" />
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Future Recipe Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle><T text="Recipe Creation" /></CardTitle>
              <CardDescription>
                <T text="Define preparation instructions and ingredients" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="font-medium"><T text="Recipe Details" /></h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <T text="Coming soon: Create detailed recipe instructions, preparation steps, and cooking methods." />
                  </p>
                </div>
                
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center mb-2">
                    <Utensils className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="font-medium"><T text="Ingredients Management" /></h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <T text="Coming soon: Add ingredients with precise quantities, automatically calculate costs based on current inventory prices." />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle><T text="Cost Analysis" /></CardTitle>
              <CardDescription>
                <T text="Track costs and optimize profitability" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center mb-2">
                    <BarChart4 className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="font-medium"><T text="Cost Calculation" /></h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <T text="Coming soon: Automatically calculate total recipe cost and cost per serving based on current ingredient prices." />
                  </p>
                </div>
                
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="font-medium"><T text="Profit Analysis" /></h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <T text="Coming soon: See profit margins for each dish and get suggestions for price optimization." />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeManagement;
