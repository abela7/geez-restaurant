
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { OrderItem } from '@/types/order';

interface OrderReviewStepProps {
  orderItems: OrderItem[];
  handleQuantityChange: (itemId: string, newQuantity: number) => void;
  handleRemoveItem: (itemId: string) => void;
  orderType: string;
  selectedTable: string;
  tables: any[];
  customerName: string;
  customerCount: string | number;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
  calculateTotal: () => number;
  handleSubmitOrder: () => void;
  isSubmitting: boolean;
}

export const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  orderItems,
  handleQuantityChange,
  handleRemoveItem,
  orderType,
  selectedTable,
  tables,
  customerName,
  customerCount,
  specialInstructions,
  setSpecialInstructions,
  calculateTotal,
  handleSubmitOrder,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  // Find selected table info
  const selectedTableInfo = tables.find(table => table.id === selectedTable);
  
  const formatOrderType = (type: string) => {
    switch (type) {
      case 'dine-in': return t('Dine In');
      case 'takeout': return t('Takeout');
      case 'delivery': return t('Delivery');
      default: return type;
    }
  };
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Review Order" /></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4"><T text="Order Summary" /></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label><T text="Order Type" /></Label>
                  <div className="mt-1 font-medium">{formatOrderType(orderType)}</div>
                </div>
                
                {orderType === 'dine-in' && selectedTableInfo && (
                  <div>
                    <Label><T text="Table" /></Label>
                    <div className="mt-1 font-medium">
                      <T text="Table" /> {selectedTableInfo.table_number} ({selectedTableInfo.capacity} <T text="seats" />)
                    </div>
                  </div>
                )}
                
                <div>
                  <Label><T text="Customer" /></Label>
                  <div className="mt-1 font-medium">{customerName || <span className="text-muted-foreground italic"><T text="Not specified" /></span>}</div>
                </div>
                
                <div>
                  <Label><T text="Number of Guests" /></Label>
                  <div className="mt-1 font-medium">{customerCount}</div>
                </div>
              </div>
              
              <Label><T text="Special Instructions" /></Label>
              <Textarea 
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder={t("Enter any special instructions or requests")}
                className="mt-1 mb-6"
              />
              
              <h3 className="text-lg font-medium mb-4"><T text="Order Items" /></h3>
              
              {orderItems.length === 0 ? (
                <div className="bg-muted/50 p-6 rounded-md text-center text-muted-foreground">
                  <T text="No items added to the order yet" />
                </div>
              ) : (
                <ScrollArea className="h-[300px] border rounded-md">
                  <div className="p-4 space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-start pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.foodItem.name}</h4>
                              {item.special_instructions && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.special_instructions}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium">£{(item.foodItem.price * item.quantity).toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                £{item.foodItem.price.toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-2 text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span><T text="Subtotal" /></span>
                  <span>£{calculateTotal().toFixed(2)}</span>
                </div>
                {/* Add tax calculation if needed */}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span><T text="Total" /></span>
                  <span>£{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                disabled={orderItems.length === 0 || isSubmitting}
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                <T text="Place Order" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4"><T text="Quick Actions" /></h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled={isSubmitting}>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add More Items" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start" disabled={isSubmitting}>
                  <T text="Apply Discount" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start" disabled={isSubmitting}>
                  <T text="Split Order" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
