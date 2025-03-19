
import React from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
} from 'recharts';

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

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="$3,248"
          change="+12.5%"
          isPositive={true}
        />
        <StatCard
          title="Active Orders"
          value="18"
          change="+3"
          isPositive={true}
        />
        <StatCard
          title="Staff Present"
          value="8/12"
          change=""
          isPositive={true}
        />
        <StatCard
          title="Inventory Alerts"
          value="3"
          change="+2"
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 card-custom p-4">
          <h3 className="text-lg font-semibold mb-4">Weekly Sales</h3>
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
        </Card>

        <Card className="card-custom p-4">
          <h3 className="text-lg font-semibold mb-4">Popular Menu Items</h3>
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
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-custom">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">Latest orders from customers</p>
          </div>
          <Separator />
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Table</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Amount</th>
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
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:underline">View All Orders</button>
            </div>
          </div>
        </Card>

        <Card className="card-custom">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Inventory Alerts</h3>
            <p className="text-sm text-muted-foreground mb-4">Items running low on stock</p>
          </div>
          <Separator />
          <div className="p-4">
            <div className="space-y-3">
              <InventoryAlert item="Berbere Spice" stock="200g" required="1kg" severity="high" />
              <InventoryAlert item="Teff Flour" stock="2kg" required="5kg" severity="medium" />
              <InventoryAlert item="Coffee Beans" stock="1kg" required="2kg" severity="low" />
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:underline">View All Inventory</button>
            </div>
          </div>
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => {
  return (
    <Card className="card-custom">
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-end justify-between mt-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          )}
        </div>
      </div>
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
          {status}
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
        <h4 className="font-medium">{item}</h4>
        <p className="text-sm text-muted-foreground">
          {stock} available / {required} required
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    </div>
  );
};

export default Dashboard;
