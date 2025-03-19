
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample forecasts
const monthlyForecasts = [
  { month: "Aug", revenue: 19500, expenses: 13200, profit: 6300 },
  { month: "Sep", revenue: 20100, expenses: 13600, profit: 6500 },
  { month: "Oct", revenue: 22500, expenses: 15200, profit: 7300 },
  { month: "Nov", revenue: 24100, expenses: 16300, profit: 7800 },
  { month: "Dec", revenue: 28500, expenses: 19200, profit: 9300 },
];

const ForecastDetails: React.FC = () => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium"><T text="Forecast Details" /></h3>
        <Button size="sm" variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <T text="Export Forecast" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Month" /></TableHead>
            <TableHead className="text-right"><T text="Revenue" /></TableHead>
            <TableHead className="text-right"><T text="Expenses" /></TableHead>
            <TableHead className="text-right"><T text="Profit" /></TableHead>
            <TableHead className="text-right"><T text="Profit Margin" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthlyForecasts.map((month, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{month.month}</TableCell>
              <TableCell className="text-right">${month.revenue.toLocaleString()}</TableCell>
              <TableCell className="text-right">${month.expenses.toLocaleString()}</TableCell>
              <TableCell className="text-right">${month.profit.toLocaleString()}</TableCell>
              <TableCell className="text-right">{((month.profit / month.revenue) * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ForecastDetails;
