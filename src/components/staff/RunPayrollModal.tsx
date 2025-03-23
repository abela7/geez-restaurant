
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SideModal } from "@/components/ui/side-modal";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { StaffMember } from "@/hooks/useStaffMembers";

export interface RunPayrollFormData {
  payPeriod: string;
  startDate: string;
  endDate: string;
  selectedStaffIds: string[];
}

interface RunPayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMembers: StaffMember[];
  staffLoading: boolean;
  onRunPayroll: (data: RunPayrollFormData) => void;
}

const RunPayrollModal: React.FC<RunPayrollModalProps> = ({
  open,
  onOpenChange,
  staffMembers,
  staffLoading,
  onRunPayroll
}) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<RunPayrollFormData>({
    payPeriod: `${format(new Date(), 'MMMM yyyy')} - Period 1`,
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    selectedStaffIds: []
  });

  const handleChange = (key: keyof RunPayrollFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    onRunPayroll(formData);
  };

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={<T text="Run Payroll" />}
      description={<T text="Process payroll for the selected period and staff members" />}
      width="lg"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pay-period"><T text="Pay Period Name" /></Label>
          <Input
            id="pay-period"
            value={formData.payPeriod}
            onChange={(e) => handleChange("payPeriod", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date"><T text="Start Date" /></Label>
            <Input
              id="start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date"><T text="End Date" /></Label>
            <Input
              id="end-date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label><T text="Select Staff Members" /></Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleChange("selectedStaffIds", staffMembers.map(s => s.id))}
            >
              <T text="Select All" />
            </Button>
          </div>
          
          <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
            {staffLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : staffMembers.length === 0 ? (
              <p className="text-center text-muted-foreground">
                <T text="No staff members found" />
              </p>
            ) : (
              <div className="space-y-2">
                {staffMembers.map(staff => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`staff-${staff.id}`}
                      className="h-4 w-4 rounded border-gray-300"
                      checked={formData.selectedStaffIds.includes(staff.id)}
                      onChange={(e) => {
                        const newSelectedStaff = e.target.checked
                          ? [...formData.selectedStaffIds, staff.id]
                          : formData.selectedStaffIds.filter(id => id !== staff.id);
                        
                        handleChange("selectedStaffIds", newSelectedStaff);
                      }}
                    />
                    <label htmlFor={`staff-${staff.id}`} className="text-sm">
                      {staff.first_name} {staff.last_name}
                      {staff.department && <span className="text-muted-foreground ml-1">({staff.department})</span>}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button onClick={handleSubmit} disabled={staffLoading || formData.selectedStaffIds.length === 0}>
            <T text="Process Payroll" />
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default RunPayrollModal;
