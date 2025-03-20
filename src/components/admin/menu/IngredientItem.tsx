
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface IngredientItemProps {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  stock?: number;
  category?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  id,
  name,
  quantity,
  unit,
  cost,
  stock,
  category,
  onEdit,
  onDelete
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-3 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="mb-2 md:mb-0">
        <h3 className="font-medium text-sm">{name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {category && <Badge variant="outline" className="text-xs px-1.5 py-0">{category}</Badge>}
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {stock !== undefined ? (
              <><T text="Stock" />: {stock} {unit}</>
            ) : (
              <>{quantity} {unit}</>
            )}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            ${cost.toFixed(2)}/{unit}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 md:mt-0">
        {onEdit && (
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onEdit(id)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs"><T text="Edit" /></span>
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => onDelete(id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs"><T text="Delete" /></span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default IngredientItem;
