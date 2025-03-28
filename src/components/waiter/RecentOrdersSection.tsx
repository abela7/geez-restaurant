
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, DollarSign, User, ExternalLink, ClipboardX } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useRecentOrders } from "@/hooks/useRecentOrders";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export const RecentOrdersSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders, isLoading, error } = useRecentOrders();
  
  if (isLoading) {
    return (
      <Card className="p-3 h-40 flex justify-center items-center">
        <div className="animate-pulse text-sm">
          <T text="Loading recent orders..." />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-3 h-40 flex justify-center items-center text-destructive text-sm">
        <T text="Failed to load recent orders" />
      </Card>
    );
  }
  
  return (
    <Card className="mb-3 border-border">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium text-sm"><T text="Recent Orders" /></h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/waiter/orders')}
          className="flex items-center gap-1 h-6 text-xs"
        >
          <ExternalLink className="h-3 w-3" />
          <T text="View All" />
        </Button>
      </div>
      
      <div className="divide-y divide-border">
        {orders.length === 0 ? (
          <div className="p-6 text-center">
            <ClipboardX className="h-10 w-10 text-muted-foreground mx-auto mb-1.5" />
            <h4 className="font-medium text-sm mb-1"><T text="No Recent Orders" /></h4>
            <p className="text-muted-foreground text-xs">
              <T text="No recent orders have been placed." />
            </p>
          </div>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div key={order.id} className="p-2 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-medium text-sm">
                      {order.table_number ? 
                        t("Table") + " " + order.table_number : 
                        t(order.order_type)}
                    </h4>
                    <Badge 
                      variant={
                        order.status === "completed" ? "default" : 
                        order.status === "in-progress" ? "secondary" : 
                        "outline"
                      }
                      className="capitalize text-xs px-1.5 py-0"
                    >
                      {t(order.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-0.5 flex-shrink-0" />
                      <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center">
                      <Utensils className="h-3 w-3 mr-0.5 flex-shrink-0" />
                      <span>{order.items_count} {t("items")}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-0.5 flex-shrink-0" />
                      <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                    {order.customer_name && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-0.5 flex-shrink-0" />
                        <span>{order.customer_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/waiter/orders/${order.id}`)}
                  className="ml-1.5 flex-shrink-0 h-7 text-xs"
                >
                  <T text="Details" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
