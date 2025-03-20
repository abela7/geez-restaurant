
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChecklistTemplate } from "@/hooks/useChecklistTemplates";

type ChecklistPendingCardProps = {
  pendingChecklists: ChecklistTemplate[];
};

const ChecklistPendingCard: React.FC<ChecklistPendingCardProps> = ({
  pendingChecklists,
}) => {
  const { t } = useLanguage();
  
  if (pendingChecklists.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-amber-500/50 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <ClipboardList className="h-5 w-5" />
          <T text="Pending Checklists" />
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          <T text="You have the following checklists that need to be completed:" />
        </p>
        
        <div className="space-y-2">
          {pendingChecklists.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-2 rounded-md border">
              <span className="font-medium">{template.name}</span>
              <Badge variant="outline" className="capitalize">
                {template.required_time || template.frequency}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistPendingCard;
