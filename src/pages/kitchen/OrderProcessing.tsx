
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeWithStatus } from '@/components/ui/badge-with-status';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  ChefHat, Clock, AlertTriangle, CheckCircle2, XCircle, 
  Timer, Printer, Bell, BellOff, Play, Pause, Coffee, Plus,
  ArrowUp, ArrowDown, Volume2, VolumeX
} from 'lucide-react';

// Order status types
type OrderStatus = 'new' | 'in-progress' | 'ready' | 'cancelled';

// Order priority types
type OrderPriority = 'high' | 'normal' | 'low';

// Order interface
interface OrderItem {
  id: string;
  foodItem: {
    id: string;
    name: string;
    price: number;
    preparation_time?: number;
  };
  quantity: number;
  special_instructions?: string;
  status?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  table?: string;
  table_id?: string;
  waiter?: string;
  server_id?: string;
  status: OrderStatus;
  items: OrderItem[];
  time: string;
  created_at: string;
  priority: OrderPriority;
  progress?: number;
  completedTime?: string;
  notes?: string;
  order_type: 'dine-in' | 'takeout' | 'delivery';
  customer_name?: string;
}

const OrderProcessing: React.FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Load orders from database
  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription for new orders
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchOrders();
          
          // Play sound for new orders if enabled
          if (payload.eventType === 'INSERT' && soundEnabled && notificationsEnabled) {
            playNewOrderSound();
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled, notificationsEnabled]);
  
  const playNewOrderSound = () => {
    // Implementation of sound playback would go here
    console.log('Playing new order sound');
    // Example:
    // const audio = new Audio('/sounds/new-order.mp3');
    // audio.play();
  };
  
  const fetchOrders = async () => {
    setIsLoading(true);
    
    try {
      // Fetch orders that need kitchen attention (pending or in-progress)
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          order_type,
          customer_name,
          table_id,
          server_id,
          notes,
          order_items (
            id,
            food_item_id,
            quantity,
            unit_price,
            special_instructions,
            status,
            food_items:food_item_id (
              id,
              name,
              price,
              preparation_time
            )
          )
        `)
        .in('status', ['pending', 'preparing', 'ready'])
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (ordersData) {
        // Transform data to match our Order interface
        const transformedOrders: Order[] = ordersData.map(order => {
          // Map order status to our internal status types
          let kitchenStatus: OrderStatus = 'new';
          if (order.status === 'pending') kitchenStatus = 'new';
          if (order.status === 'preparing') kitchenStatus = 'in-progress';
          if (order.status === 'ready') kitchenStatus = 'ready';
          
          // Calculate progress for in-progress orders
          const progress = order.status === 'preparing' ? 
            Math.floor(Math.random() * 80) + 10 : // Mock progress for demo
            undefined;
          
          // Determine priority (could be based on wait time, VIP customers, etc.)
          const orderTime = new Date(order.created_at);
          const currentTime = new Date();
          const waitMinutes = Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
          
          let priority: OrderPriority = 'normal';
          if (waitMinutes > 15) priority = 'high';
          
          return {
            id: order.id,
            orderNumber: `ORD-${order.id.slice(0, 4)}`,
            table: order.table_id ? `Table ${order.table_id}` : undefined,
            table_id: order.table_id,
            server_id: order.server_id,
            status: kitchenStatus,
            items: order.order_items.map((item: any) => ({
              id: item.id,
              foodItem: {
                id: item.food_items.id,
                name: item.food_items.name,
                price: item.unit_price,
                preparation_time: item.food_items.preparation_time || 10 // Default if not set
              },
              quantity: item.quantity,
              special_instructions: item.special_instructions,
              status: item.status
            })),
            time: new Date(order.created_at).toLocaleTimeString(),
            created_at: order.created_at,
            priority,
            progress,
            notes: order.notes,
            order_type: order.order_type as 'dine-in' | 'takeout' | 'delivery',
            customer_name: order.customer_name
          };
        });
        
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    // Map our internal status to database status
    let dbStatus = 'pending';
    if (status === 'in-progress') dbStatus = 'preparing';
    if (status === 'ready') dbStatus = 'ready';
    if (status === 'cancelled') dbStatus = 'cancelled';
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Optimistic update
      setOrders(prev => 
        prev.map(order => 
          order.id === id 
            ? { 
                ...order, 
                status, 
                progress: status === 'in-progress' ? (order.progress || 10) : undefined,
                // Add a completed time if marking as ready
                completedTime: status === 'ready' ? new Date().toLocaleTimeString() : undefined
              } 
            : order
        )
      );
      
      toast.success(`Order ${status === 'in-progress' ? 'started' : status === 'ready' ? 'completed' : 'updated'}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const updateOrderProgress = async (id: string, progress: number) => {
    try {
      // In a real app, we might store the progress in a separate table or as JSON metadata
      
      // Optimistic update
      setOrders(prev => 
        prev.map(order => 
          order.id === id 
            ? { ...order, progress } 
            : order
        )
      );
      
      // When progress reaches 100%, ask if they want to mark as ready
      if (progress >= 100) {
        const shouldComplete = window.confirm(t('Order preparation complete. Mark as ready to serve?'));
        if (shouldComplete) {
          updateOrderStatus(id, 'ready');
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  // Print a ticket
  const printTicket = (order: Order) => {
    console.log('Printing ticket for order:', order.orderNumber);
    toast.success(`Printing ticket for order: ${order.orderNumber}`);
    // In a real app, we would send the order to a printer here
  };

  // Count orders by status
  const newOrders = orders.filter(o => o.status === 'new').length;
  const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;

  // Get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <BadgeWithStatus variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"><T text="New" /></BadgeWithStatus>;
      case 'in-progress':
        return <BadgeWithStatus variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><T text="In Progress" /></BadgeWithStatus>;
      case 'ready':
        return <BadgeWithStatus variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><T text="Ready" /></BadgeWithStatus>;
      case 'cancelled':
        return <BadgeWithStatus variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"><T text="Cancelled" /></BadgeWithStatus>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: OrderPriority) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-600 flex gap-1 items-center">
            <ArrowUp className="h-3 w-3" />
            <T text="High" />
          </Badge>
        );
      case 'normal':
        return <Badge className="bg-yellow-600"><T text="Normal" /></Badge>;
      case 'low':
        return (
          <Badge className="bg-green-600 flex gap-1 items-center">
            <ArrowDown className="h-3 w-3" />
            <T text="Low" />
          </Badge>
        );
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <Layout interface="kitchen">
      <div className="container mx-auto p-4">
        <PageHeader 
          title={<T text="Kitchen Order Processing" />}
          description={<T text="Manage food orders and preparation" />}
          actions={
            <div className="flex gap-2">
              <Button 
                variant={soundEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-2"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <T text="Sound On" />
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <T text="Sound Off" />
                  </>
                )}
              </Button>
              
              <Button 
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="flex items-center gap-2"
              >
                {notificationsEnabled ? (
                  <>
                    <Bell className="h-4 w-4" />
                    <T text="Alerts On" />
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4" />
                    <T text="Alerts Off" />
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="flex items-center gap-2"
              >
                <T text="Refresh" />
              </Button>
            </div>
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
        
        <Tabs defaultValue="all" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
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
            <OrderList 
              orders={orders} 
              updateStatus={updateOrderStatus}
              updateProgress={updateOrderProgress}
              printTicket={printTicket}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="new">
            <OrderList 
              orders={orders.filter(o => o.status === 'new')} 
              updateStatus={updateOrderStatus}
              updateProgress={updateOrderProgress}
              printTicket={printTicket}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="in-progress">
            <OrderList 
              orders={orders.filter(o => o.status === 'in-progress')} 
              updateStatus={updateOrderStatus}
              updateProgress={updateOrderProgress}
              printTicket={printTicket}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="ready">
            <OrderList 
              orders={orders.filter(o => o.status === 'ready')} 
              updateStatus={updateOrderStatus}
              updateProgress={updateOrderProgress}
              printTicket={printTicket}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface OrderListProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  updateProgress: (id: string, progress: number) => void;
  printTicket: (order: Order) => void;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  getPriorityBadge: (priority: OrderPriority) => React.ReactNode;
  isLoading: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  updateStatus, 
  updateProgress, 
  printTicket,
  getStatusBadge,
  getPriorityBadge,
  isLoading
}) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Coffee size={64} className="text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          <T text="No Orders" />
        </h3>
        <p className="text-muted-foreground">
          <T text="All caught up! New orders will appear here." />
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle><T text="Order Queue" /></CardTitle>
          <CardDescription>
            <T text="Orders that need to be prepared" />
          </CardDescription>
        </CardHeader>
        <Separator />
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {orders.map(order => (
              <OrderCard 
                key={order.id}
                order={order}
                updateStatus={updateStatus}
                updateProgress={updateProgress}
                printTicket={printTicket}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
              />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  updateProgress: (id: string, progress: number) => void;
  printTicket: (order: Order) => void;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  getPriorityBadge: (priority: OrderPriority) => React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  updateStatus, 
  updateProgress,
  printTicket,
  getStatusBadge,
  getPriorityBadge
}) => {
  const { t } = useLanguage();
  
  // Calculate total time estimate for order
  const totalTimeEstimate = order.items.reduce((sum, item) => 
    sum + (item.foodItem.preparation_time || 10) * item.quantity, 0);
  
  // Generate a cooking timer based on preparation time
  const getCookingTimer = () => {
    if (order.status !== 'in-progress') return null;
    
    const createdTime = new Date(order.created_at).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = Math.floor((currentTime - createdTime) / 60000);
    
    const remainingMinutes = Math.max(0, totalTimeEstimate - elapsedMinutes);
    
    return (
      <div className="flex items-center gap-1 text-sm">
        <Timer className="h-4 w-4 text-yellow-600" />
        <span className={remainingMinutes === 0 ? "text-red-500 font-bold" : ""}>
          {remainingMinutes === 0 ? 
            t("Time's up!") : 
            `${remainingMinutes} ${t("min remaining")}`}
        </span>
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <CardDescription className="flex gap-2 items-center mt-1">
              {order.order_type === 'dine-in' ? (
                <>
                  <span>{order.table}</span>
                  <span>•</span>
                </>
              ) : (
                <Badge variant="outline" className="mr-1">
                  {order.order_type === 'takeout' ? t('Takeout') : t('Delivery')}
                </Badge>
              )}
              
              {order.customer_name && (
                <>
                  <span>{order.customer_name}</span>
                  <span>•</span>
                </>
              )}
              
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
          {order.items.map((item, index) => (
            <li key={item.id || index} className="flex justify-between">
              <div>
                <span className="font-medium">{item.quantity}x {item.foodItem.name}</span>
                {item.special_instructions && (
                  <p className="text-sm text-muted-foreground">{item.special_instructions}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {item.foodItem.preparation_time || 10} min
                </span>
              </div>
            </li>
          ))}
        </ul>
        
        {order.status === 'in-progress' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{getCookingTimer()}</span>
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
        
        {order.notes && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-sm font-medium"><T text="Notes:" /></p>
            <p className="text-sm">{order.notes}</p>
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
                <T text="Start Cooking" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => updateStatus(order.id, 'cancelled')}
              >
                <XCircle className="h-4 w-4 mr-1" />
                <T text="Cannot Prepare" />
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

export default OrderProcessing;
