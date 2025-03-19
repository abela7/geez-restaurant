
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, UserPlus, Filter, Lock, UserCog, KeyRound, Activity, ShieldAlert } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample users data
const users = [
  { id: 1, name: "Abebe Kebede", email: "abebe@ethiorest.com", role: "Admin", status: "Active", lastLogin: "Today, 10:25 AM", image: "/placeholder.svg" },
  { id: 2, name: "Makeda Haile", email: "makeda@ethiorest.com", role: "Kitchen Manager", status: "Active", lastLogin: "Today, 9:12 AM", image: "/placeholder.svg" },
  { id: 3, name: "Dawit Tadesse", email: "dawit@ethiorest.com", role: "Waiter", status: "Active", lastLogin: "Yesterday, 6:45 PM", image: "/placeholder.svg" },
  { id: 4, name: "Sara Mengistu", email: "sara@ethiorest.com", role: "Waiter", status: "Inactive", lastLogin: "Jul 10, 5:30 PM", image: "/placeholder.svg" },
  { id: 5, name: "Samuel Tekle", email: "samuel@ethiorest.com", role: "Bartender", status: "Active", lastLogin: "Today, 11:05 AM", image: "/placeholder.svg" },
  { id: 6, name: "Tigist Alemu", email: "tigist@ethiorest.com", role: "Hostess", status: "Active", lastLogin: "Yesterday, 8:20 PM", image: "/placeholder.svg" },
  { id: 7, name: "Yonas Gebre", email: "yonas@ethiorest.com", role: "System Admin", status: "Active", lastLogin: "Today, 8:45 AM", image: "/placeholder.svg" },
];

// Sample role permissions data
const rolePermissions = [
  { 
    role: "Admin", 
    permissions: [
      "View Dashboard",
      "Manage Staff",
      "Manage Menu",
      "Manage Inventory",
      "View Reports",
      "Manage Tasks",
      "Manage Finance",
      "View Feedback",
      "Send Announcements"
    ]
  },
  { 
    role: "Kitchen Manager", 
    permissions: [
      "View Kitchen Dashboard",
      "Update Food Status",
      "View Inventory",
      "Update Inventory",
      "Manage Kitchen Staff",
      "Communicate with Staff"
    ]
  },
  { 
    role: "Waiter", 
    permissions: [
      "View Tables",
      "Take Orders",
      "Process Payments",
      "View Current Menu",
      "Manage Assigned Tasks"
    ]
  },
  { 
    role: "System Admin", 
    permissions: [
      "All Admin Permissions",
      "Manage User Accounts",
      "System Configuration",
      "View Error Logs",
      "Manage Backups",
      "Security Settings"
    ]
  },
];

const UserManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="User Management" 
        description="Manage user accounts, roles and permissions"
        actions={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            <T text="Add User" />
          </Button>
        }
      />
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <UserCog className="h-4 w-4 mr-2" />
            <T text="Users" />
          </TabsTrigger>
          <TabsTrigger value="roles">
            <ShieldAlert className="h-4 w-4 mr-2" />
            <T text="Roles & Permissions" />
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            <T text="User Activity" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-9 w-full md:max-w-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    <T text="Filter" />
                  </Button>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="User" /></TableHead>
                  <TableHead><T text="Email" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Last Login" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img src={user.image} alt={user.name} />
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <T text="Edit" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Lock className="h-4 w-4 mr-1" />
                        <T text="Reset Password" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rolePermissions.map((roleData) => (
              <Card key={roleData.role} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{roleData.role}</h3>
                  <Button variant="outline" size="sm">
                    <T text="Edit Role" />
                  </Button>
                </div>
                
                <h4 className="text-sm font-medium mb-2"><T text="Permissions" /></h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {roleData.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">
                    <KeyRound className="h-4 w-4 mr-2" />
                    <T text="View Access Log" />
                  </Button>
                </div>
              </Card>
            ))}

            <Card className="p-4 flex flex-col justify-center items-center h-full border-dashed">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2"><T text="Create New Role" /></h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                <T text="Define custom roles with specific permissions for your restaurant staff" />
              </p>
              <Button>
                <T text="Create Role" />
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Recent User Activity" /></h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Timestamp" /></TableHead>
                  <TableHead><T text="User" /></TableHead>
                  <TableHead><T text="Activity" /></TableHead>
                  <TableHead><T text="IP Address" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Today, 10:25 AM</TableCell>
                  <TableCell>Abebe Kebede</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>192.168.1.45</TableCell>
                  <TableCell><Badge variant="default">Success</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Today, 10:30 AM</TableCell>
                  <TableCell>Abebe Kebede</TableCell>
                  <TableCell>Created New Menu Item</TableCell>
                  <TableCell>192.168.1.45</TableCell>
                  <TableCell><Badge variant="default">Success</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Today, 9:45 AM</TableCell>
                  <TableCell>Yonas Gebre</TableCell>
                  <TableCell>Reset Password for Samuel Tekle</TableCell>
                  <TableCell>192.168.1.22</TableCell>
                  <TableCell><Badge variant="default">Success</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Today, 9:12 AM</TableCell>
                  <TableCell>Makeda Haile</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>192.168.1.78</TableCell>
                  <TableCell><Badge variant="default">Success</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Today, 9:05 AM</TableCell>
                  <TableCell>Unknown</TableCell>
                  <TableCell>Login Attempt (username: admin)</TableCell>
                  <TableCell>203.45.67.89</TableCell>
                  <TableCell><Badge variant="destructive">Failed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Today, 8:45 AM</TableCell>
                  <TableCell>Yonas Gebre</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>192.168.1.22</TableCell>
                  <TableCell><Badge variant="default">Success</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
