import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Key, User, Shield, UserCog, Eye, EyeOff, Search, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge-extended';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import NoData from '@/components/ui/no-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  getUserAccounts, 
  getUserRoles, 
  createUserAccount, 
  updateUserAccount, 
  deleteUserAccount,
  createUserRole,
  updateUserRole,
  deleteUserRole,
  getUserActivityLogs
} from '@/services/settings/userAccessService';
import { UserAccount, UserRole, UserActivityLog } from '@/services/settings/types';

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  role_id: z.string().nullable(),
  status: z.string().default("active")
});

const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().nullable(),
  permissions: z.record(z.boolean()).optional().default({})
});

const UserAccess: React.FC = () => {
  const { t } = useLanguage();
  
  // States
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'user' | 'role'>('user');
  
  // Forms
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role_id: null,
      status: 'active'
    }
  });
  
  const roleForm = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: {}
    }
  });
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [usersData, rolesData, logsData] = await Promise.all([
          getUserAccounts(),
          getUserRoles(),
          getUserActivityLogs()
        ]);
        
        setUsers(usersData);
        setRoles(rolesData);
        setActivityLogs(logsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (user.role?.name || '').toLowerCase().includes(userSearch.toLowerCase())
  );
  
  // Handlers
  const handleOpenUserDialog = (user?: UserAccount) => {
    if (user) {
      setSelectedUser(user);
      userForm.reset({
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        status: user.status
      });
    } else {
      setSelectedUser(null);
      userForm.reset({
        name: '',
        email: '',
        role_id: null,
        status: 'active'
      });
    }
    setIsUserDialogOpen(true);
  };
  
  const handleOpenRoleDialog = (role?: UserRole) => {
    if (role) {
      setSelectedRole(role);
      roleForm.reset({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions
      });
    } else {
      setSelectedRole(null);
      roleForm.reset({
        name: '',
        description: '',
        permissions: {}
      });
    }
    setIsRoleDialogOpen(true);
  };
  
  const handleDeleteUser = (user: UserAccount) => {
    setSelectedUser(user);
    setDeleteType('user');
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteRole = (role: UserRole) => {
    setSelectedRole(role);
    setDeleteType('role');
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (deleteType === 'user' && selectedUser) {
      await deleteUserAccount(selectedUser.id);
      setUsers(users.filter(user => user.id !== selectedUser.id));
    } else if (deleteType === 'role' && selectedRole) {
      await deleteUserRole(selectedRole.id);
      setRoles(roles.filter(role => role.id !== selectedRole.id));
    }
    setIsDeleteDialogOpen(false);
  };
  
  const onSubmitUser = async (values: z.infer<typeof userFormSchema>) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUserAccount(selectedUser.id, values);
        if (updatedUser) {
          setUsers(users.map(user => 
            user.id === selectedUser.id ? { ...updatedUser, role: roles.find(r => r.id === updatedUser.role_id) } : user
          ));
        }
      } else {
        const newUser = await createUserAccount({
          name: values.name,
          email: values.email,
          role_id: values.role_id,
          status: values.status
        });
        if (newUser) {
          setUsers([...users, { ...newUser, role: roles.find(r => r.id === newUser.role_id) }]);
        }
      }
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  const onSubmitRole = async (values: z.infer<typeof roleFormSchema>) => {
    try {
      if (selectedRole) {
        const updatedRole = await updateUserRole(selectedRole.id, {
          name: values.name,
          description: values.description,
          permissions: values.permissions
        });
        if (updatedRole) {
          setRoles(roles.map(role => 
            role.id === selectedRole.id ? updatedRole : role
          ));
        }
      } else {
        const newRole = await createUserRole({
          name: values.name,
          description: values.description || null,
          permissions: values.permissions || {}
        });
        if (newRole) {
          setRoles([...roles, newRole]);
        }
      }
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Layout interface="admin">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="User Access" />}
        description={<T text="Manage user accounts and permissions" />}
        icon={<Key className="h-6 w-6" />}
        actions={
          <Button onClick={() => handleOpenUserDialog()}>
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
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Across all roles" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Active Users" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.filter(user => user.status === 'active').length}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Currently active" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Roles" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roles.length}</div>
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
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <NoData message={t("No user accounts found")} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Name" /></TableHead>
                    <TableHead className="hidden md:table-cell"><T text="Email" /></TableHead>
                    <TableHead><T text="Role" /></TableHead>
                    <TableHead className="hidden md:table-cell"><T text="Last Login" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{user.role?.name || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.last_login ? new Date(user.last_login).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === "active" ? "success" : "warning"}
                        >
                          <T text={user.status} />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenUserDialog(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle><T text="User Roles" /></CardTitle>
                <CardDescription><T text="Manage permission groups" /></CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleOpenRoleDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                <T text="Add Role" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {roles.length === 0 ? (
              <NoData message={t("No roles found")} />
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-7">
                        {users.filter(user => user.role_id === role.id).length} <T text="users" />
                      </p>
                    </div>
                    <div className="hidden md:block text-sm max-w-[50%] text-muted-foreground">
                      {role.description || '-'}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenRoleDialog(role)}>
                        <T text="Edit" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Form Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? t("Edit User") : t("Add User")}</DialogTitle>
            <DialogDescription>
              {selectedUser ? t("Update user account details") : t("Create a new user account")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Name" /></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Email" /></FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Role" /></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a role")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">{t("None")}</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={userForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Status" /></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t("Active")}</SelectItem>
                        <SelectItem value="inactive">{t("Inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button type="submit">
                  <T text="Save" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Role Form Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRole ? t("Edit Role") : t("Add Role")}</DialogTitle>
            <DialogDescription>
              {selectedRole ? t("Update role details and permissions") : t("Create a new user role")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onSubmitRole)} className="space-y-4">
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Role Name" /></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={roleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Description" /></FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="text-sm font-medium mb-2"><T text="Permissions" /></h3>
                <div className="space-y-2 border rounded-md p-4">
                  {/* Would list permissions here with checkboxes */}
                  <p className="text-sm text-muted-foreground">
                    <T text="Detailed permission editor would be implemented here" />
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button type="submit">
                  <T text="Save" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={deleteType === 'user' ? t("Delete User") : t("Delete Role")}
        description={
          deleteType === 'user' 
            ? t(`Are you sure you want to delete the user "${selectedUser?.name}"? This action cannot be undone.`) 
            : t(`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`)
        }
        confirmLabel={t("Delete")}
        isDangerous={true}
      />
    </Layout>
  );
};

export default UserAccess;
