
import React from "react";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { IngredientExpense } from "./types";

interface ExpensesListProps {
  expenses: IngredientExpense[];
  onEdit: (expense: IngredientExpense) => void;
  onDelete: (id: string) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><T text="Ingredient" /></TableHead>
          <TableHead><T text="Quantity" /></TableHead>
          <TableHead><T text="Price/Unit" /></TableHead>
          <TableHead><T text="Total Cost" /></TableHead>
          <TableHead><T text="Supplier" /></TableHead>
          <TableHead><T text="Date" /></TableHead>
          <TableHead className="text-right"><T text="Actions" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.ingredient_name}</TableCell>
            <TableCell>
              {expense.quantity} {expense.unit_abbreviation}
            </TableCell>
            <TableCell>£{expense.price_per_unit.toFixed(2)}/{expense.unit_abbreviation}</TableCell>
            <TableCell>£{expense.total_cost.toFixed(2)}</TableCell>
            <TableCell>{expense.supplier}</TableCell>
            <TableCell>{format(parseISO(expense.purchase_date), "dd MMM yyyy")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(expense)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesList;
