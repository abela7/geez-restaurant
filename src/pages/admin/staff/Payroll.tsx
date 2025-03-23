
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, Plus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import useStaffMembers from "@/hooks/useStaffMembers";
import useStaffPayroll, { PayrollRecord } from "@/hooks/useStaffPayroll";
import PayrollList from "@/components/staff/PayrollList";
import PayrollGridView from "@/components/staff/PayrollGridView";
import PayrollFilter, { PayrollFilterOptions } from "@/components/staff/PayrollFilter";
import PayrollDetailModal from "@/components/staff/PayrollDetailModal";
import { exportPayrollToCSV, exportPayrollToPDF } from "@/services/staff/payrollExportService";
import PayrollStatCards from "@/components/staff/PayrollStatCards";
import PayrollViewToggle from "@/components/staff/PayrollViewToggle";
import RunPayrollModal, { RunPayrollFormData } from "@/components/staff/RunPayrollModal";
import StaffPayrollSelector from "@/components/staff/StaffPayrollSelector";
import { getFilteredPayrollRecords } from "@/components/staff/PayrollFilterUtils";

const Payroll = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: staffMembers, isLoading: staffLoading } = useStaffMembers();
  const { payrollRecords, isLoading, addPayrollRecord, updatePayrollRecord } = useStaffPayroll();
  
  const [payPeriod, setPayPeriod] = useState("current");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isRunPayrollModalOpen, setIsRunPayrollModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<PayrollFilterOptions>({});
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Create a staffNames lookup for easier display
  const staffNames = staffMembers.reduce((acc, staff) => {
    acc[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    return acc;
  }, {} as Record<string, string>);
  
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
  
  const handleRunPayroll = async (formData: RunPayrollFormData) => {
    try {
      // If no staff members selected, show error
      if (formData.selectedStaffIds.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one staff member",
          variant: "destructive"
        });
        return;
      }
      
      // Create payroll records for each selected staff member
      for (const staffId of formData.selectedStaffIds) {
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
          pay_period: formData.payPeriod,
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          total_hours: totalHours,
          total_pay: Number(totalPay.toFixed(2)),
          payment_status: 'Pending',
          payment_date: null,
          hourly_rate: hourlyRate
        });
      }
      
      setIsRunPayrollModalOpen(false);
      toast({
        title: "Success",
        description: "Payroll processed successfully",
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
  
  const handleExport = (format: 'csv' | 'pdf') => {
    // Get the correct records based on the current tab
    let recordsToExport = getFilteredPayrollRecords(
      payrollRecords, 
      payPeriod, 
      filterOptions, 
      selectedStaffId, 
      staffNames
    );
    
    // Set a meaningful filename
    let filename = `payroll_${payPeriod}`;
    if (selectedStaffId) {
      filename = `payroll_${staffNames[selectedStaffId].replace(/\s+/g, '_').toLowerCase()}`;
    }
    
    if (format === 'csv') {
      const success = exportPayrollToCSV(recordsToExport, staffNames, filename);
      if (success) {
        toast({
          title: "Success",
          description: "Payroll data exported to CSV"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export payroll data",
          variant: "destructive"
        });
      }
    } else {
      // For PDF export
      const title = selectedStaffId 
        ? `Payroll Report - ${staffNames[selectedStaffId]}`
        : `Payroll Report - ${payPeriod === 'current' ? 'Current Period' : 'Previous Periods'}`;
        
      const success = exportPayrollToPDF(recordsToExport, staffNames, title);
      if (success) {
        toast({
          title: "Success",
          description: "Payroll data exported to PDF"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export payroll data",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><T text="Staff Payroll" /></h1>
          <p className="text-muted-foreground"><T text="Manage staff payroll and compensation" /></p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <PayrollFilter 
            onFilter={setFilterOptions} 
            onReset={() => setFilterOptions({})} 
          />
          
          <PayrollViewToggle 
            viewMode={viewMode} 
            onViewChange={setViewMode} 
          />
          
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            <T text="Export CSV" />
          </Button>
          
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            <T text="Export PDF" />
          </Button>
          
          <Button onClick={() => setIsRunPayrollModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Run Payroll" />
          </Button>
        </div>
      </div>

      <PayrollStatCards payrollRecords={payrollRecords} />

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
            {viewMode === "list" ? (
              <PayrollList 
                payrollRecords={getFilteredPayrollRecords(payrollRecords, 'current', filterOptions, undefined, staffNames)} 
                isLoading={isLoading} 
                onUpdateStatus={handleUpdatePayrollStatus}
                showStaffInfo={true}
                staffNames={staffNames}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="p-4">
                <PayrollGridView 
                  payrollRecords={getFilteredPayrollRecords(payrollRecords, 'current', filterOptions, undefined, staffNames)} 
                  isLoading={isLoading}
                  showStaffInfo={true}
                  staffNames={staffNames}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="previous">
          <Card>
            {viewMode === "list" ? (
              <PayrollList 
                payrollRecords={getFilteredPayrollRecords(payrollRecords, 'previous', filterOptions, undefined, staffNames)} 
                isLoading={isLoading} 
                onUpdateStatus={handleUpdatePayrollStatus}
                showStaffInfo={true}
                staffNames={staffNames}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="p-4">
                <PayrollGridView 
                  payrollRecords={getFilteredPayrollRecords(payrollRecords, 'previous', filterOptions, undefined, staffNames)} 
                  isLoading={isLoading}
                  showStaffInfo={true}
                  staffNames={staffNames}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <Card>
            <StaffPayrollSelector
              staffMembers={staffMembers}
              selectedStaffId={selectedStaffId}
              onStaffSelect={setSelectedStaffId}
              payrollRecords={getFilteredPayrollRecords(payrollRecords, 'all', filterOptions, selectedStaffId)}
              isLoading={isLoading}
              viewMode={viewMode}
              onUpdateStatus={handleUpdatePayrollStatus}
              onViewDetails={handleViewDetails}
            />
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Run Payroll Modal */}
      <RunPayrollModal
        open={isRunPayrollModalOpen}
        onOpenChange={setIsRunPayrollModalOpen}
        staffMembers={staffMembers}
        staffLoading={staffLoading}
        onRunPayroll={handleRunPayroll}
      />
      
      {/* Payroll Detail Modal */}
      <PayrollDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        record={selectedRecord}
        staffName={selectedRecord ? staffNames[selectedRecord.staff_id] : undefined}
        onUpdateStatus={handleUpdatePayrollStatus}
      />
    </>
  );
};

export default Payroll;
