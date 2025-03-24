
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { useLanguage, T } from "@/contexts/LanguageContext";
import DishCostCard from "./DishCostCard";
import { DishCost } from "@/types/dishCost";

interface DishCostListProps {
  dishCosts: DishCost[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddDishCost: () => void;
  onEditDishCost: (dish: DishCost) => void;
  onDeleteDishCost: (id: string) => void;
}

const DishCostList: React.FC<DishCostListProps> = ({
  dishCosts,
  searchQuery,
  onSearchChange,
  onAddDishCost,
  onEditDishCost,
  onDeleteDishCost
}) => {
  const { t } = useLanguage();
  
  const filteredDishCosts = dishCosts.filter(dish => 
    dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle><T text="Dish Cost Analysis" /></CardTitle>
          <Button onClick={onAddDishCost}>
            <Plus className="mr-1 h-4 w-4" />
            <T text="Add Dish Cost" />
          </Button>
        </div>
        <CardDescription><T text="Track the costs of ingredients and overhead for each dish" /></CardDescription>
        <div className="mt-2">
          <InputWithIcon
            placeholder={t("Search dishes...")}
            value={searchQuery}
            onChange={onSearchChange}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDishCosts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <T text="No dish costs have been added yet. Click 'Add Dish Cost' to get started." />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDishCosts.map(dish => (
              <DishCostCard 
                key={dish.id} 
                dish={dish} 
                onEdit={onEditDishCost}
                onDelete={onDeleteDishCost}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DishCostList;
