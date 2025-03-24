
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/types/dishCost";

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
        <div className="mt-2">
          <InputWithIcon
            placeholder={t("Search ingredients...")}
            value={searchQuery}
            onChange={onSearchChange}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
                      <Button variant="ghost" size="icon" onClick={() => onDeleteIngredient(ingredient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IngredientsTable;
