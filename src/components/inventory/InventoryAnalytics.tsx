
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface InventoryAnalyticsProps {
  analytics: any;
  isLoading: boolean;
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
  analytics,
  isLoading
}) => {
  const { t } = useLanguage();
  const [chartType, setChartType] = useState<"pie" | "bar" | "area">("pie");
  
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
    { name: t("Normal"), value: analytics.stockStatus?.normal || 0, color: "#16a34a" },
    { name: t("Low Stock"), value: analytics.stockStatus?.low || 0, color: "#eab308" },
    { name: t("Out of Stock"), value: analytics.stockStatus?.outOfStock || 0, color: "#dc2626" }
  ];
  
  const transactionData = Object.entries(analytics.transactionTypes || {}).map(([name, count]) => ({
    name: name === 'purchase' ? t('Purchase') :
          name === 'adjustment' ? t('Adjustment') :
          name === 'waste' ? t('Waste') : 
          name === 'consumption' ? t('Consumption') : name,
    count
  }));
  
  // Calculate value metrics
  const totalItems = analytics.totalItems || 0;
  const lowStockPercentage = totalItems > 0 
    ? Math.round((analytics.stockStatus?.low || 0) / totalItems * 100)
    : 0;
  const outOfStockPercentage = totalItems > 0
    ? Math.round((analytics.stockStatus?.outOfStock || 0) / totalItems * 100)
    : 0;
  
  // Create mock time series data for inventory trends (could be replaced with real data)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });
  
  const mockTrendData = last30Days.map((date, index) => {
    // Generate some mock data with a general upward trend plus some randomness
    const baseValue = 50 + index * 2;
    const randomFactor = Math.random() * 10 - 5; // Random value between -5 and 5
    return {
      date,
      inStock: Math.round(baseValue + randomFactor),
      lowStock: Math.round((index < 15 ? 25 : 15) + Math.random() * 5),
      outOfStock: Math.round(10 - index * 0.2 + Math.random() * 3)
    };
  });
  
  // For the inventory value trend (mock data)
  const mockValueData = last30Days.map((date, index) => {
    const baseValue = 5000 + index * 100;
    const randomFactor = Math.random() * 500 - 250;
    return {
      date,
      totalValue: Math.round(baseValue + randomFactor)
    };
  });
  
  // Generate category distribution for different chart types
  const renderCategoryChart = () => {
    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} ${t("items")}`, t("Count")]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
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
              <Tooltip formatter={(value) => [`${value} ${t("items")}`, t("Count")]} />
              <Legend />
              <Bar dataKey="count" name={t("Items")} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
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
              <Tooltip formatter={(value) => [`${value} ${t("items")}`, t("Count")]} />
              <Legend />
              <Area type="monotone" dataKey="count" name={t("Items")} fill="#8884d8" fillOpacity={0.6} stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };
  
  const COLORS = stockStatusData.map(item => item.color);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle><T text="Total Inventory Items" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalItems}</div>
            <p className="text-muted-foreground mt-1"><T text="Active ingredients in stock" /></p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle><T text="Low Stock Alert" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-500">
              {lowStockPercentage}%
            </div>
            <p className="text-muted-foreground mt-1">
              <T text="of items are below reorder level" />
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                {analytics.stockStatus?.low || 0} <T text="items" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle><T text="Out of Stock" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">
              {outOfStockPercentage}%
            </div>
            <p className="text-muted-foreground mt-1">
              <T text="of items are completely out of stock" />
            </p>
            <div className="mt-2">
              <Badge variant="destructive">
                {analytics.stockStatus?.outOfStock || 0} <T text="items" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
          <TabsTrigger value="stock-status"><T text="Stock Status" /></TabsTrigger>
          <TabsTrigger value="categories"><T text="Categories" /></TabsTrigger>
          <TabsTrigger value="trends"><T text="Trends" /></TabsTrigger>
          <TabsTrigger value="transactions"><T text="Transactions" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle><T text="Stock Status" /></CardTitle>
                <CardDescription><T text="Distribution of inventory stock levels" /></CardDescription>
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardDescription><T text="Types of inventory transactions" /></CardDescription>
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
              <CardDescription><T text="Last 10 inventory transactions" /></CardDescription>
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
                            <Badge variant={
                              tx.transaction_type === 'purchase' ? 'default' :
                              tx.transaction_type === 'adjustment' ? 'outline' :
                              tx.transaction_type === 'waste' ? 'destructive' :
                              'secondary'
                            }>
                              {tx.transaction_type}
                            </Badge>
                          </td>
                          <td className="py-2 px-4">
                            <span className={
                              tx.quantity > 0 ? 'text-green-600 dark:text-green-400' : 
                              tx.quantity < 0 ? 'text-red-600 dark:text-red-400' : ''
                            }>
                              {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} {tx.unit}
                            </span>
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
        
        <TabsContent value="stock-status">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Stock Level Distribution" /></CardTitle>
              <CardDescription><T text="Current status of inventory stock levels" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value, percent }) => 
                        `${name}: ${value} ${t("items")} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ${t("items")}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                {stockStatusData.map((status) => (
                  <div 
                    key={status.name}
                    className="border rounded-lg p-4 text-center"
                    style={{ borderColor: status.color, backgroundColor: `${status.color}10` }}
                  >
                    <div className="text-lg font-medium" style={{ color: status.color }}>
                      {status.name}
                    </div>
                    <div className="text-3xl font-bold mt-2" style={{ color: status.color }}>
                      {status.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <T text="items" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Items by Category" /></CardTitle>
              <CardDescription>
                <T text="Distribution of inventory items across categories" />
                <div className="flex items-center gap-4 mt-2">
                  <ToggleGroup 
                    type="single" 
                    value={chartType} 
                    onValueChange={(value: string) => {
                      if (value) setChartType(value as "pie" | "bar" | "area");
                    }}
                    className="border rounded-md p-1"
                  >
                    <ToggleGroupItem value="pie" className="text-xs px-2 py-1 rounded-sm">
                      <T text="Pie Chart" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="bar" className="text-xs px-2 py-1 rounded-sm">
                      <T text="Bar Chart" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="area" className="text-xs px-2 py-1 rounded-sm">
                      <T text="Area Chart" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryChart()}
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
                {categoryData.map((category) => (
                  <div key={category.name} className="border rounded-md p-3">
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="text-2xl font-bold mt-1">{category.count as number}</div>
                    <div className="text-xs text-muted-foreground">
                      {totalItems > 0 ? Math.round(((category.count as number) / totalItems) * 100) : 0}% <T text="of total" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle><T text="Inventory Level Trends" /></CardTitle>
                <CardDescription><T text="30-day trend of inventory stock levels" /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockTrendData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(tick) => {
                          const date = new Date(tick);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString();
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inStock"
                        name={t("In Stock")}
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="lowStock"
                        name={t("Low Stock")}
                        stroke="#eab308"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="outOfStock"
                        name={t("Out of Stock")}
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle><T text="Inventory Value Trend" /></CardTitle>
                <CardDescription><T text="30-day trend of total inventory value" /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mockValueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(tick) => {
                          const date = new Date(tick);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `£${value}`}
                      />
                      <Tooltip
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString();
                        }}
                        formatter={(value) => [`£${value}`, t("Total Value")]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="totalValue"
                        name={t("Total Inventory Value")}
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle><T text="Transaction Analysis" /></CardTitle>
              <CardDescription><T text="Distribution of inventory transactions by type" /></CardDescription>
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
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {transactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ${t("transactions")}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4"><T text="Transaction Types" /></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {transactionData.map((type) => (
                    <div key={type.name} className="border rounded-lg p-4 text-center">
                      <div className="text-lg font-medium">{type.name}</div>
                      <div className="text-3xl font-bold mt-2">{type.count as number}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <T text="transactions" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
