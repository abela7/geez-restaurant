
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseCategory } from "@/services/finance";

interface CategoryGridViewProps {
  categories: ExpenseCategory[];
  editMode: boolean;
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (id: string) => void;
}

const CategoryGridView: React.FC<CategoryGridViewProps> = ({
  categories,
  editMode,
  onEdit,
  onDelete
}) => {
  const getCategoryTypeBadgeColor = (type: string) => {
    switch (type) {
      case "fixed": return "secondary";
      case "variable": return "default";
      case "operational": return "outline";
      case "discretionary": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{category.name}</CardTitle>
              <Badge variant={getCategoryTypeBadgeColor(category.type)}>
                {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              {category.description || "No description provided"}
            </p>
          </CardContent>
          {editMode && (
            <CardFooter className="pt-0">
              <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(category.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default CategoryGridView;
