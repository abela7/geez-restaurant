
import React, { useEffect, useState } from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertCircle } from "lucide-react";
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
  const [showUnitMismatch, setShowUnitMismatch] = useState(false);

  useEffect(() => {
    // Find the selected ingredient data from the available ingredients
    if (ingredient.ingredient_id) {
      const found = availableIngredients.find(ing => ing.id === ingredient.ingredient_id);
      if (found) {
        setSelectedIngredient(found);
        
        // Check if there's a unit mismatch
        if (found.unit && ingredient.unit_type && found.unit !== ingredient.unit_type) {
          setShowUnitMismatch(true);
        } else {
          setShowUnitMismatch(false);
        }
      }
    }
  }, [ingredient.ingredient_id, ingredient.unit_type, availableIngredients]);

  const handleIngredientSelect = (ingredientId: string) => {
    const selected = availableIngredients.find(ing => ing.id === ingredientId);
    
    if (selected) {
      setSelectedIngredient(selected);
      setShowUnitMismatch(false);
      
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

  const handleFixUnitMismatch = () => {
    if (selectedIngredient && selectedIngredient.unit) {
      onChange(ingredientIndex, {
        ...ingredient,
        unit_type: selectedIngredient.unit
      });
      setShowUnitMismatch(false);
    }
  };

  return (
    <div className="space-y-2">
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
      
      {showUnitMismatch && (
        <div className="ml-4 flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{t("Unit mismatch detected.")}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-800 hover:text-amber-900 hover:bg-amber-100"
            onClick={handleFixUnitMismatch}
          >
            {t("Fix")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DishIngredientInput;
