
import React, { useState } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeasurementUnit } from "@/types/dishCost";

interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ingredient: { name: string; unit: string; cost: number; category?: string }) => Promise<void>;
  units: MeasurementUnit[];
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ open, onOpenChange, onSubmit, units }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: units.length > 0 ? units[0].abbreviation : "kg",
    cost: 0
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        category: "",
        unit: units.length > 0 ? units[0].abbreviation : "kg",
        cost: 0
      });
    } catch (error) {
      console.error("Error submitting ingredient:", error);
    }
  };

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={<T text="Add Ingredient" />}
      description={<T text="Create a new ingredient with cost information" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Ingredient Name" /></label>
          <Input 
            placeholder={t("e.g., Beef, Onion")} 
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Category" /></label>
          <Input 
            placeholder={t("e.g., Meat, Vegetable")} 
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Unit Type" /></label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleChange("unit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select unit")} />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit.id} value={unit.abbreviation}>
                  {unit.name} ({unit.abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Cost per Unit (£)" /></label>
          <Input 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            value={formData.cost}
            onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button onClick={handleSubmit}>
            <T text="Save Ingredient" />
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default AddIngredientModal;
