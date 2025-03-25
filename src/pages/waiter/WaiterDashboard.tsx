
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Users, ShoppingBag, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { T } from "@/contexts/LanguageContext";

// Import our new components
import { TableActionsSection } from "@/components/waiter/TableActionsSection";
import { RecentOrdersSection } from "@/components/waiter/RecentOrdersSection";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import ClockInOutCard from "@/components/staff/ClockInOutCard";
import TasksWidget from "@/components/staff/TasksWidget";
import StaffDashboardHeader from "@/components/staff/StaffDashboardHeader";

const WaiterDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    today: 0,
    pending: 0,
    completed: 0
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // For sample data, we'll set some dummy stats
        // In a production app, you would fetch real data from the database
        setOrderStats({
          today: 12,
          pending: 3,
          completed: 9
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
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback if user not found
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2"><T text="User Not Found" /></h2>
        <p className="text-muted-foreground">
          <T text="Please login to access your dashboard." />
        </p>
      </div>
    );
  }

  const staffName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.username;

  return (
    <div className="space-y-4">
      <StaffDashboardHeader 
        staffId={user.id}
        staffName={staffName}
        role={user.role}
      />

      {/* Quick Actions Section */}
      <TableActionsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Orders Section */}
          <RecentOrdersSection />
          
          {/* Order Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <T text="Today's Orders" />
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderStats.today}</div>
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
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderStats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  <T text="Need your attention" />
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <T text="Served Orders" />
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderStats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  <T text="Completed today" />
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Orders Section */}
          <QuickOrdersSection />
        </div>
        
        <div className="space-y-4">
          <ClockInOutCard staffId={user.id} staffName={staffName} />
          <TasksWidget staffId={user.id} staffName={staffName} />
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
