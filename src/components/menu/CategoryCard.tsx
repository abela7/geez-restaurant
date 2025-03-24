
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { MenuCategory } from "@/types/menu";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: MenuCategory;
  onEdit: (category: MenuCategory) => void;
  onDelete: (category: MenuCategory) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  viewMode: "grid" | "list";
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  viewMode = "grid"
}) => {
  const isListView = viewMode === "list";
  
  return (
    <Card 
      key={category.id} 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md", 
        !category.active && "opacity-60",
        isListView ? "flex items-center" : ""
      )}
    >
      <div className={cn(
        "p-4 w-full",
        isListView && "flex items-center justify-between"
      )}>
        <div className={cn(
          "flex justify-between items-start mb-2",
          isListView && "mb-0 flex-1"
        )}>
          <div className={cn(isListView && "flex items-center gap-4")}>
            <div>
              <h3 className="text-lg font-medium">{category.name}</h3>
              {!isListView && (
                <p className="text-sm text-muted-foreground">
                  {category.itemCount || 0} <T text="items" />
                  {!category.active && (
                    <span className="ml-2 text-red-500">(<T text="Inactive" />)</span>
                  )}
                </p>
              )}
            </div>
            {isListView && (
              <div className="text-sm text-muted-foreground hidden md:block flex-1 max-w-xs">
                {category.description}
              </div>
            )}
            {isListView && (
              <div className="text-sm text-muted-foreground hidden md:block">
                {category.itemCount || 0} <T text="items" />
                {!category.active && (
                  <span className="ml-2 text-red-500">(<T text="Inactive" />)</span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleStatus(category.id, category.active)}
              className="hidden sm:flex items-center gap-1"
            >
              {category.active ? (
                <>
                  <ToggleRight className="h-4 w-4 mr-1" />
                  <T text="Active" />
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 mr-1" />
                  <T text="Inactive" />
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(category)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onToggleStatus(category.id, category.active)}
              className="sm:hidden"
            >
              {category.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {!isListView && category.description && (
          <p className="text-sm mt-2">{category.description}</p>
        )}
      </div>
    </Card>
  );
};
