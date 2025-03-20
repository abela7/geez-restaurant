
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Utensils, DollarSign, TableRestaurant } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useWaiterInfo } from "@/hooks/useWaiterInfo";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import { TableActionsSection } from "@/components/waiter/TableActionsSection";
import { RecentOrdersSection } from "@/components/waiter/RecentOrdersSection";

const WaiterDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { waiter, isLoading } = useWaiterInfo();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={waiter ? `${t("Hello")}, ${waiter.name}` : t("Waiter Dashboard")} 
        description={t("Manage your tables, orders, and tasks")}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title={t("Active Tables")} 
          value="4" 
          icon={<TableRestaurant size={18} />}
        />
        <StatCard 
          title={t("Pending Orders")} 
          value="3" 
          icon={<Utensils size={18} />}
        />
        <StatCard 
          title={t("Today's Sales")} 
          value="$345.50" 
          icon={<DollarSign size={18} />}
        />
        <StatCard 
          title={t("Shift Ends In")} 
          value="3:45:22" 
          icon={<Clock size={18} />}
        />
      </div>

      <TableActionsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickOrdersSection />
          <RecentOrdersSection />
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg"><T text="Active Tables" /></h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 p-4">
              <Card className="p-3 bg-primary/10 border-primary">
                <div className="text-center">
                  <p className="font-medium">Table 2</p>
                  <p className="text-xs text-muted-foreground mt-1">4 {t("guests")} • 32m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-3 bg-amber-500/10 border-amber-500">
                <div className="text-center">
                  <p className="font-medium">Table 5</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t("guests")} • 15m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
            </div>
            
            <Separator />
            
            <div className="p-4">
              <h3 className="font-medium mb-3"><T text="Today's Tasks" /></h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">{t("Process end-of-shift report")}</h4>
                    <p className="text-xs text-muted-foreground">{t("Due at end of shift")}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <T text="Complete" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">{t("Restock service stations")}</h4>
                    <p className="text-xs text-muted-foreground">{t("Due before dinner service")}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <T text="Complete" />
                  </Button>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate('/waiter/tasks')}>
                <T text="View All Tasks" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
