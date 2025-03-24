
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/types/dishCost";

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: (id: string) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ 
  ingredient, 
  onEdit, 
  onDelete 
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-base">{ingredient.name}</h3>
            <div className="flex gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(ingredient)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive" 
                  onClick={() => {
                    if (window.confirm(t("Are you sure you want to delete this ingredient?"))) {
                      onDelete(ingredient.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap gap-1">
              {ingredient.category && (
                <Badge variant="outline" className="text-xs">
                  {ingredient.category}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {ingredient.unit}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground"><T text="Cost per Unit" /></span>
            <span className="font-medium">£{ingredient.cost.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
