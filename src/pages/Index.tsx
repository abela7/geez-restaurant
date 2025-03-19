
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from '@/components/ui/card-stat';
import { Separator } from "@/components/ui/separator";
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Plus, Calendar, Users, ChefHat, ShoppingCart, AlertTriangle } from 'lucide-react';

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

// Mock data
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
  { name: 'Doro Wat', orders: 45 },
  { name: 'Tibs', orders: 38 },
  { name: 'Kitfo', orders: 30 },
  { name: 'Shiro', orders: 28 },
  { name: 'Injera', orders: 25 },
];

const staffPresence = [
  { name: 'Present', value: 8 },
  { name: 'Absent', value: 3 },
  { name: 'On Leave', value: 1 },
];

const COLORS = ['#DAA520', '#4D4052', '#CDAF56', '#5D4225'];

const Index: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // For demo purposes, simple check for user in localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      // For demo, create a fake user
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'admin' }));
    }
    setIsAuthenticated(true);
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout interface="admin">
      <PageHeader 
        title="Administrative Dashboard" 
        description="Monitor your restaurant operations in real-time"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <T text="New Report" />
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Sales"
          value="$3,248"
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Active Orders"
          value="18"
          change="+3"
          isPositive={true}
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title="Staff Present"
          value="8/12"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Inventory Alerts"
          value="3"
          change="+2"
          isPositive={false}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <Tabs defaultValue="sales" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="sales">
            <T text="Sales" />
          </TabsTrigger>
          <TabsTrigger value="items">
            <T text="Popular Items" />
          </TabsTrigger>
          <TabsTrigger value="staff">
            <T text="Staff" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                <T text="Weekly Sales" />
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                <T text="Revenue trends for the current week" />
              </p>
            </div>
            <Separator />
            <div className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                      }} 
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#DAA520"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="items">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                <T text="Popular Menu Items" />
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                <T text="Most ordered dishes this month" />
              </p>
            </div>
            <Separator />
            <div className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={menuItems}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="orders" fill="#CDAF56" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="staff">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                <T text="Staff Attendance" />
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                <T text="Current staff presence status" />
              </p>
            </div>
            <Separator />
            <div className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={staffPresence}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {staffPresence.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">
                <T text="Recent Orders" />
              </h3>
              <Button variant="outline" size="sm">
                <T text="View All" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Latest orders from customers" />
            </p>
          </div>
          <Separator />
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm">
                  <th className="pb-2"><T text="Order ID" /></th>
                  <th className="pb-2"><T text="Table" /></th>
                  <th className="pb-2"><T text="Status" /></th>
                  <th className="pb-2 text-right"><T text="Amount" /></th>
                </tr>
              </thead>
              <tbody>
                <OrderRow id="ORD-1234" table="T3" status="Delivered" amount="$78.50" />
                <OrderRow id="ORD-1233" table="T5" status="Preparing" amount="$124.00" />
                <OrderRow id="ORD-1232" table="T1" status="Ordered" amount="$43.20" />
                <OrderRow id="ORD-1231" table="T7" status="Delivered" amount="$65.75" />
                <OrderRow id="ORD-1230" table="T2" status="Paid" amount="$92.30" />
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">
                <T text="Inventory Alerts" />
              </h3>
              <Button variant="outline" size="sm">
                <T text="View All" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              <T text="Items running low on stock" />
            </p>
          </div>
          <Separator />
          <div className="p-4">
            <div className="space-y-3">
              <InventoryAlert item="Berbere Spice" stock="200g" required="1kg" severity="high" />
              <InventoryAlert item="Teff Flour" stock="2kg" required="5kg" severity="medium" />
              <InventoryAlert item="Coffee Beans" stock="1kg" required="2kg" severity="low" />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

// Missing Lucide imports
import { DollarSign, ClipboardList } from 'lucide-react';

interface OrderRowProps {
  id: string;
  table: string;
  status: string;
  amount: string;
}

const OrderRow: React.FC<OrderRowProps> = ({ id, table, status, amount }) => {
  const { t } = useLanguage();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Ordered':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <tr className="border-b border-border text-sm">
      <td className="py-3">{id}</td>
      <td className="py-3">{table}</td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          <T text={status} />
        </span>
      </td>
      <td className="py-3 text-right">{amount}</td>
    </tr>
  );
};

interface InventoryAlertProps {
  item: string;
  stock: string;
  required: string;
  severity: 'low' | 'medium' | 'high';
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ item, stock, required, severity }) => {
  const { t } = useLanguage();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-md">
      <div>
        <h4 className="font-medium"><T text={item} /></h4>
        <p className="text-sm text-muted-foreground">
          {stock} <T text="available" /> / {required} <T text="required" />
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}>
        <T text={severity.charAt(0).toUpperCase() + severity.slice(1)} />
      </span>
    </div>
  );
};

export default Index;
