
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuickOrders, QuickOrder } from "@/hooks/useQuickOrders";
import { QuickOrderCard } from './QuickOrderCard';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface QuickOrdersSectionProps {
  onAddToOrder?: (order: QuickOrder) => void;
}

export const QuickOrdersSection: React.FC<QuickOrdersSectionProps> = ({ 
  onAddToOrder 
}) => {
  const { t } = useLanguage();
  const { orders, isLoading, error } = useQuickOrders();
  
  // Group orders by category
  const categories = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    const uniqueCategories = [...new Set(orders.map(order => order.category))];
    return ['All', ...uniqueCategories];
  }, [orders]);
  
  const handleAddOrder = (order: QuickOrder) => {
    if (onAddToOrder) {
      onAddToOrder(order);
    } else {
      toast.success(`${order.name} added to order`);
      // In a real app without the callback, this might add to a global order state
    }
  };
  
  if (isLoading) {
    return (
      <Card className="p-4 h-64 flex justify-center items-center">
        <div className="animate-pulse">
          <T text="Loading quick orders..." />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 h-64 flex justify-center items-center">
        <div className="text-destructive">
          <T text="Failed to load quick orders" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg"><T text="Quick Orders" /></h3>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="All">
          <TabsList className="mb-4 flex overflow-auto hide-scrollbar">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {t(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                  {orders
                    .filter(order => category === 'All' || order.category === category)
                    .map(order => (
                      <QuickOrderCard
                        key={order.id}
                        name={order.name}
                        description={order.description}
                        price={order.price}
                        category={order.category}
                        imageUrl={order.image_url}
                        onOrder={() => handleAddOrder(order)}
                      />
                    ))
                  }
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
};
