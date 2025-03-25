
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { OrderType } from '@/types/order';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CustomerInfoStepProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerCount: string;
  setCustomerCount: (count: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
  orderType: OrderType;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerName,
  setCustomerName,
  customerCount,
  setCustomerCount,
  orderType
}) => {
  const { t } = useLanguage();
  
  const handleCustomerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setCustomerCount(value);
    }
  };
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">
        <T text="Guest Information" />
      </h2>
      
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-primary mb-4">
            <Users className="h-5 w-5" />
            <h3 className="font-medium"><T text="Guest Count" /></h3>
          </div>
          
          <div className="space-y-3">
            {orderType === 'delivery' && (
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  <T text="Customer Name" /> <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder={t("Enter customer name")}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required={orderType === 'delivery'}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="customerCount">
                <T text="Number of Guests" />
              </Label>
              <Input
                id="customerCount"
                type="text"
                placeholder="1"
                value={customerCount}
                onChange={handleCustomerCountChange}
                required={orderType === 'dine-in'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {orderType === 'delivery' && !customerName && (
        <div className="text-sm text-amber-500 mt-2 text-center">
          <T text="Customer name is required for delivery orders" />
        </div>
      )}
    </div>
  );
};
