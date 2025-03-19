
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Calendar as CalendarIcon, Search, Clock, CheckCircle, 
  XCircle, AlertCircle, ChevronRight, Users
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

// Sample staff data
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    status: "Present",
    checkIn: "08:55",
    checkOut: "",
    image: "/placeholder.svg" 
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    status: "Late",
    checkIn: "09:15",
    checkOut: "",
    image: "/placeholder.svg" 
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    status: "Present",
    checkIn: "08:45",
    checkOut: "",
    image: "/placeholder.svg" 
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    status: "Present",
    checkIn: "08:30",
    checkOut: "",
    image: "/placeholder.svg" 
  },
];

// Attendance history for the last week
const attendanceHistory = [
  { date: "2023-06-01", present: 4, late: 0, absent: 0, percentage: 100 },
  { date: "2023-06-02", present: 3, late: 1, absent: 0, percentage: 90 },
  { date: "2023-06-03", present: 4, late: 0, absent: 0, percentage: 100 },
  { date: "2023-06-04", present: 2, late: 1, absent: 1, percentage: 75 },
  { date: "2023-06-05", present: 3, late: 0, absent: 1, percentage: 85 },
];

const StaffAttendance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Late":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Attendance" />}
        description={<T text="Track and manage staff attendance" />}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/staff")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back to Staff" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span><T text="Pick a date" /></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Present Today" /></p>
              <h3 className="text-2xl font-bold">{staffMembers.filter(s => s.status === "Present").length}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Late Today" /></p>
              <h3 className="text-2xl font-bold">{staffMembers.filter(s => s.status === "Late").length}</h3>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Absent Today" /></p>
              <h3 className="text-2xl font-bold">{staffMembers.filter(s => s.status === "Absent").length}</h3>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Departments" /></SelectItem>
            <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
            <SelectItem value="front"><T text="Front of House" /></SelectItem>
            <SelectItem value="management"><T text="Management" /></SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="mb-4">
          <TabsTrigger value="today"><T text="Today's Attendance" /></TabsTrigger>
          <TabsTrigger value="history"><T text="Attendance History" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Department" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Check In" /></TableHead>
                  <TableHead><T text="Check Out" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={staff.image}
                            alt={staff.name}
                            className="aspect-square h-10 w-10 object-cover"
                          />
                        </Avatar>
                        <div>
                          {staff.name}
                          <div className="text-sm text-muted-foreground">{staff.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(staff.status)}
                        <Badge variant={staff.status === "Present" ? "default" : 
                                        staff.status === "Late" ? "outline" : 
                                        "destructive"}>
                          {staff.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {staff.checkIn}
                      </div>
                    </TableCell>
                    <TableCell>
                      {staff.checkOut ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {staff.checkOut}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <T text="Not checked out" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                      >
                        <T text="View Profile" />
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle><T text="Weekly Attendance Summary" /></CardTitle>
              <CardDescription><T text="Last 7 days attendance statistics" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Date" /></TableHead>
                    <TableHead><T text="Present" /></TableHead>
                    <TableHead><T text="Late" /></TableHead>
                    <TableHead><T text="Absent" /></TableHead>
                    <TableHead><T text="Attendance Rate" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-green-600">{day.present}</TableCell>
                      <TableCell className="text-amber-600">{day.late}</TableCell>
                      <TableCell className="text-red-600">{day.absent}</TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress value={day.percentage} className="h-2" />
                          <span className="text-sm">{day.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StaffAttendance;
