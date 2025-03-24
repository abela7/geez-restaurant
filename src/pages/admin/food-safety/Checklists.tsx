import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Plus, RotateCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import ChecklistCard from "@/components/food-safety/ChecklistCard";
import ChecklistForm from "@/components/food-safety/ChecklistForm";

// Hooks
import { ChecklistTemplate, useChecklistTemplates } from "@/hooks/useChecklistTemplates";
import { useChecklistLogs } from "@/hooks/useChecklistLogs";
import useStaffMembers from "@/hooks/useStaffMembers";

const ChecklistsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: allTemplates = [], isLoading: isLoadingTemplates } = useChecklistTemplates();
  const { data: logs = [] } = useChecklistLogs();
  const { data: staffMembers = [] } = useStaffMembers();
  
  const [activeTemplate, setActiveTemplate] = useState<ChecklistTemplate | null>(null);
  
  // Group templates by role
  const kitchenTemplates = allTemplates.filter(template => template.role === "kitchen");
  const waiterTemplates = allTemplates.filter(template => template.role === "waiter");
  const managerTemplates = allTemplates.filter(template => template.role === "manager");
  
  // Get the current user's staff ID (this would come from auth in a real implementation)
  // For now, we'll just use the first staff member for demo purposes
  const currentStaffId = staffMembers.length > 0 ? staffMembers[0].id : "";
  
  // Get last completed date for each template
  const getLastCompletedAt = (templateId: string) => {
    const templateLogs = logs.filter(log => log.template_id === templateId);
    if (templateLogs.length === 0) return null;
    
    return templateLogs.sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )[0].completed_at;
  };
  
  const handleStartChecklist = (template: ChecklistTemplate) => {
    setActiveTemplate(template);
  };
  
  const handleCompleteChecklist = () => {
    setActiveTemplate(null);
  };
  
  const handleCreateChecklist = () => {
    navigate("/admin/food-safety/checklists/new");
  };
  
  if (isLoadingTemplates) {
    return (
      <div>
        <PageHeader
          heading={<T text="Food Safety Checklists" />}
          description={<T text="View and complete food safety checklists" />}
        />
        <div className="flex justify-center items-center py-20">
          <RotateCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  
  if (activeTemplate) {
    return (
      <div>
        <PageHeader
          heading={activeTemplate.name}
          description={<T text="Complete the food safety checklist" />}
          backHref="/admin/food-safety/checklists"
        />
        
        <ChecklistForm
          template={activeTemplate}
          staffId={currentStaffId}
          onComplete={handleCompleteChecklist}
        />
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        heading={<T text="Food Safety Checklists" />}
        description={<T text="View and complete food safety checklists" />}
        backHref="/admin/food-safety"
        actions={
          <Button onClick={handleCreateChecklist}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Checklist" />
          </Button>
        }
      />
      
      <Tabs defaultValue="kitchen">
        <TabsList className="mb-6">
          <TabsTrigger value="kitchen"><T text="Kitchen" /></TabsTrigger>
          <TabsTrigger value="waiter"><T text="Front of House" /></TabsTrigger>
          <TabsTrigger value="manager"><T text="Management" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="kitchen">
          {kitchenTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchenTemplates.map((template) => (
                <ChecklistCard
                  key={template.id}
                  template={template}
                  lastCompletedAt={getLastCompletedAt(template.id)}
                  onStartChecklist={() => handleStartChecklist(template)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <T text="No kitchen checklists found." />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="waiter">
          {waiterTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waiterTemplates.map((template) => (
                <ChecklistCard
                  key={template.id}
                  template={template}
                  lastCompletedAt={getLastCompletedAt(template.id)}
                  onStartChecklist={() => handleStartChecklist(template)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <T text="No waiter checklists found." />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="manager">
          {managerTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managerTemplates.map((template) => (
                <ChecklistCard
                  key={template.id}
                  template={template}
                  lastCompletedAt={getLastCompletedAt(template.id)}
                  onStartChecklist={() => handleStartChecklist(template)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <T text="No manager checklists found." />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChecklistsPage;
