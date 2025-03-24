import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FoodItem } from "@/types/menu";
import RecipeStatisticsCards from "@/components/admin/menu/RecipeStatisticsCards";
import ExistingRecipesTable from "@/components/admin/menu/ExistingRecipesTable";
import MissingRecipesTable from "@/components/admin/menu/MissingRecipesTable";
import RecipeIntegrationBanner from "@/components/admin/menu/RecipeIntegrationBanner";

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
        .select('id, name, description, price, category_id, menu_categories:category_id(id, name), available, is_vegetarian, is_vegan, is_gluten_free, is_spicy, image_url, preparation_time')
        .order('name');
      
      if (foodItemsError) throw foodItemsError;
      
      // Format food items with category name
      const formattedFoodItems: FoodItem[] = foodItemsData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url || null,
        category_id: item.category_id || null,
        available: item.available !== undefined ? item.available : true,
        is_vegetarian: item.is_vegetarian !== undefined ? item.is_vegetarian : false,
        is_vegan: item.is_vegan !== undefined ? item.is_vegan : false,
        is_gluten_free: item.is_gluten_free !== undefined ? item.is_gluten_free : false,
        is_spicy: item.is_spicy !== undefined ? item.is_spicy : false,
        preparation_time: item.preparation_time || null,
        menu_categories: item.menu_categories ? {
          id: item.menu_categories.id,
          name: item.menu_categories.name
        } : undefined,
        categoryName: item.menu_categories?.name || "Uncategorized"
      }));
      
      setFoodItems(formattedFoodItems);
      
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
        <RecipeStatisticsCards 
          recipesCount={recipes.length}
          foodItemsCount={foodItems.length}
          missingRecipesCount={foodItemsWithoutRecipes.length}
        />

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
        <ExistingRecipesTable 
          recipes={recipes}
          searchQuery={searchQuery}
        />

        {/* Food Items Without Recipes */}
        <MissingRecipesTable 
          foodItems={foodItemsWithoutRecipes}
          searchQuery={searchQuery}
        />

        {/* Integration Banner */}
        <RecipeIntegrationBanner />
      </div>
    </div>
  );
};

export default RecipeManagement;
