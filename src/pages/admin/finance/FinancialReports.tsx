
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileSpreadsheet, PieChart, BarChart as BarChartIcon, TrendingUp } from "lucide-react";
import { LineChart, BarChart, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 24500, expenses: 18200, profit: 6300 },
  { month: "Feb", revenue: 26700, expenses: 17800, profit: 8900 },
  { month: "Mar", revenue: 28900, expenses: 19300, profit: 9600 },
  { month: "Apr", revenue: 32100, expenses: 20100, profit: 12000 },
  { month: "May", revenue: 28500, expenses: 17900, profit: 10600 },
  { month: "Jun", revenue: 30200, expenses: 19500, profit: 10700 },
];

const expenseBreakdownData = [
  { name: "Ingredients", value: 42 },
  { name: "Labor", value: 28 },
  { name: "Rent", value: 15 },
  { name: "Utilities", value: 8 },
  { name: "Marketing", value: 4 },
  { name: "Other", value: 3 },
];

const menuPerformanceData = [
  { name: "Doro Wat", revenue: 4200, profit: 2100 },
  { name: "Tibs", revenue: 3800, profit: 1900 },
  { name: "Kitfo", revenue: 3550, profit: 1750 },
  { name: "Shiro", revenue: 3200, profit: 1900 },
  { name: "Beyaynet", revenue: 2800, profit: 1400 },
];

// Sample available reports
const availableReports = [
  { 
    id: 1, 
    name: "Monthly Profit & Loss", 
    description: "Complete monthly P&L statement showing revenue, expenses, and net profit.", 
    type: "financial", 
    frequency: "Monthly",
    lastRun: "Jul 31, 2023" 
  },
  { 
    id: 2, 
    name: "Menu Performance", 
    description: "Analysis of menu item sales, costs, and profit margins to identify best and worst performers.", 
    type: "sales", 
    frequency: "Monthly",
    lastRun: "Jul 31, 2023" 
  },
  { 
    id: 3, 
    name: "Labor Cost Analysis", 
    description: "Staff hours, wages, and labor cost as a percentage of revenue, with overtime analysis.", 
    type: "labor", 
    frequency: "Weekly",
    lastRun: "Aug 6, 2023" 
  },
  { 
    id: 4, 
    name: "Expense Breakdown", 
    description: "Detailed breakdown of all expenses categorized by type with month-over-month comparison.", 
    type: "financial", 
    frequency: "Monthly",
    lastRun: "Jul 31, 2023" 
  },
  { 
    id: 5, 
    name: "Sales by Hour", 
    description: "Analysis of sales performance broken down by hour to identify peak times.", 
    type: "sales", 
    frequency: "Daily",
    lastRun: "Aug 7, 2023" 
  },
];

// Colors for the pie chart
const COLORS = ['#DAA520', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const FinancialReports = () => {
  const [period, setPeriod] = useState("monthly");
  const { currentLanguage } = useLanguage();

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title="Financial Reports" 
          description="Comprehensive financial analysis and reporting"
          actions={
            <>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly"><T text="Weekly" /></SelectItem>
                  <SelectItem value="monthly"><T text="Monthly" /></SelectItem>
                  <SelectItem value="quarterly"><T text="Quarterly" /></SelectItem>
                  <SelectItem value="yearly"><T text="Yearly" /></SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                <T text="Date Range" />
              </Button>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                <T text="Export" />
              </Button>
            </>
          }
        />

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
            <TabsTrigger value="revenue"><T text="Revenue" /></TabsTrigger>
            <TabsTrigger value="expenses"><T text="Expenses" /></TabsTrigger>
            <TabsTrigger value="menu"><T text="Menu Analysis" /></TabsTrigger>
            <TabsTrigger value="reports"><T text="Available Reports" /></TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-lg font-medium mb-4"><T text="Revenue vs Expenses (6 Months)" /></h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
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
                <h3 className="text-lg font-medium mb-4"><T text="Expense Breakdown" /></h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="mt-6 p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Key Financial Metrics" /></h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Metric" /></TableHead>
                    <TableHead><T text="Current Month" /></TableHead>
                    <TableHead><T text="Previous Month" /></TableHead>
                    <TableHead><T text="Change" /></TableHead>
                    <TableHead><T text="YTD" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Total Revenue" /></TableCell>
                    <TableCell>$30,200</TableCell>
                    <TableCell>$28,500</TableCell>
                    <TableCell className="text-green-600">+5.9%</TableCell>
                    <TableCell>$171,900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Total Expenses" /></TableCell>
                    <TableCell>$19,500</TableCell>
                    <TableCell>$17,900</TableCell>
                    <TableCell className="text-red-600">+8.9%</TableCell>
                    <TableCell>$112,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Net Profit" /></TableCell>
                    <TableCell>$10,700</TableCell>
                    <TableCell>$10,600</TableCell>
                    <TableCell className="text-green-600">+0.9%</TableCell>
                    <TableCell>$59,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Profit Margin" /></TableCell>
                    <TableCell>35.4%</TableCell>
                    <TableCell>37.2%</TableCell>
                    <TableCell className="text-red-600">-1.8%</TableCell>
                    <TableCell>34.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Food Cost %" /></TableCell>
                    <TableCell>28.3%</TableCell>
                    <TableCell>27.5%</TableCell>
                    <TableCell className="text-red-600">+0.8%</TableCell>
                    <TableCell>28.1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Labor Cost %" /></TableCell>
                    <TableCell>22.4%</TableCell>
                    <TableCell>21.8%</TableCell>
                    <TableCell className="text-red-600">+0.6%</TableCell>
                    <TableCell>22.1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Revenue by Category" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { category: "Main Dishes", value: 15200 },
                    { category: "Appetizers", value: 6300 },
                    { category: "Beverages", value: 5400 },
                    { category: "Desserts", value: 2100 },
                    { category: "Special Menu", value: 1200 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Revenue ($)" fill="#DAA520" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Expense Categories" /></h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Category" /></TableHead>
                    <TableHead><T text="Current Month" /></TableHead>
                    <TableHead><T text="Previous Month" /></TableHead>
                    <TableHead><T text="Change" /></TableHead>
                    <TableHead><T text="YTD" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Ingredients" /></TableCell>
                    <TableCell>$8,190</TableCell>
                    <TableCell>$7,518</TableCell>
                    <TableCell className="text-red-600">+8.9%</TableCell>
                    <TableCell>$47,376</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Labor" /></TableCell>
                    <TableCell>$5,460</TableCell>
                    <TableCell>$5,202</TableCell>
                    <TableCell className="text-red-600">+5.0%</TableCell>
                    <TableCell>$31,584</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Rent" /></TableCell>
                    <TableCell>$2,925</TableCell>
                    <TableCell>$2,925</TableCell>
                    <TableCell className="text-gray-600">0.0%</TableCell>
                    <TableCell>$17,550</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Utilities" /></TableCell>
                    <TableCell>$1,560</TableCell>
                    <TableCell>$1,432</TableCell>
                    <TableCell className="text-red-600">+8.9%</TableCell>
                    <TableCell>$9,024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Marketing" /></TableCell>
                    <TableCell>$780</TableCell>
                    <TableCell>$716</TableCell>
                    <TableCell className="text-red-600">+8.9%</TableCell>
                    <TableCell>$4,512</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><T text="Other" /></TableCell>
                    <TableCell>$585</TableCell>
                    <TableCell>$537</TableCell>
                    <TableCell className="text-red-600">+8.9%</TableCell>
                    <TableCell>$3,384</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card className="p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Top 5 Menu Items by Revenue" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={menuPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#DAA520" />
                    <Bar dataKey="profit" name="Profit ($)" fill="#CDAF56" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Available Reports" /></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableReports.map((report) => (
                  <Card key={report.id} className="p-4 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{report.name}</h4>
                      <Badge>{report.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-1">
                      {report.description}
                    </p>
                    <div className="text-xs text-muted-foreground mb-3">
                      <T text="Last generated" />: {report.lastRun}
                    </div>
                    <div className="flex justify-between mt-auto">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <T text="View" />
                      </Button>
                      <Button size="sm">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <T text="Download" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FinancialReports;
