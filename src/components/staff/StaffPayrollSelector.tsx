
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { StaffMember } from "@/hooks/useStaffMembers";
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import PayrollList from "@/components/staff/PayrollList";
import PayrollGridView from "@/components/staff/PayrollGridView";

interface StaffPayrollSelectorProps {
  staffMembers: StaffMember[];
  selectedStaffId: string;
  onStaffSelect: (staffId: string) => void;
  payrollRecords: PayrollRecord[];
  isLoading: boolean;
  viewMode: "list" | "grid";
  onUpdateStatus: (id: string, status: string) => void;
  onViewDetails: (record: PayrollRecord) => void;
}

const StaffPayrollSelector: React.FC<StaffPayrollSelectorProps> = ({
  staffMembers,
  selectedStaffId,
  onStaffSelect,
  payrollRecords,
  isLoading,
  viewMode,
  onUpdateStatus,
  onViewDetails
}) => {
  const { t } = useLanguage();

  return (
    <>
      {!selectedStaffId ? (
        <CardContent className="p-6">
          <div className="mb-4">
            <Label htmlFor="staff-select"><T text="Select Staff Member" /></Label>
            <Select onValueChange={onStaffSelect}>
              <SelectTrigger id="staff-select" className="w-full md:w-[300px]">
                <SelectValue placeholder={t("Select staff member")} />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.first_name} {staff.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground text-center py-4">
            <T text="Select a staff member to view their payroll history." />
          </p>
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="text-lg font-medium">
              {staffMembers.find(s => s.id === selectedStaffId)?.first_name} {staffMembers.find(s => s.id === selectedStaffId)?.last_name} - <T text="Payroll History" />
            </h3>
          </div>
          {viewMode === "list" ? (
            <PayrollList 
              payrollRecords={payrollRecords} 
              isLoading={isLoading} 
              onUpdateStatus={onUpdateStatus}
            />
          ) : (
            <div className="p-4">
              <PayrollGridView 
                payrollRecords={payrollRecords} 
                isLoading={isLoading}
                onViewDetails={onViewDetails}
              />
            </div>
          )}
          <div className="p-4 border-t">
            <Button variant="outline" onClick={() => onStaffSelect("")}>
              <T text="Back to Staff Selection" />
            </Button>
          </div>
        </CardContent>
      )}
    </>
  );
};

export default StaffPayrollSelector;
