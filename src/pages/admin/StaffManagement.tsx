import React, { useState } from "react";
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
  BookUser, ListChecks, BadgeDollarSign
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

// Sample staff data
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    attendance: "Present", 
    performance: 95, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg" 
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    attendance: "Late", 
    performance: 88, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg" 
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    attendance: "Present", 
    performance: 92, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg" 
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    attendance: "Present", 
    performance: 98, 
    wage: 8,
    hourlyRate: "£8.00/hr",
    image: "/placeholder.svg" 
  },
];

const StaffManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStaff = (id: number) => {
    navigate(`/admin/staff/profile/${id}`);
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
              <h3 className="text-2xl font-bold">{staffMembers.filter(s => s.attendance === "Present").length}</h3>
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
              <h3 className="text-2xl font-bold">£{staffMembers.reduce((acc, staff) => acc + staff.wage, 0)}</h3>
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
                            src={staff.image}
                            alt={staff.name}
                            className="aspect-square h-10 w-10 object-cover"
                          />
                        </Avatar>
                        <div>
                          {staff.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <Badge variant={staff.attendance === "Present" ? "default" : 
                                      staff.attendance === "Late" ? "outline" : 
                                      "destructive"}>
                        {staff.attendance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{staff.performance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{staff.hourlyRate}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewStaff(staff.id)}
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
                {filteredStaff
                  .filter(staff => staff.department === "Kitchen")
                  .map((staff) => (
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Badge variant={staff.attendance === "Present" ? "default" : 
                                        staff.attendance === "Late" ? "outline" : 
                                        "destructive"}>
                          {staff.attendance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{staff.performance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.hourlyRate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewStaff(staff.id)}
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
                {filteredStaff
                  .filter(staff => staff.department === "Front of House")
                  .map((staff) => (
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Badge variant={staff.attendance === "Present" ? "default" : 
                                        staff.attendance === "Late" ? "outline" : 
                                        "destructive"}>
                          {staff.attendance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{staff.performance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.hourlyRate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewStaff(staff.id)}
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
                {filteredStaff
                  .filter(staff => staff.department === "Management")
                  .map((staff) => (
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Badge variant={staff.attendance === "Present" ? "default" : 
                                        staff.attendance === "Late" ? "outline" : 
                                        "destructive"}>
                          {staff.attendance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{staff.performance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.hourlyRate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewStaff(staff.id)}
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
