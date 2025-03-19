import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Search, UserPlus, Star, Clock } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample staff data
const staffMembers = [
  { id: 1, name: "Abebe Kebede", role: "Manager", attendance: "Present", performance: 95, image: "/placeholder.svg" },
  { id: 2, name: "Makeda Haile", role: "Chef", attendance: "Late", performance: 88, image: "/placeholder.svg" },
  { id: 3, name: "Dawit Tadesse", role: "Waiter", attendance: "Present", performance: 92, image: "/placeholder.svg" },
  { id: 4, name: "Sara Mengistu", role: "Waiter", attendance: "Absent", performance: 75, image: "/placeholder.svg" },
  { id: 5, name: "Samuel Tekle", role: "Bartender", attendance: "Present", performance: 89, image: "/placeholder.svg" },
  { id: 6, name: "Tigist Alemu", role: "Hostess", attendance: "Present", performance: 90, image: "/placeholder.svg" },
];

const StaffManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Staff Management" 
        description="Manage your restaurant staff, track attendance and performance"
        actions={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Add Staff" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff..."
            className="w-full pl-9"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
          <TabsTrigger value="waiters"><T text="Waiters" /></TabsTrigger>
          <TabsTrigger value="kitchen"><T text="Kitchen" /></TabsTrigger>
          <TabsTrigger value="management"><T text="Management" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Performance" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
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
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <T text="View Profile" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Other tabs would contain filtered versions of the same table */}
        <TabsContent value="waiters">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of waiters would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of kitchen staff would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of management would appear here" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement;
