
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Order, OrderItem, DbOrderItem, mapDbOrderItemToOrderItem } from "@/types/order";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TimerReset, 
  Printer, 
  Check, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Grid3X3, 
  List 
} from "lucide-react";

const OrderProcessing: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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
      
      toast.success(t(`Order status updated to ${newStatus}`));
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(t('Failed to update order status'));
    }
  };

  // Filter and sort orders
  const filteredOrders = (status: string) => {
    if (!orders) return [];
    
    return orders
      .filter(order => {
        const matchesStatus = order.status === status;
        const matchesSearch = (
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.order_type && order.order_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.table_id && order.table_id.toString().includes(searchQuery))
        );
        const matchesOrderType = orderTypeFilter === "all" || order.order_type === orderTypeFilter;
        
        return matchesStatus && matchesSearch && matchesOrderType;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
      });
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

  const getOrderIdDisplay = (id: string) => {
    return id.substring(0, 8);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(
      currentLanguage === 'am' ? 'am-ET' : 'en-US',
      { hour: '2-digit', minute: '2-digit' }
    );
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
                <h3 className="font-medium text-lg">{t("Order")} #{getOrderIdDisplay(order.id)}</h3>
                <Badge variant={order.order_type === 'dine-in' ? 'default' : 'secondary'}>
                  {order.order_type === 'dine-in' ? t('Dine In') : order.order_type === 'takeout' ? t('Takeout') : t('Delivery')}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {order.order_type === 'dine-in' && order.table_id && (
                  <span className="mr-3">{t("Table")}: {order.table_id}</span>
                )}
                <span>{formatTime(order.created_at)}</span>
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
                  <T text="Start" />
                </Button>
              )}
              
              {order.status === 'preparing' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleOrderAction(order.id, 'ready')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <T text="Ready" />
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
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => toggleOrderExpansion(order.id)}
              >
                {isExpanded ? t('Hide') : t('View')}
              </Button>
            </div>
          </div>
          
          {order.status === 'preparing' && (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span><T text="Preparation" /></span>
                <span>{eta} {t("min")}</span>
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
                          <div className="text-sm text-amber-600 dark:text-amber-400">
                            {t("Note")}: {item.special_instructions}
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

  const renderOrderGrid = (status: string) => {
    const ordersToDisplay = filteredOrders(status);
    
    if (ordersToDisplay.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
          <p><T text="No orders" /></p>
        </div>
      );
    }
    
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordersToDisplay.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{t("Order")} #{getOrderIdDisplay(order.id)}</h3>
                      <Badge variant={order.order_type === 'dine-in' ? 'default' : 'secondary'}>
                        {order.order_type === 'dine-in' ? t('Dine In') : order.order_type === 'takeout' ? t('Takeout') : t('Delivery')}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {order.order_type === 'dine-in' && order.table_id && (
                        <span className="mr-3">{t("Table")}: {order.table_id}</span>
                      )}
                      <span>{formatTime(order.created_at)}</span>
                    </div>
                    
                    <div className="text-sm mb-3">
                      <span className="font-medium mr-1"><T text="Items:" /></span>
                      <span>{order.items?.length || 0}</span>
                    </div>
                    
                    {order.status === 'preparing' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span><T text="Preparation" /></span>
                          <span>{getEta(order)} {t("min")}</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  {order.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleOrderAction(order.id, 'preparing')}
                      className="w-full"
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
                      className="w-full"
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
                      className="w-full"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      <T text="Complete" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="w-full"
                  >
                    <T text="View Details" />
                  </Button>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="border-t p-4 bg-muted/30">
                  <h4 className="font-medium mb-2"><T text="Order Items" /></h4>
                  <div className="space-y-2">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>{item.foodItem?.name}</div>
                        <div className="font-medium">x{item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      );
    }
    
    return ordersToDisplay.map(renderOrderCard);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"><T text="Order Processing" /></h1>
      </div>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search orders...")}
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("Order Type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Types" /></SelectItem>
              <SelectItem value="dine-in"><T text="Dine In" /></SelectItem>
              <SelectItem value="takeout"><T text="Takeout" /></SelectItem>
              <SelectItem value="delivery"><T text="Delivery" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="h-4 w-4" />
            <T text={sortOrder === "newest" ? "Newest First" : "Oldest First"} />
          </Button>
          
          <div className="border rounded-md flex">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="icon" 
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon" 
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pending" className="relative">
            <T text="Pending" />
            {filteredOrders('pending').length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                {filteredOrders('pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative">
            <T text="Preparing" />
            {filteredOrders('preparing').length > 0 && (
              <Badge variant="default" className="absolute -top-2 -right-2">
                {filteredOrders('preparing').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative">
            <T text="Ready" />
            {filteredOrders('ready').length > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2">
                {filteredOrders('ready').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            {renderOrderGrid('pending')}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="preparing" className="mt-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            {renderOrderGrid('preparing')}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="ready" className="mt-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            {renderOrderGrid('ready')}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderProcessing;
