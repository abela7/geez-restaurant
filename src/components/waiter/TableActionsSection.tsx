
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
      icon: <Plus className="h-5 w-5" />,
      onClick: () => navigate('/waiter/orders/new'),
      color: "primary"
    },
    {
      name: "Manage Orders",
      icon: <ClipboardList className="h-5 w-5" />,
      onClick: () => navigate('/waiter/orders'),
      color: "default"
    },
    {
      name: "Process Payment",
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => navigate('/waiter/payments'),
      color: "secondary"
    },
    {
      name: "Takeout",
      icon: <Package className="h-5 w-5" />,
      onClick: () => navigate('/waiter/orders/new?type=takeout'),
      color: "outline"
    },
    {
      name: "Delivery",
      icon: <ShoppingBag className="h-5 w-5" />,
      onClick: () => navigate('/waiter/orders/new?type=delivery'),
      color: "outline"
    },
    {
      name: "Tables",
      icon: <Table className="h-5 w-5" />,
      onClick: () => navigate('/waiter/tables'),
      color: "outline"
    }
  ];
  
  return (
    <Card className="mb-6 border-border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-lg"><T text="Quick Actions" /></h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/orders/search')}
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline"><T text="Search Orders" /></span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/tasks')}
            className="flex items-center gap-1"
          >
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline"><T text="My Tasks" /></span>
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainActions.map((action, idx) => (
            <Card 
              key={idx} 
              className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-200 cursor-pointer border-border"
              onClick={action.onClick}
            >
              <div className={`w-12 h-12 rounded-full ${action.color === "primary" ? "bg-primary text-primary-foreground" : "bg-muted"} flex items-center justify-center mb-2`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium mb-1">{t(action.name)}</span>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
