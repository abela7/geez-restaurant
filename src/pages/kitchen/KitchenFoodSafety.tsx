
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { RotateCw } from "lucide-react";

// Components
import ChecklistCard from "@/components/food-safety/ChecklistCard";
import ChecklistForm from "@/components/food-safety/ChecklistForm";
import ChecklistPendingCard from "@/components/food-safety/ChecklistPendingCard";

// Hooks
import { ChecklistTemplate, useChecklistTemplates } from "@/hooks/useChecklistTemplates";
import { useChecklistLogs } from "@/hooks/useChecklistLogs";
import useStaffMembers from "@/hooks/useStaffMembers";

const KitchenFoodSafety = () => {
  const { t } = useLanguage();
  
  const { data: templates = [], isLoading: isLoadingTemplates } = useChecklistTemplates("kitchen");
  const { data: staffMembers = [] } = useStaffMembers();
  const { data: logs = [] } = useChecklistLogs();
  
  const [activeTemplate, setActiveTemplate] = useState<ChecklistTemplate | null>(null);
  
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
  };
  
  if (isLoadingTemplates) {
    return (
      <Layout interface="kitchen">
        <PageHeader
          heading={<T text="Food Safety Checklists" />}
          description={<T text="Maintain food safety standards in the kitchen" />}
        />
        <div className="flex justify-center items-center py-20">
          <RotateCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }
  
  if (activeTemplate) {
    return (
      <Layout interface="kitchen">
        <PageHeader
          heading={activeTemplate.name}
          description={<T text="Complete the food safety checklist" />}
          backHref="/kitchen/food-safety"
        />
        
        <ChecklistForm
          template={activeTemplate}
          staffId={currentStaffId}
          onComplete={handleCompleteChecklist}
        />
      </Layout>
    );
  }
  
  return (
    <Layout interface="kitchen">
      <PageHeader
        heading={<T text="Food Safety Checklists" />}
        description={<T text="Maintain food safety standards in the kitchen" />}
      />
      
      {pendingChecklists.length > 0 && (
        <div className="mb-8">
          <ChecklistPendingCard pendingChecklists={pendingChecklists} />
        </div>
      )}
      
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
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
    </Layout>
  );
};

export default KitchenFoodSafety;
