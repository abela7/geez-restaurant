
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Plus, Search, UserPlus, Star, Clock, ChevronRight, 
  CalendarDays, DollarSign, BarChart, Users,
  BookUser, ListChecks, BadgeDollarSign, AlertCircle
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the staff member type based on the profiles table schema
type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  department: string | null;
  attendance: string | null;
  performance: number | null;
  hourly_rate: number | null;
  image_url: string | null;
};

const StaffManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
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
      
      setStaffMembers(data || []);
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

  useEffect(() => {
    fetchStaffData();
  }, []);

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getFullName = (staff: StaffMember) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

  const getAttendanceVariant = (attendance: string | null) => {
    switch (attendance) {
      case "Present":
        return "default";
      case "Late":
        return "secondary";
      case "Absent":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Calculate statistics for dashboard cards
  const presentCount = staffMembers.filter(s => s.attendance === "Present").length;
  const lateCount = staffMembers.filter(s => s.attendance === "Late").length;
  const absentCount = staffMembers.filter(s => s.attendance === "Absent").length;
  const totalHourlyRate = staffMembers.reduce((acc, staff) => acc + (staff.hourly_rate || 0), 0);

  const filterStaffByDepartment = (department: string) => {
    return filteredStaff.filter(staff => staff.department === department);
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Management" />}
        description={<T text="Manage your restaurant staff, track attendance and performance" />}
        actions={
          <Button onClick={() => navigate("/admin/staff/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Add Staff" />
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/directory")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Staff Directory" /></p>
              <h3 className="text-2xl font-bold">{staffMembers.length}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <BookUser className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/attendance")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Present Today" /></p>
              <h3 className="text-2xl font-bold">{presentCount}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
              <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/tasks")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Task Management" /></p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
              <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/payroll")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Total Wage Per Hour" /></p>
              <h3 className="text-2xl font-bold">£{totalHourlyRate.toFixed(2)}</h3>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
              <BadgeDollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin/staff/directory")}>
            <BookUser className="mr-2 h-4 w-4" />
            <T text="Directory" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/staff/tasks")}>
            <ListChecks className="mr-2 h-4 w-4" />
            <T text="Tasks" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/staff/payroll")}>
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            <T text="Payroll" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
          <TabsTrigger value="kitchen"><T text="Kitchen" /></TabsTrigger>
          <TabsTrigger value="waiters"><T text="Waiters" /></TabsTrigger>
          <TabsTrigger value="management"><T text="Management" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground"><T text="No staff members found" /></p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Staff Member" /></TableHead>
                    <TableHead><T text="Role" /></TableHead>
                    <TableHead><T text="Department" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead><T text="Performance" /></TableHead>
                    <TableHead><T text="Rate" /></TableHead>
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <Badge variant={getAttendanceVariant(staff.attendance)}>
                          {staff.attendance || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{staff.performance || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                        >
                          <T text="View" />
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

        <TabsContent value="kitchen">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Performance" /></TableHead>
                  <TableHead><T text="Rate" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStaffByDepartment("Kitchen").map((staff) => (
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge variant={getAttendanceVariant(staff.attendance)}>
                        {staff.attendance || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{staff.performance || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                      >
                        <T text="View" />
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="waiters">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Performance" /></TableHead>
                  <TableHead><T text="Rate" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStaffByDepartment("Front of House").map((staff) => (
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge variant={getAttendanceVariant(staff.attendance)}>
                        {staff.attendance || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{staff.performance || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                      >
                        <T text="View" />
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Performance" /></TableHead>
                  <TableHead><T text="Rate" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStaffByDepartment("Management").map((staff) => (
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge variant={getAttendanceVariant(staff.attendance)}>
                        {staff.attendance || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{staff.performance || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                      >
                        <T text="View" />
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StaffManagement;
