import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { FoodItem } from "@/types/menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { fetchRecipeByFoodItem, createRecipe, updateRecipeIngredients, RecipeIngredient } from "@/services/menu/recipeService";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecipeManagementDialogProps {
  open: boolean;
  onClose: () => void;
  foodItem: FoodItem;
}

export const RecipeManagementDialog: React.FC<RecipeManagementDialogProps> = ({
  open,
  onClose,
  foodItem
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [serves, setServes] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [costPerServing, setCostPerServing] = useState(0);

  useEffect(() => {
    if (open) {
      loadRecipe();
      loadAvailableIngredients();
    }
  }, [open, foodItem.id]);

  const loadRecipe = async () => {
    setIsLoading(true);
    try {
      const recipeData = await fetchRecipeByFoodItem(foodItem.id);
      
      if (recipeData) {
        setRecipe(recipeData);
        setServes(recipeData.serves || 1);
        
        if (recipeData.recipe_ingredients && recipeData.recipe_ingredients.length > 0) {
          const formattedIngredients = recipeData.recipe_ingredients.map((item: any) => ({
            id: item.id,
            ingredient_id: item.ingredient_id,
            quantity: item.quantity,
            unit: item.unit,
            ingredient: item.ingredient
          }));
          
          setIngredients(formattedIngredients);
          calculateTotalCost(formattedIngredients, recipeData.serves || 1);
        }
      } else {
        setRecipe(null);
        setIngredients([]);
        setTotalCost(0);
        setCostPerServing(0);
      }
    } catch (error) {
      console.error("Error loading recipe:", error);
      toast.error(t("Failed to load recipe"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setAvailableIngredients(data || []);
    } catch (error) {
      console.error("Error loading ingredients:", error);
      toast.error(t("Failed to load ingredients"));
    }
  };

  const handleAddIngredient = () => {
    if (availableIngredients.length === 0) {
      toast.error(t("No ingredients available. Please add ingredients first."));
      return;
    }
    
    const firstIngredient = availableIngredients[0];
    setIngredients([
      ...ingredients,
      {
        ingredient_id: firstIngredient.id,
        quantity: 1,
        unit: firstIngredient.unit,
        ingredient: firstIngredient
      }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    calculateTotalCost(newIngredients, serves);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...ingredients];
    
    if (field === 'ingredient_id') {
      const selectedIngredient = availableIngredients.find(i => i.id === value);
      if (selectedIngredient) {
        newIngredients[index] = {
          ...newIngredients[index],
          ingredient_id: value,
          unit: selectedIngredient.unit,
          ingredient: selectedIngredient
        };
      }
    } else {
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: field === 'quantity' ? Number(value) : value
      };
    }
    
    setIngredients(newIngredients);
    calculateTotalCost(newIngredients, serves);
  };

  const handleServesChange = (value: number) => {
    const newServes = Math.max(1, value); // Ensure at least 1 serving
    setServes(newServes);
    calculateTotalCost(ingredients, newServes);
  };

  const calculateTotalCost = (ingredientsList: any[], servesCount: number) => {
    let cost = 0;
    
    ingredientsList.forEach(ing => {
      const ingredient = ing.ingredient || availableIngredients.find(i => i.id === ing.ingredient_id);
      if (ingredient) {
        cost += (ingredient.cost || 0) * ing.quantity;
      }
    });
    
    setTotalCost(cost);
    setCostPerServing(servesCount > 0 ? cost / servesCount : cost);
  };

  const handleSaveRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error(t("Please add at least one ingredient"));
      return;
    }
    
    setIsSaving(true);
    
    try {
      const formattedIngredients: RecipeIngredient[] = ingredients.map(ing => ({
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit
      }));
      
      if (recipe) {
        // Update existing recipe
        const success = await updateRecipeIngredients(recipe.id, formattedIngredients);
        
        if (success) {
          // Update the serves count if changed
          if (recipe.serves !== serves) {
            await supabase
              .from('recipes')
              .update({ serves: serves })
              .eq('id', recipe.id);
          }
          
          toast.success(t("Recipe updated successfully"));
          onClose();
        }
      } else {
        // Create new recipe
        const newRecipe = await createRecipe({
          food_item_id: foodItem.id,
          name: foodItem.name,
          serves: serves,
          ingredients: formattedIngredients
        });
        
        if (newRecipe) {
          toast.success(t("Recipe created successfully"));
          onClose();
        }
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error(t("Failed to save recipe"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Recipe for")} {foodItem.name}</DialogTitle>
          <DialogDescription>
            {t("Define ingredients and quantities for this dish")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serves">{t("Serves (Number of Portions)")}</Label>
                  <Input
                    id="serves"
                    type="number"
                    min="1"
                    value={serves}
                    onChange={(e) => handleServesChange(parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="text-sm text-muted-foreground mb-1">{t("Cost Information")}</div>
                  <div className="border rounded-md p-3 space-y-1">
                    <div className="flex justify-between">
                      <span>{t("Total Cost")}:</span>
                      <span className="font-medium">£{totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Cost Per Serving")}:</span>
                      <span className="font-medium">£{costPerServing.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <Label>{t("Ingredients")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredient}
                    disabled={availableIngredients.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Add Ingredient")}
                  </Button>
                </div>
                
                {availableIngredients.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t("No ingredients available. Please add ingredients in the inventory management section first.")}
                    </AlertDescription>
                  </Alert>
                )}

                {ingredients.length === 0 ? (
                  <div className="border rounded-md p-8 text-center text-muted-foreground">
                    {t("No ingredients added yet. Click 'Add Ingredient' to start building your recipe.")}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Select
                            value={ingredient.ingredient_id}
                            onValueChange={(value) => handleIngredientChange(index, 'ingredient_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("Select ingredient")} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIngredients.map(ing => (
                                <SelectItem key={ing.id} value={ing.id}>
                                  {ing.name} - £{ing.cost?.toFixed(2) || "0.00"}/{ing.unit}
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
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            placeholder={t("Quantity")}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            value={ingredient.unit}
                            disabled
                            placeholder={t("Unit")}
                          />
                        </div>
                        
                        <div className="col-span-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                {t("Cancel")}
              </Button>
              <Button 
                onClick={handleSaveRecipe} 
                disabled={ingredients.length === 0 || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    {t("Saving...")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {recipe ? t("Update Recipe") : t("Save Recipe")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
