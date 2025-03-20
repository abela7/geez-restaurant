
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, DollarSign, User } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useRecentOrders } from "@/hooks/useRecentOrders";
import { formatDistanceToNow } from "date-fns";

export const RecentOrdersSection: React.FC = () => {
  const { t } = useLanguage();
  const { orders, isLoading, error } = useRecentOrders();
  
  if (isLoading) {
    return (
      <Card className="p-4 h-64 flex justify-center items-center">
        <div className="animate-pulse">
          <T text="Loading recent orders..." />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 h-64 flex justify-center items-center">
        <div className="text-destructive">
          <T text="Failed to load recent orders" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-lg"><T text="Recent Orders" /></h3>
        <Button variant="outline" size="sm">
          <T text="View All" />
        </Button>
      </div>
      
      <div className="divide-y">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <T text="No recent orders found" />
          </div>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div key={order.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    {order.restaurant_tables ? 
                      t("Table") + " " + order.restaurant_tables.table_number : 
                      t(order.order_type)}
                  </h4>
                  <Badge 
                    variant={
                      order.status === "completed" ? "default" : 
                      order.status === "in-progress" ? "secondary" : 
                      "outline"
                    }
                  >
                    {t(order.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center">
                    <Utensils className="h-3 w-3 mr-1" />
                    <span>{order.items_count} {t("items")}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                  {order.customer_name && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{order.customer_name}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <T text="Details" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
