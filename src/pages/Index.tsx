import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { CardStat } from '@/components/ui/card-stat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
  LayoutDashboard, Users, Clock, Utensils, DollarSign, ShoppingCart,
  Bell, CalendarDays, ClipboardList, ArrowUp, ArrowDown, Search,
  PlusCircle, Filter, FileDown, Printer, HelpCircle
} from 'lucide-react';

// Mock Data
const recentOrders = [
  { id: '#1532', table: 'Table 5', items: 3, total: '$52.50', time: '10 mins ago', status: 'Preparing' },
  { id: '#1531', table: 'Table 8', items: 2, total: '$31.20', time: '25 mins ago', status: 'Served' },
  { id: '#1530', table: 'Table 2', items: 5, total: '$75.80', time: '40 mins ago', status: 'Completed' },
  { id: '#1529', table: 'Table 11', items: 1, total: '$18.90', time: '55 mins ago', status: 'Completed' },
  { id: '#1528', table: 'Table 4', items: 4, total: '$62.30', time: '1 hour ago', status: 'Completed' },
];

const activeStaff = [
  { id: 1, name: 'Abebe Kebede', role: 'Server', status: 'Active', since: '08:00 AM' },
  { id: 2, name: 'Sara Hailu', role: 'Chef', status: 'Active', since: '07:30 AM' },
  { id: 3, name: 'Dawit Tesfaye', role: 'Cashier', status: 'Break', since: '08:15 AM' },
  { id: 4, name: 'Tigist Alemu', role: 'Server', status: 'Active', since: '09:00 AM' },
];

const lowStockItems = [
  { id: 1, name: 'Berbere Spice', current: '120g', threshold: '500g', status: 'critical' },
  { id: 2, name: 'Injera', current: '15 pcs', threshold: '30 pcs', status: 'low' },
  { id: 3, name: 'Lamb Meat', current: '2.3 kg', threshold: '5 kg', status: 'low' },
];

const todayStats = {
  sales: { value: '$1,285.24', change: 12.5, isPositive: true },
  orders: { value: '32', change: 8.2, isPositive: true },
  averageOrder: { value: '$40.16', change: 3.7, isPositive: true },
  customers: { value: '48', change: -5.3, isPositive: false }
};

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-cream/50 p-3 rounded-lg border border-sand">
          {/* Left side - Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage><T text="Dashboard" /></BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Right side - Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Search" /></span>
            </Button>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="New Order" /></span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Filter" /></span>
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <FileDown className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Export" /></span>
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Printer className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Print" /></span>
            </Button>
            <Button variant="outline" size="sm" className="hidden lg:flex">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Help" /></span>
            </Button>
          </div>
        </div>
        
        {/* Today's Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardStat
            title={t("Today's Sales")}
            value={todayStats.sales.value}
            icon={<DollarSign className="h-5 w-5" />}
            trend={todayStats.sales.change}
            trendText={`${todayStats.sales.isPositive ? '+' : ''}${todayStats.sales.change}% vs yesterday`}
            positive={todayStats.sales.isPositive}
          />
          <CardStat
            title={t("Orders")}
            value={todayStats.orders.value}
            icon={<ClipboardList className="h-5 w-5" />}
            trend={todayStats.orders.change}
            trendText={`${todayStats.orders.isPositive ? '+' : ''}${todayStats.orders.change}% vs yesterday`}
            positive={todayStats.orders.isPositive}
          />
          <CardStat
            title={t("Average Order")}
            value={todayStats.averageOrder.value}
            icon={<Utensils className="h-5 w-5" />}
            trend={todayStats.averageOrder.change}
            trendText={`${todayStats.averageOrder.isPositive ? '+' : ''}${todayStats.averageOrder.change}% vs yesterday`}
            positive={todayStats.averageOrder.isPositive}
          />
          <CardStat
            title={t("Customers")}
            value={todayStats.customers.value}
            icon={<Users className="h-5 w-5" />}
            trend={todayStats.customers.change}
            trendText={`${todayStats.customers.isPositive ? '+' : ''}${todayStats.customers.change}% vs yesterday`}
            positive={todayStats.customers.isPositive}
          />
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <T text="Overview" />
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ClipboardList className="h-4 w-4 mr-2" />
              <T text="Orders" />
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="h-4 w-4 mr-2" />
              <T text="Staff" />
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <T text="Inventory" />
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent Orders */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle><T text="Recent Orders" /></CardTitle>
                  <CardDescription><T text="Latest customer orders from all tables" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b border-sand pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{order.id} - {order.table}</p>
                            <p className="text-sm text-muted-foreground">{order.items} items · {order.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total}</p>
                            <p className={`text-xs ${
                              order.status === 'Preparing' ? 'text-amber-500' : 
                              order.status === 'Served' ? 'text-blue-500' : 
                              'text-green-500'
                            }`}>{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <T text="View All Orders" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Today's Schedule */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle><T text="Today's Schedule" /></CardTitle>
                  <CardDescription><T text="Upcoming events and shifts" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-2">
                      <p className="text-xs text-muted-foreground">9:00 AM - 11:00 AM</p>
                      <p className="font-medium">Morning Staff Meeting</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-2">
                      <p className="text-xs text-muted-foreground">11:30 AM - 2:30 PM</p>
                      <p className="font-medium">Lunch Service</p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-2">
                      <p className="text-xs text-muted-foreground">3:00 PM</p>
                      <p className="font-medium">Food Delivery</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-2">
                      <p className="text-xs text-muted-foreground">5:30 PM - 10:00 PM</p>
                      <p className="font-medium">Dinner Service</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <T text="View Calendar" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Active Staff */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle><T text="Active Staff" /></CardTitle>
                  <CardDescription><T text="Current staff on duty" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {activeStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-turmeric/20 flex items-center justify-center mr-2">
                              <Users className="h-4 w-4 text-plum" />
                            </div>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-xs text-muted-foreground">{staff.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-medium ${
                              staff.status === 'Active' ? 'text-green-500' : 'text-amber-500'
                            }`}>{staff.status}</p>
                            <p className="text-xs text-muted-foreground">Since {staff.since}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    <T text="Staff Timeline" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Inventory Alerts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle><T text="Inventory Alerts" /></CardTitle>
                  <CardDescription><T text="Items low in stock" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {lowStockItems.map((item) => (
                        <div key={item.id} className="border-l-4 pl-2 py-1" 
                          style={{ 
                            borderColor: item.status === 'critical' ? 'rgb(239, 68, 68)' : 'rgb(234, 179, 8)'
                          }}
                        >
                          <p className="font-medium">{item.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">Current: {item.current}</p>
                            <p className="text-xs text-muted-foreground">Threshold: {item.threshold}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <T text="Manage Inventory" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Other tabs would be implemented here */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle><T text="All Orders" /></CardTitle>
                <CardDescription><T text="Manage and track all restaurant orders" /></CardDescription>
              </CardHeader>
              <CardContent>
                <p><T text="Order management functionality would be implemented here." /></p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle><T text="Staff Management" /></CardTitle>
                <CardDescription><T text="Oversee staff schedules and performance" /></CardDescription>
              </CardHeader>
              <CardContent>
                <p><T text="Staff management functionality would be implemented here." /></p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle><T text="Inventory Management" /></CardTitle>
                <CardDescription><T text="Track stock levels and ingredients" /></CardDescription>
              </CardHeader>
              <CardContent>
                <p><T text="Inventory management functionality would be implemented here." /></p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
