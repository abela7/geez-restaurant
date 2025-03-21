
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useWaiterInfo } from "@/hooks/useWaiterInfo";
import { TableActionsSection } from "@/components/waiter/TableActionsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useStaffTasks from "@/hooks/useStaffTasks";

// Mock orders data - would be fetched from API in production
const mockOrders = [
  { id: "ORD-001", table: "Table 2", items: 4, time: "10 min ago", status: "pending" },
  { id: "ORD-002", table: "Table 5", items: 2, time: "15 min ago", status: "preparing" },
  { id: "ORD-003", table: "Takeout", items: 3, time: "20 min ago", status: "preparing" },
  { id: "ORD-004", table: "Table 9", items: 1, time: "25 min ago", status: "pending" },
  { id: "ORD-005", table: "Table 3", items: 5, time: "30 min ago", status: "declined" }
];

// Active tables component
const ActiveTables = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card className="mb-4 border-border">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium text-sm"><T text="Active Tables" /></h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/waiter/tables')}>
          <T text="View All" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
        <Card className="p-2 bg-primary/10 border-primary hover:shadow-sm transition-all cursor-pointer"
          onClick={() => navigate('/waiter/tables')}>
          <div className="text-center">
            <p className="font-medium">Table 2</p>
            <p className="text-xs text-muted-foreground">4 {t("guests")} • 32m</p>
          </div>
        </Card>
        
        <Card className="p-2 bg-amber-500/10 border-amber-500 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => navigate('/waiter/tables')}>
          <div className="text-center">
            <p className="font-medium">Table 5</p>
            <p className="text-xs text-muted-foreground">2 {t("guests")} • 15m</p>
          </div>
        </Card>
        
        <Card className="p-2 bg-green-500/10 border-green-500 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => navigate('/waiter/tables')}>
          <div className="text-center">
            <p className="font-medium">Table 7</p>
            <p className="text-xs text-muted-foreground">6 {t("guests")} • 5m</p>
          </div>
        </Card>
        
        <Card className="p-2 bg-blue-500/10 border-blue-500 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => navigate('/waiter/tables')}>
          <div className="text-center">
            <p className="font-medium">Table 9</p>
            <p className="text-xs text-muted-foreground">3 {t("guests")} • 22m</p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

// Pending Task Card component
const PendingTaskCard = ({ task, onComplete }) => {
  const { t } = useLanguage();
  
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
      case 'medium': return "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800";
      default: return "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800";
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <Card className={`mb-4 ${getPriorityColor(task.priority)}`}>
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex items-start gap-2">
            {getPriorityIcon(task.priority)}
            <div>
              <h3 className="font-medium text-sm">{task.title}</h3>
              {task.description && <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>}
              {task.due_time && <p className="text-xs text-muted-foreground mt-0.5">{t("Due")}: {task.due_time}</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-7" onClick={() => onComplete(task.id)}>
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            <T text="Complete" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const WaiterDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { waiter } = useWaiterInfo();
  const [activeTab, setActiveTab] = useState("pending");
  
  // Mocked staff ID - in a real app, this would come from auth context or similar
  const staffId = "1";
  const { tasks, updateTask } = useStaffTasks(staffId);
  
  const pendingTasks = tasks.filter(task => task.status !== "Completed");
  
  const handleCompleteTask = async (taskId) => {
    await updateTask(taskId, { status: "Completed", completed_at: new Date().toISOString() });
  };
  
  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => order.status === activeTab);
  
  return (
    <div className="space-y-3 waiter-dashboard">
      <PageHeader 
        title={waiter?.name ? `${t("Hello")}, ${waiter.name}` : ""}
        actions={
          <Button onClick={() => navigate('/waiter/orders/new')} size="sm" className="gap-1 h-8">
            <Plus className="h-3.5 w-3.5" />
            <T text="New Order" />
          </Button>
        }
        compact={true}
      />

      {/* Pending Tasks Section */}
      {pendingTasks.length > 0 && (
        <>
          {pendingTasks.map(task => (
            <PendingTaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
          ))}
        </>
      )}

      {/* Main action section */}
      <TableActionsSection />

      {/* Active Tables */}
      <ActiveTables />

      {/* Orders Section with Tabs */}
      <Card className="border-border">
        <div className="p-2 border-b">
          <h3 className="font-medium text-sm"><T text="Orders" /></h3>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-2 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="pending">
                <T text="Pending" />
              </TabsTrigger>
              <TabsTrigger value="preparing">
                <T text="Preparing" />
              </TabsTrigger>
              <TabsTrigger value="declined">
                <T text="Declined" />
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="p-2">
            {filteredOrders.length > 0 ? (
              <div className="space-y-2">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="p-3 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(`/waiter/orders`)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-sm">{order.id}</h4>
                        <p className="text-xs text-muted-foreground">{order.table} • {order.items} items</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p><T text="No orders found" /></p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default WaiterDashboard;
