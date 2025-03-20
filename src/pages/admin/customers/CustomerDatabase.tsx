
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search, Download, UserPlus, Pencil, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';
import { SideModal } from '@/components/ui/side-modal';
import { useToast } from '@/hooks/use-toast';
import CustomerForm from '@/components/customer/CustomerForm';
import { 
  getCustomers, 
  getCustomerStats,
  createCustomer, 
  updateCustomer, 
  deleteCustomer
} from '@/services/customer/customerService';
import { Customer } from '@/services/customer/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomerDatabase: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { 
    data: customers = [], 
    isLoading 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });
  
  const { 
    data: stats = { 
      totalCustomers: 0, 
      activeCustomers: 0, 
      averageVisits: 0,
      loyaltyMembers: { bronze: 0, silver: 0, gold: 0, total: 0 }
    }, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: getCustomerStats
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast({
        title: t("Customer Added"),
        description: t("The customer has been added successfully."),
      });
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to add customer. Please try again."),
        variant: "destructive",
      });
      console.error("Error adding customer:", error);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; customer: Partial<Customer> }) => 
      updateCustomer(data.id, data.customer),
    onSuccess: () => {
      toast({
        title: t("Customer Updated"),
        description: t("The customer has been updated successfully."),
      });
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update customer. Please try again."),
        variant: "destructive",
      });
      console.error("Error updating customer:", error);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      toast({
        title: t("Customer Deleted"),
        description: t("The customer has been deleted successfully."),
      });
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-stats'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete customer. Please try again."),
        variant: "destructive",
      });
      console.error("Error deleting customer:", error);
    }
  });
  
  const handleAddCustomer = (data: Partial<Customer>) => {
    createMutation.mutate(data as Omit<Customer, 'id' | 'created_at' | 'updated_at'>);
  };
  
  const handleUpdateCustomer = (data: Partial<Customer>) => {
    if (selectedCustomer) {
      updateMutation.mutate({ 
        id: selectedCustomer.id, 
        customer: data 
      });
    }
  };
  
  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  };
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };
  
  const handleDeletePrompt = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };
  
  // Filter customers based on search query
  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery) return customers;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return customers.filter(customer => 
      customer.name?.toLowerCase().includes(lowerCaseQuery) ||
      customer.email?.toLowerCase().includes(lowerCaseQuery) ||
      customer.phone?.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Customer Database" />}
        description={<T text="Manage your customer information" />}
        icon={<Database className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <T text="Export" />
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              <T text="Add Customer" />
            </Button>
          </>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Customers" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers}</div>
            <p className="text-sm text-muted-foreground mt-1">
              <T text="+12% from last month" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Active Customers" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCustomers}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalCustomers > 0 
                ? `${Math.round((stats.activeCustomers / stats.totalCustomers) * 100)}% of total customers`
                : <T text="0% of total customers" />}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Average Visits" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageVisits}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Per customer" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Loyalty Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.loyaltyMembers.total}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalCustomers > 0 
                ? `${Math.round((stats.loyaltyMembers.total / stats.totalCustomers) * 100)}% of total customers`
                : <T text="0% of total customers" />}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Customer List" /></CardTitle>
          <CardDescription><T text="View and manage customer information" /></CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={t("Search customers...")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Name" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Email" /></TableHead>
                <TableHead className="hidden lg:table-cell"><T text="Phone" /></TableHead>
                <TableHead><T text="Visits" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Last Visit" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead><T text="Loyalty" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <T text="Loading..." />
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <T text="No customers found." />
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.email || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">{customer.phone || "-"}</TableCell>
                    <TableCell>{customer.visits || 0}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.last_visit 
                        ? format(new Date(customer.last_visit), 'dd/MM/yyyy')
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={(customer.visits || 0) > 0 ? "success" : "warning"}
                      >
                        <T text={(customer.visits || 0) > 0 ? "active" : "inactive"} />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          customer.loyalty_level === "Gold" ? "default" : 
                          customer.loyalty_level === "Silver" ? "secondary" : 
                          "outline"
                        }
                      >
                        <T text={customer.loyalty_level || "Bronze"} />
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only"><T text="View" /></span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only"><T text="Edit" /></span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeletePrompt(customer)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only"><T text="Delete" /></span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Customer Modal */}
      <SideModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title={<T text="Add New Customer" />}
        description={<T text="Create a new customer record" />}
      >
        <CustomerForm 
          onSubmit={handleAddCustomer}
          isLoading={createMutation.isPending}
        />
      </SideModal>
      
      {/* Edit Customer Modal */}
      <SideModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title={<T text="Edit Customer" />}
        description={<T text="Update customer information" />}
      >
        {selectedCustomer && (
          <CustomerForm 
            customer={selectedCustomer}
            onSubmit={handleUpdateCustomer}
            isLoading={updateMutation.isPending}
          />
        )}
      </SideModal>
      
      {/* View Customer Modal */}
      <SideModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        title={<T text="Customer Details" />}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
              {selectedCustomer.email && (
                <p className="text-sm flex items-center text-muted-foreground">
                  <span className="font-medium mr-2"><T text="Email:" /></span> 
                  {selectedCustomer.email}
                </p>
              )}
              {selectedCustomer.phone && (
                <p className="text-sm flex items-center text-muted-foreground">
                  <span className="font-medium mr-2"><T text="Phone:" /></span> 
                  {selectedCustomer.phone}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground"><T text="Loyalty Level" /></p>
                <Badge 
                  variant={
                    selectedCustomer.loyalty_level === "Gold" ? "default" : 
                    selectedCustomer.loyalty_level === "Silver" ? "secondary" : 
                    "outline"
                  }
                  className="mt-1"
                >
                  {selectedCustomer.loyalty_level}
                </Badge>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground"><T text="Points" /></p>
                <p className="text-xl font-semibold">{selectedCustomer.loyalty_points || 0}</p>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground"><T text="Visits" /></p>
                <p className="text-xl font-semibold">{selectedCustomer.visits || 0}</p>
              </div>
            </div>
            
            {selectedCustomer.address && (
              <div>
                <h4 className="font-medium"><T text="Address" /></h4>
                <p className="text-sm mt-1">{selectedCustomer.address}</p>
              </div>
            )}
            
            {selectedCustomer.notes && (
              <div>
                <h4 className="font-medium"><T text="Notes" /></h4>
                <p className="text-sm mt-1">{selectedCustomer.notes}</p>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2"><T text="Customer Since" /></h4>
              <p className="text-sm">
                {selectedCustomer.created_at ? format(new Date(selectedCustomer.created_at), 'PPP') : '-'}
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCustomer(selectedCustomer);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                <T text="Edit Customer" />
              </Button>
            </div>
          </div>
        )}
      </SideModal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T text="Confirm Deletion" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T text="Are you sure you want to delete this customer? This action cannot be undone." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T text="Cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <T text="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CustomerDatabase;
