
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Calendar, Utensils, DollarSign, Users, Bell, ClipboardList } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample active orders data
const activeOrders = [
  { id: 1, table: "Table 5", status: "Ready", time: "5 mins ago", items: 4 },
  { id: 2, table: "Table 8", status: "Preparing", time: "12 mins ago", items: 3 },
  { id: 3, table: "Table 2", status: "Order Placed", time: "2 mins ago", items: 6 },
];

// Sample notifications
const notifications = [
  { id: 1, message: "Order #1 is ready for pickup", time: "Just now", type: "Order" },
  { id: 2, message: "Table 10 requested assistance", time: "5 mins ago", type: "Table" },
  { id: 3, message: "New task assigned: End of day report", time: "15 mins ago", type: "Task" },
];

// Sample upcoming shifts
const shifts = [
  { id: 1, date: "Today", time: "5:00 PM - 11:00 PM", type: "Dinner Service" },
  { id: 2, date: "Tomorrow", time: "11:00 AM - 3:00 PM", type: "Lunch Service" },
  { id: 3, date: "Jul 15", time: "5:00 PM - 11:00 PM", type: "Dinner Service" },
];

const WaiterDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Waiter Dashboard")} 
        description={t("Manage your tables, orders, and tasks")}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title={t("Active Tables")} 
          value="4" 
          icon={<Users size={18} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg"><T text="Active Orders" /></h3>
              <Button size="sm" onClick={() => window.location.href = '/waiter/orders'}>
                <T text="View All Orders" />
              </Button>
            </div>
            
            <div className="divide-y">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{t(order.table)}</h4>
                      <Badge 
                        variant={
                          order.status === "Ready" ? "default" : 
                          order.status === "Preparing" ? "outline" : 
                          "secondary"
                        }
                      >
                        {t(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{order.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Utensils className="h-3 w-3 mr-1" />
                        <span>{order.items} {t("items")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <T text="Details" />
                    </Button>
                    {order.status === "Ready" && (
                      <Button size="sm">
                        <T text="Serve" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Tabs defaultValue="tables">
            <TabsList className="mb-4">
              <TabsTrigger value="tables">
                <Users className="h-4 w-4 mr-2" />
                <T text="My Tables" />
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <ClipboardList className="h-4 w-4 mr-2" />
                <T text="My Tasks" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tables">
              <Card className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <Card className="p-3 bg-primary/10 border-primary">
                    <div className="text-center">
                      <p className="font-medium">Table 2</p>
                      <Badge variant="outline" className="mt-1">{t("Occupied")}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">4 {t("guests")} • 32m</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => window.location.href = '/waiter/tables'}>
                        <T text="View" />
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-3 bg-amber-500/10 border-amber-500">
                    <div className="text-center">
                      <p className="font-medium">Table 5</p>
                      <Badge variant="outline" className="mt-1">{t("Order Ready")}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">2 {t("guests")} • 15m</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => window.location.href = '/waiter/tables'}>
                        <T text="View" />
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-3 bg-primary/10 border-primary">
                    <div className="text-center">
                      <p className="font-medium">Table 7</p>
                      <Badge variant="outline" className="mt-1">{t("Occupied")}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">6 {t("guests")} • 45m</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => window.location.href = '/waiter/tables'}>
                        <T text="View" />
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="text-center">
                      <p className="font-medium">Table 8</p>
                      <Badge variant="secondary" className="mt-1">{t("Preparing")}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">3 {t("guests")} • 22m</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => window.location.href = '/waiter/tables'}>
                        <T text="View" />
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-3 bg-muted">
                    <div className="text-center">
                      <p className="font-medium">Table 1</p>
                      <Badge variant="secondary" className="mt-1">{t("Available")}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">4 {t("seats")}</p>
                      <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => window.location.href = '/waiter/tables'}>
                        <T text="Assign" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <Card>
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium"><T text="Today's Tasks" /></h3>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/waiter/tasks'}>
                    <T text="All Tasks" />
                  </Button>
                </div>
                
                <div className="divide-y">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{t("Process end-of-shift report")}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{t("Due at end of shift")}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Complete" />
                    </Button>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{t("Restock service stations")}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{t("Due before dinner service")}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Complete" />
                    </Button>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{t("Assist with table setting")}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{t("Completed at 4:30 PM")}</p>
                    </div>
                    <Badge>
                      <T text="Completed" />
                    </Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium"><T text="My Profile" /></h3>
              <Button variant="ghost" size="sm">
                <T text="Edit" />
              </Button>
            </div>
            
            <div className="p-4 flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-4">
                <img src="/placeholder.svg" alt="Dawit Tadesse" />
              </Avatar>
              <h3 className="font-medium text-lg">Dawit Tadesse</h3>
              <p className="text-sm text-muted-foreground">{t("Senior Waiter")}</p>
              
              <div className="grid grid-cols-3 gap-2 w-full mt-6 text-center">
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">12</p>
                  <p className="text-xs text-muted-foreground"><T text="Tables" /></p>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">95%</p>
                  <p className="text-xs text-muted-foreground"><T text="Rating" /></p>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">$145</p>
                  <p className="text-xs text-muted-foreground"><T text="Tips" /></p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="mb-6">
            <div className="p-4 border-b">
              <h3 className="font-medium"><T text="Notifications" /></h3>
            </div>
            
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{t(notification.message)}</p>
                    <Badge variant="outline">{t(notification.type)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
            
            <div className="p-3 text-center border-t">
              <Button variant="ghost" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                <T text="View All Notifications" />
              </Button>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-medium"><T text="Upcoming Shifts" /></h3>
            </div>
            
            <div className="divide-y">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{shift.date}</p>
                      <p className="text-sm text-muted-foreground">{shift.time}</p>
                    </div>
                    <Badge variant="outline">{t(shift.type)}</Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 text-center border-t">
              <Button variant="ghost" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                <T text="View Schedule" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
