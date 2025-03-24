
import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { IngredientExpense } from "./types";

interface ExpensesGridProps {
  expenses: IngredientExpense[];
  onEdit: (expense: IngredientExpense) => void;
  onDelete: (id: string) => void;
}

const ExpensesGrid: React.FC<ExpensesGridProps> = ({ expenses, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {expenses.map(expense => (
        <Card key={expense.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{expense.ingredient_name}</CardTitle>
              <Badge variant="outline">{format(parseISO(expense.purchase_date), "dd MMM yyyy")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">£{expense.total_cost.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">{expense.supplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{expense.quantity} {expense.unit_abbreviation}</span>
              <span>@ £{expense.price_per_unit.toFixed(2)}/{expense.unit_abbreviation}</span>
            </div>
            {expense.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {expense.notes}
              </p>
            )}
          </CardContent>
          <div className="p-4 pt-0 flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(expense)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              <T text="Edit" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(expense.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <T text="Delete" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpensesGrid;
