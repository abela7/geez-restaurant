
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";

// Interface for Ingredient
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit_id: string;
  cost_per_unit: number;
  stock_quantity?: number;
  reorder_level?: number;
  is_allergen?: boolean;
  created_at?: string;
  updated_at?: string;
  units?: object;
}

const IngredientManagement = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Ingredient Management" />}
        description={<T text="Manage recipe ingredients" />}
      />
      
      <MenuNav />
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            <T text="Ingredient management coming soon" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientManagement;
