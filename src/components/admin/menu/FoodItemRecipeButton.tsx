
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { FoodItem } from "@/types/menu";
import { RecipeManagementDialog } from "@/components/menu/RecipeManagementDialog";

interface FoodItemRecipeButtonProps {
  foodItem: FoodItem;
}

const FoodItemRecipeButton: React.FC<FoodItemRecipeButtonProps> = ({ foodItem }) => {
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
        <FileText className="h-4 w-4" />
        <span className="sr-only"><T text="Recipe" /></span>
      </Button>
      
      <RecipeManagementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        foodItem={foodItem}
      />
    </>
  );
};

export default FoodItemRecipeButton;
