
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, Grid2X2, List } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/types/dishCost";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import IngredientCard from "./IngredientCard";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddIngredient: () => void;
  onEditIngredient?: (ingredient: Ingredient) => void;
  onDeleteIngredient?: (id: string) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({
  ingredients,
  searchQuery,
  onSearchChange,
  onAddIngredient,
  onEditIngredient,
  onDeleteIngredient
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  const filteredIngredients = ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ingredient.category && ingredient.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle><T text="Ingredients with Costs" /></CardTitle>
          <Button onClick={onAddIngredient}>
            <Plus className="mr-1 h-4 w-4" />
            <T text="Add Ingredient" />
          </Button>
        </div>
        <CardDescription><T text="Manage ingredients and their costs for dish calculations" /></CardDescription>
        <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
          <InputWithIcon
            placeholder={t("Search ingredients...")}
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
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Unit" /></TableHead>
                  <TableHead><T text="Cost per Unit" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    <TableCell>£{ingredient.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onEditIngredient && (
                          <Button variant="ghost" size="icon" onClick={() => onEditIngredient(ingredient)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteIngredient && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (window.confirm(t("Are you sure you want to delete this ingredient?"))) {
                                onDeleteIngredient(ingredient.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredIngredients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      <T text="No ingredients found" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {filteredIngredients.map((ingredient) => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient}
                onEdit={onEditIngredient}
                onDelete={onDeleteIngredient}
              />
            ))}
            {filteredIngredients.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                <T text="No ingredients found" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientsTable;
