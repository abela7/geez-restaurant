
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Store, Home, Truck } from "lucide-react";
import { cn } from '@/lib/utils';

interface OrderTypeStepProps {
  orderType: string;
  setOrderType: (type: "dine-in" | "takeout" | "delivery") => void;
}

export const OrderTypeStep: React.FC<OrderTypeStepProps> = ({
  orderType,
  setOrderType
}) => {
  const { t } = useLanguage();
  
  const orderTypes = [
    { id: 'dine-in', label: t('Dine In'), icon: <Home className="h-5 w-5 mb-2" /> },
    { id: 'takeout', label: t('Takeout'), icon: <Store className="h-5 w-5 mb-2" /> },
    { id: 'delivery', label: t('Delivery'), icon: <Truck className="h-5 w-5 mb-2" /> },
  ];
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">
          <T text="Select Order Type" />
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {orderTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 p-2",
                orderType === type.id && "border-primary bg-primary/10 text-primary"
              )}
              onClick={() => setOrderType(type.id as "dine-in" | "takeout" | "delivery")}
            >
              {type.icon}
              <span>{type.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
