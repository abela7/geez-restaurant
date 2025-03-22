
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Plus, CheckCircle2, CheckCircle, AlertTriangle, Thermometer, Clock, ListChecks } from "lucide-react";

// Simple representation of a checklist template
interface ChecklistTemplate {
  id: string;
  name: string;
  frequency: string;
  role: string;
  required_time?: string;
}

// Simple representation of a temperature log
interface TemperatureLog {
  id: string;
  location: string;
  temperature: number;
  recorded_at: string;
  recorded_by: string;
  status: 'safe' | 'warning' | 'critical';
}

const KitchenFoodSafety = () => {
  const { t, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("checklists");
  
  // Query for checklists
  const { data: checklists = [], isLoading: checklistsLoading } = useQuery({
    queryKey: ["food-safety-checklists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_templates")
        .select("*")
        .eq("role", "kitchen")
        .order("name");
        
      if (error) throw error;
      return data as ChecklistTemplate[];
    },
  });
  
  // Temperature logs would be fetched from a real table in a complete implementation
  // Here we're using mock data for demonstration
  const temperatureLogs: TemperatureLog[] = [
    {
      id: "1",
      location: t("Walk-in Refrigerator"),
      temperature: 3.2,
      recorded_at: new Date().toISOString(),
      recorded_by: t("Kitchen Staff"),
      status: "safe"
    },
    {
      id: "2",
      location: t("Freezer"),
      temperature: -18.4,
      recorded_at: new Date().toISOString(),
      recorded_by: t("Kitchen Staff"),
      status: "safe"
    },
    {
      id: "3",
      location: t("Food Warming Station"),
      temperature: 58.1,
      recorded_at: new Date().toISOString(),
      recorded_by: t("Kitchen Staff"),
      status: "warning"
    }
  ];
  
  const startChecklist = (checklist: ChecklistTemplate) => {
    // In a real app, this would navigate to a dedicated checklist completion page
    toast.info(t(`Starting ${checklist.name} checklist`));
  };
  
  const recordTemperature = () => {
    // In a real app, this would open a form to record a new temperature
    toast.info(t("Temperature recording form will be implemented soon"));
  };
  
  const renderStatusBadge = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe':
        return <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />{t("Safe")}
        </Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />{t("Warning")}
        </Badge>;
      case 'critical':
        return <Badge variant="destructive">
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />{t("Critical")}
        </Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(
      currentLanguage === 'am' ? 'am-ET' : 'en-US',
      { hour: '2-digit', minute: '2-digit' }
    );
  };

  if (checklistsLoading) {
    return (
      <Layout interface="kitchen">
        <div className="p-4 flex justify-center items-center h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout interface="kitchen">
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <T text="Food Safety" />
        </h1>
        
        <Tabs defaultValue="checklists" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="checklists" className="flex-1">
              <ListChecks className="h-4 w-4 mr-2" />
              <T text="Checklists" />
            </TabsTrigger>
            <TabsTrigger value="temperature" className="flex-1">
              <Thermometer className="h-4 w-4 mr-2" />
              <T text="Temperature Logs" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checklists" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <T text="View Completed" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklists.map((checklist) => (
                  <Card key={checklist.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-base">{checklist.name}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="capitalize">{t(checklist.frequency)}</span>
                            {checklist.required_time && (
                              <span className="ml-2">• {checklist.required_time}</span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startChecklist(checklist)}
                          className="flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <T text="Start" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="temperature" className="mt-0">
            <div className="flex justify-between mb-4 flex-wrap gap-2">
              <div className="flex gap-2 items-center flex-wrap">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
                  <T text="Safe: < 5°C or > 63°C" />
                </Badge>
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                  <T text="Warning: 5-8°C or 54-63°C" />
                </Badge>
                <Badge variant="destructive">
                  <T text="Critical: 8-54°C" />
                </Badge>
              </div>
              <Button size="sm" onClick={recordTemperature} className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <T text="Record" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg"><T text="Today's Temperature Logs" /></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {temperatureLogs.map((log) => (
                      <div key={log.id} className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="font-medium">{log.location}</h3>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatTime(log.recorded_at)} • {log.recorded_by}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-xl font-semibold">{log.temperature}°C</div>
                            {renderStatusBadge(log.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default KitchenFoodSafety;
