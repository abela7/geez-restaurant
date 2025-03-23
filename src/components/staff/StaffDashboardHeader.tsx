
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { T } from "@/contexts/LanguageContext";

interface StaffDashboardHeaderProps {
  staffId: string;
  staffName: string;
  role: string;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({ 
  staffId, 
  staffName,
  role
}) => {
  const [greeting, setGreeting] = useState("Good day");
  const [timeMessage, setTimeMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    setTimeMessage(format(new Date(), "EEEE, MMMM d, yyyy"));
  }, []);

  // Load attendance data on initial render
  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        // This would fetch today's orders, tasks, etc.
        // For now, we'll just add a welcome toast
        
        // Check if this is the first visit today
        const today = format(new Date(), 'yyyy-MM-dd');
        const localStorageKey = `last_visit_${staffId}`;
        const lastVisit = localStorage.getItem(localStorageKey);
        
        if (lastVisit !== today) {
          // First visit today
          toast({
            title: `${greeting}, ${staffName}!`,
            description: `Welcome back. Today is ${timeMessage}.`,
          });
          
          localStorage.setItem(localStorageKey, today);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchTodayStats();
  }, [staffId, staffName, greeting, timeMessage]);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting}, {staffName}!
            </h1>
            <p className="text-blue-100">{timeMessage}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              <span className="font-medium"><T text={role} /></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffDashboardHeader;
