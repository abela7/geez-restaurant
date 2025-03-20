
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

type PayrollListProps = {
  payrollRecords: PayrollRecord[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
};

const PayrollList: React.FC<PayrollListProps> = ({ 
  payrollRecords, 
  isLoading, 
  onUpdateStatus,
  showStaffInfo = false,
  staffNames = {}
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <Table>
      <TableHeader>
        <TableRow>
          {showStaffInfo && <TableHead><T text="Staff Member" /></TableHead>}
          <TableHead><T text="Pay Period" /></TableHead>
          <TableHead><T text="Regular Hours" /></TableHead>
          <TableHead><T text="Overtime" /></TableHead>
          <TableHead><T text="Total Hours" /></TableHead>
          <TableHead><T text="Total Pay" /></TableHead>
          <TableHead><T text="Status" /></TableHead>
          <TableHead><T text="Payment Date" /></TableHead>
          {onUpdateStatus && <TableHead className="text-right"><T text="Actions" /></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrollRecords.map((record) => (
          <TableRow key={record.id}>
            {showStaffInfo && <TableCell>{staffNames[record.staff_id] || record.staff_id}</TableCell>}
            <TableCell>{record.pay_period}</TableCell>
            <TableCell>{record.regular_hours}</TableCell>
            <TableCell>{record.overtime_hours}</TableCell>
            <TableCell>{record.total_hours}</TableCell>
            <TableCell className="font-semibold">£{record.total_pay.toFixed(2)}</TableCell>
            <TableCell>
              {onUpdateStatus ? (
                <Select 
                  value={record.payment_status} 
                  onValueChange={(value) => onUpdateStatus(record.id, value)}
                >
                  <SelectTrigger className="w-[100px] h-7">
                    <Badge variant={record.payment_status === "Paid" ? "outline" : "default"}>
                      {record.payment_status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={record.payment_status === "Paid" ? "outline" : "default"}>
                  {record.payment_status}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {record.payment_date 
                ? format(new Date(record.payment_date), 'MMM dd, yyyy')
                : '-'}
            </TableCell>
            {onUpdateStatus && (
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <T text="Details" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PayrollList;
