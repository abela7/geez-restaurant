
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DownloadIcon, Filter, PieChart, Printer, Search, ArrowUpDown } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import PayrollList from "@/components/staff/PayrollList";
import useStaffMembers from "@/hooks/useStaffMembers";
import useStaffPayroll, { PayrollRecord } from "@/hooks/useStaffPayroll";
import { useToast } from "@/hooks/use-toast";

// Payroll period type
type PayrollPeriod = {
  id: number;
  name: string;
  status: string;
};

// Sample payroll periods (would come from DB in a real app)
const payrollPeriods = [
  { id: 1, name: "July 1-15, 2023", status: "Completed" },
  { id: 2, name: "July 16-31, 2023", status: "In Progress" },
  { id: 3, name: "June 16-30, 2023", status: "Completed" },
  { id: 4, name: "June 1-15, 2023", status: "Completed" },
];

const Payroll = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2");
  const [newPayrollDialog, setNewPayrollDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  
  // Fetch staff and payroll data
  const { 
    staffMembers, 
    isLoading: isStaffLoading, 
    error: staffError 
  } = useStaffMembers();
  
  const { 
    payrollRecords, 
    isLoading: isPayrollLoading, 
    error: payrollError,
    addPayrollRecord,
    updatePayrollRecord,
    fetchPayrollData 
  } = useStaffPayroll();
  
  // Create a map of staff IDs to names for display
  const staffNames = staffMembers.reduce((acc, staff) => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
    acc[staff.id] = fullName;
    return acc;
  }, {} as Record<string, string>);

  // Filter payroll records based on search term and status filter
  const filteredPayroll = payrollRecords.filter(record => {
    const staffName = staffNames[record.staff_id] || "";
    const matchesSearch = 
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.pay_period.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && (record.payment_status || "").toLowerCase() === statusFilter.toLowerCase();
  });

  // Apply sorting
  const sortedPayroll = [...filteredPayroll].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue: any, bValue: any;
    switch(sortConfig.key) {
      case 'name':
        aValue = staffNames[a.staff_id] || "";
        bValue = staffNames[b.staff_id] || "";
        break;
      case 'hours':
        aValue = a.total_hours || 0;
        bValue = b.total_hours || 0;
        break;
      case 'pay':
        aValue = a.total_pay || 0;
        bValue = b.total_pay || 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handler for updating payroll status
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
  
  // Process batch payments
  const processPayments = async () => {
    const pendingPayrolls = payrollRecords.filter(record => record.payment_status === "Pending");
    
    if (pendingPayrolls.length === 0) {
      toast({
        title: "Info",
        description: "No pending payments to process",
      });
      return;
    }
    
    try {
      const promises = pendingPayrolls.map(record => 
        updatePayrollRecord(record.id, { 
          payment_status: 'Paid',
          payment_date: new Date().toISOString()
        })
      );
      
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `Processed payments for ${pendingPayrolls.length} staff members`,
      });
    } catch (error) {
      console.error('Failed to process payments:', error);
      toast({
        title: "Error",
        description: "Failed to process payments",
        variant: "destructive"
      });
    }
  };
  
  // Handler for payroll form submission
  const handlePayrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a staff member",
        variant: "destructive"
      });
      return;
    }
    
    const staffMember = staffMembers.find(s => s.id === selectedStaff);
    if (!staffMember) {
      toast({
        title: "Error",
        description: "Selected staff member not found",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const payPeriod = formData.get('payPeriod') as string;
    const regularHours = parseFloat(formData.get('regularHours') as string);
    const overtimeHours = parseFloat(formData.get('overtimeHours') as string);
    const hourlyRate = staffMember.hourly_rate || 0;
    
    const totalHours = regularHours + overtimeHours;
    const totalPay = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
    
    try {
      const newPayroll = {
        staff_id: selectedStaff,
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
      setSelectedStaff("");
    } catch (error) {
      console.error('Failed to add payroll record:', error);
    }
  };
  
  // Export data to CSV
  const exportPayrollData = () => {
    if (filteredPayroll.length === 0) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive"
      });
      return;
    }

    // Transform data to include staff names
    const exportData = filteredPayroll.map(record => ({
      Staff: staffNames[record.staff_id] || record.staff_id,
      PayPeriod: record.pay_period,
      RegularHours: record.regular_hours,
      OvertimeHours: record.overtime_hours,
      TotalHours: record.total_hours,
      TotalPay: `£${record.total_pay.toFixed(2)}`,
      Status: record.payment_status,
      PaymentDate: record.payment_date || ''
    }));
    
    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          let value = row[header as keyof typeof row];
          // Handle special formatting
          if (value === null || value === undefined) value = '';
          if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Payroll_${payrollPeriods.find(p => p.id.toString() === selectedPeriod)?.name || 'Export'}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Payroll data exported successfully",
    });
  };

  // Calculate payroll statistics
  const totalHours = filteredPayroll.reduce((sum, record) => sum + (record.total_hours || 0), 0);
  const totalPay = filteredPayroll.reduce((sum, record) => sum + (record.total_pay || 0), 0);
  const paidStaff = filteredPayroll.filter(record => record.payment_status === "Paid").length;
  const percentagePaid = filteredPayroll.length > 0 ? (paidStaff / filteredPayroll.length) * 100 : 0;

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Payroll Management" />}
        description={<T text="Track staff hours, manage wages, and process payments" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportPayrollData}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              <T text="Print" />
            </Button>
            <Button onClick={processPayments}>
              <Calendar className="mr-2 h-4 w-4" />
              <T text="Process Payments" />
            </Button>
          </div>
        }
      />

      {(staffError || payrollError) && (
        <ErrorDisplay error={staffError || payrollError || ""} />
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Total Hours" />
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">hrs</span></div>
            <p className="text-xs text-muted-foreground">
              <T text="Current pay period" />
            </p>
          </CardContent>
        </Card>
        
        <Card className="flex-1 min-w-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Total Payroll" />
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalPay.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <T text="Current pay period" />
            </p>
          </CardContent>
        </Card>
        
        <Card className="flex-1 min-w-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Payment Status" />
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{percentagePaid.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">
                <T text="Paid" />
              </div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div 
                className={`h-2 rounded-full ${percentagePaid < 50 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${percentagePaid}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle><T text="Pay Period" /></CardTitle>
            <CardDescription>
              <T text="Select a pay period to view and manage payroll" />
            </CardDescription>
          </div>
          <Dialog open={newPayrollDialog} onOpenChange={setNewPayrollDialog}>
            <DialogTrigger asChild>
              <Button>
                <T text="Add Payroll Record" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle><T text="Add Payroll Record" /></DialogTitle>
                <DialogDescription>
                  <T text="Add a new payroll record for a staff member" />
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePayrollSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="staffMember" className="text-right">
                      <T text="Staff Member" />
                    </Label>
                    <Select 
                      value={selectedStaff} 
                      onValueChange={setSelectedStaff}
                      name="staffMember"
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("Select staff member")} />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {`${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payPeriod" className="text-right">
                      <T text="Pay Period" />
                    </Label>
                    <Select name="payPeriod" defaultValue={payrollPeriods[0].name}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t("Select pay period")} />
                      </SelectTrigger>
                      <SelectContent>
                        {payrollPeriods.map(period => (
                          <SelectItem key={period.id} value={period.name}>
                            {period.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>
                <DialogFooter>
                  <Button type="submit"><T text="Save Record" /></Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-[300px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("Select pay period")} />
            </SelectTrigger>
            <SelectContent>
              {payrollPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{period.name}</span>
                    <Badge 
                      variant={period.status === "Completed" ? "outline" : "default"}
                      className="ml-2"
                    >
                      {period.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search staff...")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("Filter by status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Statuses" /></SelectItem>
            <SelectItem value="Paid"><T text="Paid" /></SelectItem>
            <SelectItem value="Pending"><T text="Pending" /></SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <PayrollList
            payrollRecords={sortedPayroll}
            isLoading={isPayrollLoading || isStaffLoading}
            onUpdateStatus={handleUpdatePaymentStatus}
            showStaffInfo={true}
            staffNames={staffNames}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Payroll;
