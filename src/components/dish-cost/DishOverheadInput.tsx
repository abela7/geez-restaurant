
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface DishOverheadInputProps {
  costIndex: number;
  cost: {
    category: string;
    description: string;
    cost: number;
  };
  onChange: (index: number, updatedCost: any) => void;
  onRemove: (index: number) => void;
}

const DishOverheadInput: React.FC<DishOverheadInputProps> = ({
  costIndex,
  cost,
  onChange,
  onRemove
}) => {
  const { t } = useLanguage();

  const handleCategoryChange = (value: string) => {
    onChange(costIndex, {
      ...cost,
      category: value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(costIndex, {
      ...cost,
      description: e.target.value
    });
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const costValue = parseFloat(e.target.value) || 0;
    onChange(costIndex, {
      ...cost,
      cost: costValue
    });
  };

  // Category options with non-empty values
  const categoryOptions = [
    { value: "labor", label: "Labor" },
    { value: "utilities", label: "Utilities" },
    { value: "rent", label: "Rent" },
    { value: "maintenance", label: "Maintenance" },
    { value: "electricity", label: "Electricity" },
    { value: "gas", label: "Gas" },
    { value: "water", label: "Water" },
    { value: "packaging", label: "Packaging" },
    { value: "insurance", label: "Insurance" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-3">
        <Select
          value={cost.category}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("Select category")} />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <T text={option.label} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-6">
        <Input
          value={cost.description}
          onChange={handleDescriptionChange}
          placeholder={t("Description")}
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={cost.cost}
          onChange={handleCostChange}
          placeholder={t("Cost")}
        />
      </div>
      
      <div className="col-span-1 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(costIndex)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default DishOverheadInput;
