
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { CheckCircle, Printer, Send, Loader2 } from "lucide-react";
import { OrderItem } from "@/hooks/useOrderManagement";

interface ConfirmationStepProps {
  orderItems: OrderItem[];
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
  calculateTotal: () => number;
  handleSubmitOrder: () => void;
  isSubmitting: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  orderItems,
  orderType,
  selectedTable,
  tables,
  customerName,
  customerCount,
  specialInstructions,
  calculateTotal,
  handleSubmitOrder,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  const getSelectedTableInfo = () => {
    const table = tables.find(table => table.id === selectedTable);
    return table ? `Table ${table.table_number}` : "";
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-1">
            <T text="Ready to Place Order" />
          </h2>
          <p className="text-muted-foreground">
            <T text="Please review the order details below before submitting" />
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">
              <T text="Order Information" />
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground"><T text="Order Type" />:</span>
                <span className="font-medium">{orderType === 'dine-in' ? t('Dine In') : orderType === 'takeout' ? t('Takeout') : t('Delivery')}</span>
              </li>
              
              {orderType === 'dine-in' && (
                <>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground"><T text="Table" />:</span>
                    <span className="font-medium">{getSelectedTableInfo()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground"><T text="Number of Guests" />:</span>
                    <span className="font-medium">{customerCount}</span>
                  </li>
                </>
              )}
              
              {customerName && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground"><T text="Customer Name" />:</span>
                  <span className="font-medium">{customerName}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">
              <T text="Items" /> ({orderItems.length})
            </h3>
            <ul className="space-y-1 text-sm">
              {orderItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.foodItem.name}</span>
                  <span className="font-medium">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {specialInstructions && (
            <div className="border-b pb-3">
              <h3 className="font-medium mb-2">
                <T text="Special Instructions" />
              </h3>
              <p className="text-sm">{specialInstructions}</p>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-lg"><T text="Total" /></span>
              <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmitOrder}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            <T text="Send to Kitchen" />
          </Button>
          
          <Button 
            variant="outline"
            disabled={isSubmitting}
            className="w-full"
          >
            <Printer className="mr-2 h-4 w-4" />
            <T text="Print Order" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
