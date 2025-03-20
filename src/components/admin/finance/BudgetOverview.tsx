
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";

// Sample monthly budget vs actual data
const monthlyBudgetData = [
  { month: "Jan", budget: 15000, actual: 14200, variance: -800 },
  { month: "Feb", budget: 15000, actual: 14800, variance: -200 },
  { month: "Mar", budget: 16000, actual: 16500, variance: 500 },
  { month: "Apr", budget: 16000, actual: 17200, variance: 1200 },
  { month: "May", budget: 17000, actual: 16400, variance: -600 },
  { month: "Jun", budget: 18000, actual: 17600, variance: -400 },
  { month: "Jul", budget: 19000, actual: 18300, variance: -700 },
  { month: "Aug", budget: 19000, actual: 4500, variance: -14500 }, // Partial month
];

const chartConfig = {
  budget: { label: "Budget (£)", color: "#CDAF56" },
  actual: { label: "Actual (£)", color: "#DAA520" },
};

const BudgetOverview: React.FC = () => {
  return (
    <>
      <Card className="p-5 mb-6">
        <h3 className="text-lg font-medium mb-4"><T text="Budget vs. Actual (2023)" /></h3>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <BarChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#CDAF56" />
              <Bar dataKey="actual" fill="#DAA520" />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>
      
      <Card className="p-5">
        <h3 className="text-lg font-medium mb-4"><T text="Monthly Variance Analysis" /></h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Month" /></TableHead>
                <TableHead className="text-right"><T text="Budget" /></TableHead>
                <TableHead className="text-right"><T text="Actual" /></TableHead>
                <TableHead className="text-right"><T text="Variance" /></TableHead>
                <TableHead className="text-right"><T text="Variance %" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyBudgetData.map((month, index) => {
                const variancePercent = ((month.actual - month.budget) / month.budget) * 100;
                const isPositive = variancePercent >= 0;
                const isWarning = Math.abs(variancePercent) > 10;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell className="text-right">£{month.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">£{month.actual.toLocaleString()}</TableCell>
                    <TableCell className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{month.variance.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{variancePercent.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {index === monthlyBudgetData.length - 1 ? (
                        <Badge variant="outline"><T text="In Progress" /></Badge>
                      ) : (
                        <Badge variant={isWarning ? "outline" : (isPositive ? "default" : "secondary")}>
                          {isWarning ? (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          ) : isPositive ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {isWarning
                            ? <T text="Significant Variance" />
                            : isPositive
                              ? <T text="Over Budget" />
                              : <T text="Under Budget" />}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default BudgetOverview;
