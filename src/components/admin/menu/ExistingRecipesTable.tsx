
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
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

interface ExistingRecipesTableProps {
  recipes: Recipe[];
  searchQuery: string;
}

const ExistingRecipesTable: React.FC<ExistingRecipesTableProps> = ({
  recipes,
  searchQuery
}) => {
  const { t } = useLanguage();
  
  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.food_item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
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
  );
};

export default ExistingRecipesTable;
