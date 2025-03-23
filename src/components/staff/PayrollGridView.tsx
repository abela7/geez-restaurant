
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

type PayrollGridViewProps = {
  payrollRecords: PayrollRecord[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
  onViewDetails?: (record: PayrollRecord) => void;
};

const PayrollGridView: React.FC<PayrollGridViewProps> = ({ 
  payrollRecords, 
  isLoading, 
  showStaffInfo = false,
  staffNames = {},
  onViewDetails
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48">
            <CardContent className="p-0 h-full bg-muted/30"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (payrollRecords.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground"><T text="No payroll records found" /></p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {payrollRecords.map((record) => (
        <Card key={record.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium">{record.pay_period}</h3>
                {showStaffInfo && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {staffNames[record.staff_id] || record.staff_id}
                  </div>
                )}
              </div>
              <Badge variant={record.payment_status === "Paid" ? "outline" : "default"} className="ml-2">
                {record.payment_status}
              </Badge>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground"><T text="Regular Hours" /></p>
                  <p className="font-medium">{record.regular_hours}</p>
                </div>
                <div>
                  <p className="text-muted-foreground"><T text="Overtime" /></p>
                  <p className="font-medium">{record.overtime_hours}</p>
                </div>
                <div>
                  <p className="text-muted-foreground"><T text="Total Hours" /></p>
                  <p className="font-medium">{record.total_hours}</p>
                </div>
                <div>
                  <p className="text-muted-foreground"><T text="Payment Date" /></p>
                  <p className="font-medium">
                    {record.payment_date 
                      ? format(new Date(record.payment_date), 'MMM dd, yyyy')
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium"><T text="Total Pay" /></p>
                  <p className="text-lg font-bold">£{record.total_pay.toFixed(2)}</p>
                </div>
                
                {onViewDetails && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2" 
                    onClick={() => onViewDetails(record)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <T text="View Details" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PayrollGridView;
