
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Grid2X2, List } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { useLanguage, T } from "@/contexts/LanguageContext";
import DishCostCard from "./DishCostCard";
import { DishCost } from "@/types/dishCost";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  const filteredDishCosts = dishCosts.filter(dish => 
    dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dish.food_item?.name && dish.food_item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (dish.food_item?.menu_categories?.name && dish.food_item.menu_categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
          <InputWithIcon
            placeholder={t("Search dishes...")}
            value={searchQuery}
            onChange={onSearchChange}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
            <ToggleGroupItem value="table" aria-label="List view">
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="List" /></span>
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Grid" /></span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDishCosts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <T text="No dish costs have been added yet. Click 'Add Dish Cost' to get started." />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredDishCosts.map(dish => (
              <DishCostCard 
                key={dish.id} 
                dish={dish} 
                onEdit={onEditDishCost}
                onDelete={onDeleteDishCost}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Dish Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Cost" /></TableHead>
                  <TableHead><T text="Price" /></TableHead>
                  <TableHead><T text="Profit Margin" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDishCosts.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell className="font-medium">{dish.dish_name}</TableCell>
                    <TableCell>{dish.food_item?.menu_categories?.name || "-"}</TableCell>
                    <TableCell>£{dish.total_cost.toFixed(2)}</TableCell>
                    <TableCell>
                      £{dish.use_manual_price && dish.manual_price ? dish.manual_price.toFixed(2) : dish.suggested_price.toFixed(2)}
                    </TableCell>
                    <TableCell>{dish.profit_margin}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEditDishCost(dish)}>
                          <T text="Edit" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => {
                            if (window.confirm(t("Are you sure you want to delete this dish cost?"))) {
                              onDeleteDishCost(dish.id);
                            }
                          }}
                        >
                          <T text="Delete" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DishCostList;
