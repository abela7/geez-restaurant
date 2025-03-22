
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { OrderType } from '@/types/order';
import { Utensils, ShoppingBag, Truck } from 'lucide-react';

interface OrderTypeStepProps {
  onSelectOrderType: (type: OrderType) => void;
}

export const OrderTypeStep: React.FC<OrderTypeStepProps> = ({ onSelectOrderType }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <CardTitle><T text="Select Order Type" /></CardTitle>
        <CardDescription><T text="Choose how the customer will receive their order." /></CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => onSelectOrderType('dine-in')}
        >
          <Utensils className="h-5 w-5" />
          <span><T text="Dine-in" /></span>
        </Button>
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => onSelectOrderType('takeout')}
        >
          <ShoppingBag className="h-5 w-5" />
          <span><T text="Takeout" /></span>
        </Button>
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => onSelectOrderType('delivery')}
        >
          <Truck className="h-5 w-5" />
          <span><T text="Delivery" /></span>
        </Button>
      </CardContent>
    </Card>
  );
};
