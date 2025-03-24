
import React, { useEffect, useState } from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "@/types/dishCost";
import { toast } from "sonner";

interface DishIngredientInputProps {
  ingredientIndex: number;
  ingredient: {
    ingredient_id: string | null;
    ingredient_name: string;
    quantity: number;
    unit_type: string;
    unit_cost: number;
    total_cost: number;
  };
  onChange: (index: number, updatedIngredient: any) => void;
  onRemove: (index: number) => void;
  availableIngredients: Ingredient[];
}

const DishIngredientInput: React.FC<DishIngredientInputProps> = ({
  ingredientIndex,
  ingredient,
  onChange,
  onRemove,
  availableIngredients
}) => {
  const { t } = useLanguage();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    // Find the selected ingredient data from the available ingredients
    if (ingredient.ingredient_id) {
      const found = availableIngredients.find(ing => ing.id === ingredient.ingredient_id);
      if (found) {
        setSelectedIngredient(found);
      }
    }
  }, [ingredient.ingredient_id, availableIngredients]);

  const handleIngredientSelect = (ingredientId: string) => {
    const selected = availableIngredients.find(ing => ing.id === ingredientId);
    
    if (selected) {
      setSelectedIngredient(selected);
      
      // Update the ingredient with defaults from the selected inventory item
      onChange(ingredientIndex, {
        ...ingredient,
        ingredient_id: selected.id,
        ingredient_name: selected.name,
        unit_type: selected.unit,
        unit_cost: selected.cost || 0,
        total_cost: (selected.cost || 0) * ingredient.quantity
      });
    }
  };

  const handleQuantityChange = (value: number) => {
    const quantity = value || 0;
    onChange(ingredientIndex, {
      ...ingredient,
      quantity,
      total_cost: quantity * ingredient.unit_cost
    });
  };

  const handleUnitCostChange = (value: number) => {
    const unitCost = value || 0;
    onChange(ingredientIndex, {
      ...ingredient,
      unit_cost: unitCost,
      total_cost: ingredient.quantity * unitCost
    });
  };

  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
      <div className="col-span-4">
        <Select
          value={ingredient.ingredient_id || "placeholder"}
          onValueChange={handleIngredientSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select ingredient")} />
          </SelectTrigger>
          <SelectContent>
            {availableIngredients.map(ing => (
              <SelectItem key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit}) - £{ing.cost?.toFixed(2) || "0.00"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={ingredient.quantity}
          onChange={(e) => handleQuantityChange(parseFloat(e.target.value))}
          placeholder={t("Quantity")}
        />
      </div>
      
      <div className="col-span-2">
        <Input
          value={selectedIngredient?.unit || ingredient.unit_type}
          disabled
          placeholder={t("Unit")}
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={ingredient.unit_cost}
          onChange={(e) => handleUnitCostChange(parseFloat(e.target.value))}
          placeholder={t("Cost per unit")}
        />
      </div>
      
      <div className="col-span-1 text-right">
        <p className="font-medium">£{ingredient.total_cost.toFixed(2)}</p>
      </div>
      
      <div className="col-span-1 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(ingredientIndex)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default DishIngredientInput;
