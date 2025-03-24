
import React from "react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FoodItemRecipeButton from "@/components/admin/menu/FoodItemRecipeButton";
import { FoodItem } from "@/types/menu";

interface MissingRecipesTableProps {
  foodItems: FoodItem[];
  searchQuery: string;
}

const MissingRecipesTable: React.FC<MissingRecipesTableProps> = ({
  foodItems,
  searchQuery
}) => {
  const { t } = useLanguage();
  
  // Filter food items based on search query
  const filteredMissingRecipes = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Food Items Without Recipes" /></CardTitle>
        <CardDescription>
          <T text="Items that need recipes to be created" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredMissingRecipes.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Dish Name" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Current Price" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMissingRecipes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>£{item.price?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      <FoodItemRecipeButton foodItem={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {searchQuery ? 
              <T text="No food items without recipes match your search" /> : 
              <T text="All food items have recipes" />
            }
          </div>
        )}
      </CardContent>
      {filteredMissingRecipes.length > 0 && (
        <CardFooter>
          <Button variant="outline" asChild>
            <Link to="/admin/menu/food">
              <T text="Manage Food Items" />
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MissingRecipesTable;
