
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ClipboardCheck, 
  ThermometerSun, 
  AlertTriangle, 
  RotateCw, 
  Clock, 
  CheckCircle2,
  CalendarDays,
  Utensils
} from "lucide-react";

// Import the components from the food-safety folder
import ChecklistCard from "@/components/food-safety/ChecklistCard";
import ChecklistForm from "@/components/food-safety/ChecklistForm";
import ChecklistComplianceCard from "@/components/food-safety/ChecklistComplianceCard";
import ChecklistPendingCard from "@/components/food-safety/ChecklistPendingCard";

// Import related hooks
import { ChecklistTemplate, useChecklistTemplates } from "@/hooks/useChecklistTemplates";
import { useChecklistLogs } from "@/hooks/useChecklistLogs";
import useStaffMembers from "@/hooks/useStaffMembers";

const KitchenFoodSafety = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("checklists");
  const [activeTemplate, setActiveTemplate] = useState<ChecklistTemplate | null>(null);
  
  // Fetch food safety data
  const { data: templates = [], isLoading: isLoadingTemplates } = useChecklistTemplates("kitchen");
  const { data: staffMembers = [] } = useStaffMembers();
  const { data: logs = [], isLoading: isLoadingLogs } = useChecklistLogs();
  
  // Get the current user's staff ID (this would come from auth in a real implementation)
  const currentStaffId = staffMembers.length > 0 ? staffMembers[0].id : "";
  
  // Get last completed date for each template
  const getLastCompletedAt = (templateId: string) => {
    const templateLogs = logs.filter(log => log.template_id === templateId);
    if (templateLogs.length === 0) return null;
    
    return templateLogs.sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )[0].completed_at;
  };
  
  // Determine pending checklists (ones that should be done today but aren't)
  const getPendingChecklists = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return templates.filter(template => {
      const lastCompletedAt = getLastCompletedAt(template.id);
      if (!lastCompletedAt) return true;
      
      const lastCompleted = new Date(lastCompletedAt);
      lastCompleted.setHours(0, 0, 0, 0);
      
      return lastCompleted.getTime() !== today.getTime();
    });
  };
  
  const pendingChecklists = getPendingChecklists();
  
  const handleStartChecklist = (template: ChecklistTemplate) => {
    setActiveTemplate(template);
  };
  
  const handleCompleteChecklist = () => {
    setActiveTemplate(null);
    toast.success(t("Checklist completed successfully"));
  };
  
  if (isLoadingTemplates || isLoadingLogs) {
    return (
      <Layout interface="kitchen">
        <div className="p-4 flex justify-center items-center h-[70vh]">
          <RotateCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (activeTemplate) {
    return (
      <Layout interface="kitchen">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveTemplate(null)}
            className="mb-4"
          >
            ← <T text="Back to checklists" />
          </Button>
          
          <h1 className="text-xl font-semibold mb-4">{activeTemplate.name}</h1>
          
          <ChecklistForm
            template={activeTemplate}
            staffId={currentStaffId}
            onComplete={handleCompleteChecklist}
          />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout interface="kitchen">
      <div className="p-4">
        <Tabs defaultValue="checklists" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="checklists">
              <ClipboardCheck className="h-4 w-4 mr-1.5" />
              <T text="Checklists" />
            </TabsTrigger>
            <TabsTrigger value="temperature">
              <ThermometerSun className="h-4 w-4 mr-1.5" />
              <T text="Temperature Logs" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checklists" className="space-y-4">
            {pendingChecklists.length > 0 && (
              <ChecklistPendingCard pendingChecklists={pendingChecklists} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.length > 0 ? (
                templates.map((template) => (
                  <ChecklistCard
                    key={template.id}
                    template={template}
                    lastCompletedAt={getLastCompletedAt(template.id)}
                    onStartChecklist={() => handleStartChecklist(template)}
                  />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                    <p className="text-muted-foreground">
                      <T text="No checklists found for kitchen staff" />
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="temperature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  <T text="Temperature Monitoring" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium"><T text="Refrigerator #1" /></h3>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <T text="Normal" />
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><T text="Current" /></span>
                      <span className="font-medium">2.1°C</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span><T text="Target Range" /></span>
                      <span>1-4°C</span>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span><T text="Last checked: 30 minutes ago" /></span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium"><T text="Freezer #1" /></h3>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        <T text="Warning" />
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><T text="Current" /></span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">-15.8°C</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span><T text="Target Range" /></span>
                      <span>-18 to -22°C</span>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span><T text="Last checked: 1 hour ago" /></span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button size="sm" className="w-full">
                    <CalendarDays className="h-4 w-4 mr-1.5" />
                    <T text="Log New Temperature Reading" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  <T text="Recent Temperature Logs" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y border-t">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="p-3 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium">{`Refrigerator #${item % 2 + 1}`}</div>
                        <div className="text-muted-foreground text-xs">Today, {item + 7}:30 AM</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{(Math.random() * 4 + 1).toFixed(1)}°C</div>
                        <div className="text-xs text-green-600 dark:text-green-400"><T text="Normal" /></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <T text="View All Temperature Logs" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default KitchenFoodSafety;
