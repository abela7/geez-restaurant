import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Minus, Plus, Trash2, CheckCircle, Printer } from "lucide-react";
import { OrderItem } from "@/types/order";

interface OrderReviewStepProps {
  orderItems: OrderItem[];
  handleQuantityChange: (itemId: string, newQuantity: number) => void;
  handleRemoveItem: (itemId: string) => void;
  orderType: string;
  selectedTable: string;
  tables: {
    id: string;
    table_number: number;
    capacity: number;
    status: string;
    location?: string;
  }[];
  customerName: string;
  customerCount: string;
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
  
  const getSelectedTableInfo = () => {
    const table = tables.find(table => table.id === selectedTable);
    return table ? `Table ${table.table_number} (${table.capacity} seats)` : "";
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">
            <T text="Order Summary" />
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                <T text="Order Type" />
              </h4>
              <p>{orderType === 'dine-in' ? t('Dine In') : orderType === 'takeout' ? t('Takeout') : t('Delivery')}</p>
            </div>
            
            {orderType === 'dine-in' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    <T text="Table" />
                  </h4>
                  <p>{getSelectedTableInfo()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    <T text="Number of Guests" />
                  </h4>
                  <p>{customerCount}</p>
                </div>
              </>
            )}
            
            {customerName && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  <T text="Customer Name" />
                </h4>
                <p>{customerName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-3 flex items-center">
            <T text="Order Items" />
            <Badge variant="outline" className="ml-2">{orderItems.length}</Badge>
          </h3>
          
          <ScrollArea className="h-[250px]">
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b pb-3">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.foodItem.name}</span>
                      <span className="font-bold">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.special_instructions && (
                      <p className="text-sm text-muted-foreground mt-1">Note: {item.special_instructions}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-destructive"
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
          
          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span><T text="Total" /></span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-3">
            <T text="Special Instructions" /> <span className="text-muted-foreground text-sm">(<T text="optional" />)</span>
          </h3>
          
          <Textarea 
            placeholder={t("Enter any special instructions or requests")}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2" />
          ) : (
            <CheckCircle className="h-5 w-5 mr-2" />
          )}
          <T text="Place Order" />
        </Button>
        
        <Button variant="outline" className="w-full">
          <Printer className="h-5 w-5 mr-2" />
          <T text="Print Receipt" />
        </Button>
      </div>
    </div>
  );
};
