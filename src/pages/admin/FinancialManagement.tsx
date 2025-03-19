
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from "recharts";
import { Search, Download, Calendar, DollarSign, CreditCard, Wallet, Printer, BarChart2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample data for revenue
const revenueData = [
  { name: "Jan", revenue: 24500, expenses: 18200, profit: 6300 },
  { name: "Feb", revenue: 26700, expenses: 17800, profit: 8900 },
  { name: "Mar", revenue: 28900, expenses: 19300, profit: 9600 },
  { name: "Apr", revenue: 32100, expenses: 20100, profit: 12000 },
  { name: "May", revenue: 28500, expenses: 17900, profit: 10600 },
  { name: "Jun", revenue: 30200, expenses: 19500, profit: 10700 },
];

// Sample data for payment methods
const paymentMethodData = [
  { name: "Cash", value: 35 },
  { name: "Credit Card", value: 45 },
  { name: "Mobile Payment", value: 15 },
  { name: "Gift Card", value: 5 },
];

// Sample transactions data
const transactions = [
  { id: 1, date: "Jul 12, 2023", type: "Sale", description: "Table 7 - Dinner", amount: 124.50, paymentMethod: "Credit Card" },
  { id: 2, date: "Jul 12, 2023", type: "Sale", description: "Table 3 - Lunch", amount: 86.75, paymentMethod: "Cash" },
  { id: 3, date: "Jul 12, 2023", type: "Expense", description: "Produce Delivery", amount: -235.40, paymentMethod: "Bank Transfer" },
  { id: 4, date: "Jul 11, 2023", type: "Sale", description: "Table 12 - Dinner", amount: 157.25, paymentMethod: "Credit Card" },
  { id: 5, date: "Jul 11, 2023", type: "Sale", description: "Table 5 - Dinner", amount: 94.50, paymentMethod: "Mobile Payment" },
  { id: 6, date: "Jul 11, 2023", type: "Expense", description: "Staff Wages", amount: -1250.00, paymentMethod: "Bank Transfer" },
  { id: 7, date: "Jul 10, 2023", type: "Expense", description: "Utility Bills", amount: -345.60, paymentMethod: "Bank Transfer" },
  { id: 8, date: "Jul 10, 2023", type: "Sale", description: "Catering Order", amount: 750.00, paymentMethod: "Credit Card" },
];

const FinancialManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Financial Management" 
        description="Track and manage restaurant finances and transactions"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              <T text="Date Range" />
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              <T text="Generate Report" />
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export Data" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Today's Revenue" 
          value="$1,245.80" 
          change="+15.2%" 
          isPositive={true}
          icon={<DollarSign size={18} />}
        />
        <StatCard 
          title="This Month" 
          value="$28,450.25" 
          change="+8.4%" 
          isPositive={true}
          icon={<BarChart2 size={18} />}
        />
        <StatCard 
          title="Avg. Order Value" 
          value="$42.30" 
          change="+5.1%" 
          isPositive={true}
          icon={<CreditCard size={18} />}
        />
        <StatCard 
          title="Expenses (MTD)" 
          value="$12,840.60" 
          change="+2.3%" 
          isPositive={false}
          icon={<Wallet size={18} />}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
          <TabsTrigger value="transactions"><T text="Transactions" /></TabsTrigger>
          <TabsTrigger value="reports"><T text="Reports" /></TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-4">
              <h3 className="text-lg font-medium mb-4"><T text="Revenue vs Expenses (6 Months)" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4"><T text="Payment Methods" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethodData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#DAA520" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-9 w-full md:max-w-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <T text="All Transactions" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <T text="Sales Only" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <T text="Expenses Only" />
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Date" /></TableHead>
                  <TableHead><T text="Type" /></TableHead>
                  <TableHead><T text="Description" /></TableHead>
                  <TableHead><T text="Payment Method" /></TableHead>
                  <TableHead className="text-right"><T text="Amount" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "Sale" ? "default" : "destructive"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-destructive' : ''}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6"><T text="Financial Reports" /></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Sales Summary" /></h4>
                  <Badge><T text="Daily" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Detailed breakdown of all sales transactions, grouped by payment method and menu category." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    <T text="Generate" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Expense Report" /></h4>
                  <Badge><T text="Monthly" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Comprehensive list of all expenses, categorized by type with month-over-month comparison." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    <T text="Generate" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Profit & Loss" /></h4>
                  <Badge><T text="Quarterly" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Complete P&L statement showing revenue, expenses, and net profit with previous quarter comparison." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    <T text="Generate" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Menu Performance" /></h4>
                  <Badge><T text="Monthly" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Analysis of menu item sales, costs, and profit margins to identify best and worst performers." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    <T text="Generate" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Labor Cost" /></h4>
                  <Badge><T text="Weekly" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Staff hours, wages, and labor cost as a percentage of revenue, with overtime analysis." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    <T text="Generate" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium"><T text="Custom Report" /></h4>
                  <Badge><T text="Any Period" /></Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  <T text="Create a customized report with your selected metrics, time period, and data visualization." />
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">
                    <T text="Create" />
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
