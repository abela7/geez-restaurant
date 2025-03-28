
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Utensils, AlertCircle, Package, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/hooks/useStaffMembers";
import { T } from "@/contexts/LanguageContext";

// Import our new components
import ClockInOutCard from "@/components/staff/ClockInOutCard";
import TasksWidget from "@/components/staff/TasksWidget";
import StaffDashboardHeader from "@/components/staff/StaffDashboardHeader";

const KitchenDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [staffProfile, setStaffProfile] = useState<StaffMember | null>(null);
  const [kitchenStats, setKitchenStats] = useState({
    orders: 0,
    pending: 0,
    completed: 0,
    lowStock: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Get staff profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        setStaffProfile(profileData as StaffMember);
        
        // For sample data, we'll set some dummy stats
        // In a production app, you would fetch real data from the database
        setKitchenStats({
          orders: 15,
          pending: 4,
          completed: 11,
          lowStock: 3
        });
        
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback if staff profile not found
  if (!staffProfile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2"><T text="Staff Profile Not Found" /></h2>
        <p className="text-muted-foreground">
          <T text="Please contact an administrator to set up your staff profile." />
        </p>
      </div>
    );
  }

  const staffName = `${staffProfile.first_name || ""} ${staffProfile.last_name || ""}`.trim();

  return (
    <div className="space-y-6">
      <StaffDashboardHeader 
        staffId={staffProfile.id}
        staffName={staffName}
        role={staffProfile.role}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="h-full space-y-6">
            <TabsList>
              <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
              <TabsTrigger value="orders"><T text="Orders" /></TabsTrigger>
              <TabsTrigger value="inventory"><T text="Inventory" /></TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <T text="Today's Orders" />
                    </CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchenStats.orders}</div>
                    <p className="text-xs text-muted-foreground">
                      +{Math.floor(Math.random() * 20)}% <T text="from yesterday" />
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <T text="Pending Orders" />
                    </CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchenStats.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      <T text="Need your attention" />
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <T text="Low Stock Items" />
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchenStats.lowStock}</div>
                    <p className="text-xs text-muted-foreground">
                      <T text="Items need restocking" />
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle><T text="Kitchen Productivity" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-6">
                    <Package className="h-8 w-8 mx-auto mb-2" />
                    <T text="Productivity metrics will be available soon" />
                  </p>
                  {/* We will implement this in future updates */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle><T text="Pending Orders" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-6">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                    <T text="Order queue will be available soon" />
                  </p>
                  {/* We will implement this in future updates */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle><T text="Low Stock Alerts" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-6">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <T text="Inventory alerts will be available soon" />
                  </p>
                  {/* We will implement this in future updates */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <ClockInOutCard staffId={staffProfile.id} staffName={staffName} />
          <TasksWidget staffId={staffProfile.id} staffName={staffName} />
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
