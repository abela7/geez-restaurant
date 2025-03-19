
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";
import { FileSpreadsheet } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";

// Sample forecasts
const monthlyForecasts = [
  { month: "Aug", revenue: 19500, expenses: 13200, profit: 6300 },
  { month: "Sep", revenue: 20100, expenses: 13600, profit: 6500 },
  { month: "Oct", revenue: 22500, expenses: 15200, profit: 7300 },
  { month: "Nov", revenue: 24100, expenses: 16300, profit: 7800 },
  { month: "Dec", revenue: 28500, expenses: 19200, profit: 9300 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "#DAA520" },
  expenses: { label: "Expenses", color: "#4D4052" },
  profit: { label: "Profit", color: "#CDAF56" },
};

const ForecastChart: React.FC = () => {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-medium mb-4"><T text="5-Month Forecast" /></h3>
      <div className="h-80">
        <ChartContainer config={chartConfig}>
          <LineChart data={monthlyForecasts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#DAA520" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expenses" stroke="#4D4052" />
            <Line type="monotone" dataKey="profit" stroke="#CDAF56" />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default ForecastChart;
