
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Package, 
  ShoppingBag, 
  ClipboardList, 
  CreditCard,
  Table
} from "lucide-react";

export const TableActionsSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const mainActions = [
    {
      name: "New Order",
      icon: <UtensilsCrossed />,
      onClick: () => navigate('/waiter/orders'),
      color: "primary"
    },
    {
      name: "Takeout",
      icon: <Package />,
      onClick: () => navigate('/waiter/orders?type=takeout'),
      color: "secondary"
    },
    {
      name: "Manage Orders",
      icon: <ClipboardList />,
      onClick: () => navigate('/waiter/orders'),
      color: "default"
    },
    {
      name: "Process Payment",
      icon: <CreditCard />,
      onClick: () => navigate('/waiter/payments'),
      color: "outline"
    },
    {
      name: "View Tables",
      icon: <Table />,
      onClick: () => navigate('/waiter/tables'),
      color: "outline"
    },
    {
      name: "Deliveries",
      icon: <ShoppingBag />,
      onClick: () => navigate('/waiter/orders?type=delivery'),
      color: "outline"
    }
  ];
  
  return (
    <Card className="mb-6">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg"><T text="Quick Actions" /></h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mainActions.map((action, idx) => (
            <Card key={idx} className="p-3 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{t(action.name)}</span>
              <Button 
                variant={action.color as any} 
                size="sm" 
                className="mt-2 w-full" 
                onClick={action.onClick}
              >
                <T text="Go" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
