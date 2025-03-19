
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/card-stat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart, Legend, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar, Filter, Download, Users, Coffee, DollarSign } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample data for reports
const salesData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 4390 },
  { name: "Sun", value: 3490 },
];

const productData = [
  { name: "Doro Wat", value: 35 },
  { name: "Tibs", value: 25 },
  { name: "Kitfo", value: 15 },
  { name: "Injera", value: 15 },
  { name: "Shiro", value: 10 },
];

const COLORS = ["#DAA520", "#5D4225", "#4D4052", "#301934", "#CDAF56"];

const revenueData = [
  { name: "Jan", revenue: 24000, expenses: 18000 },
  { name: "Feb", revenue: 26000, expenses: 17000 },
  { name: "Mar", revenue: 29000, expenses: 19000 },
  { name: "Apr", revenue: 32000, expenses: 20000 },
  { name: "May", revenue: 28000, expenses: 17500 },
  { name: "Jun", revenue: 30000, expenses: 19200 },
];

const Reports = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Reports & Analytics" 
        description="View and analyze your restaurant's performance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              <T text="Date Range" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              <T text="Filter" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Sales" 
          value="$32,450" 
          change="+12.5%" 
          isPositive={true}
          icon={<DollarSign size={18} />}
        />
        <StatCard 
          title="Customer Count" 
          value="1,245" 
          change="+8.3%" 
          isPositive={true}
          icon={<Users size={18} />}
        />
        <StatCard 
          title="Popular Item" 
          value="Doro Wat" 
          change="+24 orders" 
          isPositive={true}
          icon={<Coffee size={18} />}
        />
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="mb-4">
          <TabsTrigger value="sales"><T text="Sales Analysis" /></TabsTrigger>
          <TabsTrigger value="products"><T text="Popular Products" /></TabsTrigger>
          <TabsTrigger value="revenue"><T text="Revenue vs Expenses" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Daily Sales (Last Week)" /></h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#DAA520" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Most Popular Menu Items" /></h3>
            <div className="h-80 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Revenue vs Expenses (6 Months)" /></h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#DAA520" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#4D4052" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
