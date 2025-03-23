
import React from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Clock, PoundSterling, CalendarDays, User } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { format } from "date-fns";
import { exportPayrollRecordToPDF } from "@/services/staff/payrollExportService";

interface PayrollDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: PayrollRecord;
  staffName?: string;
  onUpdateStatus?: (id: string, status: string) => void;
}

const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({
  open,
  onOpenChange,
  record,
  staffName,
  onUpdateStatus
}) => {
  const { t } = useLanguage();

  if (!record) return null;
  
  const handleExportPDF = () => {
    if (record) {
      const title = staffName 
        ? `Payroll Record - ${staffName} - ${record.pay_period}`
        : `Payroll Record - ${record.pay_period}`;
      
      exportPayrollRecordToPDF(record, staffName, title);
    }
  };

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={<T text="Payroll Record Details" />}
      width="md"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{record.pay_period}</h2>
            {staffName && (
              <div className="text-muted-foreground flex items-center mt-1">
                <User className="h-4 w-4 mr-1.5" />
                {staffName}
              </div>
            )}
          </div>
          
          {onUpdateStatus && (
            <Select 
              value={record.payment_status} 
              onValueChange={(value) => onUpdateStatus(record.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <Badge variant={record.payment_status === "Paid" ? "outline" : "default"}>
                  {record.payment_status}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid"><T text="Paid" /></SelectItem>
                <SelectItem value="Pending"><T text="Pending" /></SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground"><T text="Regular Hours" /></p>
                <p className="font-medium">{record.regular_hours}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground"><T text="Overtime Hours" /></p>
                <p className="font-medium">{record.overtime_hours}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground"><T text="Total Hours" /></p>
                <p className="font-medium">{record.total_hours}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground"><T text="Payment Date" /></p>
                <p className="font-medium">
                  {record.payment_date 
                    ? format(new Date(record.payment_date), 'MMM dd, yyyy')
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-muted/40 p-4 rounded-lg border">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium"><T text="Base Pay" /></p>
            <p>£{(record.regular_hours * (record.hourly_rate || 10)).toFixed(2)}</p>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm font-medium"><T text="Overtime Pay" /></p>
            <p>£{(record.overtime_hours * (record.hourly_rate || 10) * 1.5).toFixed(2)}</p>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <p className="font-semibold"><T text="Total Pay" /></p>
            <p className="text-xl font-bold flex items-center">
              <PoundSterling className="h-5 w-5 mr-1 text-primary" />
              £{record.total_pay.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-8 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            <T text="Print" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            <T text="Export PDF" />
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default PayrollDetailModal;
