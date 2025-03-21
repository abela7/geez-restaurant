
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
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
      icon: <Plus className="h-4 w-4" />,
      onClick: () => navigate('/waiter/orders/new'),
      color: "primary"
    },
    {
      name: "Manage Orders",
      icon: <ClipboardList className="h-4 w-4" />,
      onClick: () => navigate('/waiter/orders'),
      color: "default"
    },
    {
      name: "Process Payment",
      icon: <CreditCard className="h-4 w-4" />,
      onClick: () => navigate('/waiter/payments'),
      color: "secondary"
    },
    {
      name: "Tables",
      icon: <Table className="h-4 w-4" />,
      onClick: () => navigate('/waiter/tables'),
      color: "outline"
    }
  ];
  
  return (
    <Card className="mb-2 border-border">
      <div className="px-2 py-1.5 border-b flex justify-between items-center">
        <h3 className="font-medium text-sm"><T text="Quick Actions" /></h3>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/orders/search')}
            className="flex items-center gap-1 h-6 text-xs"
          >
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline"><T text="Search Orders" /></span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/waiter/tasks')}
            className="flex items-center gap-1 h-6 text-xs"
          >
            <ListChecks className="h-3 w-3" />
            <span className="hidden sm:inline"><T text="My Tasks" /></span>
          </Button>
        </div>
      </div>
      
      <div className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {mainActions.map((action, idx) => (
            <Card 
              key={idx} 
              className="p-1.5 flex flex-col items-center justify-center text-center hover:shadow-sm transition-all duration-200 cursor-pointer border-border"
              onClick={action.onClick}
            >
              <div className={`w-7 h-7 rounded-full ${action.color === "primary" ? "bg-primary text-primary-foreground" : "bg-muted"} flex items-center justify-center mb-1`}>
                {action.icon}
              </div>
              <span className="text-xs font-medium">{t(action.name)}</span>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
