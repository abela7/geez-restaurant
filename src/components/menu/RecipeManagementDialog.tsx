
import React, { useState, useEffect } from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FoodItem } from "@/types/menu";
import { Recipe, RecipeIngredient, createRecipe, fetchRecipeByFoodItem, updateRecipeIngredients } from "@/services/menu/recipeService";
import { fetchStock } from "@/services/inventory/stockService";
import { Ingredient } from "@/services/inventory/types";
import { Loader2 } from "lucide-react";

interface RecipeManagementDialogProps {
  open: boolean;
  onClose: () => void;
  foodItem: FoodItem | null;
}

export const RecipeManagementDialog: React.FC<RecipeManagementDialogProps> = ({
  open,
  onClose,
  foodItem,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [serves, setServes] = useState<number>(1);

  useEffect(() => {
    if (open && foodItem) {
      loadData();
    }
  }, [open, foodItem]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load ingredients
      const stockIngredients = await fetchStock();
      setIngredients(stockIngredients);

      // Load recipe if it exists
      if (foodItem) {
        const existingRecipe = await fetchRecipeByFoodItem(foodItem.id);
        if (existingRecipe) {
          setRecipe(existingRecipe);
          setServes(existingRecipe.serves);
          setRecipeIngredients(
            existingRecipe.recipe_ingredients?.map((ri: any) => ({
              id: ri.id,
              recipe_id: ri.recipe_id,
              ingredient_id: ri.ingredient_id,
              quantity: ri.quantity,
              unit: ri.unit
            })) || []
          );
        } else {
          setRecipe(null);
          setServes(1);
          setRecipeIngredients([]);
        }
      }
    } catch (error) {
      console.error("Error loading recipe data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (ingredients.length === 0) return;
    
    setRecipeIngredients([
      ...recipeIngredients, 
      {
        ingredient_id: ingredients[0].id,
        quantity: 1,
        unit: ingredients[0].unit
      }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients.splice(index, 1);
    setRecipeIngredients(updatedIngredients);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updatedIngredients = [...recipeIngredients];
    
    if (field === 'ingredient_id') {
      // When ingredient changes, also update the unit to match the ingredient's unit
      const selectedIngredient = ingredients.find(ing => ing.id === value);
      if (selectedIngredient) {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          [field]: value,
          unit: selectedIngredient.unit
        };
      } else {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          [field]: value
        };
      }
    } else {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
    }
    
    setRecipeIngredients(updatedIngredients);
  };

  const handleSaveRecipe = async () => {
    if (!foodItem) return;
    
    setIsSaving(true);
    try {
      if (recipe) {
        // Update existing recipe
        await updateRecipeIngredients(recipe.id!, recipeIngredients);
      } else {
        // Create new recipe
        await createRecipe({
          food_item_id: foodItem.id,
          name: foodItem.name,
          serves: serves,
          ingredients: recipeIngredients
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!foodItem) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {recipe ? <T text="Edit Recipe for" /> : <T text="Create Recipe for" />} {foodItem.name}
          </DialogTitle>
          <DialogDescription>
            <T text="Define the ingredients and quantities needed to prepare this dish" />
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {ingredients.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start">
                <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    <T text="No ingredients available" />
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    <T text="Please add ingredients to your inventory first before creating recipes." />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={onClose}
                    asChild
                  >
                    <a href="/admin/inventory/stock">
                      <T text="Go to Inventory" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipe-name">
                        <T text="Recipe Name" />
                      </Label>
                      <Input
                        id="recipe-name"
                        value={foodItem.name}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="serves">
                        <T text="Serves (Portions)" />
                      </Label>
                      <Input
                        id="serves"
                        type="number"
                        min="1"
                        value={serves}
                        onChange={(e) => setServes(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>
                        <T text="Ingredients" />
                      </Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddIngredient}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <T text="Add Ingredient" />
                      </Button>
                    </div>
                    
                    {recipeIngredients.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <T text="No ingredients added yet. Click 'Add Ingredient' to start building your recipe." />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recipeIngredients.map((ingredient, index) => (
                          <div key={index} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-5">
                              <Select
                                value={ingredient.ingredient_id}
                                onValueChange={(value) => handleIngredientChange(index, 'ingredient_id', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={t("Select ingredient")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {ingredients.map((ing) => (
                                    <SelectItem key={ing.id} value={ing.id}>
                                      {ing.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={ingredient.quantity}
                                onChange={(e) => 
                                  handleIngredientChange(
                                    index, 
                                    'quantity', 
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder={t("Quantity")}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                value={ingredient.unit}
                                onChange={(e) => 
                                  handleIngredientChange(index, 'unit', e.target.value)
                                }
                                disabled
                                placeholder={t("Unit")}
                              />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveIngredient(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            <T text="Cancel" />
          </Button>
          <Button onClick={handleSaveRecipe} disabled={isLoading || isSaving || ingredients.length === 0 || recipeIngredients.length === 0}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <T text="Save Recipe" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
