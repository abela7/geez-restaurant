
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from "recharts";
import { Calendar, Download, PieChart, BarChart as BarChartIcon, TrendingUp } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample expense data by category
const expenseByCategory = [
  { name: "Staff Wages", value: 3250 },
  { name: "Rent", value: 2500 },
  { name: "Ingredients", value: 1850 },
  { name: "Utilities", value: 950 },
  { name: "Marketing", value: 650 },
  { name: "Maintenance", value: 420 },
  { name: "Transport", value: 350 },
  { name: "Licenses", value: 300 },
  { name: "Other", value: 280 },
];

// Sample expense data by month
const expenseByMonth = [
  { name: "Jan", fixed: 2800, variable: 2200, operational: 1500, total: 6500 },
  { name: "Feb", fixed: 2800, variable: 2100, operational: 1600, total: 6500 },
  { name: "Mar", fixed: 2800, variable: 2300, operational: 1700, total: 6800 },
  { name: "Apr", fixed: 2800, variable: 2400, operational: 1800, total: 7000 },
  { name: "May", fixed: 2800, variable: 2600, operational: 1900, total: 7300 },
  { name: "Jun", fixed: 2800, variable: 2700, operational: 2000, total: 7500 },
  { name: "Jul", fixed: 2800, variable: 2800, operational: 2100, total: 7700 },
  { name: "Aug", fixed: 2800, variable: 2900, operational: 2200, total: 7900 },
];

// Sample profit margin data
const profitMarginData = [
  { name: "Jan", revenue: 15000, expenses: 6500, profit: 8500, margin: 56.7 },
  { name: "Feb", revenue: 14800, expenses: 6500, profit: 8300, margin: 56.1 },
  { name: "Mar", revenue: 16200, expenses: 6800, profit: 9400, margin: 58.0 },
  { name: "Apr", revenue: 16500, expenses: 7000, profit: 9500, margin: 57.6 },
  { name: "May", revenue: 17100, expenses: 7300, profit: 9800, margin: 57.3 },
  { name: "Jun", revenue: 18200, expenses: 7500, profit: 10700, margin: 58.8 },
  { name: "Jul", revenue: 19000, expenses: 7700, profit: 11300, margin: 59.5 },
  { name: "Aug", revenue: 19500, expenses: 7900, profit: 11600, margin: 59.5 },
];

// Colors for the pie chart
const COLORS = ['#DAA520', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

const ExpenseReporting: React.FC = () => {
  const { t } = useLanguage();
  const [timePeriod, setTimePeriod] = useState("year");
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold"><T text="Expense Analysis" /></h3>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("Time Period")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month"><T text="This Month" /></SelectItem>
              <SelectItem value="quarter"><T text="This Quarter" /></SelectItem>
              <SelectItem value="year"><T text="This Year" /></SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Custom" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="category">
        <TabsList className="mb-4">
          <TabsTrigger value="category">
            <PieChart className="h-4 w-4 mr-2" />
            <T text="By Category" />
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <BarChartIcon className="h-4 w-4 mr-2" />
            <T text="Monthly Trend" />
          </TabsTrigger>
          <TabsTrigger value="profitMargin">
            <TrendingUp className="h-4 w-4 mr-2" />
            <T text="Profit Margin" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="category">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${value}`} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">
              <T text="Total Expenses" />: £{expenseByCategory.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              <T text="Based on data from the selected period" />
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `£${value}`} />
                <Legend />
                <Bar dataKey="fixed" name={t("Fixed Expenses")} stackId="a" fill="#DAA520" />
                <Bar dataKey="variable" name={t("Variable Expenses")} stackId="a" fill="#8884d8" />
                <Bar dataKey="operational" name={t("Operational Expenses")} stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Average Monthly Expenses" /></p>
              <p className="text-lg font-medium">
                £{(expenseByMonth.reduce((sum, item) => sum + item.total, 0) / expenseByMonth.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Highest Month" /></p>
              <p className="text-lg font-medium">
                £{Math.max(...expenseByMonth.map(item => item.total)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Lowest Month" /></p>
              <p className="text-lg font-medium">
                £{Math.min(...expenseByMonth.map(item => item.total)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Monthly Growth" /></p>
              <p className="text-lg font-medium text-amber-600">
                +{((expenseByMonth[expenseByMonth.length - 1].total / expenseByMonth[0].total - 1) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="profitMargin">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === "margin" ? `${value}%` : `£${value}`,
                  name === "margin" ? t("Profit Margin") : t(name.charAt(0).toUpperCase() + name.slice(1))
                ]} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name={t("Revenue")} stroke="#DAA520" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="expenses" name={t("Expenses")} stroke="#FF8042" />
                <Line yAxisId="left" type="monotone" dataKey="profit" name={t("Profit")} stroke="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="margin" name={t("Profit Margin")} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Average Revenue" /></p>
              <p className="text-lg font-medium">
                £{(profitMarginData.reduce((sum, item) => sum + item.revenue, 0) / profitMarginData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Average Expenses" /></p>
              <p className="text-lg font-medium">
                £{(profitMarginData.reduce((sum, item) => sum + item.expenses, 0) / profitMarginData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Average Profit" /></p>
              <p className="text-lg font-medium">
                £{(profitMarginData.reduce((sum, item) => sum + item.profit, 0) / profitMarginData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Average Margin" /></p>
              <p className="text-lg font-medium text-green-600">
                {(profitMarginData.reduce((sum, item) => sum + item.margin, 0) / profitMarginData.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExpenseReporting;
