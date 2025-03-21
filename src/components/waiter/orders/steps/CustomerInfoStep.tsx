
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { UserRound } from "lucide-react";

interface CustomerInfoStepProps {
  orderType: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerCount: string;
  setCustomerCount: (count: string) => void;
  goToNextStep: () => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  orderType,
  customerName,
  setCustomerName,
  customerCount,
  setCustomerCount,
  goToNextStep
}) => {
  const { t } = useLanguage();
  const [isReady, setIsReady] = useState(false);
  
  const handleCustomerCountChange = (value: string) => {
    setCustomerCount(value);
    // If we have a value, mark as ready for auto-navigation
    setIsReady(true);
  };
  
  // For takeout/delivery, auto-continue after a short delay
  useEffect(() => {
    if (orderType !== "dine-in" || isReady) {
      const timer = setTimeout(() => {
        goToNextStep();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [orderType, isReady, goToNextStep]);
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">
          <T text="Customer Information" />
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              <T text="Customer Name" /> <span className="text-muted-foreground">(<T text="optional" />)</span>
            </label>
            <div className="relative">
              <UserRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("Enter customer name")} 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {orderType === "dine-in" && (
            <div>
              <label className="text-sm font-medium mb-1 block">
                <T text="Number of Guests" />
              </label>
              <Select value={customerCount} onValueChange={handleCustomerCountChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select guest count")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
