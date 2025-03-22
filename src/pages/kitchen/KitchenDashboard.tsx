
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Users, ChefHat, AlertTriangle, CheckCircle2 } from "lucide-react";

const KitchenDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <PageHeader
        title={<T text="Kitchen Dashboard" />}
        description={<T text="Overview of kitchen operations" />}
        className="mb-4"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <T text="Current Orders" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              <T text="4 pending, 8 in preparation" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ChefHat className="mr-2 h-4 w-4 text-muted-foreground" />
              <T text="Active Staff" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              <T text="3 chefs, 2 assistants" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              <T text="Inventory Alerts" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              <T text="Items requiring attention" />
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <T text="Pending Orders" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3, 4].map((order) => (
                <div key={order} className="p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">
                        <T text="Order" /> #{Math.floor(Math.random() * 10000)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <T text="Table" /> #{Math.floor(Math.random() * 20)}
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded text-xs font-medium">
                      <T text="Pending" />
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">3 × </span> Doro Wat<br />
                    <span className="font-medium">2 × </span> Tibs
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <T text="Today's Tasks" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { title: "Prepare injera batter", status: "completed" },
                { title: "Marinate beef for tibs", status: "completed" },
                { title: "Check spice inventory", status: "pending" },
                { title: "Clean kitchen area", status: "pending" },
                { title: "Prepare berbere mix", status: "pending" }
              ].map((task, index) => (
                <div key={index} className="p-4 hover:bg-muted/50 flex items-start">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 border-2 rounded-full mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                    {t(task.title)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <T text="Menu Availability" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="unavailable">
            <div className="px-4 pt-2">
              <TabsList>
                <TabsTrigger value="unavailable">
                  <T text="Unavailable Items" />
                </TabsTrigger>
                <TabsTrigger value="available">
                  <T text="All Items" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="unavailable" className="p-0 mt-0">
              <div className="divide-y">
                {[
                  { name: "Kitfo Special", category: "Main Course" },
                  { name: "Shiro", category: "Vegetarian" },
                  { name: "Special Tibs", category: "Main Course" }
                ].map((item, index) => (
                  <div key={index} className="p-4 hover:bg-muted/50 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{t(item.category)}</div>
                    </div>
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      <T text="Mark Available" />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="available" className="mt-0">
              <div className="p-4 text-center text-muted-foreground">
                <T text="View all menu items and their availability status" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KitchenDashboard;
