
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ShoppingBag, UtensilsCrossed, Truck } from "lucide-react";
import { OrderType } from '@/types/order';

interface OrderTypeStepProps {
  onSelectOrderType: (type: OrderType) => void;
}

export const OrderTypeStep: React.FC<OrderTypeStepProps> = ({ onSelectOrderType }) => {
  const { t } = useLanguage();
  
  const orderTypes = [
    {
      type: 'dine-in' as OrderType,
      title: t('Dine In'),
      description: t('Customer is eating in the restaurant'),
      icon: <UtensilsCrossed className="h-6 w-6" />,
      color: 'bg-green-500/10 text-green-700 dark:text-green-300'
    },
    {
      type: 'takeout' as OrderType,
      title: t('Takeout'),
      description: t('Customer will take food with them'),
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    },
    {
      type: 'delivery' as OrderType,
      title: t('Delivery'),
      description: t('Food will be delivered to customer'),
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
    }
  ];
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Select Order Type" /></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orderTypes.map((orderType) => (
          <Card 
            key={orderType.type}
            className="hover:shadow-md transition-all cursor-pointer overflow-hidden"
            onClick={() => onSelectOrderType(orderType.type)}
          >
            <div className={`p-6 flex flex-col items-center justify-center text-center ${orderType.color}`}>
              <div className="mb-4 p-3 rounded-full bg-background">
                {orderType.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{orderType.title}</h3>
              <p className="text-sm opacity-75">{orderType.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
