
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ExpenseWithCategory } from "@/services/finance";

interface ExpenseGridViewProps {
  expenses: ExpenseWithCategory[];
  onEdit: (expense: ExpenseWithCategory) => void;
  onDelete: (id: string) => void;
}

const ExpenseGridView: React.FC<ExpenseGridViewProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {expenses.map((expense) => (
        <Card key={expense.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <CardTitle className="text-base font-medium">{expense.payee}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(parseISO(expense.date), "dd MMM yyyy")}
                </div>
              </div>
              <Badge variant="outline">{expense.category?.name || "Uncategorized"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2 pt-0 flex-grow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">£{parseFloat(expense.amount.toString()).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">{expense.payment_method}</span>
            </div>
            {expense.ingredient_id && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mt-2">
                <ShoppingCart className="h-3 w-3 mr-1" />
                {expense.quantity} {expense.unit}
              </Badge>
            )}
            {expense.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {expense.description}
              </p>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseGridView;
