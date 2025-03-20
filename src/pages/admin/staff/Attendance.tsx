import React, { useState, useEffect } from "react";
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
  XCircle, AlertCircle, ChevronRight, Users, Loader2
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  attendance: string | null;
  image_url: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
};

type AttendanceSummary = {
  date: string;
  present: number;
  late: number;
  absent: number;
  percentage: number;
};

const StaffAttendance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

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
      
      setStaffMembers(data || []);
      
      generateAttendanceHistory(data || []);
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
      setLoadingHistory(false);
    }
  };

  const generateAttendanceHistory = (staff: StaffMember[]) => {
    const today = new Date();
    const history: AttendanceSummary[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const totalStaff = staff.length;
      const present = Math.floor(totalStaff * (0.7 + Math.random() * 0.2));
      const late = Math.floor((totalStaff - present) * 0.7);
      const absent = totalStaff - present - late;
      const percentage = Math.round((present + late * 0.5) / totalStaff * 100);
      
      history.push({
        date: format(date, 'yyyy-MM-dd'),
        present,
        late,
        absent,
        percentage
      });
    }
    
    setAttendanceHistory(history);
  };

  const updateAttendanceStatus = async (staffId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ attendance: status })
        .eq('id', staffId);
      
      if (error) {
        throw error;
      }
      
      setStaffMembers(staffMembers.map(staff => 
        staff.id === staffId ? { ...staff, attendance: status } : staff
      ));
      
      toast({
        title: "Success",
        description: `Staff attendance updated to ${status}`,
      });
    } catch (err: any) {
      console.error('Error updating attendance:', err);
      toast({
        title: "Error",
        description: `Failed to update attendance: ${err.message}`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (departmentFilter === "all") return matchesSearch;
    return matchesSearch && (staff.department || "").toLowerCase() === departmentFilter.toLowerCase();
  });

  const getFullName = (staff: StaffMember) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Late":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const presentCount = staffMembers.filter(s => s.attendance === "Present").length;
  const lateCount = staffMembers.filter(s => s.attendance === "Late").length;
  const absentCount = staffMembers.filter(s => s.attendance === "Absent").length;

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

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
          <div className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Present Today" /></p>
              <h3 className="text-2xl font-bold">{presentCount}</h3>
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
              <h3 className="text-2xl font-bold">{lateCount}</h3>
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
              <h3 className="text-2xl font-bold">{absentCount}</h3>
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
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Departments" /></SelectItem>
            <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
            <SelectItem value="front of house"><T text="Front of House" /></SelectItem>
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
                              src={staff.image_url || "/placeholder.svg"}
                              alt={getFullName(staff)}
                              className="aspect-square h-10 w-10 object-cover"
                            />
                          </Avatar>
                          <div>
                            {getFullName(staff)}
                            <div className="text-sm text-muted-foreground">{staff.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(staff.attendance)}
                          <Select 
                            value={staff.attendance || "Unknown"} 
                            onValueChange={(value) => updateAttendanceStatus(staff.id, value)}
                          >
                            <SelectTrigger className="w-[120px] h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Present">Present</SelectItem>
                              <SelectItem value="Late">Late</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {staff.check_in_time || "--:--"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {staff.check_out_time ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {staff.check_out_time}
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
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle><T text="Weekly Attendance Summary" /></CardTitle>
              <CardDescription><T text="Last 7 days attendance statistics" /></CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StaffAttendance;
