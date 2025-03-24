
import React, { useState, useEffect } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeasurementUnit, Ingredient } from "@/types/dishCost";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ingredient: { name: string; unit: string; cost: number; category?: string }) => Promise<void>;
  units: MeasurementUnit[];
  ingredient?: Ingredient;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  units,
  ingredient 
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: units.length > 0 ? units[0].abbreviation : "kg",
    cost: 0
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category || "",
        unit: ingredient.unit,
        cost: ingredient.cost
      });
    } else {
      setFormData({
        name: "",
        category: "",
        unit: units.length > 0 ? units[0].abbreviation : "kg",
        cost: 0
      });
    }
    setSearchTerm("");
  }, [ingredient, units, open]);

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

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group units by type
  const groupedUnits = filteredUnits.reduce((acc, unit) => {
    if (!acc[unit.type]) {
      acc[unit.type] = [];
    }
    acc[unit.type].push(unit);
    return acc;
  }, {} as Record<string, MeasurementUnit[]>);

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={ingredient ? <T text="Edit Ingredient" /> : <T text="Add Ingredient" />}
      description={<T text={ingredient ? "Modify ingredient details" : "Create a new ingredient with cost information"} />}
      width="md"
    >
      <ScrollArea className="pr-4 overflow-y-auto">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Ingredient Name" /></label>
            <Input 
              placeholder={t("e.g., Beef, Onion")} 
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Category" /></label>
            <Input 
              placeholder={t("e.g., Meat, Vegetable")} 
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Unit Type" /></label>
            <Select 
              value={formData.unit} 
              onValueChange={(value) => handleChange("unit", value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("Select unit")} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="sticky top-0 bg-background py-1 px-2 border-b mb-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("Search units...")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                </div>
                
                {Object.entries(groupedUnits).map(([type, typeUnits]) => (
                  <div key={type} className="mb-2">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                      {t(type.charAt(0).toUpperCase() + type.slice(1))}
                    </div>
                    {typeUnits.map(unit => (
                      <SelectItem key={unit.id} value={unit.abbreviation}>
                        <div className="flex flex-col">
                          <span>{unit.name} ({unit.abbreviation})</span>
                          {unit.description && (
                            <span className="text-xs text-muted-foreground">{unit.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Cost per Unit (£)" /></label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">£</span>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={formData.cost}
                onChange={(e) => handleChange("cost", parseFloat(e.target.value) || 0)}
                className="pl-7 h-11"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11">
              <T text="Cancel" />
            </Button>
            <Button onClick={handleSubmit} className="h-11">
              <T text={ingredient ? "Update Ingredient" : "Save Ingredient"} />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </SideModal>
  );
};

export default AddIngredientModal;
