
import React, { useState } from "react";
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
import { DollarSign, Calendar, User, Clock, Download, Search, ArrowUpDown, Filter, PieChart } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

// Sample staff data
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    wage: 6,
    hourlyRate: "£6.00/hr",
    hoursWorked: 42,
    regularHours: 40,
    overtimeHours: 2,
    totalPay: 258,
    paymentStatus: "Paid",
    image: "/placeholder.svg" 
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    wage: 6,
    hourlyRate: "£6.00/hr",
    hoursWorked: 38,
    regularHours: 38,
    overtimeHours: 0,
    totalPay: 228,
    paymentStatus: "Pending",
    image: "/placeholder.svg" 
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    wage: 6,
    hourlyRate: "£6.00/hr",
    hoursWorked: 45,
    regularHours: 40,
    overtimeHours: 5,
    totalPay: 285,
    paymentStatus: "Pending",
    image: "/placeholder.svg" 
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    wage: 8,
    hourlyRate: "£8.00/hr",
    hoursWorked: 40,
    regularHours: 40,
    overtimeHours: 0,
    totalPay: 320,
    paymentStatus: "Paid",
    image: "/placeholder.svg" 
  },
];

// Sample payroll periods
const payrollPeriods = [
  { id: 1, name: "July 1-15, 2023", status: "Completed" },
  { id: 2, name: "July 16-31, 2023", status: "In Progress" },
  { id: 3, name: "June 16-30, 2023", status: "Completed" },
  { id: 4, name: "June 1-15, 2023", status: "Completed" },
];

const Payroll = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2");
  
  const totalHours = staffMembers.reduce((sum, staff) => sum + staff.hoursWorked, 0);
  const totalPay = staffMembers.reduce((sum, staff) => sum + staff.totalPay, 0);
  const percentagePaid = (staffMembers.filter(s => s.paymentStatus === "Paid").length / staffMembers.length) * 100;
  
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && staff.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  // Apply sorting
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue, bValue;
    switch(sortConfig.key) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'hoursWorked':
        aValue = a.hoursWorked;
        bValue = b.hoursWorked;
        break;
      case 'totalPay':
        aValue = a.totalPay;
        bValue = b.totalPay;
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

  const getSortDirection = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 'up' : 'down';
  };

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
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              <T text="Process Payments" />
            </Button>
          </div>
        }
      />

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
        
        <Select defaultValue="all" onValueChange={setStatusFilter}>
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
                        src={staff.image}
                        alt={staff.name}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <div>{staff.name}</div>
                      <div className="text-sm text-muted-foreground">{staff.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.hoursWorked}</TableCell>
                <TableCell>{staff.regularHours}</TableCell>
                <TableCell>{staff.overtimeHours}</TableCell>
                <TableCell>{staff.hourlyRate}</TableCell>
                <TableCell className="font-semibold">£{staff.totalPay.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={staff.paymentStatus === "Paid" ? "outline" : "default"}>
                    {staff.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <T text="Details" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Layout>
  );
};

export default Payroll;
