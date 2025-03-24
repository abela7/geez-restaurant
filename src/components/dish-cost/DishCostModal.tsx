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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronsUpDown, Calculator, Percent } from "lucide-react";
import { FoodItem } from "@/types/menu";
import { DishCost, Ingredient } from "@/types/dishCost";
import DishIngredientInput from "./DishIngredientInput";
import DishOverheadInput from "./DishOverheadInput";
import { supabase } from "@/integrations/supabase/client";

interface DishCostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => void;
  dishCost?: DishCost;
  ingredients: Ingredient[];
  foodItems: FoodItem[];
}

const DishCostModal: React.FC<DishCostModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  dishCost,
  ingredients,
  foodItems,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [stockIngredients, setStockIngredients] = useState<Ingredient[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    dish_name: "",
    food_item_id: null as string | null,
    profit_margin: 70,
    ingredients: [] as any[],
    overhead_costs: [] as any[],
    manual_price: null as number | null,
    use_manual_price: false,
  });

  // Load stock ingredients from the ingredients table
  useEffect(() => {
    const fetchStockIngredients = async () => {
      try {
        const { data: stockData, error } = await supabase
          .from('ingredients')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setStockIngredients(stockData || []);
      } catch (error) {
        console.error("Error fetching stock ingredients:", error);
      }
    };
    
    fetchStockIngredients();
  }, []);

  useEffect(() => {
    if (dishCost) {
      // Initialize with existing dish cost data
      setFormData({
        dish_name: dishCost.dish_name || "",
        food_item_id: dishCost.food_item_id,
        profit_margin: dishCost.profit_margin || 70,
        ingredients: dishCost.dish_ingredients?.map((ing) => ({
          ingredient_id: ing.ingredient_id,
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity,
          unit_type: ing.unit_type,
          unit_cost: ing.unit_cost,
          total_cost: ing.total_cost,
        })) || [],
        overhead_costs: dishCost.dish_overhead_costs?.map((cost) => ({
          category: cost.category,
          description: cost.description,
          cost: cost.cost,
        })) || [],
        manual_price: dishCost.manual_price,
        use_manual_price: dishCost.use_manual_price,
      });
    } else {
      // Initialize with defaults for new dish cost
      setFormData({
        dish_name: "",
        food_item_id: null,
        profit_margin: 70,
        ingredients: [],
        overhead_costs: [],
        manual_price: null,
        use_manual_price: false,
      });
    }
  }, [dishCost, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddIngredient = () => {
    // Find the first available ingredient from stock
    const firstIngredient = stockIngredients.length > 0 ? stockIngredients[0] : null;
    
    const newIngredient = {
      ingredient_id: firstIngredient?.id || null,
      ingredient_name: firstIngredient?.name || "",
      quantity: 1,
      unit_type: firstIngredient?.unit || "",
      unit_cost: firstIngredient?.cost || 0,
      total_cost: firstIngredient?.cost || 0,
    };
    
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, updatedIngredient: any) => {
    setFormData((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = updatedIngredient;
      return {
        ...prev,
        ingredients: updatedIngredients,
      };
    });
  };

  const handleAddOverheadCost = () => {
    const newCost = {
      category: "Labor",
      description: "",
      cost: 0,
    };
    setFormData((prev) => ({
      ...prev,
      overhead_costs: [...prev.overhead_costs, newCost],
    }));
  };

  const handleRemoveOverheadCost = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      overhead_costs: prev.overhead_costs.filter((_, i) => i !== index),
    }));
  };

  const handleOverheadCostChange = (index: number, updatedCost: any) => {
    setFormData((prev) => {
      const updatedCosts = [...prev.overhead_costs];
      updatedCosts[index] = updatedCost;
      return {
        ...prev,
        overhead_costs: updatedCosts,
      };
    });
  };

  const handleFoodItemChange = (foodItemId: string) => {
    const selectedFoodItem = foodItems.find((item) => item.id === foodItemId);
    if (selectedFoodItem) {
      setFormData((prev) => ({
        ...prev,
        food_item_id: foodItemId,
        dish_name: selectedFoodItem.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting dish cost:", error);
      setIsLoading(false);
    }
  };

  // Calculate totals
  const totalIngredientCost = formData.ingredients.reduce(
    (sum, ing) => sum + ing.total_cost,
    0
  );
  
  const totalOverheadCost = formData.overhead_costs.reduce(
    (sum, cost) => sum + cost.cost,
    0
  );
  
  const totalCost = totalIngredientCost + totalOverheadCost;
  const suggestedPrice = totalCost > 0 ? totalCost / (1 - formData.profit_margin / 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {dishCost ? <T text="Edit Dish Cost" /> : <T text="Add New Dish Cost" />}
          </DialogTitle>
          <DialogDescription>
            <T text="Track the costs and calculate the profitability of each dish" />
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="food_item"><T text="Link to Menu Item" /> <span className="text-muted-foreground text-sm">(optional)</span></Label>
                <Select
                  value={formData.food_item_id || ""}
                  onValueChange={handleFoodItemChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select menu item")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      <T text="No linked menu item" />
                    </SelectItem>
                    {foodItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - £{item.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dish_name"><T text="Dish Name" /></Label>
                <Input
                  id="dish_name"
                  value={formData.dish_name}
                  onChange={(e) => handleChange("dish_name", e.target.value)}
                  required
                />
              </div>
            </div>

            <Tabs
              defaultValue="ingredients"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="ingredients">
                  <ChevronsUpDown className="h-4 w-4 mr-2" />
                  <T text="Ingredients" />
                </TabsTrigger>
                <TabsTrigger value="overhead">
                  <Calculator className="h-4 w-4 mr-2" />
                  <T text="Overhead Costs" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label><T text="Ingredients" /></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddIngredient}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <T text="Add Ingredient" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-3 space-y-2">
                    <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-4"><T text="Ingredient" /></div>
                      <div className="col-span-2"><T text="Quantity" /></div>
                      <div className="col-span-2"><T text="Unit" /></div>
                      <div className="col-span-2"><T text="Cost per unit" /></div>
                      <div className="col-span-1 text-right"><T text="Total" /></div>
                      <div className="col-span-1"></div>
                    </div>

                    {formData.ingredients.length === 0 ? (
                      <div className="py-3 text-center text-muted-foreground">
                        <T text="No ingredients added yet. Click the 'Add Ingredient' button to start." />
                      </div>
                    ) : (
                      formData.ingredients.map((ingredient, index) => (
                        <DishIngredientInput
                          key={index}
                          ingredientIndex={index}
                          ingredient={ingredient}
                          onChange={handleIngredientChange}
                          onRemove={handleRemoveIngredient}
                          availableIngredients={stockIngredients}
                        />
                      ))
                    )}

                    <div className="flex justify-end gap-4 mt-4 pt-3 border-t">
                      <span className="font-medium text-muted-foreground"><T text="Total Ingredients Cost:" /></span>
                      <span className="font-bold">£{totalIngredientCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="overhead" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label><T text="Overhead Costs" /></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOverheadCost}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <T text="Add Overhead" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-3 space-y-2">
                    {formData.overhead_costs.length === 0 ? (
                      <div className="py-3 text-center text-muted-foreground">
                        <T text="No overhead costs added yet. Click the 'Add Overhead' button to start." />
                      </div>
                    ) : (
                      formData.overhead_costs.map((cost, index) => (
                        <DishOverheadInput
                          key={index}
                          costIndex={index}
                          cost={cost}
                          onChange={handleOverheadCostChange}
                          onRemove={handleRemoveOverheadCost}
                        />
                      ))
                    )}

                    <div className="flex justify-end gap-4 mt-4 pt-3 border-t">
                      <span className="font-medium text-muted-foreground"><T text="Total Overhead Cost:" /></span>
                      <span className="font-bold">£{totalOverheadCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="profit_margin">
                  <T text="Profit Margin" /> (%)
                </Label>
                <div className="flex items-center">
                  <Input
                    id="profit_margin"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.profit_margin}
                    onChange={(e) => handleChange("profit_margin", parseInt(e.target.value) || 0)}
                  />
                  <Percent className="h-4 w-4 ml-2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="manual_price">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="use_manual_price"
                      checked={formData.use_manual_price}
                      onChange={(e) => handleChange("use_manual_price", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span><T text="Use Manual Price" /></span>
                  </div>
                </Label>
                <Input
                  id="manual_price"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={!formData.use_manual_price}
                  value={formData.manual_price || ""}
                  onChange={(e) => handleChange("manual_price", parseFloat(e.target.value) || null)}
                  placeholder={t("Enter manual price")}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2"><T text="Cost Summary" /></h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground"><T text="Ingredients Cost" />:</span>
                      <span>£{totalIngredientCost.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground"><T text="Overhead Cost" />:</span>
                      <span>£{totalOverheadCost.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between font-medium pt-1 border-t mt-1">
                      <span><T text="Total Cost" />:</span>
                      <span>£{totalCost.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2"><T text="Pricing" /></h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground"><T text="Profit Margin" />:</span>
                      <span>{formData.profit_margin}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground"><T text="Suggested Price" />:</span>
                      <span>£{suggestedPrice.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between font-medium pt-1 border-t mt-1">
                      <span><T text="Final Price" />:</span>
                      <span>£{formData.use_manual_price && formData.manual_price ? formData.manual_price.toFixed(2) : suggestedPrice.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <T text="Cancel" />
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <T text="Saving..." /> : <T text="Save Dish Cost" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DishCostModal;
