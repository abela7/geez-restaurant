
import React, { useState } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddUnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (unit: { name: string; abbreviation: string; type: string; description?: string }) => Promise<void>;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    type: "weight",
    description: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        abbreviation: "",
        type: "weight",
        description: ""
      });
    } catch (error) {
      console.error("Error submitting unit:", error);
    }
  };

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={<T text="Add Unit Type" />}
      description={<T text="Create a new measurement unit for ingredients" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Unit Name" /></label>
          <Input 
            placeholder={t("e.g., Kilogram, Liter")} 
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Abbreviation" /></label>
          <Input 
            placeholder={t("e.g., kg, L")} 
            value={formData.abbreviation}
            onChange={(e) => handleChange("abbreviation", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Unit Type" /></label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select unit type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight"><T text="Weight" /></SelectItem>
              <SelectItem value="volume"><T text="Volume" /></SelectItem>
              <SelectItem value="quantity"><T text="Quantity" /></SelectItem>
              <SelectItem value="length"><T text="Length" /></SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium"><T text="Description (Optional)" /></label>
          <Input 
            placeholder={t("Brief description of the unit")} 
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button onClick={handleSubmit}>
            <T text="Save Unit" />
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default AddUnitModal;
