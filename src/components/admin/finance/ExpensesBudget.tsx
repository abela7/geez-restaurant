
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample expense categories budget data
const expenseBudgetData = [
  { category: "Food Cost", budget: 8500, actual: 8190, percentage: 96 },
  { category: "Labor", budget: 6000, actual: 5460, percentage: 91 },
  { category: "Rent", budget: 3000, actual: 2925, percentage: 98 },
  { category: "Utilities", budget: 1500, actual: 1560, percentage: 104 },
  { category: "Marketing", budget: 800, actual: 780, percentage: 98 },
  { category: "Other", budget: 600, actual: 585, percentage: 98 },
];

interface ExpensesBudgetProps {
  editingMode: boolean;
}

const ExpensesBudget: React.FC<ExpensesBudgetProps> = ({ editingMode }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Expense Budget Tracking (August 2023)" /></h3>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Category" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Expense Category" /></TableHead>
            <TableHead className="text-right"><T text="Budget" /></TableHead>
            <TableHead className="text-right"><T text="Actual (MTD)" /></TableHead>
            <TableHead className="text-right"><T text="Remaining" /></TableHead>
            <TableHead className="w-[200px]"><T text="Progress" /></TableHead>
            {editingMode && <TableHead className="text-right"><T text="Actions" /></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseBudgetData.map((category, index) => {
            const remaining = category.budget - category.actual;
            const isOverBudget = remaining < 0;
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{category.category}</TableCell>
                <TableCell className="text-right">
                  {editingMode ? (
                    <Input 
                      type="number" 
                      defaultValue={category.budget} 
                      className="w-28 text-right ml-auto" 
                    />
                  ) : (
                    `$${category.budget.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell className="text-right">${category.actual.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ${remaining.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={category.percentage} 
                      className={category.percentage > 100 ? "bg-red-200" : ""}
                    />
                    <span className="text-sm">{category.percentage}%</span>
                  </div>
                </TableCell>
                {editingMode && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <T text="Edit" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          <TableRow className="bg-muted/50">
            <TableCell className="font-medium"><T text="Total Expenses" /></TableCell>
            <TableCell className="text-right font-bold">
              {editingMode ? (
                <Input 
                  type="number" 
                  defaultValue={expenseBudgetData.reduce((acc, curr) => acc + curr.budget, 0)} 
                  className="w-28 text-right ml-auto font-bold" 
                  disabled
                />
              ) : (
                `$${expenseBudgetData.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`
              )}
            </TableCell>
            <TableCell className="text-right font-bold">
              ${expenseBudgetData.reduce((acc, curr) => acc + curr.actual, 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-bold">
              ${(expenseBudgetData.reduce((acc, curr) => acc + curr.budget, 0) - 
                expenseBudgetData.reduce((acc, curr) => acc + curr.actual, 0)).toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.round((expenseBudgetData.reduce((acc, curr) => acc + curr.actual, 0) / 
                          expenseBudgetData.reduce((acc, curr) => acc + curr.budget, 0)) * 100)} 
                />
                <span className="text-sm">
                  {Math.round((expenseBudgetData.reduce((acc, curr) => acc + curr.actual, 0) / 
                          expenseBudgetData.reduce((acc, curr) => acc + curr.budget, 0)) * 100)}%
                </span>
              </div>
            </TableCell>
            {editingMode && <TableCell></TableCell>}
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

export default ExpensesBudget;
