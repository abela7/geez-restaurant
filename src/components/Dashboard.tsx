
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import TabNav from '@/components/TabNav';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard, DollarSign, Users, Package, FilePieChart, 
  Calendar, Clock, ArrowUp, ArrowDown, Plus, RefreshCw,
  Settings, List, ArrowUpRight, TrendingUp, ChevronRight,
  Store, Utensils, AlertTriangle
} from 'lucide-react';

const salesData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 1900 },
  { name: 'Wed', sales: 2100 },
  { name: 'Thu', sales: 2400 },
  { name: 'Fri', sales: 2800 },
  { name: 'Sat', sales: 3200 },
  { name: 'Sun', sales: 2700 },
];

const menuItems = [
  { name: 'Doro Wat', orders: 45, value: 45 },
  { name: 'Tibs', orders: 38, value: 38 },
  { name: 'Kitfo', orders: 30, value: 30 },
  { name: 'Shiro', orders: 28, value: 28 },
  { name: 'Injera', orders: 25, value: 25 },
];

const COLORS = ['#DAA520', '#CDAF56', '#BE8C3C', '#957C41', '#7E6A3B'];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  const tabs = [
    { icon: <LayoutDashboard size={16} />, label: "Overview", value: "overview" },
    { icon: <DollarSign size={16} />, label: "Sales", value: "sales" },
    { icon: <Utensils size={16} />, label: "Orders", value: "orders" },
    { icon: <Users size={16} />, label: "Staff", value: "staff" },
    { icon: <Package size={16} />, label: "Inventory", value: "inventory" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><T text="Dashboard" /></h1>
          <p className="text-muted-foreground"><T text="Welcome back, Abebe. Here's what's happening today." /></p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex h-8">
            <RefreshCw size={14} className="mr-1.5" />
            <T text="Refresh" />
          </Button>
          <Button size="sm" className="h-8">
            <Plus size={14} className="mr-1.5" />
            <T text="New Order" />
          </Button>
        </div>
      </div>

      <TabNav 
        items={tabs} 
        value={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="$3,248"
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign className="text-primary" size={18} />}
        />
        <StatCard
          title="Active Orders"
          value="18"
          change="+3"
          isPositive={true}
          icon={<Utensils className="text-amber-500" size={18} />}
        />
        <StatCard
          title="Staff Present"
          value="8/12"
          change=""
          isPositive={true}
          icon={<Users className="text-indigo-500" size={18} />}
        />
        <StatCard
          title="Inventory Alerts"
          value="3"
          change="+2"
          isPositive={false}
          icon={<AlertTriangle className="text-rose-500" size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Weekly Sales" /></CardTitle>
                <CardDescription><T text="Revenue performance for the past week" /></CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <FilePieChart size={14} className="mr-1.5" />
                <T text="Report" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }} 
                    formatter={(value) => [`$${value}`, 'Sales']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <CardTitle><T text="Popular Menu Items" /></CardTitle>
            <CardDescription><T text="Top 5 dishes by order volume" /></CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px] mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={menuItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {menuItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} orders`, 'Volume']}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              <List size={14} className="mr-1.5" />
              <T text="View All Menu Items" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Recent Orders" /></CardTitle>
                <CardDescription><T text="Latest orders from customers" /></CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">
                <T text="Today" />
              </Badge>
            </div>
          </CardHeader>
          <ScrollArea className="h-[305px]">
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                <OrderRow id="ORD-1234" table="T3" status="Delivered" amount="$78.50" />
                <OrderRow id="ORD-1233" table="T5" status="Preparing" amount="$124.00" />
                <OrderRow id="ORD-1232" table="T1" status="Ordered" amount="$43.20" />
                <OrderRow id="ORD-1231" table="T7" status="Delivered" amount="$65.75" />
                <OrderRow id="ORD-1230" table="T2" status="Paid" amount="$92.30" />
              </div>
            </CardContent>
          </ScrollArea>
          <CardFooter className="border-t py-3 bg-muted/30">
            <Button variant="ghost" size="sm" className="w-full">
              <T text="View All Orders" />
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden border-border/60">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Inventory Alerts" /></CardTitle>
                <CardDescription><T text="Items running low on stock" /></CardDescription>
              </div>
              <Button size="sm" variant="outline" className="h-8">
                <Store size={14} className="mr-1.5" />
                <T text="Order Supplies" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="h-[260px]">
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <InventoryAlert item="Berbere Spice" stock="200g" required="1kg" severity="high" />
                <InventoryAlert item="Teff Flour" stock="2kg" required="5kg" severity="medium" />
                <InventoryAlert item="Coffee Beans" stock="1kg" required="2kg" severity="low" />
              </div>
            </CardContent>
          </ScrollArea>
          <CardFooter className="border-t py-3 bg-muted/30">
            <Button variant="ghost" size="sm" className="w-full">
              <T text="View Inventory" />
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground mb-1"><T text={title} /></p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          {icon && (
            <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
              {icon}
            </div>
          )}
        </div>
        {change && (
          <div className="mt-4 flex items-center text-xs font-medium">
            {isPositive ? (
              <ArrowUp size={12} className="mr-1 text-green-500" />
            ) : (
              <ArrowDown size={12} className="mr-1 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {change}
            </span>
            <span className="ml-1.5 text-muted-foreground"><T text="vs yesterday" /></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface OrderRowProps {
  id: string;
  table: string;
  status: string;
  amount: string;
}

const OrderRow: React.FC<OrderRowProps> = ({ id, table, status, amount }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Ordered':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium">{id}</p>
        <p className="text-sm text-muted-foreground">{table}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={`${getStatusColor(status)} border-none`}>
          {status}
        </Badge>
        <p className="font-medium text-right">{amount}</p>
      </div>
    </div>
  );
};

interface InventoryAlertProps {
  item: string;
  stock: string;
  required: string;
  severity: 'low' | 'medium' | 'high';
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ item, stock, required, severity }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-50 border-l-4 border-l-rose-500 dark:bg-rose-950/20';
      case 'medium':
        return 'bg-amber-50 border-l-4 border-l-amber-500 dark:bg-amber-950/20';
      case 'low':
        return 'bg-blue-50 border-l-4 border-l-blue-500 dark:bg-blue-950/20';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500 dark:bg-gray-900/20';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-rose-700 dark:text-rose-400';
      case 'medium':
        return 'text-amber-700 dark:text-amber-400';
      case 'low':
        return 'text-blue-700 dark:text-blue-400';
      default:
        return 'text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className={`p-3 rounded-md ${getSeverityColor(severity)}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{item}</h4>
        <Badge variant="outline" className={`${getSeverityText(severity)} border-none font-normal`}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground mt-1 flex justify-between">
        <span>Current: {stock}</span>
        <span>Required: {required}</span>
      </div>
    </div>
  );
};

export default Dashboard;
