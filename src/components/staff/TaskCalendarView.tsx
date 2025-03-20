
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

const TaskCalendarView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Task Calendar" /></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2"><T text="Calendar View Coming Soon" /></h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            <T text="The calendar view for task management is currently under development. Please check back soon." />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCalendarView;
