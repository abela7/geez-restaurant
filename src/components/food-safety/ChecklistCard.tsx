
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Clock } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChecklistTemplate } from "@/hooks/useChecklistTemplates";
import { format } from "date-fns";

type ChecklistCardProps = {
  template: ChecklistTemplate;
  lastCompletedAt?: string | null;
  onStartChecklist: () => void;
};

const ChecklistCard: React.FC<ChecklistCardProps> = ({
  template,
  lastCompletedAt,
  onStartChecklist,
}) => {
  const { t } = useLanguage();
  
  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case "daily":
        return t("Daily");
      case "weekly":
        return t("Weekly");
      case "monthly":
        return t("Monthly");
      default:
        return frequency;
    }
  };
  
  const getTimeLabel = (time: string | null): string => {
    if (!time) return "";
    
    switch (time) {
      case "morning":
        return t("Morning");
      case "evening":
        return t("Evening");
      case "closing":
        return t("Closing");
      case "shift":
        return t("Every Shift");
      default:
        return time;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-2">
                {getFrequencyLabel(template.frequency)}
              </Badge>
              {template.required_time && (
                <Badge variant="outline">
                  {getTimeLabel(template.required_time)}
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {lastCompletedAt ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              <T text="Last completed" />: {format(new Date(lastCompletedAt), "PPp")}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <T text="Not completed yet" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={onStartChecklist}>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          <T text="Start Checklist" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChecklistCard;
