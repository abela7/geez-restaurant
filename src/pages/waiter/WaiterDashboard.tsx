
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/hooks/useStaffMembers";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { TableActionsSection } from "@/components/waiter/TableActionsSection";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import { RecentOrdersSection } from "@/components/waiter/RecentOrdersSection";
import ClockInOutCard from "@/components/staff/ClockInOutCard";
import TasksWidget from "@/components/staff/TasksWidget";
import StaffDashboardHeader from "@/components/staff/StaffDashboardHeader";

// Function to simulate quick order addition (will be replaced with real functionality)
const handleQuickOrderAdd = (order: any) => {
  toast.success(`${order.name} has been added to the order`);
};

const WaiterDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [staffProfile, setStaffProfile] = useState<StaffMember | null>(null);
  const [orderStats, setOrderStats] = useState({
    today: 0,
    pending: 0,
    completed: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, we'll use a hardcoded staff profile
        // In production, we would fetch this from the database based on auth user
        const demoStaffProfile = {
          id: "1",
          first_name: "Dawit",
          last_name: "Tekle",
          role: "waiter",
          performance: 92,
          total_customers_served: 456,
          total_orders_completed: 782,
          start_date: "2023-01-15"
        };
        
        setStaffProfile(demoStaffProfile as StaffMember);
        
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
  }, []);

  const createNewOrder = () => {
    navigate('/waiter/orders?new=true');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
            <div className="animate-pulse text-center">
              <div className="h-8 w-48 bg-muted rounded mb-4 mx-auto"></div>
              <div className="h-4 w-64 bg-muted rounded mb-2 mx-auto"></div>
              <div className="h-4 w-56 bg-muted rounded mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback if staff profile not found
  if (!staffProfile) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2"><T text="Staff Profile Not Found" /></h2>
            <p className="text-muted-foreground mb-4">
              <T text="Please contact an administrator to set up your staff profile." />
            </p>
            <Button onClick={() => navigate('/login')}>
              <T text="Back to Login" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const staffName = `${staffProfile.first_name || ""} ${staffProfile.last_name || ""}`.trim();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <StaffDashboardHeader 
        staffId={staffProfile.id}
        staffName={staffName}
        role={staffProfile.role}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <TableActionsSection />
          
          <Tabs defaultValue="overview">
            <TabsList className="w-full mb-2">
              <TabsTrigger value="overview" className="flex-1"><T text="Dashboard" /></TabsTrigger>
              <TabsTrigger value="quick-orders" className="flex-1"><T text="Quick Orders" /></TabsTrigger>
              <TabsTrigger value="recent-orders" className="flex-1"><T text="Recent Orders" /></TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-primary/10 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold">{orderStats.today}</div>
                      <div className="text-sm text-muted-foreground"><T text="Today's Orders" /></div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold">{orderStats.pending}</div>
                      <div className="text-sm text-muted-foreground"><T text="Pending Orders" /></div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold">{orderStats.completed}</div>
                      <div className="text-sm text-muted-foreground"><T text="Completed Orders" /></div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={createNewOrder}
                  >
                    <T text="Create New Order" />
                  </Button>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium"><T text="Quick Access" /></h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => navigate('/waiter/tables')}>
                        <T text="Table Management" />
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/waiter/payments')}>
                        <T text="Process Payment" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quick-orders">
              <QuickOrdersSection onAddToOrder={handleQuickOrderAdd} />
            </TabsContent>
            
            <TabsContent value="recent-orders">
              <RecentOrdersSection />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <ClockInOutCard staffId={staffProfile.id} staffName={staffName} />
          <TasksWidget staffId={staffProfile.id} staffName={staffName} />
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
