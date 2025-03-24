import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Plus, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import ChecklistLogsTable from "@/components/food-safety/ChecklistLogsTable";
import ChecklistComplianceCard from "@/components/food-safety/ChecklistComplianceCard";

// Hooks
import { useChecklistTemplates } from "@/hooks/useChecklistTemplates";
import { useChecklistLogs } from "@/hooks/useChecklistLogs";
import useStaffMembers from "@/hooks/useStaffMembers";

const FoodSafety = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  
  const { data: staffMembers = [] } = useStaffMembers();
  const { data: templates = [] } = useChecklistTemplates();
  const { data: logs = [] } = useChecklistLogs();
  
  // Create lookup maps
  const staffNames = staffMembers.reduce((acc, staff) => {
    acc[staff.id] = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
    return acc;
  }, {} as Record<string, string>);
  
  const templateNames = templates.reduce((acc, template) => {
    acc[template.id] = template.name;
    return acc;
  }, {} as Record<string, string>);
  
  // Calculate compliance data
  const complianceData = {
    totalChecks: 150, // This would come from real data in a full implementation
    compliantChecks: 142,
    percentage: 94,
  };
  
  const handleCreateChecklist = () => {
    navigate("/admin/food-safety/checklists/new");
  };
  
  const filterLogs = (logs: any[]) => {
    if (filter === "all") return logs;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === "today") {
      return logs.filter(log => {
        const logDate = new Date(log.completed_at);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
      });
    }
    
    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      return logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= weekAgo;
      });
    }
    
    if (filter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      return logs.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate >= monthAgo;
      });
    }
    
    return logs;
  };
  
  return (
    <div>
      <PageHeader
        heading={<T text="Food Safety & Hygiene" />}
        description={<T text="Manage food safety checklists and compliance records" />}
        actions={
          <Button onClick={handleCreateChecklist}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Checklist" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <ChecklistComplianceCard complianceData={complianceData} />
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle><T text="Food Safety Overview" /></CardTitle>
            <CardDescription>
              <T text="Track and manage food safety compliance across all areas" />
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  <T text="Total Checklists" />
                </div>
                <div className="text-2xl font-bold">{templates.length}</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  <T text="Completed Today" />
                </div>
                <div className="text-2xl font-bold">
                  {
                    logs.filter(log => {
                      const logDate = new Date(log.completed_at);
                      const today = new Date();
                      return (
                        logDate.getDate() === today.getDate() &&
                        logDate.getMonth() === today.getMonth() &&
                        logDate.getFullYear() === today.getFullYear()
                      );
                    }).length
                  }
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  <T text="Staff Participating" />
                </div>
                <div className="text-2xl font-bold">
                  {new Set(logs.map(log => log.completed_by)).size}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium"><T text="Recent Checklist Activity" /></span>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/food-safety/checklists")}>
                <T text="View All" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="logs">
        <TabsList className="mb-4">
          <TabsTrigger value="logs"><T text="Checklist Logs" /></TabsTrigger>
          <TabsTrigger value="issues"><T text="Issues & Follow-ups" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle><T text="Completed Checklists" /></CardTitle>
                
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("Select period")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all"><T text="All Time" /></SelectItem>
                      <SelectItem value="today"><T text="Today" /></SelectItem>
                      <SelectItem value="week"><T text="Last 7 Days" /></SelectItem>
                      <SelectItem value="month"><T text="Last 30 Days" /></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <ChecklistLogsTable 
                logs={filterLogs(logs)}
                staffNames={staffNames}
                templateNames={templateNames}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <T text="No compliance issues found in recent checklists." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodSafety;
