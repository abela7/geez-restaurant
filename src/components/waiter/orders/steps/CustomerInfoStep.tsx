
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { OrderType } from '@/types/order';
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, MessageSquare } from "lucide-react";

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
  specialInstructions,
  setSpecialInstructions,
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
        <T text="Customer Information" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <User className="h-5 w-5" />
              <h3 className="font-medium"><T text="Customer Details" /></h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  <T text="Customer Name" /> {orderType === 'delivery' && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="customerName"
                  placeholder={t("Enter customer name")}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required={orderType === 'delivery'}
                />
              </div>
              
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
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium"><T text="Order Notes" /></h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">
                <T text="Special Instructions" />
              </Label>
              <Textarea
                id="specialInstructions"
                placeholder={t("Enter any special instructions or notes")}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {orderType === 'delivery' && !customerName && (
        <div className="text-sm text-amber-500 mt-2">
          <T text="Customer name is required for delivery orders" />
        </div>
      )}
    </div>
  );
};
