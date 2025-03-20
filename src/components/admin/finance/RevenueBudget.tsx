
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample revenue budget data by category
const revenueBudgetData = [
  { category: "Main Dishes", budget: 12000, actual: 11500, percentage: 96 },
  { category: "Appetizers", budget: 5000, actual: 4800, percentage: 96 },
  { category: "Beverages", budget: 4500, actual: 4900, percentage: 109 },
  { category: "Desserts", budget: 2000, actual: 1850, percentage: 93 },
  { category: "Special Menu", budget: 1000, actual: 1350, percentage: 135 },
];

interface RevenueBudgetProps {
  editingMode: boolean;
}

const RevenueBudget: React.FC<RevenueBudgetProps> = ({ editingMode }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Revenue Budget Tracking (August 2023)" /></h3>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Category" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Revenue Category" /></TableHead>
            <TableHead className="text-right"><T text="Budget" /></TableHead>
            <TableHead className="text-right"><T text="Actual (MTD)" /></TableHead>
            <TableHead className="text-right"><T text="Remaining" /></TableHead>
            <TableHead className="w-[200px]"><T text="Progress" /></TableHead>
            {editingMode && <TableHead className="text-right"><T text="Actions" /></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenueBudgetData.map((category, index) => {
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
                    `£${category.budget.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell className="text-right">£{category.actual.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${isOverBudget ? 'text-green-600' : ''}`}>
                  £{remaining.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} />
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
            <TableCell className="font-medium"><T text="Total Revenue" /></TableCell>
            <TableCell className="text-right font-bold">
              {editingMode ? (
                <Input 
                  type="number" 
                  defaultValue={revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0)} 
                  className="w-28 text-right ml-auto font-bold" 
                  disabled
                />
              ) : (
                `£${revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`
              )}
            </TableCell>
            <TableCell className="text-right font-bold">
              £{revenueBudgetData.reduce((acc, curr) => acc + curr.actual, 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-bold">
              £{(revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0) - 
                revenueBudgetData.reduce((acc, curr) => acc + curr.actual, 0)).toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.round((revenueBudgetData.reduce((acc, curr) => acc + curr.actual, 0) / 
                          revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0)) * 100)} 
                />
                <span className="text-sm">
                  {Math.round((revenueBudgetData.reduce((acc, curr) => acc + curr.actual, 0) / 
                          revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0)) * 100)}%
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

export default RevenueBudget;
