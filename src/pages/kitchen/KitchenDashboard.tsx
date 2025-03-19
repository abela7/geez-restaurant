
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChefHat, Clock, AlertTriangle, CheckCircle2, XCircle, 
  Timer, Printer, Bell, BellOff, Play, Pause, Coffee
} from 'lucide-react';

// Mock data
const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD-1243',
    table: 'Table 3',
    waiter: 'Abebe',
    status: 'new',
    items: [
      { id: 1, name: 'Doro Wat', quantity: 2, special: 'Extra spicy', timeEstimate: 20 },
      { id: 2, name: 'Injera', quantity: 4, special: '', timeEstimate: 5 },
    ],
    time: '14:32:45',
    priority: 'high'
  },
  {
    id: 2,
    orderNumber: 'ORD-1242',
    table: 'Table 7',
    waiter: 'Tigist',
    status: 'in-progress',
    items: [
      { id: 1, name: 'Tibs', quantity: 1, special: 'Medium spice', timeEstimate: 15 },
      { id: 2, name: 'Shiro', quantity: 1, special: '', timeEstimate: 10 },
      { id: 3, name: 'Injera', quantity: 2, special: '', timeEstimate: 5 },
    ],
    time: '14:30:12',
    priority: 'normal',
    progress: 65
  },
  {
    id: 3,
    orderNumber: 'ORD-1241',
    table: 'Table 2',
    waiter: 'Solomon',
    status: 'in-progress',
    items: [
      { id: 1, name: 'Kitfo', quantity: 2, special: 'Rare', timeEstimate: 12 },
      { id: 2, name: 'Gomen', quantity: 1, special: '', timeEstimate: 8 },
      { id: 3, name: 'Injera', quantity: 3, special: '', timeEstimate: 5 },
    ],
    time: '14:25:33',
    priority: 'normal',
    progress: 85
  },
  {
    id: 4,
    orderNumber: 'ORD-1240',
    table: 'Table 5',
    waiter: 'Abebe',
    status: 'ready',
    items: [
      { id: 1, name: 'Beyaynetu', quantity: 1, special: 'No Alicha', timeEstimate: 18 },
      { id: 2, name: 'Injera', quantity: 2, special: '', timeEstimate: 5 },
    ],
    time: '14:20:45',
    priority: 'normal'
  }
];

// Order status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">New</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">In Progress</Badge>;
    case 'ready':
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Ready</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Priority badges
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-600">High</Badge>;
    case 'normal':
      return <Badge className="bg-yellow-600">Normal</Badge>;
    case 'low':
      return <Badge className="bg-green-600">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const KitchenDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState(mockOrders);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // For demo purposes: Play a sound when a new order comes in
  useEffect(() => {
    if (notificationsEnabled) {
      // In a real app, we would set up a WebSocket or long polling for new orders
      const timer = setTimeout(() => {
        const newOrder = {
          id: orders.length + 1,
          orderNumber: `ORD-${1244 + orders.length}`,
          table: `Table ${Math.floor(Math.random() * 10) + 1}`,
          waiter: ['Abebe', 'Tigist', 'Solomon'][Math.floor(Math.random() * 3)],
          status: 'new',
          items: [
            { 
              id: 1, 
              name: ['Doro Wat', 'Tibs', 'Kitfo', 'Shiro', 'Beyaynetu'][Math.floor(Math.random() * 5)], 
              quantity: Math.floor(Math.random() * 3) + 1, 
              special: '', 
              timeEstimate: Math.floor(Math.random() * 15) + 5 
            },
            { 
              id: 2, 
              name: 'Injera', 
              quantity: Math.floor(Math.random() * 4) + 1, 
              special: '', 
              timeEstimate: 5 
            },
          ],
          time: new Date().toLocaleTimeString(),
          priority: Math.random() > 0.7 ? 'high' : 'normal'
        };
        
        // Don't actually add orders for demo so the UI remains stable
        // setOrders(prev => [newOrder, ...prev]);
        
        // Play a sound
        // In a real app, we would play a sound here
        console.log('New order received: ', newOrder.orderNumber);
      }, 30000); // Every 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [orders, notificationsEnabled]);

  const updateOrderStatus = (id: number, status: 'new' | 'in-progress' | 'ready' | 'cancelled') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { 
              ...order, 
              status, 
              progress: status === 'in-progress' ? (order.progress || 0) : undefined,
              // Add a completed time if marking as ready
              completedTime: status === 'ready' ? new Date().toLocaleTimeString() : undefined
            } 
          : order
      )
    );
  };

  const updateOrderProgress = (id: number, progress: number) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, progress } 
          : order
      )
    );
  };

  // Print a ticket
  const printTicket = (order: typeof mockOrders[0]) => {
    console.log('Printing ticket for order:', order.orderNumber);
    // In a real app, we would send the order to a printer here
    alert(`Printing ticket for order: ${order.orderNumber}`);
  };

  // Count orders by status
  const newOrders = orders.filter(o => o.status === 'new').length;
  const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;

  return (
    <Layout interface="kitchen">
      <PageHeader 
        title="Kitchen Dashboard" 
        description="Manage food orders and preparation"
        actions={
          <Button 
            variant={notificationsEnabled ? "default" : "outline"}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="mr-2 h-4 w-4" />
                <T text="Notifications On" />
              </>
            ) : (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                <T text="Notifications Off" />
              </>
            )}
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center">
            <div className="bg-primary/20 p-2 rounded mr-2">
              <AlertTriangle size={20} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl"><T text="New Orders" /></CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{newOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center">
            <div className="bg-yellow-500/20 p-2 rounded mr-2">
              <Clock size={20} className="text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-xl"><T text="In Progress" /></CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{inProgressOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center">
            <div className="bg-green-500/20 p-2 rounded mr-2">
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <div>
              <CardTitle className="text-xl"><T text="Ready to Serve" /></CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{readyOrders}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">
            <T text="All Orders" />
          </TabsTrigger>
          <TabsTrigger value="new">
            <T text="New" /> {newOrders > 0 && <span className="ml-1 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{newOrders}</span>}
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            <T text="In Progress" />
          </TabsTrigger>
          <TabsTrigger value="ready">
            <T text="Ready" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T text="Order Queue" /></CardTitle>
                <CardDescription>
                  <T text="All orders that need to be prepared" />
                </CardDescription>
              </CardHeader>
              <Separator />
              <ScrollArea className="h-[600px]">
                {orders.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {orders.map(order => (
                      <OrderCard 
                        key={order.id}
                        order={order}
                        updateStatus={updateOrderStatus}
                        updateProgress={updateOrderProgress}
                        printTicket={printTicket}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Coffee size={64} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      <T text="No Orders" />
                    </h3>
                    <p className="text-muted-foreground">
                      <T text="Enjoy your break! New orders will appear here." />
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="new">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T text="New Orders" /></CardTitle>
                <CardDescription>
                  <T text="Orders that need to be started" />
                </CardDescription>
              </CardHeader>
              <Separator />
              <ScrollArea className="h-[600px]">
                {orders.filter(o => o.status === 'new').length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {orders
                      .filter(o => o.status === 'new')
                      .map(order => (
                        <OrderCard 
                          key={order.id}
                          order={order}
                          updateStatus={updateOrderStatus}
                          updateProgress={updateOrderProgress}
                          printTicket={printTicket}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 size={64} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      <T text="All Caught Up!" />
                    </h3>
                    <p className="text-muted-foreground">
                      <T text="No new orders waiting to be prepared." />
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T text="Orders In Progress" /></CardTitle>
                <CardDescription>
                  <T text="Orders currently being prepared" />
                </CardDescription>
              </CardHeader>
              <Separator />
              <ScrollArea className="h-[600px]">
                {orders.filter(o => o.status === 'in-progress').length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {orders
                      .filter(o => o.status === 'in-progress')
                      .map(order => (
                        <OrderCard 
                          key={order.id}
                          order={order}
                          updateStatus={updateOrderStatus}
                          updateProgress={updateOrderProgress}
                          printTicket={printTicket}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ChefHat size={64} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      <T text="Kitchen Clear" />
                    </h3>
                    <p className="text-muted-foreground">
                      <T text="No orders are currently being prepared." />
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ready">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T text="Ready Orders" /></CardTitle>
                <CardDescription>
                  <T text="Orders ready to be served" />
                </CardDescription>
              </CardHeader>
              <Separator />
              <ScrollArea className="h-[600px]">
                {orders.filter(o => o.status === 'ready').length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {orders
                      .filter(o => o.status === 'ready')
                      .map(order => (
                        <OrderCard 
                          key={order.id}
                          order={order}
                          updateStatus={updateOrderStatus}
                          updateProgress={updateOrderProgress}
                          printTicket={printTicket}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 size={64} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      <T text="No Ready Orders" />
                    </h3>
                    <p className="text-muted-foreground">
                      <T text="All completed orders have been served." />
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

interface OrderCardProps {
  order: typeof mockOrders[0];
  updateStatus: (id: number, status: 'new' | 'in-progress' | 'ready' | 'cancelled') => void;
  updateProgress: (id: number, progress: number) => void;
  printTicket: (order: typeof mockOrders[0]) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  updateStatus, 
  updateProgress,
  printTicket
}) => {
  const { t } = useLanguage();
  
  // Calculate total time estimate for order
  const totalTimeEstimate = order.items.reduce((sum, item) => sum + item.timeEstimate, 0);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <CardDescription className="flex gap-2 items-center mt-1">
              <span>{order.table}</span>
              <span>•</span>
              <span>{order.waiter}</span>
              <span>•</span>
              <span>{order.time}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {getPriorityBadge(order.priority)}
            {getStatusBadge(order.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {order.items.map(item => (
            <li key={item.id} className="flex justify-between">
              <div>
                <span className="font-medium">{item.quantity}x {item.name}</span>
                {item.special && (
                  <p className="text-sm text-muted-foreground">{item.special}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item.timeEstimate} min</span>
              </div>
            </li>
          ))}
        </ul>
        
        {order.status === 'in-progress' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm"><T text="Progress" /></span>
              <span className="text-sm">{order.progress}%</span>
            </div>
            <Progress value={order.progress} className="h-2" />
            <div className="flex justify-between mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateProgress(order.id, Math.min(100, (order.progress || 0) + 10))}
              >
                <Plus className="h-4 w-4 mr-1" />
                10%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateProgress(order.id, Math.min(100, (order.progress || 0) + 25))}
              >
                <Plus className="h-4 w-4 mr-1" />
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateProgress(order.id, 100)}
              >
                <T text="Complete" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 bg-muted/30 border-t p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Timer size={16} />
            <span>
              <T text="Est. Time:" /> <span className="font-medium">{totalTimeEstimate} min</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => printTicket(order)}
          >
            <Printer className="h-4 w-4 mr-1" />
            <T text="Print" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full mt-2">
          {order.status === 'new' && (
            <>
              <Button 
                className="flex-1"
                onClick={() => updateStatus(order.id, 'in-progress')}
              >
                <Play className="h-4 w-4 mr-1" />
                <T text="Start" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => updateStatus(order.id, 'cancelled')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                <T text="Cancel" />
              </Button>
            </>
          )}
          
          {order.status === 'in-progress' && (
            <>
              <Button 
                className="flex-1"
                onClick={() => updateStatus(order.id, 'ready')}
                disabled={(order.progress || 0) < 100}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <T text="Mark Ready" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => updateStatus(order.id, 'new')}
              >
                <Pause className="h-4 w-4 mr-1" />
                <T text="Pause" />
              </Button>
            </>
          )}
          
          {order.status === 'ready' && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => updateStatus(order.id, 'in-progress')}
            >
              <T text="Return to Kitchen" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default KitchenDashboard;
