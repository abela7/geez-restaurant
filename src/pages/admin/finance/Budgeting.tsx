
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from "recharts";
import { Calendar, Calculator, Download, FileSpreadsheet, Save, Edit2, TrendingDown, TrendingUp, Plus, PieChart, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

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

// Sample expense categories budget data
const expenseBudgetData = [
  { category: "Food Cost", budget: 8500, actual: 8190, percentage: 96 },
  { category: "Labor", budget: 6000, actual: 5460, percentage: 91 },
  { category: "Rent", budget: 3000, actual: 2925, percentage: 98 },
  { category: "Utilities", budget: 1500, actual: 1560, percentage: 104 },
  { category: "Marketing", budget: 800, actual: 780, percentage: 98 },
  { category: "Other", budget: 600, actual: 585, percentage: 98 },
];

// Sample revenue budget data by category
const revenueBudgetData = [
  { category: "Main Dishes", budget: 12000, actual: 11500, percentage: 96 },
  { category: "Appetizers", budget: 5000, actual: 4800, percentage: 96 },
  { category: "Beverages", budget: 4500, actual: 4900, percentage: 109 },
  { category: "Desserts", budget: 2000, actual: 1850, percentage: 93 },
  { category: "Special Menu", budget: 1000, actual: 1350, percentage: 135 },
];

// Sample forecasts
const monthlyForecasts = [
  { month: "Aug", revenue: 19500, expenses: 13200, profit: 6300 },
  { month: "Sep", revenue: 20100, expenses: 13600, profit: 6500 },
  { month: "Oct", revenue: 22500, expenses: 15200, profit: 7300 },
  { month: "Nov", revenue: 24100, expenses: 16300, profit: 7800 },
  { month: "Dec", revenue: 28500, expenses: 19200, profit: 9300 },
];

const Budgeting = () => {
  const [editingMode, setEditingMode] = useState(false);
  const { currentLanguage } = useLanguage();

  const toggleEditMode = () => {
    setEditingMode(!editingMode);
  };

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title="Budgeting & Forecasting" 
          description="Manage restaurant budget, track expenses and forecast revenue"
          actions={
            <>
              <Select defaultValue="august">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january"><T text="January 2023" /></SelectItem>
                  <SelectItem value="february"><T text="February 2023" /></SelectItem>
                  <SelectItem value="march"><T text="March 2023" /></SelectItem>
                  <SelectItem value="april"><T text="April 2023" /></SelectItem>
                  <SelectItem value="may"><T text="May 2023" /></SelectItem>
                  <SelectItem value="june"><T text="June 2023" /></SelectItem>
                  <SelectItem value="july"><T text="July 2023" /></SelectItem>
                  <SelectItem value="august"><T text="August 2023" /></SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                <T text="Export" />
              </Button>
              <Button size="sm" onClick={toggleEditMode}>
                {editingMode ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <T text="Save Changes" />
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    <T text="Edit Budget" />
                  </>
                )}
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-amber-100">
              <Calculator className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Monthly Budget" /></p>
              <h3 className="text-2xl font-bold">$19,000</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="MTD Revenue" /></p>
              <h3 className="text-2xl font-bold">$4,500</h3>
              <p className="text-xs text-muted-foreground"><T text="24% of budget" /></p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-red-100">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="MTD Expenses" /></p>
              <h3 className="text-2xl font-bold">$3,100</h3>
              <p className="text-xs text-muted-foreground"><T text="22% of budget" /></p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-green-100">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="MTD Profit" /></p>
              <h3 className="text-2xl font-bold">$1,400</h3>
              <p className="text-xs text-muted-foreground"><T text="29% of budget" /></p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
            <TabsTrigger value="expenses"><T text="Expenses" /></TabsTrigger>
            <TabsTrigger value="revenue"><T text="Revenue" /></TabsTrigger>
            <TabsTrigger value="forecast"><T text="Forecasting" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card className="p-5 mb-6">
              <h3 className="text-lg font-medium mb-4"><T text="Budget vs. Actual (2023)" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBudgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budget" name="Budget ($)" fill="#CDAF56" />
                    <Bar dataKey="actual" name="Actual ($)" fill="#DAA520" />
                  </BarChart>
                </ResponsiveContainer>
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
                          <TableCell className="text-right">${month.budget.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${month.actual.toLocaleString()}</TableCell>
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
          </TabsContent>
          
          <TabsContent value="expenses">
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
          </TabsContent>
          
          <TabsContent value="revenue">
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
                            `$${category.budget.toLocaleString()}`
                          )}
                        </TableCell>
                        <TableCell className="text-right">${category.actual.toLocaleString()}</TableCell>
                        <TableCell className={`text-right ${isOverBudget ? 'text-green-600' : ''}`}>
                          ${remaining.toLocaleString()}
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
                        `$${revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${revenueBudgetData.reduce((acc, curr) => acc + curr.actual, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${(revenueBudgetData.reduce((acc, curr) => acc + curr.budget, 0) - 
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
          </TabsContent>
          
          <TabsContent value="forecast">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-lg font-medium mb-4"><T text="5-Month Forecast" /></h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyForecasts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#DAA520" activeDot={{ r: 8 }} name="Revenue" />
                      <Line type="monotone" dataKey="expenses" stroke="#4D4052" name="Expenses" />
                      <Line type="monotone" dataKey="profit" stroke="#CDAF56" name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
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
            </div>
            
            <Card className="p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium"><T text="Forecasting Parameters" /></h3>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  <T text="Update Forecast" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium"><T text="Revenue Growth Rate (%)" /></label>
                  <Input type="number" defaultValue="3.5" min="0" max="100" step="0.1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium"><T text="Cost Inflation Rate (%)" /></label>
                  <Input type="number" defaultValue="2.1" min="0" max="100" step="0.1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium"><T text="Labor Cost Increase (%)" /></label>
                  <Input type="number" defaultValue="3.0" min="0" max="100" step="0.1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium"><T text="Seasonal Adjustment (Holiday)" /></label>
                  <Input type="number" defaultValue="15" min="-100" max="100" step="1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium"><T text="New Menu Items Revenue (%)" /></label>
                  <Input type="number" defaultValue="5" min="0" max="100" step="1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium"><T text="Marketing ROI (%)" /></label>
                  <Input type="number" defaultValue="250" min="0" max="1000" step="10" className="mt-1" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Budgeting;
