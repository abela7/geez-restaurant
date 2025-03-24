
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle, FileText } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { FoodItem } from "@/types/menu";
import FoodItemRecipeButton from "./FoodItemRecipeButton";

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, currentAvailability: boolean) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const { t } = useLanguage();

  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{item.name}</h3>
          <Badge variant="secondary">
            {item.available ? t("Available") : t("Unavailable")}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-amber-600">
            £{item.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleAvailability(item.id, item.available)}
            >
              {item.available ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="sr-only">
                {item.available ? t("Deactivate") : t("Activate")}
              </span>
            </Button>
            <FoodItemRecipeButton foodItem={item} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodItemCard;
