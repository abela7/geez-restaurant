
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { MenuCategory } from "@/types/menu";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (category: MenuCategory) => void;
  onDelete: (category: MenuCategory) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  return (
    <Card key={category.id} className={`overflow-hidden ${!category.active ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.itemCount} <T text="items" />
              {!category.active && (
                <span className="ml-2 text-red-500">(<T text="Inactive" />)</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onToggleStatus(category.id, category.active)}>
              {category.active ? <T text="Deactivate" /> : <T text="Activate" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(category)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {category.description && (
          <p className="text-sm mt-2">{category.description}</p>
        )}
      </div>
    </Card>
  );
};
