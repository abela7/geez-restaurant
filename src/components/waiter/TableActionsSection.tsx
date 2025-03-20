
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
  Table,
  Plus,
  Search,
  ListChecks
} from "lucide-react";

export const TableActionsSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const mainActions = [
    {
      name: "New Order",
      icon: <Plus />,
      onClick: () => navigate('/waiter/orders/new'),
      color: "primary"
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
      color: "secondary"
    },
    {
      name: "Takeout",
      icon: <Package />,
      onClick: () => navigate('/waiter/orders/new?type=takeout'),
      color: "outline"
    },
    {
      name: "Delivery",
      icon: <ShoppingBag />,
      onClick: () => navigate('/waiter/orders/new?type=delivery'),
      color: "outline"
    },
    {
      name: "Tables",
      icon: <Table />,
      onClick: () => navigate('/waiter/tables'),
      color: "outline"
    }
  ];
  
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-lg"><T text="POS Actions" /></h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/orders/search')}
          >
            <Search className="h-4 w-4 mr-2" />
            <T text="Search Orders" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/tasks')}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            <T text="My Tasks" />
          </Button>
        </div>
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
