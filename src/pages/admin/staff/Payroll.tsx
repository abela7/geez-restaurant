
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SideModal } from "@/components/ui/side-modal";
import { Calendar, Download, Plus, Filter, DollarSign, Clock, CreditCard, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import useStaffMembers from "@/hooks/useStaffMembers";
import useStaffPayroll, { PayrollRecord } from "@/hooks/useStaffPayroll";
import PayrollList from "@/components/staff/PayrollList";
import { format, parseISO, startOfMonth, endOfMonth, isAfter } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RunPayrollFormData {
  payPeriod: string;
  startDate: string;
  endDate: string;
  selectedStaffIds: string[];
}

const Payroll = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: staffMembers, isLoading: staffLoading } = useStaffMembers();
  const { payrollRecords, isLoading, addPayrollRecord, updatePayrollRecord } = useStaffPayroll();
  
  const [payPeriod, setPayPeriod] = useState("current");
  const [isRunPayrollModalOpen, setIsRunPayrollModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [runPayrollData, setRunPayrollData] = useState<RunPayrollFormData>({
    payPeriod: `${format(new Date(), 'MMMM yyyy')} - Period 1`,
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    selectedStaffIds: []
  });
  
  // Create a staffNames lookup for easier display
  const staffNames = staffMembers.reduce((acc, staff) => {
    acc[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    return acc;
  }, {} as Record<string, string>);
  
  // Get current period totals
  const currentPeriodRecords = payrollRecords.filter(record => 
    record.pay_period.includes(format(new Date(), 'MMMM yyyy'))
  );
  
  const totalHours = currentPeriodRecords.reduce((sum, record) => sum + record.total_hours, 0);
  const totalPay = currentPeriodRecords.reduce((sum, record) => sum + record.total_pay, 0);
  
  // Filter records for each tab
  const getFilteredRecords = (period: string, staffId?: string) => {
    if (staffId) {
      return payrollRecords.filter(record => record.staff_id === staffId);
    }
    
    const isCurrentMonth = (record: PayrollRecord) => {
      return record.pay_period.includes(format(new Date(), 'MMMM yyyy'));
    };
    
    const isPreviousPeriod = (record: PayrollRecord) => {
      try {
        // Attempt to parse the pay period date if in expected format
        const periodDate = record.pay_period.split(' - ')[0];
        const date = parseISO(`01 ${periodDate}`);
        return !isAfter(date, startOfMonth(new Date()));
      } catch {
        // Fallback if date parsing fails
        return !isCurrentMonth(record);
      }
    };
    
    switch (period) {
      case 'current':
        return payrollRecords.filter(isCurrentMonth);
      case 'previous':
        return payrollRecords.filter(isPreviousPeriod);
      default:
        return payrollRecords;
    }
  };
  
  const handleUpdatePayrollStatus = async (id: string, status: string) => {
    try {
      await updatePayrollRecord(id, { 
        payment_status: status,
        payment_date: status === 'Paid' ? new Date().toISOString() : null
      });
      
      toast({
        title: "Success",
        description: `Payment status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };
  
  const handleRunPayroll = async () => {
    try {
      // If no staff members selected, show error
      if (runPayrollData.selectedStaffIds.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one staff member",
          variant: "destructive"
        });
        return;
      }
      
      // Create payroll records for each selected staff member
      for (const staffId of runPayrollData.selectedStaffIds) {
        const staff = staffMembers.find(s => s.id === staffId);
        if (!staff || !staff.hourly_rate) continue;
        
        // We would normally calculate hours from attendance records
        // For demo purposes we're using random numbers
        const regularHours = Math.floor(Math.random() * 35) + 20; // 20-55 hours
        const overtimeHours = Math.floor(Math.random() * 10); // 0-10 overtime hours
        const totalHours = regularHours + overtimeHours;
        const hourlyRate = staff.hourly_rate || 10;
        const totalPay = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
        
        await addPayrollRecord({
          staff_id: staffId,
          pay_period: runPayrollData.payPeriod,
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          total_hours: totalHours,
          total_pay: Number(totalPay.toFixed(2)),
          payment_status: 'Pending',
          payment_date: null
        });
      }
      
      setIsRunPayrollModalOpen(false);
      toast({
        title: "Success",
        description: "Payroll processed successfully",
      });
      
      // Reset form
      setRunPayrollData({
        ...runPayrollData,
        selectedStaffIds: []
      });
      
    } catch (error) {
      console.error("Error running payroll:", error);
      toast({
        title: "Error",
        description: "Failed to process payroll",
        variant: "destructive"
      });
    }
  };
  
  const nextPaymentDate = () => {
    // Simple logic - if we're before the 15th, next payment is 15th, otherwise end of month
    const today = new Date();
    const day = today.getDate();
    
    if (day < 15) {
      return "15 " + format(today, 'MMMM');
    } else {
      return format(endOfMonth(today), 'd MMMM');
    }
  };

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Payroll" />}
        description={<T text="Manage staff payroll and compensation" />}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              <T text="Filter" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export Report" />
            </Button>
            <Button onClick={() => setIsRunPayrollModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Run Payroll" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Current Pay Period" />
              </p>
              <div className="text-2xl font-bold">£{totalPay.toFixed(2)}</div>
            </div>
            <DollarSign className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Total Hours" />
              </p>
              <div className="text-2xl font-bold">{totalHours}</div>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                <T text="Next Payment Date" />
              </p>
              <div className="text-2xl font-bold">{nextPaymentDate()}</div>
            </div>
            <CreditCard className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" onValueChange={setPayPeriod} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="current">
            <T text="Current Period" />
          </TabsTrigger>
          <TabsTrigger value="previous">
            <T text="Previous Periods" />
          </TabsTrigger>
          <TabsTrigger value="staff">
            <T text="By Staff Member" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <Card>
            <CardContent className="p-0">
              <PayrollList 
                payrollRecords={getFilteredRecords('current')} 
                isLoading={isLoading} 
                onUpdateStatus={handleUpdatePayrollStatus}
                showStaffInfo={true}
                staffNames={staffNames}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="previous">
          <Card>
            <CardContent className="p-0">
              <PayrollList 
                payrollRecords={getFilteredRecords('previous')} 
                isLoading={isLoading} 
                onUpdateStatus={handleUpdatePayrollStatus}
                showStaffInfo={true}
                staffNames={staffNames}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <Card>
            {!selectedStaffId ? (
              <CardContent className="p-6">
                <div className="mb-4">
                  <Label htmlFor="staff-select"><T text="Select Staff Member" /></Label>
                  <Select onValueChange={setSelectedStaffId}>
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
                    {staffNames[selectedStaffId]} - <T text="Payroll History" />
                  </h3>
                </div>
                <PayrollList 
                  payrollRecords={getFilteredRecords('all', selectedStaffId)} 
                  isLoading={isLoading} 
                  onUpdateStatus={handleUpdatePayrollStatus}
                />
                <div className="p-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedStaffId("")}>
                    <T text="Back to Staff Selection" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Run Payroll Modal */}
      <SideModal
        open={isRunPayrollModalOpen}
        onOpenChange={setIsRunPayrollModalOpen}
        title={<T text="Run Payroll" />}
        description={<T text="Process payroll for the selected period and staff members" />}
        width="lg"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pay-period"><T text="Pay Period Name" /></Label>
            <Input
              id="pay-period"
              value={runPayrollData.payPeriod}
              onChange={(e) => setRunPayrollData({...runPayrollData, payPeriod: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date"><T text="Start Date" /></Label>
              <Input
                id="start-date"
                type="date"
                value={runPayrollData.startDate}
                onChange={(e) => setRunPayrollData({...runPayrollData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date"><T text="End Date" /></Label>
              <Input
                id="end-date"
                type="date"
                value={runPayrollData.endDate}
                onChange={(e) => setRunPayrollData({...runPayrollData, endDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label><T text="Select Staff Members" /></Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRunPayrollData({
                  ...runPayrollData,
                  selectedStaffIds: staffMembers.map(s => s.id)
                })}
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
                        checked={runPayrollData.selectedStaffIds.includes(staff.id)}
                        onChange={(e) => {
                          const newSelectedStaff = e.target.checked
                            ? [...runPayrollData.selectedStaffIds, staff.id]
                            : runPayrollData.selectedStaffIds.filter(id => id !== staff.id);
                          
                          setRunPayrollData({
                            ...runPayrollData,
                            selectedStaffIds: newSelectedStaff
                          });
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
            <Button variant="outline" onClick={() => setIsRunPayrollModalOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleRunPayroll} disabled={staffLoading}>
              <T text="Process Payroll" />
            </Button>
          </div>
        </div>
      </SideModal>
    </>
  );
};

export default Payroll;
