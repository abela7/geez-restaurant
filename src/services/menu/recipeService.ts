
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecipeIngredient {
  id?: string;
  recipe_id?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id?: string;
  food_item_id: string;
  name: string;
  serves: number;
  ingredients?: RecipeIngredient[];
}

// Fetch a recipe by food item ID
export const fetchRecipeByFoodItem = async (foodItemId: string) => {
  try {
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*, recipe_ingredients(*, ingredient:ingredients(*))")
      .eq("food_item_id", foodItemId)
      .single();

    if (error) {
      console.error("Error fetching recipe:", error);
      return null;
    }

    return recipe;
  } catch (error) {
    console.error("Unexpected error fetching recipe:", error);
    return null;
  }
};

// Create a new recipe and update dish costs
export const createRecipe = async (recipe: Recipe) => {
  try {
    console.log("Creating recipe and updating dish costs:", recipe);
    
    // First create the recipe
    const { data: newRecipe, error } = await supabase
      .from("recipes")
      .insert({
        food_item_id: recipe.food_item_id,
        name: recipe.name,
        serves: recipe.serves
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe");
      return null;
    }

    // Then add the ingredients if provided
    let totalIngredientCost = 0;
    
    if (recipe.ingredients && recipe.ingredients.length > 0 && newRecipe.id) {
      const ingredientDetails = [];
      
      // Fetch details for all ingredients in one go
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from("ingredients")
        .select("id, name, cost, unit")
        .in("id", recipe.ingredients.map(ing => ing.ingredient_id));
        
      if (ingredientsError) {
        console.error("Error fetching ingredient details:", ingredientsError);
      }
      
      // Create a map for easy lookup
      const ingredientMap = new Map();
      if (ingredientsData) {
        ingredientsData.forEach(ing => {
          ingredientMap.set(ing.id, ing);
        });
      }
      
      // Prepare recipe ingredients with calculated costs
      const recipeIngredients = [];
      
      for (const ingredient of recipe.ingredients) {
        const ingredientInfo = ingredientMap.get(ingredient.ingredient_id);
        if (ingredientInfo) {
          const ingredientCost = (ingredientInfo.cost || 0) * ingredient.quantity;
          totalIngredientCost += ingredientCost;
          
          recipeIngredients.push({
            recipe_id: newRecipe.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            cost: ingredientCost
          });
          
          ingredientDetails.push({
            ingredient_id: ingredient.ingredient_id,
            ingredient_name: ingredientInfo.name,
            quantity: ingredient.quantity,
            unit_type: ingredient.unit,
            unit_cost: ingredientInfo.cost || 0,
            total_cost: ingredientCost
          });
        }
      }

      // Insert recipe ingredients
      const { error: ingredientError } = await supabase
        .from("recipe_ingredients")
        .insert(recipeIngredients);

      if (ingredientError) {
        console.error("Error adding recipe ingredients:", ingredientError);
        toast.error("Recipe created but failed to add ingredients");
        return newRecipe;
      }
      
      // Update the recipe with total cost and cost per serving
      const costPerServing = recipe.serves > 0 ? totalIngredientCost / recipe.serves : totalIngredientCost;
      
      await supabase
        .from("recipes")
        .update({
          total_cost: totalIngredientCost,
          cost_per_serving: costPerServing
        })
        .eq("id", newRecipe.id);
      
      // Check if a dish cost record already exists for this food item
      const { data: existingDishCost } = await supabase
        .from("dish_costs")
        .select("id")
        .eq("food_item_id", recipe.food_item_id)
        .maybeSingle();
        
      if (existingDishCost) {
        // Update existing dish cost
        console.log("Updating existing dish cost for food item:", recipe.food_item_id);
        
        // Get the current dish cost to calculate total
        const { data: currentDishCost } = await supabase
          .from("dish_costs")
          .select("total_overhead_cost, profit_margin, use_manual_price, manual_price")
          .eq("id", existingDishCost.id)
          .single();
          
        if (currentDishCost) {
          const totalCost = totalIngredientCost + currentDishCost.total_overhead_cost;
          const suggestedPrice = totalCost > 0 ? totalCost / (1 - (currentDishCost.profit_margin / 100)) : 0;
          const finalPrice = currentDishCost.use_manual_price && currentDishCost.manual_price ? 
            currentDishCost.manual_price : suggestedPrice;
          
          // Update dish cost
          await supabase
            .from("dish_costs")
            .update({
              total_ingredient_cost: totalIngredientCost,
              total_cost: totalCost,
              suggested_price: suggestedPrice
            })
            .eq("id", existingDishCost.id);
            
          // Clear existing dish ingredients
          await supabase
            .from("dish_ingredients")
            .delete()
            .eq("dish_cost_id", existingDishCost.id);
            
          // Add new dish ingredients
          if (ingredientDetails.length > 0) {
            const dishIngredients = ingredientDetails.map(ing => ({
              dish_cost_id: existingDishCost.id,
              ingredient_id: ing.ingredient_id,
              ingredient_name: ing.ingredient_name,
              quantity: ing.quantity,
              unit_type: ing.unit_type,
              unit_cost: ing.unit_cost,
              total_cost: ing.total_cost
            }));
            
            await supabase
              .from("dish_ingredients")
              .insert(dishIngredients);
          }
          
          // Update food item price and cost
          await supabase
            .from("food_items")
            .update({
              cost: totalCost,
              price: finalPrice
            })
            .eq("id", recipe.food_item_id);
        }
      } else {
        // Create a new dish cost record
        console.log("Creating new dish cost for food item:", recipe.food_item_id);
        
        // Get food item details
        const { data: foodItem } = await supabase
          .from("food_items")
          .select("name")
          .eq("id", recipe.food_item_id)
          .single();
          
        if (foodItem) {
          const profit_margin = 70; // Default profit margin
          const totalCost = totalIngredientCost; // No overhead costs initially
          const suggestedPrice = totalCost > 0 ? totalCost / (1 - (profit_margin / 100)) : 0;
          
          // Create dish cost
          const { data: dishCostData, error: dishCostError } = await supabase
            .from("dish_costs")
            .insert({
              dish_name: foodItem.name,
              food_item_id: recipe.food_item_id,
              total_ingredient_cost: totalIngredientCost,
              total_overhead_cost: 0,
              total_cost: totalCost,
              profit_margin: profit_margin,
              suggested_price: suggestedPrice,
              use_manual_price: false
            })
            .select()
            .single();
            
          if (dishCostError) {
            console.error("Error creating dish cost:", dishCostError);
          } else if (dishCostData && ingredientDetails.length > 0) {
            // Add dish ingredients
            const dishIngredients = ingredientDetails.map(ing => ({
              dish_cost_id: dishCostData.id,
              ingredient_id: ing.ingredient_id,
              ingredient_name: ing.ingredient_name,
              quantity: ing.quantity,
              unit_type: ing.unit_type,
              unit_cost: ing.unit_cost,
              total_cost: ing.total_cost
            }));
            
            await supabase
              .from("dish_ingredients")
              .insert(dishIngredients);
              
            // Update food item price and cost
            await supabase
              .from("food_items")
              .update({
                cost: totalCost,
                profit_margin: profit_margin,
                price: suggestedPrice
              })
              .eq("id", recipe.food_item_id);
          }
        }
      }
    }

    toast.success("Recipe created successfully");
    return newRecipe;
  } catch (error) {
    console.error("Unexpected error creating recipe:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Update recipe ingredients
export const updateRecipeIngredients = async (recipeId: string, ingredients: RecipeIngredient[]) => {
  try {
    console.log("Updating recipe ingredients:", ingredients);
    
    // Get recipe details to access food_item_id and serves
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .select("food_item_id, serves")
      .eq("id", recipeId)
      .single();
      
    if (recipeError) {
      console.error("Error fetching recipe:", recipeError);
      toast.error("Failed to update recipe ingredients");
      return false;
    }
    
    // First delete existing ingredients
    const { error: deleteError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", recipeId);

    if (deleteError) {
      console.error("Error deleting existing ingredients:", deleteError);
      toast.error("Failed to update recipe ingredients");
      return false;
    }

    let totalIngredientCost = 0;
    const ingredientDetails = [];
    
    // Fetch details for all ingredients in one go
    const { data: ingredientsData, error: ingredientsError } = await supabase
      .from("ingredients")
      .select("id, name, cost, unit")
      .in("id", ingredients.map(ing => ing.ingredient_id));
      
    if (ingredientsError) {
      console.error("Error fetching ingredient details:", ingredientsError);
    }
    
    // Create a map for easy lookup
    const ingredientMap = new Map();
    if (ingredientsData) {
      ingredientsData.forEach(ing => {
        ingredientMap.set(ing.id, ing);
      });
    }
    
    // Prepare recipe ingredients with calculated costs
    const recipeIngredients = [];
    
    for (const ingredient of ingredients) {
      const ingredientInfo = ingredientMap.get(ingredient.ingredient_id);
      if (ingredientInfo) {
        const ingredientCost = (ingredientInfo.cost || 0) * ingredient.quantity;
        totalIngredientCost += ingredientCost;
        
        recipeIngredients.push({
          recipe_id: recipeId,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          cost: ingredientCost
        });
        
        ingredientDetails.push({
          ingredient_id: ingredient.ingredient_id,
          ingredient_name: ingredientInfo.name,
          quantity: ingredient.quantity,
          unit_type: ingredient.unit,
          unit_cost: ingredientInfo.cost || 0,
          total_cost: ingredientCost
        });
      }
    }

    // Add the new ingredients
    const { error: insertError } = await supabase
      .from("recipe_ingredients")
      .insert(recipeIngredients);

    if (insertError) {
      console.error("Error adding recipe ingredients:", insertError);
      toast.error("Failed to update recipe ingredients");
      return false;
    }
    
    // Update the recipe with total cost and cost per serving
    const costPerServing = recipe.serves > 0 ? totalIngredientCost / recipe.serves : totalIngredientCost;
    
    await supabase
      .from("recipes")
      .update({
        total_cost: totalIngredientCost,
        cost_per_serving: costPerServing
      })
      .eq("id", recipeId);
      
    // Check if a dish cost record exists for this food item
    const { data: existingDishCost } = await supabase
      .from("dish_costs")
      .select("id")
      .eq("food_item_id", recipe.food_item_id)
      .maybeSingle();
      
    if (existingDishCost) {
      // Update existing dish cost
      console.log("Updating existing dish cost for food item:", recipe.food_item_id);
      
      // Get the current dish cost to calculate total
      const { data: currentDishCost } = await supabase
        .from("dish_costs")
        .select("total_overhead_cost, profit_margin, use_manual_price, manual_price")
        .eq("id", existingDishCost.id)
        .single();
        
      if (currentDishCost) {
        const totalCost = totalIngredientCost + currentDishCost.total_overhead_cost;
        const suggestedPrice = totalCost > 0 ? totalCost / (1 - (currentDishCost.profit_margin / 100)) : 0;
        const finalPrice = currentDishCost.use_manual_price && currentDishCost.manual_price ? 
          currentDishCost.manual_price : suggestedPrice;
        
        // Update dish cost
        await supabase
          .from("dish_costs")
          .update({
            total_ingredient_cost: totalIngredientCost,
            total_cost: totalCost,
            suggested_price: suggestedPrice
          })
          .eq("id", existingDishCost.id);
          
        // Clear existing dish ingredients
        await supabase
          .from("dish_ingredients")
          .delete()
          .eq("dish_cost_id", existingDishCost.id);
          
        // Add new dish ingredients
        if (ingredientDetails.length > 0) {
          const dishIngredients = ingredientDetails.map(ing => ({
            dish_cost_id: existingDishCost.id,
            ingredient_id: ing.ingredient_id,
            ingredient_name: ing.ingredient_name,
            quantity: ing.quantity,
            unit_type: ing.unit_type,
            unit_cost: ing.unit_cost,
            total_cost: ing.total_cost
          }));
          
          await supabase
            .from("dish_ingredients")
            .insert(dishIngredients);
        }
        
        // Update food item price and cost
        await supabase
          .from("food_items")
          .update({
            cost: totalCost,
            price: finalPrice
          })
          .eq("id", recipe.food_item_id);
      }
    }

    toast.success("Recipe ingredients updated successfully");
    return true;
  } catch (error) {
    console.error("Unexpected error updating recipe ingredients:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};

// Update stock based on order
export const deductIngredientsFromStock = async (foodItemId: string, quantity: number) => {
  try {
    // First get the recipe
    const recipe = await fetchRecipeByFoodItem(foodItemId);
    
    if (!recipe || !recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
      console.log(`No recipe found for food item ${foodItemId} or no ingredients defined`);
      return false;
    }

    console.log(`Deducting ingredients for ${quantity} orders of food item ${foodItemId}`);
    
    // For each ingredient in the recipe, deduct from stock
    for (const recipeIngredient of recipe.recipe_ingredients) {
      const totalQuantityNeeded = (recipeIngredient.quantity * quantity) / recipe.serves;
      
      // Get current stock level
      const { data: ingredient, error: getError } = await supabase
        .from("ingredients")
        .select("stock_quantity")
        .eq("id", recipeIngredient.ingredient_id)
        .single();

      if (getError) {
        console.error(`Error getting ingredient ${recipeIngredient.ingredient_id}:`, getError);
        continue;
      }

      const currentStock = ingredient.stock_quantity || 0;
      const newStock = Math.max(0, currentStock - totalQuantityNeeded);

      console.log(`Ingredient ${recipeIngredient.ingredient_id}: Current stock ${currentStock}, Needed: ${totalQuantityNeeded}, New stock: ${newStock}`);
      
      // Update the stock
      const { error: updateError } = await supabase
        .from("ingredients")
        .update({ stock_quantity: newStock })
        .eq("id", recipeIngredient.ingredient_id);

      if (updateError) {
        console.error(`Error updating stock for ingredient ${recipeIngredient.ingredient_id}:`, updateError);
        continue;
      }

      // Log the transaction
      await supabase.from("inventory_transactions").insert({
        ingredient_id: recipeIngredient.ingredient_id,
        transaction_type: "consumption",
        quantity: -totalQuantityNeeded,
        previous_quantity: currentStock,
        new_quantity: newStock,
        unit: recipeIngredient.unit,
        notes: `Used in order for food item: ${foodItemId}`,
        reference_id: foodItemId,
        reference_type: "food_item",
        created_by: "order-system"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deducting ingredients from stock:", error);
    return false;
  }
};
