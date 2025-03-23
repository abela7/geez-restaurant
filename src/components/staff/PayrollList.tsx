
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

type PayrollListProps = {
  payrollRecords: PayrollRecord[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
  onViewDetails?: (record: PayrollRecord) => void;
};

const PayrollList: React.FC<PayrollListProps> = ({ 
  payrollRecords, 
  isLoading, 
  onUpdateStatus,
  showStaffInfo = false,
  staffNames = {},
  onViewDetails
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showStaffInfo && <TableHead><T text="Staff Member" /></TableHead>}
            <TableHead><T text="Pay Period" /></TableHead>
            <TableHead className="hidden md:table-cell"><T text="Regular Hours" /></TableHead>
            <TableHead className="hidden md:table-cell"><T text="Overtime" /></TableHead>
            <TableHead><T text="Total Hours" /></TableHead>
            <TableHead><T text="Total Pay" /></TableHead>
            <TableHead><T text="Status" /></TableHead>
            <TableHead className="hidden sm:table-cell"><T text="Payment Date" /></TableHead>
            <TableHead className="text-right"><T text="Actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRecords.map((record) => (
            <TableRow key={record.id}>
              {showStaffInfo && (
                <TableCell className="font-medium">
                  {staffNames[record.staff_id] || record.staff_id}
                </TableCell>
              )}
              <TableCell>{record.pay_period}</TableCell>
              <TableCell className="hidden md:table-cell">{record.regular_hours}</TableCell>
              <TableCell className="hidden md:table-cell">{record.overtime_hours}</TableCell>
              <TableCell>{record.total_hours}</TableCell>
              <TableCell className="font-semibold">£{record.total_pay.toFixed(2)}</TableCell>
              <TableCell>
                {onUpdateStatus ? (
                  <Select 
                    value={record.payment_status} 
                    onValueChange={(value) => onUpdateStatus(record.id, value)}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <Badge variant={record.payment_status === "Paid" ? "outline" : "default"}>
                        {record.payment_status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid"><T text="Paid" /></SelectItem>
                      <SelectItem value="Pending"><T text="Pending" /></SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={record.payment_status === "Paid" ? "outline" : "default"}>
                    {record.payment_status}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {record.payment_date 
                  ? format(new Date(record.payment_date), 'MMM dd, yyyy')
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails ? onViewDetails(record) : null}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <T text="Details" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollList;
