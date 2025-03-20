
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus, Users, Search, Clock, CalendarClock, BadgeDollarSign, Check, Ban, ArrowUpDown } from "lucide-react";
import { useStaff } from "@/hooks/useStaff";
import { StaffMember } from "@/types/staff";

const StaffManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { staff, isLoading } = useStaff();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof StaffMember>("first_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter staff by search term
  const filteredStaff = staff.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort staff
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA < valueB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (field: keyof StaffMember) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Group staff by department
  const staffByDepartment = staff.reduce(
    (acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    },
    {} as Record<string, StaffMember[]>
  );

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Staff Management" />}
        description={<T text="Manage your restaurant staff, track performance, and assign tasks" />}
        actions={
          <Button onClick={() => navigate("/admin/staff/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Add Staff Member" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Total Staff" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              <T text="Active staff members" />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Attendance Rate" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.length ? Math.round((staff.filter((s) => s.attendance === "Present").length / staff.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <T text="Current day" />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Upcoming Schedule" />
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <T text="Staff on duty tomorrow" />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <T text="Payroll Due" />
            </CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{staff.reduce((sum, s) => sum + (s.hourly_rate || 0), 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <T text="Weekly total" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search staff...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex ml-4 space-x-2">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => handleSort("role")}
          >
            <T text="Role" />
            <ArrowUpDown className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => handleSort("department")}
          >
            <T text="Department" />
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            <T text="All Staff" />
          </TabsTrigger>
          <TabsTrigger value="kitchen">
            <T text="Kitchen" />
          </TabsTrigger>
          <TabsTrigger value="frontofhouse">
            <T text="Front of House" />
          </TabsTrigger>
          <TabsTrigger value="management">
            <T text="Management" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <T text="Loading staff data..." />
                  </div>
                </CardContent>
              </Card>
            ) : sortedStaff.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <T text="No staff members found" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedStaff.map((member, index) => (
                <Card key={member.id || index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={member.attendance === "Present" ? "outline" : "default"}
                        className={
                          member.attendance === "Present"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : member.attendance === "Late"
                            ? "bg-amber-500 hover:bg-amber-500"
                            : "bg-red-500 hover:bg-red-500"
                        }
                      >
                        {member.attendance === "Present" ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Ban className="h-3 w-3 mr-1" />
                        )}
                        <T text={member.attendance} />
                      </Badge>
                      <Badge variant="secondary">
                        <T text={member.role} />
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pb-3">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <img
                        src={member.image_url || "/placeholder.svg"}
                        alt={`${member.first_name} ${member.last_name}`}
                        className="object-cover"
                      />
                    </Avatar>
                    <h3 className="font-semibold text-lg">{`${member.first_name} ${member.last_name}`}</h3>
                    <p className="text-muted-foreground text-sm">{member.department}</p>
                    <div className="flex items-center justify-center mt-2 gap-1">
                      <span className="text-xs text-muted-foreground">
                        <T text="Performance:" />
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          member.performance > 90
                            ? "text-green-600"
                            : member.performance > 70
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {member.performance}%
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/staff/profile/${member.id}`)}
                    >
                      <T text="View Profile" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/staff/tasks?assign=${member.id}`)}
                    >
                      <T text="Assign Task" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Department tabs - these would ideally be dynamic based on your departments */}
        {["kitchen", "frontofhouse", "management"].map((dept, index) => {
          const deptName = dept === "frontofhouse" ? "Front of House" : dept === "kitchen" ? "Kitchen" : "Management";
          const deptStaff = staff.filter(
            member => member.department.toLowerCase() === deptName.toLowerCase()
          );
          
          return (
            <TabsContent key={index} value={dept}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deptStaff.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <T text={`No staff members in ${deptName}`} />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  deptStaff.map((member, idx) => (
                    <Card key={member.id || idx}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={member.attendance === "Present" ? "outline" : "default"}
                            className={
                              member.attendance === "Present"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : member.attendance === "Late"
                                ? "bg-amber-500 hover:bg-amber-500"
                                : "bg-red-500 hover:bg-red-500"
                            }
                          >
                            {member.attendance === "Present" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Ban className="h-3 w-3 mr-1" />
                            )}
                            <T text={member.attendance} />
                          </Badge>
                          <Badge variant="secondary">
                            <T text={member.role} />
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-center pb-3">
                        <Avatar className="h-20 w-20 mx-auto mb-3">
                          <img
                            src={member.image_url || "/placeholder.svg"}
                            alt={`${member.first_name} ${member.last_name}`}
                            className="object-cover"
                          />
                        </Avatar>
                        <h3 className="font-semibold text-lg">{`${member.first_name} ${member.last_name}`}</h3>
                        <p className="text-muted-foreground text-sm">{member.department}</p>
                        <div className="flex items-center justify-center mt-2 gap-1">
                          <span className="text-xs text-muted-foreground">
                            <T text="Performance:" />
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              member.performance > 90
                                ? "text-green-600"
                                : member.performance > 70
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {member.performance}%
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/staff/profile/${member.id}`)}
                        >
                          <T text="View Profile" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/staff/tasks?assign=${member.id}`)}
                        >
                          <T text="Assign Task" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </Layout>
  );
};

export default StaffManagement;
