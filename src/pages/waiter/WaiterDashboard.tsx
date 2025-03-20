
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, UtensilsCrossed, DollarSign, Table, Plus, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useWaiterInfo } from "@/hooks/useWaiterInfo";
import { TableActionsSection } from "@/components/waiter/TableActionsSection";
import { RecentOrdersSection } from "@/components/waiter/RecentOrdersSection";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";

const WaiterDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { waiter, isLoading } = useWaiterInfo();
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={waiter ? `${t("Hello")}, ${waiter.name}` : t("Waiter Dashboard")} 
        description={t("Manage orders, tables, and tasks")}
        actions={
          <Button onClick={() => navigate('/waiter/orders/new')} className="gap-1">
            <Plus className="h-4 w-4" />
            <T text="New Order" />
          </Button>
        }
      />

      {/* Main action section */}
      <TableActionsSection />

      {/* Stats overview section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title={t("Active Tables")} 
          value="4" 
          icon={<Table className="h-4 w-4" />}
        />
        <StatCard 
          title={t("Guests Today")} 
          value="24" 
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard 
          title={t("Pending Orders")} 
          value="3" 
          icon={<UtensilsCrossed className="h-4 w-4" />}
        />
        <StatCard 
          title={t("Today's Sales")} 
          value="$345.50" 
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Main content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersSection />
          <QuickOrdersSection compact={true} />
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6 border-border">
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg"><T text="Active Tables" /></h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 p-4">
              <Card className="p-3 bg-primary/10 border-primary hover:shadow-sm transition-all">
                <div className="text-center">
                  <p className="font-medium">Table 2</p>
                  <p className="text-xs text-muted-foreground mt-1">4 {t("guests")} • 32m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-3 bg-amber-500/10 border-amber-500 hover:shadow-sm transition-all">
                <div className="text-center">
                  <p className="font-medium">Table 5</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t("guests")} • 15m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-3 bg-green-500/10 border-green-500 hover:shadow-sm transition-all">
                <div className="text-center">
                  <p className="font-medium">Table 7</p>
                  <p className="text-xs text-muted-foreground mt-1">6 {t("guests")} • 5m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
              
              <Card className="p-3 bg-blue-500/10 border-blue-500 hover:shadow-sm transition-all">
                <div className="text-center">
                  <p className="font-medium">Table 9</p>
                  <p className="text-xs text-muted-foreground mt-1">3 {t("guests")} • 22m</p>
                  <Button size="sm" className="w-full mt-2" onClick={() => navigate('/waiter/tables')}>
                    <T text="View" />
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-center p-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/waiter/tables')}>
                <T text="View All Tables" />
              </Button>
            </div>
          </Card>
          
          <Card className="border-border">
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg"><T text="Today's Tasks" /></h3>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-medium">{t("Process end-of-shift report")}</h4>
                  <p className="text-xs text-muted-foreground">{t("Due at end of shift")}</p>
                </div>
                <Button variant="outline" size="sm">
                  <T text="Complete" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-medium">{t("Restock service stations")}</h4>
                  <p className="text-xs text-muted-foreground">{t("Due before dinner service")}</p>
                </div>
                <Button variant="outline" size="sm">
                  <T text="Complete" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-medium">{t("Check table reservations")}</h4>
                  <p className="text-xs text-muted-foreground">{t("Due in 30 minutes")}</p>
                </div>
                <Button variant="outline" size="sm">
                  <T text="Complete" />
                </Button>
              </div>
              
              <div className="pt-2 flex justify-center">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/waiter/tasks')}>
                  <T text="View All Tasks" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
