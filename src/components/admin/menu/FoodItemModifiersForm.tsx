
import React, { useEffect } from 'react';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFoodItemModifiers } from "@/hooks/useFoodItemModifiers";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface FoodItemModifiersFormProps {
  foodItemId?: string;
  onModifiersChange?: (selectedModifiers: string[]) => void;
  mode?: 'edit' | 'create';
}

const FoodItemModifiersForm: React.FC<FoodItemModifiersFormProps> = ({ 
  foodItemId,
  onModifiersChange,
  mode = 'edit'
}) => {
  const { t } = useLanguage();
  const { 
    isLoading, 
    availableModifierGroups, 
    selectedModifierGroups, 
    toggleModifierGroup,
    loadModifierData,
    loadAvailableModifierGroups
  } = useFoodItemModifiers(foodItemId);

  useEffect(() => {
    if (mode === 'edit' && foodItemId) {
      loadModifierData();
    } else if (mode === 'create') {
      // Just load available modifier groups without any selection
      loadAvailableModifierGroups();
    }
  }, [foodItemId, mode, loadModifierData, loadAvailableModifierGroups]);

  useEffect(() => {
    if (onModifiersChange) {
      onModifiersChange(selectedModifierGroups);
    }
  }, [selectedModifierGroups, onModifiersChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (availableModifierGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><T text="Modifiers" /></CardTitle>
          <CardDescription><T text="No modifier groups available" /></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <T text="Create modifier groups in the Modifiers section first." />
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Modifiers" /></CardTitle>
        <CardDescription><T text="Select modifiers that can be applied to this food item" /></CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="modifiers">
            <AccordionTrigger>
              <div className="flex items-center">
                <span><T text="Modifiers" /></span>
                {selectedModifierGroups.length > 0 && (
                  <Badge className="ml-2">{selectedModifierGroups.length} <T text="selected" /></Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {availableModifierGroups.map((group) => (
                  <div key={group.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={`modifier-${group.id}`}
                      checked={selectedModifierGroups.includes(group.id)}
                      onCheckedChange={() => toggleModifierGroup(group.id)}
                    />
                    <div>
                      <Label 
                        htmlFor={`modifier-${group.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {group.name} {group.required && <span className="text-amber-500">*</span>}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.options?.length || 0} {t("options available")}
                        {group.required && <span className="ml-1">({t("required")})</span>}
                      </p>
                      {(group.options?.length > 0) && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium"><T text="Options" />: </span>
                          {group.options.map((option, index) => (
                            <span key={option.id}>
                              {option.name}{option.price > 0 ? ` (+£${option.price.toFixed(2)})` : ''}
                              {index < (group.options?.length || 0) - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FoodItemModifiersForm;
