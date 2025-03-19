
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StatCard } from '@/components/ui/card-stat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BarChart,
  DollarSign,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  Download,
  ChevronDown,
  FilterX,
  LineChart,
  PieChart,
  Filter,
  CircleCheck,
  ChartPie
} from 'lucide-react';
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Sample data for sales charts
const salesData = [
  { name: 'Jan', revenue: 4800, expenses: 3200, profit: 1600 },
  { name: 'Feb', revenue: 5200, expenses: 3300, profit: 1900 },
  { name: 'Mar', revenue: 5800, expenses: 3500, profit: 2300 },
  { name: 'Apr', revenue: 6200, expenses: 3800, profit: 2400 },
  { name: 'May', revenue: 7000, expenses: 4000, profit: 3000 },
  { name: 'Jun', revenue: 7500, expenses: 4200, profit: 3300 },
  { name: 'Jul', revenue: 7800, expenses: 4300, profit: 3500 },
];

// Monthly performance comparison
const monthlyComparison = [
  { name: 'Mon', current: 4000, previous: 3500 },
  { name: 'Tue', current: 3800, previous: 3200 },
  { name: 'Wed', current: 4200, previous: 3700 },
  { name: 'Thu', current: 4500, previous: 3900 },
  { name: 'Fri', current: 5100, previous: 4200 },
  { name: 'Sat', current: 5800, previous: 4800 },
  { name: 'Sun', current: 5200, previous: 4500 },
];

// Top selling items data
const topSellingItems = [
  { name: 'Doro Wat', value: 28 },
  { name: 'Tibs', value: 22 },
  { name: 'Kitfo', value: 17 },
  { name: 'Injera', value: 15 },
  { name: 'Shiro', value: 10 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#DAA520', '#5D4225', '#CDAF56', '#301934', '#4D4052', '#8E9196'];

const SalesAnalytics: React.FC = () => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState('year');
  const [chartType, setChartType] = useState('revenue');

  const renderLegendText = (value: string) => {
    return <span className="text-sm font-medium"><T text={value} /></span>;
  };

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Sales Analytics" />}
        description={<T text="Detailed analysis of restaurant sales performance" />}
        icon={<BarChart className="h-6 w-6" />}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              <T text="Filters" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <T text="Export" />
            </Button>
          </div>
        }
      />

      {/* Summary metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Revenue"
          value="$42,500"
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign className="text-primary" size={18} />}
        />
        <StatCard 
          title="Average Order Value"
          value="$38.75"
          change="+5.2%"
          isPositive={true}
          icon={<ArrowUpRight className="text-green-500" size={18} />}
        />
        <StatCard 
          title="Order Count"
          value="1,248"
          change="+8.7%"
          isPositive={true}
          icon={<TrendingUp className="text-indigo-500" size={18} />}
        />
        <StatCard 
          title="Profit Margin"
          value="32.4%"
          change="+2.1%"
          isPositive={true}
          icon={<ChartPie className="text-purple-500" size={18} />}
        />
      </div>

      {/* Time period selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className={timeframe === 'week' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setTimeframe('week')}>
            <T text="Week" />
          </Button>
          <Button variant="outline" size="sm" className={timeframe === 'month' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setTimeframe('month')}>
            <T text="Month" />
          </Button>
          <Button variant="outline" size="sm" className={timeframe === 'quarter' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setTimeframe('quarter')}>
            <T text="Quarter" />
          </Button>
          <Button variant="outline" size="sm" className={timeframe === 'year' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setTimeframe('year')}>
            <T text="Year" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Jan 1, 2023 - Dec 31, 2023</span>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="Sales Performance" /></CardTitle>
                <CardDescription><T text="Revenue, expenses and profit over time" /></CardDescription>
              </div>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("Select chart type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue"><T text="Revenue Breakdown" /></SelectItem>
                  <SelectItem value="comparison"><T text="Monthly Comparison" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              {chartType === 'revenue' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value) => [`$${value}`, '']}
                    />
                    <Legend formatter={renderLegendText} />
                    <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#CDAF56" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#5D4225" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={monthlyComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value) => [`$${value}`, '']}
                    />
                    <Legend formatter={renderLegendText} />
                    <Line type="monotone" dataKey="current" name="Current Month" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="previous" name="Previous Month" stroke="#4D4052" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle><T text="Top Selling Items" /></CardTitle>
            <CardDescription><T text="Distribution of sales by menu item" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={topSellingItems}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {topSellingItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} orders`, '']}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              <T text="View Detailed Report" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Revenue Distribution */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle><T text="Revenue Breakdown by Category" /></CardTitle>
          <CardDescription><T text="Distribution of revenue across different menu categories" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium"><T text="Main Dishes" /></span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">42%</Badge>
              </div>
              <div className="flex items-center justify-between text-2xl font-bold">
                $17,850
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <T text="Compared to $15,200 last period" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium"><T text="Beverages" /></span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">28%</Badge>
              </div>
              <div className="flex items-center justify-between text-2xl font-bold">
                $11,900
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <T text="Compared to $10,400 last period" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium"><T text="Appetizers" /></span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">18%</Badge>
              </div>
              <div className="flex items-center justify-between text-2xl font-bold">
                $7,650
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <T text="Compared to $6,800 last period" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium"><T text="Desserts" /></span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">12%</Badge>
              </div>
              <div className="flex items-center justify-between text-2xl font-bold">
                $5,100
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <T text="Compared to $4,800 last period" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Goals */}
      <Card>
        <CardHeader>
          <CardTitle><T text="Sales Goals Progress" /></CardTitle>
          <CardDescription><T text="Current progress toward monthly and quarterly targets" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-sm font-medium"><T text="Monthly Revenue Target" /></h4>
                  <p className="text-xs text-muted-foreground"><T text="$45,000 goal for this month" /></p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">$42,500</span>
                  <p className="text-xs text-muted-foreground">94% <CircleCheck className="inline-block h-3 w-3 text-green-500 ml-1" /></p>
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-sm font-medium"><T text="Quarterly Profit Target" /></h4>
                  <p className="text-xs text-muted-foreground"><T text="$50,000 goal for Q3" /></p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">$38,200</span>
                  <p className="text-xs text-muted-foreground">76% <CircleCheck className="inline-block h-3 w-3 text-green-500 ml-1" /></p>
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-sm font-medium"><T text="Annual Growth Target" /></h4>
                  <p className="text-xs text-muted-foreground"><T text="15% increase from previous year" /></p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">12.5%</span>
                  <p className="text-xs text-muted-foreground">83% <CircleCheck className="inline-block h-3 w-3 text-green-500 ml-1" /></p>
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SalesAnalytics;
