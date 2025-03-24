
import React, { useState, useEffect } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Flame, Clock, Zap, Droplets, Home, Wrench, Shield, Package, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { DishCost, Ingredient, NewDishCost, NewDishIngredient, NewDishOverheadCost } from "@/types/dishCost";
import { FoodItem } from "@/types/menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DishCostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dishCost: NewDishCost) => Promise<void>;
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
  foodItems
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<NewDishCost>({
    dish_name: "",
    food_item_id: null,
    profit_margin: 70,
    use_manual_price: false,
    manual_price: null,
    ingredients: [],
    overhead_costs: []
  });

  // Initialize form data when dishCost prop changes
  useEffect(() => {
    if (dishCost) {
      setFormData({
        dish_name: dishCost.dish_name,
        food_item_id: dishCost.food_item_id,
        profit_margin: dishCost.profit_margin,
        use_manual_price: dishCost.use_manual_price,
        manual_price: dishCost.manual_price,
        ingredients: dishCost.dish_ingredients?.map(ing => ({
          ingredient_id: ing.ingredient_id,
          ingredient_name: ing.ingredient_name,
          quantity: ing.quantity,
          unit_type: ing.unit_type,
          unit_cost: ing.unit_cost,
          total_cost: ing.total_cost
        })) || [],
        overhead_costs: dishCost.dish_overhead_costs?.map(cost => ({
          category: cost.category,
          description: cost.description,
          cost: cost.cost
        })) || []
      });
    } else {
      // Initialize with default values for new dish cost
      setFormData({
        dish_name: "",
        food_item_id: null,
        profit_margin: 70,
        use_manual_price: false,
        manual_price: null,
        ingredients: [],
        overhead_costs: [
          {
            category: "Labor",
            description: "Chef time",
            cost: 1.50
          }
        ]
      });
    }
  }, [dishCost, open]);

  const addIngredient = () => {
    if (ingredients.length === 0) return;
    
    const defaultIngredient = ingredients[0];
    const newIngredient: NewDishIngredient = {
      ingredient_id: defaultIngredient.id,
      ingredient_name: defaultIngredient.name,
      quantity: 0.5,
      unit_type: defaultIngredient.unit,
      unit_cost: defaultIngredient.cost,
      total_cost: 0.5 * defaultIngredient.cost
    };
    
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));
  };

  const updateIngredient = (index: number, field: keyof NewDishIngredient, value: any) => {
    setFormData(prev => {
      const updatedIngredients = [...prev.ingredients];
      const updatedIngredient = { ...updatedIngredients[index], [field]: value };
      
      if (field === 'ingredient_id') {
        const selectedIngredient = ingredients.find(i => i.id === value);
        if (selectedIngredient) {
          updatedIngredient.ingredient_name = selectedIngredient.name;
          updatedIngredient.unit_type = selectedIngredient.unit;
          updatedIngredient.unit_cost = selectedIngredient.cost;
          updatedIngredient.total_cost = updatedIngredient.quantity * selectedIngredient.cost;
        }
      }
      
      if (field === 'quantity' || field === 'unit_cost') {
        updatedIngredient.total_cost = updatedIngredient.quantity * updatedIngredient.unit_cost;
      }
      
      updatedIngredients[index] = updatedIngredient;
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addOverheadCost = () => {
    // Use a different default to show variety
    const newCost: NewDishOverheadCost = {
      category: "Gas",
      description: "Cooking gas consumption",
      cost: 0.65
    };
    
    setFormData(prev => ({
      ...prev,
      overhead_costs: [...prev.overhead_costs, newCost]
    }));
  };

  const updateOverheadCost = (index: number, field: keyof NewDishOverheadCost, value: any) => {
    setFormData(prev => {
      const updatedCosts = [...prev.overhead_costs];
      updatedCosts[index] = { ...updatedCosts[index], [field]: value };
      return { ...prev, overhead_costs: updatedCosts };
    });
  };

  const removeOverheadCost = (index: number) => {
    setFormData(prev => ({
      ...prev,
      overhead_costs: prev.overhead_costs.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const totalIngredientCost = formData.ingredients.reduce((sum, ing) => sum + ing.total_cost, 0);
    const totalOverheadCost = formData.overhead_costs.reduce((sum, cost) => sum + cost.cost, 0);
    const totalCost = totalIngredientCost + totalOverheadCost;
    const suggestedPrice = totalCost > 0 ? totalCost / (1 - (formData.profit_margin / 100)) : 0;
    
    return {
      totalIngredientCost,
      totalOverheadCost,
      totalCost,
      suggestedPrice
    };
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting dish cost:", error);
    }
  };

  const totals = calculateTotals();

  // Get overhead cost icon
  const getOverheadIcon = (category: string) => {
    switch (category) {
      case "Labor":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Utilities":
        return <Flame className="h-4 w-4 text-amber-500" />;
      case "Rent":
        return <Home className="h-4 w-4 text-amber-500" />;
      case "Electricity":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "Gas":
        return <Flame className="h-4 w-4 text-amber-500" />;
      case "Water":
        return <Droplets className="h-4 w-4 text-amber-500" />;
      case "Maintenance":
        return <Wrench className="h-4 w-4 text-amber-500" />;
      case "Insurance":
        return <Shield className="h-4 w-4 text-amber-500" />;
      case "Packaging":
        return <Package className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-amber-500" />;
    }
  };

  // Predefined overhead cost categories with descriptions
  const overheadCategories = [
    { value: "Labor", label: t("Labor"), description: t("Staff wages, chef time, etc.") },
    { value: "Gas", label: t("Gas"), description: t("Cooking gas usage") },
    { value: "Electricity", label: t("Electricity"), description: t("Power consumption") },
    { value: "Water", label: t("Water"), description: t("Water usage") },
    { value: "Utilities", label: t("Utilities"), description: t("Combined utility costs") },
    { value: "Rent", label: t("Rent"), description: t("Kitchen space rent") },
    { value: "Maintenance", label: t("Maintenance"), description: t("Equipment maintenance") },
    { value: "Insurance", label: t("Insurance"), description: t("Insurance costs") },
    { value: "Taxes", label: t("Taxes"), description: t("Business taxes") },
    { value: "Packaging", label: t("Packaging"), description: t("Food containers, packaging") },
    { value: "Overhead", label: t("Other Overhead"), description: t("Other overhead expenses") }
  ];

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={dishCost ? <T text="Edit Dish Cost" /> : <T text="Add Dish Cost" />}
      description={<T text="Calculate the cost of a dish including ingredients and operational overheads" />}
      width="2xl"
    >
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <ScrollArea className="flex-grow pr-4 pb-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium"><T text="Dish Name" /></label>
                <Input 
                  placeholder={t("e.g., Beef Tibs, Doro Wat")} 
                  value={formData.dish_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, dish_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium"><T text="Link to Menu Item (Optional)" /></label>
                <Select 
                  value={formData.food_item_id || "none"} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, food_item_id: value === "none" ? null : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a menu item")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="none"><T text="None" /></SelectItem>
                    {foodItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2"><T text="Ingredients" /></h3>
                <div className="space-y-3 mb-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="grid grid-cols-12 gap-2">
                        <div className={isMobile ? "col-span-12" : "col-span-4"}>
                          <label className="text-xs text-muted-foreground"><T text="Ingredient" /></label>
                          <Select 
                            value={ingredient.ingredient_id || "none"} 
                            onValueChange={(value) => updateIngredient(index, 'ingredient_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("Select an ingredient")} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {ingredients.map(ing => (
                                <SelectItem key={ing.id} value={ing.id}>
                                  {ing.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={isMobile ? "col-span-6" : "col-span-2"}>
                          <label className="text-xs text-muted-foreground"><T text="Quantity" /></label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="text-sm" 
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className={isMobile ? "col-span-6" : "col-span-2"}>
                          <label className="text-xs text-muted-foreground"><T text="Unit" /></label>
                          <div className="p-1.5 border rounded text-sm bg-muted">{ingredient.unit_type}</div>
                        </div>
                        <div className={isMobile ? "col-span-6" : "col-span-2"}>
                          <label className="text-xs text-muted-foreground"><T text="Cost per Unit" /></label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="text-sm" 
                            value={ingredient.unit_cost}
                            onChange={(e) => updateIngredient(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className={isMobile ? "col-span-6" : "col-span-1"}>
                          <label className="text-xs text-muted-foreground"><T text="Total" /></label>
                          <div className="p-1.5 border rounded text-sm">£{ingredient.total_cost.toFixed(2)}</div>
                        </div>
                        <div className={isMobile ? "col-span-12 mt-2 flex justify-between" : "col-span-1 flex items-end"}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeIngredient(index)}
                          >
                            <T text="Remove" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={addIngredient}>
                  <Plus className="h-3 w-3 mr-1" />
                  <T text="Add Ingredient" />
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">
                  <span className="flex items-center">
                    <T text="Overhead Costs" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <T text="Include costs such as staff wages, utilities, gas, electricity, and other operational expenses specific to this dish." />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </h3>
                <div className="space-y-3 mb-2">
                  {formData.overhead_costs.map((cost, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="grid grid-cols-12 gap-2">
                        <div className={isMobile ? "col-span-12" : "col-span-4"}>
                          <label className="text-xs text-muted-foreground"><T text="Category" /></label>
                          <Select 
                            value={cost.category} 
                            onValueChange={(value) => updateOverheadCost(index, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {overheadCategories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center">
                                    {getOverheadIcon(category.value)}
                                    <span className="ml-2">{category.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={isMobile ? "col-span-12" : "col-span-5"}>
                          <label className="text-xs text-muted-foreground"><T text="Description" /></label>
                          <Input 
                            className="text-sm" 
                            value={cost.description}
                            onChange={(e) => updateOverheadCost(index, 'description', e.target.value)}
                            placeholder={overheadCategories.find(cat => cat.value === cost.category)?.description || ""}
                          />
                        </div>
                        <div className={isMobile ? "col-span-12" : "col-span-2"}>
                          <label className="text-xs text-muted-foreground"><T text="Cost (£)" /></label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="text-sm" 
                            value={cost.cost}
                            onChange={(e) => updateOverheadCost(index, 'cost', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className={isMobile ? "col-span-12 mt-2 flex justify-between" : "col-span-1 flex items-end"}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeOverheadCost(index)}
                          >
                            <T text="Remove" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={addOverheadCost}>
                  <Plus className="h-3 w-3 mr-1" />
                  <T text="Add Overhead Cost" />
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-3"><T text="Cost Summary" /></h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span><T text="Ingredient Costs" /></span>
                      <span className="font-medium">£{totals.totalIngredientCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span><T text="Overhead Costs" /></span>
                      <span className="font-medium">£{totals.totalOverheadCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-medium">
                      <span><T text="Total Cost" /></span>
                      <span className="text-amber-600">£{totals.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3"><T text="Pricing" /></h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm"><T text="Profit Margin (%)" /></label>
                      <Input 
                        type="number" 
                        value={formData.profit_margin}
                        onChange={(e) => setFormData(prev => ({ ...prev, profit_margin: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="pt-1 flex justify-between text-sm">
                      <span><T text="Suggested Price" /></span>
                      <span className="font-medium text-green-600">£{totals.suggestedPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Switch 
                          id="useManualPrice" 
                          checked={formData.use_manual_price}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_manual_price: checked }))}
                        />
                        <Label htmlFor="useManualPrice" className="text-sm font-medium cursor-pointer">
                          <T text="Use Manual Price" />
                        </Label>
                      </div>
                      
                      {formData.use_manual_price && (
                        <div className="space-y-2">
                          <label className="text-sm"><T text="Manual Price (£)" /></label>
                          <div className="relative">
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              value={formData.manual_price || ""}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                manual_price: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              placeholder="0.00"
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              £
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Action buttons positioned at the bottom */}
        <div className="flex justify-end space-x-2 py-4 bg-background border-t mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button onClick={handleSubmit}>
            <T text="Save Dish Cost" />
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default DishCostModal;
