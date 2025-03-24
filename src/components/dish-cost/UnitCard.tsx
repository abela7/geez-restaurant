
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MeasurementUnit } from "@/types/dishCost";

interface UnitCardProps {
  unit: MeasurementUnit;
  onEdit?: (unit: MeasurementUnit) => void;
  onDelete?: (id: string) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ 
  unit, 
  onEdit, 
  onDelete 
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-base">{unit.name}</h3>
            <div className="flex gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(unit)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => {
                    if (window.confirm(t("Are you sure you want to delete this unit?"))) {
                      onDelete(unit.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <Badge className="mr-2">{unit.abbreviation}</Badge>
            <Badge variant="outline">{unit.type}</Badge>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mt-2">
          {unit.description || <T text="No description provided" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitCard;
