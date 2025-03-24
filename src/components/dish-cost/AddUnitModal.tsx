
import React, { useState, useEffect } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeasurementUnit } from "@/types/dishCost";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AddUnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (unit: { name: string; abbreviation: string; type: string; description?: string }) => Promise<void>;
  unit?: MeasurementUnit;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ open, onOpenChange, onSubmit, unit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    type: "weight",
    description: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unit types with descriptions
  const unitTypes = [
    { value: "weight", label: t("Weight"), description: t("For measuring mass (kg, g, lb, oz)") },
    { value: "volume", label: t("Volume"), description: t("For measuring liquid volume (L, ml, cup)") },
    { value: "quantity", label: t("Quantity"), description: t("For counting items (pcs, dozen)") },
    { value: "length", label: t("Length"), description: t("For measuring size (cm, in)") }
  ];

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        abbreviation: unit.abbreviation,
        type: unit.type,
        description: unit.description || ""
      });
    } else {
      setFormData({
        name: "",
        abbreviation: "",
        type: "weight",
        description: ""
      });
    }
    setErrors({});
  }, [unit, open]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("Unit name is required");
    }
    
    if (!formData.abbreviation.trim()) {
      newErrors.abbreviation = t("Abbreviation is required");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for the field being changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        name: "",
        abbreviation: "",
        type: "weight",
        description: ""
      });
      toast.success(unit ? t("Unit updated successfully") : t("Unit added successfully"));
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting unit:", error);
      toast.error(t("Error saving unit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={unit ? <T text="Edit Unit Type" /> : <T text="Add Unit Type" />}
      description={<T text={unit ? "Modify measurement unit" : "Create a new measurement unit for ingredients"} />}
      width="md"
    >
      <ScrollArea className="pr-4 overflow-y-auto">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Unit Name" /></label>
            <Input 
              placeholder={t("e.g., Kilogram, Liter")} 
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`h-11 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Abbreviation" /></label>
            <Input 
              placeholder={t("e.g., kg, L")} 
              value={formData.abbreviation}
              onChange={(e) => handleChange("abbreviation", e.target.value)}
              className={`h-11 ${errors.abbreviation ? "border-red-500" : ""}`}
            />
            {errors.abbreviation && <p className="text-sm text-red-500">{errors.abbreviation}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Unit Type" /></label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("Select unit type")} />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium"><T text="Description (Optional)" /></label>
            <Input 
              placeholder={t("Brief description of the unit")} 
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11" disabled={isSubmitting}>
              <T text="Cancel" />
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="h-11" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <T text="Saving..." /> : <T text={unit ? "Update Unit" : "Save Unit"} />}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </SideModal>
  );
};

export default AddUnitModal;
