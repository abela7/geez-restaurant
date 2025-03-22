
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Clock, Package, AlertCircle, CheckCircle } from "lucide-react";
import ActiveOrdersPanel from "@/components/kitchen/ActiveOrdersPanel";
import KitchenTimer from "@/components/kitchen/KitchenTimer";

// Sample data for the dashboard stats
const kitchenStats = {
  ordersInQueue: 5,
  averagePrepTime: 14, // minutes
  lowStockItems: 3,
  completedOrders: 18
};

const KitchenDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4">
      <PageHeader 
        title="Kitchen Dashboard" 
        description="Monitor kitchen operations and manage orders"
      />
      
      {/* Kitchen Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="p-2 rounded-full bg-amber-100 text-amber-700 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Orders in Queue" /></p>
              <p className="text-2xl font-bold">{kitchenStats.ordersInQueue}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Avg. Prep Time" /></p>
              <p className="text-2xl font-bold">{kitchenStats.averagePrepTime} <span className="text-sm">min</span></p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="p-2 rounded-full bg-red-100 text-red-700 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Low Stock Items" /></p>
              <p className="text-2xl font-bold">{kitchenStats.lowStockItems}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="p-2 rounded-full bg-green-100 text-green-700 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Completed Today" /></p>
              <p className="text-2xl font-bold">{kitchenStats.completedOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Active Orders Panel */}
          <ActiveOrdersPanel />
          
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <T text="Inventory Alerts" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="low">
                <TabsList className="mb-3">
                  <TabsTrigger value="low"><T text="Low Stock" /></TabsTrigger>
                  <TabsTrigger value="out"><T text="Out of Stock" /></TabsTrigger>
                </TabsList>
                <TabsContent value="low">
                  <div className="space-y-2">
                    <div className="p-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">Berbere Spice</span>
                        <span className="ml-2 text-sm text-muted-foreground">250g remaining</span>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">Running Low</span>
                    </div>
                    <div className="p-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">Chicken Breast</span>
                        <span className="ml-2 text-sm text-muted-foreground">1.2kg remaining</span>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">Running Low</span>
                    </div>
                    <div className="p-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">Honey</span>
                        <span className="ml-2 text-sm text-muted-foreground">350ml remaining</span>
                      </div>
                      <span className="text-sm text-amber-600 font-medium">Running Low</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="out">
                  <div className="space-y-2">
                    <div className="p-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">Fresh Rosemary</span>
                      </div>
                      <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                    </div>
                    <div className="p-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">Tej (Honey Wine)</span>
                      </div>
                      <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Kitchen Timers */}
          <KitchenTimer />
          
          {/* Daily Prep Tasks */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle><T text="Daily Preparation" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="task1" className="h-4 w-4 mr-2" />
                  <label htmlFor="task1" className="text-sm">Prepare Berbere spice mix</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="task2" className="h-4 w-4 mr-2" />
                  <label htmlFor="task2" className="text-sm">Make base sauce for Doro Wat</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="task3" className="h-4 w-4 mr-2" />
                  <label htmlFor="task3" className="text-sm">Prepare vegetable sides</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="task4" className="h-4 w-4 mr-2" />
                  <label htmlFor="task4" className="text-sm">Marinate meat for Tibs</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="task5" className="h-4 w-4 mr-2" />
                  <label htmlFor="task5" className="text-sm">Prepare Injera batter</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
