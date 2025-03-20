
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, DownloadIcon, Printer } from "lucide-react";
import PayrollList from "@/components/staff/PayrollList";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { StaffMember } from "@/hooks/useStaffMembers";
import { useLanguage, T } from "@/contexts/LanguageContext";

type PayrollSectionProps = {
  staffId: string;
  staffMember: StaffMember;
  payrollRecords: PayrollRecord[];
  isLoading: boolean;
  error: string | null;
  addPayrollRecord: (record: Omit<PayrollRecord, 'id'>) => Promise<any>;
  updatePayrollRecord: (id: string, updates: Partial<PayrollRecord>) => Promise<any>;
  onExportData: (data: any[], filename: string) => void;
};

const PayrollSection: React.FC<PayrollSectionProps> = ({
  staffId,
  staffMember,
  payrollRecords,
  isLoading,
  error,
  addPayrollRecord,
  updatePayrollRecord,
  onExportData
}) => {
  const { t } = useLanguage();
  const [newPayrollDialog, setNewPayrollDialog] = useState(false);

  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

  const handlePayrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!staffId) return;
    
    const formData = new FormData(e.currentTarget);
    const payPeriod = formData.get('payPeriod') as string;
    const regularHours = parseFloat(formData.get('regularHours') as string);
    const overtimeHours = parseFloat(formData.get('overtimeHours') as string);
    const hourlyRate = staffMember.hourly_rate || 0;
    
    const totalHours = regularHours + overtimeHours;
    const totalPay = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
    
    try {
      const newPayroll = {
        staff_id: staffId,
        pay_period: payPeriod,
        regular_hours: regularHours,
        overtime_hours: overtimeHours,
        total_hours: totalHours,
        total_pay: totalPay,
        payment_status: 'Pending',
        payment_date: null
      };
      
      await addPayrollRecord(newPayroll);
      setNewPayrollDialog(false);
    } catch (error) {
      console.error('Failed to add payroll record:', error);
    }
  };

  const handleUpdatePaymentStatus = async (payrollId: string, status: string) => {
    try {
      await updatePayrollRecord(payrollId, { 
        payment_status: status,
        payment_date: status === 'Paid' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle><T text="Payroll Records" /></CardTitle>
          <CardDescription><T text="Staff payment history" /></CardDescription>
        </div>
        <Dialog open={newPayrollDialog} onOpenChange={setNewPayrollDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              <T text="Add Payroll" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle><T text="Add Payroll Record" /></DialogTitle>
              <DialogDescription>
                <T text="Add a new payroll record for" /> {getFullName()}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePayrollSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payPeriod" className="text-right">
                    <T text="Pay Period" />
                  </Label>
                  <Input
                    id="payPeriod"
                    name="payPeriod"
                    placeholder="e.g. July 1-15, 2023"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="regularHours" className="text-right">
                    <T text="Regular Hours" />
                  </Label>
                  <Input
                    id="regularHours"
                    name="regularHours"
                    type="number"
                    min="0"
                    step="0.5"
                    defaultValue="80"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="overtimeHours" className="text-right">
                    <T text="Overtime Hours" />
                  </Label>
                  <Input
                    id="overtimeHours"
                    name="overtimeHours"
                    type="number"
                    min="0"
                    step="0.5"
                    defaultValue="0"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hourlyRate" className="text-right">
                    <T text="Hourly Rate" />
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="text-muted-foreground">£{staffMember.hourly_rate?.toFixed(2) || '0.00'}</span>
                    <span className="ml-2 text-xs text-muted-foreground">(<T text="Defined in profile" />)</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit"><T text="Save Record" /></Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error ? (
          <ErrorDisplay error={error} />
        ) : (
          <PayrollList 
            payrollRecords={payrollRecords}
            isLoading={isLoading}
            onUpdateStatus={handleUpdatePaymentStatus}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onExportData(payrollRecords, `${getFullName()}_Payroll`)}
          disabled={payrollRecords.length === 0}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          <T text="Export Data" />
        </Button>
        <Button variant="outline" disabled={payrollRecords.length === 0}>
          <Printer className="mr-2 h-4 w-4" />
          <T text="Print Report" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PayrollSection;
