
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  special_instructions?: string;
  preparation_time: number;
}

interface Order {
  id: string;
  table_name: string;
  waiter_name: string;
  status: "pending" | "in_progress" | "ready";
  created_at: string;
  items: OrderItem[];
}

// Sample data - in a real app this would come from the API
const sampleOrders: Order[] = [
  {
    id: "ord-001",
    table_name: "Table 5",
    waiter_name: "Sara",
    status: "pending",
    created_at: "2023-09-15T10:15:00Z",
    items: [
      { id: "item-001", name: "Doro Wat", quantity: 2, preparation_time: 15 },
      { id: "item-002", name: "Injera", quantity: 4, preparation_time: 5 }
    ]
  },
  {
    id: "ord-002",
    table_name: "Table 3",
    waiter_name: "Dawit",
    status: "in_progress",
    created_at: "2023-09-15T10:05:00Z",
    items: [
      { id: "item-003", name: "Tibs", quantity: 1, preparation_time: 12, special_instructions: "Extra spicy" },
      { id: "item-004", name: "Kitfo", quantity: 1, preparation_time: 10 }
    ]
  }
];

const ActiveOrdersPanel: React.FC = () => {
  const { t } = useLanguage();
  
  // Calculate preparation time remaining for each order based on when it was created
  const calculateTimeRemaining = (order: Order) => {
    const createdTime = new Date(order.created_at).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = Math.floor((currentTime - createdTime) / (1000 * 60));
    
    // Get the longest prep time item
    const maxPrepTime = Math.max(...order.items.map(item => item.preparation_time));
    
    return Math.max(0, maxPrepTime - elapsedMinutes);
  };
  
  // Get time status for visual indication
  const getTimeStatus = (order: Order) => {
    const remaining = calculateTimeRemaining(order);
    if (remaining <= 0) return "overdue";
    if (remaining <= 5) return "urgent";
    return "normal";
  };
  
  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    // In a real app, this would call the API
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle><T text="Active Kitchen Orders" /></CardTitle>
      </CardHeader>
      <CardContent>
        {sampleOrders.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            <T text="No active orders" />
          </div>
        ) : (
          <div className="grid gap-4">
            {sampleOrders.map(order => (
              <Card key={order.id} className="border border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {order.table_name}
                        <Badge className="ml-2">{order.status.replace("_", " ")}</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        <T text="Waiter" />: {order.waiter_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center ${
                        getTimeStatus(order) === "overdue" ? "text-red-500" :
                        getTimeStatus(order) === "urgent" ? "text-amber-500" : 
                        "text-green-500"
                      }`}>
                        {getTimeStatus(order) === "overdue" ? (
                          <AlertTriangle className="h-4 w-4 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 mr-1" />
                        )}
                        <span className="font-semibold">
                          {calculateTimeRemaining(order) <= 0 
                            ? <T text="Overdue" />
                            : `${calculateTimeRemaining(order)} min`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-start py-1 border-b border-dashed border-gray-200">
                        <div>
                          <div className="font-medium">{item.name} × {item.quantity}</div>
                          {item.special_instructions && (
                            <div className="text-sm text-amber-600 italic">
                              {item.special_instructions}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {item.preparation_time} min
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-3">
                    {order.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updateOrderStatus(order.id, "in_progress")}
                      >
                        <T text="Start Preparing" />
                      </Button>
                    )}
                    {order.status === "in_progress" && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        <T text="Mark Ready" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveOrdersPanel;
