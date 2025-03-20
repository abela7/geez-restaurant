
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Key, User, Shield, UserCog, Eye, EyeOff, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge-extended';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const USERS_DATA = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@habesharestaurant.com",
    role: "Administrator",
    lastLogin: "2023-06-10 14:32",
    status: "active"
  },
  {
    id: 2,
    name: "Manager One",
    email: "manager1@habesharestaurant.com",
    role: "Manager",
    lastLogin: "2023-06-09 09:15",
    status: "active"
  },
  {
    id: 3,
    name: "Waiter One",
    email: "waiter1@habesharestaurant.com",
    role: "Waiter",
    lastLogin: "2023-06-10 18:45",
    status: "active"
  },
  {
    id: 4,
    name: "Kitchen One",
    email: "kitchen1@habesharestaurant.com",
    role: "Kitchen Staff",
    lastLogin: "2023-06-10 16:20",
    status: "active"
  },
  {
    id: 5,
    name: "System Admin",
    email: "sysadmin@habesharestaurant.com",
    role: "System Administrator",
    lastLogin: "2023-06-01 10:05",
    status: "inactive"
  },
];

const ROLES_DATA = [
  {
    id: 1,
    name: "Administrator",
    users: 1,
    permissions: "Full access to all system features"
  },
  {
    id: 2,
    name: "Manager",
    users: 2,
    permissions: "Access to operations, staff, menu, and limited financial data"
  },
  {
    id: 3,
    name: "Waiter",
    users: 8,
    permissions: "Access to order management, tables, and payments"
  },
  {
    id: 4,
    name: "Kitchen Staff",
    users: 5,
    permissions: "Access to orders, recipes, and inventory checks"
  },
  {
    id: 5,
    name: "System Administrator",
    users: 1,
    permissions: "Access to system settings, logs, and user management"
  },
];

const UserAccess: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="User Access" />}
        description={<T text="Manage user accounts and permissions" />}
        icon={<Key className="h-6 w-6" />}
        actions={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            <T text="Add User" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Users" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">17</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Across all roles" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Active Users" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">16</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Currently active" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Roles" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Permission groups" /></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle><T text="User Accounts" /></CardTitle>
            <CardDescription><T text="Manage system users and their access" /></CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder={t("Search users...")}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Name" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Email" /></TableHead>
                  <TableHead><T text="Role" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Last Login" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {USERS_DATA.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "active" ? "success" : "warning"}
                      >
                        <T text={user.status} />
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="User Roles" /></CardTitle>
                <CardDescription><T text="Manage permission groups" /></CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <T text="Add Role" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ROLES_DATA.map((role) => (
                <div key={role.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-7">
                      {role.users} <T text="users" />
                    </p>
                  </div>
                  <div className="hidden md:block text-sm max-w-[50%] text-muted-foreground">
                    {role.permissions}
                  </div>
                  <Button variant="ghost" size="sm">
                    <T text="Edit" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserAccess;
