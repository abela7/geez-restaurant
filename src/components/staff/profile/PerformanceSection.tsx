
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffMember } from "@/hooks/useStaffMembers";
import { useLanguage, T } from "@/contexts/LanguageContext";

type PerformanceSectionProps = {
  staffMember: StaffMember;
  onExportData: (data: any[], filename: string) => void;
};

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ staffMember }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle><T text="Performance Metrics" /></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
          <h3 className="text-xl font-semibold mb-2"><T text="Coming Soon" /></h3>
          <p className="text-muted-foreground max-w-md">
            <T text="Performance metrics with task completion rates and staff ratings will be available in a future update." />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSection;
