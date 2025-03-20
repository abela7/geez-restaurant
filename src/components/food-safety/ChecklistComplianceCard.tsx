
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ComplianceData = {
  totalChecks: number;
  compliantChecks: number;
  percentage: number;
};

type ChecklistComplianceCardProps = {
  complianceData: ComplianceData;
};

const ChecklistComplianceCard: React.FC<ChecklistComplianceCardProps> = ({
  complianceData,
}) => {
  const { t } = useLanguage();
  
  const getColorClass = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  const getProgressClass = (percentage: number): string => {
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          <T text="Compliance Rate" />
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          <span className={getColorClass(complianceData.percentage)}>
            {complianceData.percentage}%
          </span>
        </div>
        
        <Progress 
          value={complianceData.percentage} 
          className="h-2 mb-3"
          indicatorClassName={getProgressClass(complianceData.percentage)}
        />
        
        <p className="text-sm text-muted-foreground">
          <T text="Based on" /> {complianceData.compliantChecks} <T text="compliant items out of" /> {complianceData.totalChecks} <T text="total checks" />
        </p>
      </CardContent>
    </Card>
  );
};

export default ChecklistComplianceCard;
