
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuickOrders, QuickOrder } from "@/hooks/useQuickOrders";
import { QuickOrderCard } from './QuickOrderCard';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { SearchX } from "lucide-react";

interface QuickOrdersSectionProps {
  onAddToOrder?: (order: QuickOrder) => void;
  compact?: boolean;
}

export const QuickOrdersSection: React.FC<QuickOrdersSectionProps> = ({ 
  onAddToOrder,
  compact = false
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
      <Card className="p-2 h-36 flex justify-center items-center">
        <div className="animate-pulse text-sm">
          <T text="Loading quick orders..." />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-2 h-36 flex justify-center items-center text-destructive text-sm">
        <T text="Failed to load quick orders" />
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-3 flex flex-col items-center justify-center">
        <SearchX className="h-8 w-8 text-muted-foreground mb-1.5" />
        <h3 className="font-medium text-sm mb-0.5"><T text="No Orders Available" /></h3>
        <p className="text-muted-foreground text-center text-xs">
          <T text="There are currently no quick orders available." />
        </p>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border-border">
      <div className="px-2 py-1.5 border-b">
        <h3 className="font-medium text-sm"><T text="Quick Orders" /></h3>
      </div>
      
      <div className="p-2">
        <Tabs defaultValue="All">
          <TabsList className="mb-2 flex overflow-auto hide-scrollbar h-7">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap h-6 text-xs">
                {t(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <ScrollArea className={compact ? "h-[250px]" : "h-[calc(100vh-300px)]"}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 p-0.5">
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
