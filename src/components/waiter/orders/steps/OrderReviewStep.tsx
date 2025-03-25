
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { OrderItem, OrderType } from '@/types/order';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ClipboardList, Table, User, Plus, Minus, Trash2 } from "lucide-react";
import { useTables } from "@/hooks/useTables";

interface OrderReviewStepProps {
  orderItems: OrderItem[];
  orderType: OrderType;
  tableId: string;
  customerName: string;
  customerCount: string;
  specialInstructions: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  onGoBack: () => void;
}

export const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  orderItems,
  orderType,
  tableId,
  customerName,
  customerCount,
  specialInstructions,
  onUpdateQuantity,
  onRemoveItem,
  total,
  onPlaceOrder,
  isSubmitting,
  onGoBack
}) => {
  const { t } = useLanguage();
  const { getTableById } = useTables();
  
  const selectedTable = getTableById(tableId);
  
  const getOrderTypeLabel = () => {
    switch (orderType) {
      case 'dine-in':
        return t('Dine In');
      case 'takeout':
        return t('Takeout');
      case 'delivery':
        return t('Delivery');
      default:
        return '';
    }
  };
  
  const getOrderTypeBadgeColor = () => {
    switch (orderType) {
      case 'dine-in':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'takeout':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'delivery':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold"><T text="Review Order" /></h2>
        <Badge className={`text-sm ${getOrderTypeBadgeColor()}`}>
          {getOrderTypeLabel()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                <T text="Order Items" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-500px)] pr-4">
                <div className="space-y-3">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start py-2 border-b border-border">
                      <div className="flex-1">
                        <div className="font-medium">{t(item.foodItem.name)}</div>
                        {item.special_instructions && (
                          <div className="text-xs text-muted-foreground italic mt-1">
                            {item.special_instructions}
                          </div>
                        )}
                        {item.foodItem.is_vegetarian && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500 text-xs mt-1">
                            <T text="Vegetarian" />
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-5 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right w-20 text-sm font-medium">
                          £{(item.foodItem.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between font-medium">
                  <span className="text-lg"><T text="Total" /></span>
                  <span className="text-lg">£{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {/* Order Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg"><T text="Order Details" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  <T text="Order Type" />
                </h4>
                <div className="font-medium">{getOrderTypeLabel()}</div>
              </div>
              
              {orderType === 'dine-in' && selectedTable && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    <T text="Table" />
                  </h4>
                  <div className="flex items-center">
                    <Table className="h-4 w-4 mr-1.5" />
                    <span className="font-medium"><T text="Table" /> {selectedTable.table_number}</span>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  <T text="Customer" />
                </h4>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">{customerName || t('Guest')}</span>
                </div>
              </div>
              
              {orderType === 'dine-in' && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    <T text="Guest Count" />
                  </h4>
                  <div className="font-medium">{customerCount || '1'}</div>
                </div>
              )}
              
              {specialInstructions && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    <T text="Special Instructions" />
                  </h4>
                  <div className="text-sm border rounded p-2 bg-muted/30">
                    {specialInstructions}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="pt-2">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button variant="outline" onClick={onGoBack}>
                    <T text="Back" />
                  </Button>
                  
                  <Button 
                    onClick={onPlaceOrder} 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    <T text="Place Order" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  <T text="By placing this order, it will be sent to the kitchen for preparation." />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
