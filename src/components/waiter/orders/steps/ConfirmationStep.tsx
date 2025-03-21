import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { CheckCircle, AlertCircle } from "lucide-react";
import { OrderItem } from "@/types/order";

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
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  orderItems,
  orderType,
  selectedTable,
  tables,
  customerName,
  customerCount,
  specialInstructions,
  calculateTotal
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
            <T text="Order Confirmation" />
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

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              <T text="Special Instructions" />
            </h4>
            <p>{specialInstructions || t("No special instructions")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-3 flex items-center">
            <T text="Order Items" />
            <Badge variant="outline" className="ml-2">{orderItems.length}</Badge>
          </h3>

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
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span><T text="Total" /></span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <T text="Confirm Order" />
          <CheckCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
