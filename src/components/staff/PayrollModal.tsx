
import React, { useState } from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { StaffMember } from "@/hooks/useStaffMembers";

interface PayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMember?: StaffMember;
  onSave: (data: PayrollFormData) => void;
  isLoading?: boolean;
}

export interface PayrollFormData {
  payPeriod: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  paymentStatus: string;
}

export const PayrollModal: React.FC<PayrollModalProps> = ({
  open,
  onOpenChange,
  staffMember,
  onSave,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<PayrollFormData>({
    payPeriod: "",
    regularHours: 40,
    overtimeHours: 0,
    hourlyRate: staffMember?.hourly_rate || 10,
    paymentStatus: "Pending"
  });
  
  const handleChange = (key: keyof PayrollFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const totalPay = (
    (formData.regularHours * formData.hourlyRate) + 
    (formData.overtimeHours * formData.hourlyRate * 1.5)
  ).toFixed(2);
  
  // Fix by using the correct format for the title based on how the t function is implemented in LanguageContext
  const staffFullName = staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '';
  const title = staffMember 
    ? t(`Payroll for ${staffFullName}`)
    : t("Create Payroll Record");

  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      width="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="payPeriod"><T text="Pay Period" /></Label>
          <Input
            id="payPeriod"
            value={formData.payPeriod}
            onChange={(e) => handleChange("payPeriod", e.target.value)}
            placeholder="e.g., January 2025 - Period 1"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="regularHours"><T text="Regular Hours" /></Label>
            <Input
              id="regularHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.regularHours}
              onChange={(e) => handleChange("regularHours", parseFloat(e.target.value))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="overtimeHours"><T text="Overtime Hours" /></Label>
            <Input
              id="overtimeHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.overtimeHours}
              onChange={(e) => handleChange("overtimeHours", parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hourlyRate"><T text="Hourly Rate (£)" /></Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => handleChange("hourlyRate", parseFloat(e.target.value))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="paymentStatus"><T text="Payment Status" /></Label>
            <Select 
              value={formData.paymentStatus}
              onValueChange={(value) => handleChange("paymentStatus", value)}
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending"><T text="Pending" /></SelectItem>
                <SelectItem value="Paid"><T text="Paid" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-muted/30 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium"><T text="Total Hours" /></h3>
            <span>{formData.regularHours + formData.overtimeHours}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <h3 className="font-medium"><T text="Total Pay" /></h3>
            <span className="font-bold">£{totalPay}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t mt-8">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                <T text="Processing..." />
              </span>
            ) : (
              <T text="Save Payroll Record" />
            )}
          </Button>
        </div>
      </form>
    </SideModal>
  );
};

export default PayrollModal;
