
import React, { useState } from "react";
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
import { Plus, CheckCircle2, CheckCircle, AlertTriangle, Thermometer, Clock, ListChecks, Grid, List, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  
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
  
  // Filter checklists based on search term and frequency
  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrequency = frequencyFilter === "all" || checklist.frequency.toLowerCase() === frequencyFilter.toLowerCase();
    return matchesSearch && matchesFrequency;
  });
  
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
      <div className="p-4 flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <T text="Food Safety" />
        </h1>
      </div>
      
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
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search checklists...")}
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={t("Frequency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Frequencies" /></SelectItem>
                  <SelectItem value="daily"><T text="Daily" /></SelectItem>
                  <SelectItem value="weekly"><T text="Weekly" /></SelectItem>
                  <SelectItem value="monthly"><T text="Monthly" /></SelectItem>
                </SelectContent>
              </Select>
              
              <div className="border rounded-md flex">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <T text="View Completed" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-240px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChecklists.map((checklist) => (
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
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium"><T text="Checklist Name" /></th>
                        <th className="text-left p-4 font-medium"><T text="Frequency" /></th>
                        <th className="text-left p-4 font-medium"><T text="Required Time" /></th>
                        <th className="text-right p-4 font-medium"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredChecklists.map((checklist) => (
                        <tr key={checklist.id}>
                          <td className="p-4">{checklist.name}</td>
                          <td className="p-4 capitalize">{t(checklist.frequency)}</td>
                          <td className="p-4">{checklist.required_time || "-"}</td>
                          <td className="p-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startChecklist(checklist)}
                              className="flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <T text="Start" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
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
            <div className="flex items-center gap-2">
              <div className="border rounded-md flex">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" onClick={recordTemperature} className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <T text="Record" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-240px)]">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {temperatureLogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-base">{log.location}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatTime(log.recorded_at)} • {log.recorded_by}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xl font-semibold">{log.temperature}°C</div>
                          {renderStatusBadge(log.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg"><T text="Today's Temperature Logs" /></CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium"><T text="Location" /></th>
                        <th className="text-left p-4 font-medium"><T text="Time" /></th>
                        <th className="text-left p-4 font-medium"><T text="Recorded By" /></th>
                        <th className="text-left p-4 font-medium"><T text="Temperature" /></th>
                        <th className="text-right p-4 font-medium"><T text="Status" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {temperatureLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="p-4">{log.location}</td>
                          <td className="p-4">{formatTime(log.recorded_at)}</td>
                          <td className="p-4">{log.recorded_by}</td>
                          <td className="p-4 font-semibold">{log.temperature}°C</td>
                          <td className="p-4 text-right">{renderStatusBadge(log.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenFoodSafety;
