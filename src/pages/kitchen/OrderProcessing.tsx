
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Order, OrderItem, DbOrderItem, mapDbOrderItemToOrderItem } from "@/types/order";
import { Clock, CheckCircle2, AlertCircle, TimerReset, Printer, Check } from "lucide-react";

const OrderProcessing: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Query for fetching orders with realtime updates
  const { data: orders, refetch } = useQuery({
    queryKey: ["kitchen-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*, food_item:food_items(*))
        `)
        .in("status", ["pending", "preparing", "ready"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map the database structure to our application's structure
      return data.map(order => {
        // Convert each order_items to our OrderItem type
        const mappedItems = order.items 
          ? order.items.map((item: DbOrderItem) => mapDbOrderItemToOrderItem(item))
          : [];
        
        return {
          ...order,
          items: mappedItems
        } as Order;
      });
    },
  });

  // Set up real-time subscription for orders
  useEffect(() => {
    const subscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const handleOrderAction = async (orderId: string, newStatus: 'preparing' | 'ready' | 'completed') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Order status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders?.filter(order => order.status === status) || [];
  };

  const getEta = (order: Order) => {
    if (!order.items) return 0;
    
    const maxPrepTime = Math.max(
      ...order.items.map(item => item.foodItem?.preparation_time || 10)
    );
    
    return maxPrepTime;
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrderCard = (order: Order) => {
    const isExpanded = expandedOrder === order.id;
    const eta = getEta(order);
    
    return (
      <Card key={order.id} className={`mb-4 ${isExpanded ? 'border-primary' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">Order #{order.id.substring(0, 8)}</h3>
                <Badge variant={order.order_type === 'dine-in' ? 'default' : 'secondary'}>
                  {order.order_type === 'dine-in' ? t('Dine In') : order.order_type === 'takeout' ? t('Takeout') : t('Delivery')}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {order.order_type === 'dine-in' && order.table_id && (
                  <span className="mr-3">Table: {order.table_id}</span>
                )}
                <span>{new Date(order.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {order.status === 'pending' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleOrderAction(order.id, 'preparing')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <T text="Start Preparing" />
                </Button>
              )}
              
              {order.status === 'preparing' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleOrderAction(order.id, 'ready')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <T text="Mark Ready" />
                </Button>
              )}
              
              {order.status === 'ready' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleOrderAction(order.id, 'completed')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  <T text="Complete" />
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                {isExpanded ? t('Hide Details') : t('View Details')}
              </Button>
            </div>
          </div>
          
          {order.status === 'preparing' && (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span><T text="Preparation Progress" /></span>
                <span>{eta} min</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          )}
          
          {isExpanded && (
            <>
              <Separator className="my-3" />
              
              <div className="space-y-3">
                <h4 className="font-medium"><T text="Order Items" /></h4>
                
                <div className="space-y-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                      <div>
                        <div className="font-medium">{item.foodItem?.name}</div>
                        {item.special_instructions && (
                          <div className="text-sm text-muted-foreground">
                            Note: {item.special_instructions}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">x{item.quantity}</span>
                        {order.status === 'preparing' && (
                          <Button size="sm" variant="ghost">
                            <TimerReset className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.notes && (
                  <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-950/20 text-sm">
                    <div className="font-medium mb-1"><T text="Special Instructions" /></div>
                    <p>{order.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-1" />
                    <T text="Print" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout interface="kitchen">
      <div className="container mx-auto p-4 max-w-5xl">
        <PageHeader
          title={<T text="Order Processing" />}
          description={<T text="Manage and prepare customer orders" />}
          className="mb-4"
        />
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="relative">
              <T text="Pending" />
              {getOrdersByStatus('pending').length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2">
                  {getOrdersByStatus('pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="relative">
              <T text="Preparing" />
              {getOrdersByStatus('preparing').length > 0 && (
                <Badge variant="default" className="absolute -top-2 -right-2">
                  {getOrdersByStatus('preparing').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready" className="relative">
              <T text="Ready" />
              {getOrdersByStatus('ready').length > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2">
                  {getOrdersByStatus('ready').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              {getOrdersByStatus('pending').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p><T text="No pending orders" /></p>
                </div>
              ) : (
                getOrdersByStatus('pending').map(renderOrderCard)
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="preparing" className="mt-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              {getOrdersByStatus('preparing').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p><T text="No orders in preparation" /></p>
                </div>
              ) : (
                getOrdersByStatus('preparing').map(renderOrderCard)
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="ready" className="mt-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              {getOrdersByStatus('ready').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p><T text="No orders ready for pickup" /></p>
                </div>
              ) : (
                getOrdersByStatus('ready').map(renderOrderCard)
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OrderProcessing;
