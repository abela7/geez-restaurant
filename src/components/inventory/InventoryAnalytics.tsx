
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { 
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
  Cell
} from "recharts";

interface InventoryAnalyticsProps {
  analytics: any;
  isLoading: boolean;
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
  analytics,
  isLoading
}) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-3 text-lg"><T text="Loading analytics..." /></p>
      </div>
    );
  }
  
  if (!analytics) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground"><T text="No analytics data available" /></p>
      </div>
    );
  }
  
  // Prepare data for charts
  const categoryData = Object.entries(analytics.categoryCounts || {}).map(([name, count]) => ({
    name,
    count
  }));
  
  const stockStatusData = [
    { name: t("Normal"), value: analytics.stockStatus?.normal || 0 },
    { name: t("Low Stock"), value: analytics.stockStatus?.low || 0 },
    { name: t("Out of Stock"), value: analytics.stockStatus?.outOfStock || 0 }
  ];
  
  const transactionData = Object.entries(analytics.transactionTypes || {}).map(([name, count]) => ({
    name: name === 'purchase' ? t('Purchase') :
          name === 'adjustment' ? t('Adjustment') :
          name === 'waste' ? t('Waste') : 
          name === 'consumption' ? t('Consumption') : name,
    count
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
          <TabsTrigger value="categories"><T text="Categories" /></TabsTrigger>
          <TabsTrigger value="transactions"><T text="Transactions" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle><T text="Stock Status" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stockStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle><T text="Inventory Movement" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={transactionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name={t("Transactions")} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Recent Transactions" /></CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentTransactions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4"><T text="Date" /></th>
                        <th className="text-left py-2 px-4"><T text="Type" /></th>
                        <th className="text-left py-2 px-4"><T text="Quantity" /></th>
                        <th className="text-left py-2 px-4"><T text="Notes" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentTransactions.map((tx: any) => (
                        <tr key={tx.id} className="border-b">
                          <td className="py-2 px-4">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 capitalize">
                            {tx.transaction_type}
                          </td>
                          <td className="py-2 px-4">
                            {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} {tx.unit}
                          </td>
                          <td className="py-2 px-4 truncate max-w-xs">
                            {tx.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  <T text="No recent transactions" />
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Items by Category" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name={t("Item Count")} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Transaction Analysis" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {transactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
