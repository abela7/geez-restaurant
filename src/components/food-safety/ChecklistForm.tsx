
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChecklistTemplate } from "@/hooks/useChecklistTemplates";
import { ChecklistItem, useChecklistItems } from "@/hooks/useChecklistItems";
import { useSubmitChecklist } from "@/hooks/useChecklistLogs";
import ChecklistItemComponent from "@/components/food-safety/ChecklistItem";
import { RotateCw, ClipboardCheck } from "lucide-react";

type ChecklistFormProps = {
  template: ChecklistTemplate;
  staffId: string;
  onComplete: () => void;
};

type ItemState = {
  value: string;
  isCompliant: boolean;
  notes: string;
};

const ChecklistForm: React.FC<ChecklistFormProps> = ({ template, staffId, onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: checklistItems, isLoading: isLoadingItems } = useChecklistItems(template.id);
  const submitChecklist = useSubmitChecklist();
  
  const [generalNotes, setGeneralNotes] = useState("");
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  
  // Initialize item states when items load
  React.useEffect(() => {
    if (checklistItems && checklistItems.length > 0) {
      const initialItemStates: Record<string, ItemState> = {};
      
      checklistItems.forEach(item => {
        initialItemStates[item.id] = {
          value: "",
          isCompliant: false,
          notes: "",
        };
      });
      
      setItemStates(initialItemStates);
    }
  }, [checklistItems]);
  
  const handleItemChange = (
    itemId: string,
    updates: { value?: string; isCompliant?: boolean; notes?: string }
  ) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        ...updates,
      },
    }));
  };
  
  const handleSubmit = async () => {
    if (!checklistItems || checklistItems.length === 0) return;
    
    const allCompleted = checklistItems.every(item => 
      itemStates[item.id] && (
        itemStates[item.id].isCompliant || 
        (!itemStates[item.id].isCompliant && itemStates[item.id].notes.trim() !== "")
      )
    );
    
    if (!allCompleted) {
      toast({
        title: t("Incomplete Checklist"),
        description: t("Please mark all items as compliant or provide notes for non-compliant items."),
        variant: "destructive",
      });
      return;
    }
    
    try {
      await submitChecklist.mutateAsync({
        templateId: template.id,
        staffId,
        notes: generalNotes,
        items: checklistItems.map(item => ({
          itemId: item.id,
          value: itemStates[item.id].value,
          isCompliant: itemStates[item.id].isCompliant,
          notes: itemStates[item.id].notes,
        })),
      });
      
      toast({
        title: t("Checklist Completed"),
        description: t("Food safety checklist has been successfully submitted."),
      });
      
      onComplete();
    } catch (error) {
      console.error("Error submitting checklist:", error);
      toast({
        title: t("Submission Error"),
        description: t("There was a problem submitting your checklist. Please try again."),
        variant: "destructive",
      });
    }
  };
  
  if (isLoadingItems) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!checklistItems || checklistItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <T text="No checklist items found for this template." />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>
          {template.required_time && (
            <span className="capitalize">{template.required_time}</span>
          )}{" "}
          <T text="checklist" /> - {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1 mb-4">
          <h3 className="font-medium"><T text="Checklist Items" /></h3>
          <p className="text-sm text-muted-foreground">
            <T text="Check off each item as compliant, or provide notes for non-compliant items." />
          </p>
        </div>
        
        <div className="space-y-4">
          {checklistItems.map((item: ChecklistItem) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              value={itemStates[item.id]?.value || ""}
              isCompliant={itemStates[item.id]?.isCompliant || false}
              notes={itemStates[item.id]?.notes || ""}
              onChange={handleItemChange}
            />
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div>
            <label htmlFor="general-notes" className="text-sm font-medium block mb-1">
              <T text="General Notes" />
            </label>
            <Textarea
              id="general-notes"
              placeholder={t("Enter any general notes or observations")}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={onComplete}>
          <T text="Cancel" />
        </Button>
        <Button onClick={handleSubmit} disabled={submitChecklist.isPending}>
          {submitChecklist.isPending ? (
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="mr-2 h-4 w-4" />
          )}
          <T text="Submit Checklist" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChecklistForm;
