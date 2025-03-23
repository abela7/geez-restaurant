
import React from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, Activity } from "lucide-react";

interface PerformanceSectionProps {
  staffId: string;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ staffId }) => {
  // For now, we'll display a placeholder for the performance section
  // This can be expanded in the future with real performance metrics
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Activity className="mr-2 h-5 w-5" />
          <T text="Performance Metrics" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <Card className="p-4">
            <BarChart3 className="h-10 w-10 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-medium mb-1"><T text="Attendance Rate" /></h3>
            <p className="text-3xl font-bold text-primary">96%</p>
            <p className="text-sm text-muted-foreground mt-1">
              <T text="Last 30 days" />
            </p>
          </Card>
          
          <Card className="p-4">
            <LineChart className="h-10 w-10 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-medium mb-1"><T text="Task Completion" /></h3>
            <p className="text-3xl font-bold text-primary">92%</p>
            <p className="text-sm text-muted-foreground mt-1">
              <T text="Last 30 days" />
            </p>
          </Card>
        </div>
        
        <div className="mt-4 text-center p-4 border rounded-md border-dashed">
          <p className="text-muted-foreground">
            <T text="More detailed performance metrics will be available soon." />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSection;
