
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, User, Clock, Download, Search, ArrowUpDown, Filter, PieChart, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the staff member type
type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  hourly_rate: number | null;
  image_url: string | null;
  hours_worked?: number;
  regular_hours?: number;
  overtime_hours?: number;
  total_pay?: number;
  payment_status?: "Paid" | "Pending";
};

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
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch staff data from the database
  const fetchStaffData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Enhance the data with additional payroll metrics
      // In a real app, these would come from proper payroll/timesheet tables
      const enhancedData = (data || []).map(staff => {
        const hourlyRate = staff.hourly_rate || 0;
        
        // Generate random but realistic work hours
        const regularHours = Math.floor(35 + Math.random() * 5);
        const overtimeHours = Math.floor(Math.random() * 6);
        const hoursWorked = regularHours + overtimeHours;
        
        // Calculate pay
        const totalPay = regularHours * hourlyRate + overtimeHours * hourlyRate * 1.5;
        
        // Random payment status
        const paymentStatus = Math.random() > 0.5 ? "Paid" : "Pending";
        
        return {
          ...staff,
          hours_worked: hoursWorked,
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          total_pay: totalPay,
          payment_status: paymentStatus as "Paid" | "Pending"
        };
      });
      
      setStaffMembers(enhancedData);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError(err.message || 'Failed to load staff data');
      toast({
        title: "Error",
        description: `Failed to load staff data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update staff payment status
  const updatePaymentStatus = async (staffId: string, status: "Paid" | "Pending") => {
    try {
      // In a real app, this would update a payroll records table
      // For now, we'll just update the local state
      setStaffMembers(staffMembers.map(staff => 
        staff.id === staffId ? { ...staff, payment_status: status } : staff
      ));
      
      toast({
        title: "Success",
        description: `Payment status updated to ${status}`,
      });
    } catch (err: any) {
      console.error('Error updating payment status:', err);
      toast({
        title: "Error",
        description: `Failed to update payment status: ${err.message}`,
        variant: "destructive"
      });
    }
  };

  // Process batch payments
  const processPayments = () => {
    // In a real app, this would trigger payment processing
    const pendingStaff = staffMembers.filter(staff => staff.payment_status === "Pending");
    
    if (pendingStaff.length === 0) {
      toast({
        title: "Info",
        description: "No pending payments to process",
      });
      return;
    }
    
    setStaffMembers(staffMembers.map(staff => 
      staff.payment_status === "Pending" ? { ...staff, payment_status: "Paid" } : staff
    ));
    
    toast({
      title: "Success",
      description: `Processed payments for ${pendingStaff.length} staff members`,
    });
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const getFullName = (staff: StaffMember) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = getFullName(staff).toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.department || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && (staff.payment_status || "").toLowerCase() === statusFilter.toLowerCase();
  });

  // Apply sorting
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue: any, bValue: any;
    switch(sortConfig.key) {
      case 'name':
        aValue = getFullName(a);
        bValue = getFullName(b);
        break;
      case 'hoursWorked':
        aValue = a.hours_worked || 0;
        bValue = b.hours_worked || 0;
        break;
      case 'totalPay':
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

  // Calculate payroll statistics
  const totalHours = staffMembers.reduce((sum, staff) => sum + (staff.hours_worked || 0), 0);
  const totalPay = staffMembers.reduce((sum, staff) => sum + (staff.total_pay || 0), 0);
  const paidStaff = staffMembers.filter(staff => staff.payment_status === "Paid").length;
  const percentagePaid = staffMembers.length > 0 ? (paidStaff / staffMembers.length) * 100 : 0;

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Payroll Management" />}
        description={<T text="Track staff hours, manage wages, and process payments" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
            <Button onClick={processPayments}>
              <DollarSign className="mr-2 h-4 w-4" />
              <T text="Process Payments" />
            </Button>
          </div>
        }
      />

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
          <div className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      )}

      <div className="mb-6 flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Total Hours" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} <span className="text-sm font-normal text-muted-foreground">hrs</span></div>
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
            <Progress 
              value={percentagePaid} 
              className="h-2 mt-2" 
              indicatorClassName={percentagePaid < 50 ? "bg-amber-500" : "bg-green-500"}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle><T text="Pay Period" /></CardTitle>
          <CardDescription>
            <T text="Select a pay period to view and manage payroll" />
          </CardDescription>
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
            <SelectItem value="paid"><T text="Paid" /></SelectItem>
            <SelectItem value="pending"><T text="Pending" /></SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="p-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground"><T text="No staff members found" /></p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Staff Member" /></TableHead>
                <TableHead onClick={() => requestSort('hoursWorked')} className="cursor-pointer">
                  <div className="flex items-center">
                    <T text="Hours" />
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead><T text="Regular Hours" /></TableHead>
                <TableHead><T text="Overtime" /></TableHead>
                <TableHead><T text="Rate" /></TableHead>
                <TableHead onClick={() => requestSort('totalPay')} className="cursor-pointer">
                  <div className="flex items-center">
                    <T text="Total" />
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <img
                          src={staff.image_url || "/placeholder.svg"}
                          alt={getFullName(staff)}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </Avatar>
                      <div>
                        <div>{getFullName(staff)}</div>
                        <div className="text-sm text-muted-foreground">{staff.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{staff.hours_worked}</TableCell>
                  <TableCell>{staff.regular_hours}</TableCell>
                  <TableCell>{staff.overtime_hours}</TableCell>
                  <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
                  <TableCell className="font-semibold">£{staff.total_pay?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Select 
                      value={staff.payment_status} 
                      onValueChange={(value) => updatePaymentStatus(staff.id, value as "Paid" | "Pending")}
                    >
                      <SelectTrigger className="w-[100px] h-7">
                        <Badge variant={staff.payment_status === "Paid" ? "outline" : "default"}>
                          {staff.payment_status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                    >
                      <T text="Details" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </Layout>
  );
};

export default Payroll;
