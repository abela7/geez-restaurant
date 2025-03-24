
import React from "react";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MeasurementUnit, RecipeIngredient } from "./types";

interface ExpenseFormProps {
  formData: {
    ingredient_id: string;
    unit_id: string;
    quantity: number;
    price_per_unit: number;
    total_cost: number;
    supplier: string;
    purchase_date: string;
    notes: string;
  };
  ingredients: RecipeIngredient[];
  units: MeasurementUnit[];
  loading: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  formData,
  ingredients,
  units,
  loading,
  isEditing,
  onClose,
  onSave,
  handleInputChange,
  handleNumberChange,
  handleSelectChange
}) => {
  const { t } = useLanguage();

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? <T text="Edit Expense" /> : <T text="Add Ingredient Expense" />}
        </DialogTitle>
        <DialogDescription>
          <T text="Track expenses for ingredients to calculate accurate recipe costs" />
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="ingredient_id"><T text="Ingredient" /></Label>
          <Select
            value={formData.ingredient_id}
            onValueChange={handleSelectChange("ingredient_id")}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select an ingredient")} />
            </SelectTrigger>
            <SelectContent>
              {ingredients.map(ingredient => (
                <SelectItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity"><T text="Quantity" /></Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.quantity}
              onChange={handleNumberChange("quantity")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit_id"><T text="Unit" /></Label>
            <Select
              value={formData.unit_id}
              onValueChange={handleSelectChange("unit_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("Select a unit")} />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_unit"><T text="Price per Unit (£)" /></Label>
            <Input
              id="price_per_unit"
              name="price_per_unit"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_per_unit}
              onChange={handleNumberChange("price_per_unit")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_cost"><T text="Total Cost (£)" /></Label>
            <Input
              id="total_cost"
              name="total_cost"
              type="number"
              value={formData.total_cost}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplier"><T text="Supplier" /></Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              placeholder={t("Enter supplier name")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_date"><T text="Purchase Date" /></Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes"><T text="Notes (Optional)" /></Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder={t("Enter any additional notes")}
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          <T text="Cancel" />
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? <T text="Update Expense" /> : <T text="Add Expense" />}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ExpenseForm;
