
import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChecklistItem } from "@/hooks/useChecklistItems";

type ChecklistItemProps = {
  item: ChecklistItem;
  value: string;
  isCompliant: boolean;
  notes: string;
  onChange: (
    itemId: string,
    updates: { value?: string; isCompliant?: boolean; notes?: string }
  ) => void;
};

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  item,
  value,
  isCompliant,
  notes,
  onChange,
}) => {
  const { t } = useLanguage();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(item.id, { value: e.target.value });
  };

  const handleComplianceChange = (checked: boolean) => {
    onChange(item.id, { isCompliant: checked });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(item.id, { notes: e.target.value });
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-card">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`compliance-${item.id}`}
          checked={isCompliant}
          onCheckedChange={handleComplianceChange}
          className="mt-1"
        />
        <div className="flex-1">
          <Label htmlFor={`compliance-${item.id}`} className="text-base font-medium">
            {item.description}
          </Label>

          {item.requires_value && (
            <div className="mt-2">
              <Label htmlFor={`value-${item.id}`} className="text-sm text-muted-foreground mb-1 block">
                {item.value_type === "temperature" ? (
                  <T text="Record temperature" />
                ) : (
                  <T text="Enter value" />
                )}
              </Label>
              <div className="flex items-center">
                <Input
                  id={`value-${item.id}`}
                  type={item.value_type === "number" ? "number" : "text"}
                  value={value}
                  onChange={handleValueChange}
                  className="max-w-[150px]"
                  placeholder={item.value_type === "temperature" ? "e.g. 4.5" : ""}
                />
                {item.value_unit && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {item.value_unit}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-3">
            <Label htmlFor={`notes-${item.id}`} className="text-sm text-muted-foreground mb-1 block">
              <T text="Notes (if non-compliant)" />
            </Label>
            <Textarea
              id={`notes-${item.id}`}
              value={notes}
              onChange={handleNotesChange}
              placeholder={t("Enter any issues or notes here")}
              className="h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistItemComponent;
