
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from "recharts";
import { Calendar, Download, PieChart, BarChart as BarChartIcon, TrendingUp } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { getExpensesGroupedByCategory, getExpensesByMonth, getProfitMarginData } from "@/services/expenseService";

// Colors for the pie chart
const COLORS = ['#DAA520', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

const ExpenseReporting: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState("year");
  const [expenseByCategory, setExpenseByCategory] = useState<any[]>([]);
  const [expenseByMonth, setExpenseByMonth] = useState<any[]>([]);
  const [profitMarginData, setProfitMarginData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function to capitalize strings safely
  const capitalize = (str: string | number): string => {
    const text = String(str);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoryData, monthlyData, profitData] = await Promise.all([
        getExpensesGroupedByCategory(timePeriod),
        getExpensesByMonth(),
        getProfitMarginData()
      ]);
      
      setExpenseByCategory(categoryData);
      setExpenseByMonth(monthlyData);
      setProfitMarginData(profitData);
    } catch (error) {
      console.error("Error fetching expense report data:", error);
      toast({
        title: "Error",
        description: "Failed to load expense reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded."
    });
    // In a real implementation, this would generate and download a PDF or Excel file
  };

  const handleCustomDateRange = () => {
    toast({
      title: "Custom Date Range",
      description: "Date range picker would open here."
    });
    // In a real implementation, this would open a date picker for custom date selection
  };
  
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
          <Button variant="outline" size="sm" onClick={handleCustomDateRange}>
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Custom" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground"><T text="Loading expense reports..." /></p>
        </div>
      ) : (
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
            {expenseByCategory.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground"><T text="No expense data available for this period" /></p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly">
            {expenseByMonth.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground"><T text="No monthly expense data available" /></p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="profitMargin">
            {profitMarginData.length > 0 ? (
              <>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [
                        name === "margin" ? `${value}%` : `£${value}`,
                        name === "margin" ? t("Profit Margin") : t(typeof name === 'string' ? capitalize(name) : String(name))
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
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground"><T text="No profit margin data available" /></p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};

export default ExpenseReporting;
