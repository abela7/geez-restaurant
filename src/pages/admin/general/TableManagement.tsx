
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, Users, Clock, RefreshCw, PlusCircle, Edit, Trash2
} from 'lucide-react';

import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  getTableStats
} from "@/services/table/tableService";
import type { Table } from "@/services/table/types";

// Table Management Page
const TableManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(4);
  const [location, setLocation] = useState<string>('Main Area');

  // Fetch tables
  const { 
    data: tables = [],
    isLoading: isLoadingTables
  } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables
  });

  // Fetch table statistics
  const {
    data: tableStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['tableStats'],
    queryFn: getTableStats
  });

  // Create table mutation
  const createTableMutation = useMutation({
    mutationFn: (newTable: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => 
      createTable(newTable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Created"),
        description: t("Table has been created successfully")
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Update table mutation
  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Table> }) => 
      updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Updated"),
        description: t("Table has been updated successfully")
      });
      setIsEditDialogOpen(false);
      setSelectedTable(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Delete table mutation
  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Deleted"),
        description: t("Table has been deleted successfully")
      });
      setIsDeleteDialogOpen(false);
      setSelectedTable(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Reset form
  const resetForm = () => {
    setTableNumber(1);
    setCapacity(4);
    setLocation('Main Area');
  };

  // Handle edit table
  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setTableNumber(table.table_number);
    setCapacity(table.capacity);
    setLocation(table.location || 'Main Area');
    setIsEditDialogOpen(true);
  };

  // Handle table create
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    createTableMutation.mutate({
      table_number: tableNumber,
      capacity,
      location,
      status: 'available'
    });
  };

  // Handle table update
  const handleUpdateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTable) {
      updateTableMutation.mutate({
        id: selectedTable.id,
        data: {
          table_number: tableNumber,
          capacity,
          location
        }
      });
    }
  };

  // Handle table delete
  const handleDeleteTable = () => {
    if (selectedTable) {
      deleteTableMutation.mutate(selectedTable.id);
    }
  };

  // Loading state
  const isLoading = isLoadingTables || isLoadingStats;
  
  if (isLoading) {
    return (
      <Layout interface="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground"><T text="Loading..." /></p>
          </div>
        </div>
      </Layout>
    );
  }

  // Get status badge
  const getStatusBadge = (status: Table['status']) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-600">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-600">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-600">Reserved</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-600">Cleaning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        title={t("Table Management")}
        description={t("Manage restaurant tables and seating capacity")}
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <T text="Add Table" />
          </Button>
        }
      />
      
      {/* Table Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
              <T text="Available" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.available || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-red-600" />
              <T text="Occupied" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.occupied || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <T text="Reserved" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.reserved || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 text-yellow-600" />
              <T text="Cleaning" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.cleaning || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tables List */}
      <Card>
        <CardHeader>
          <CardTitle><T text="Restaurant Tables" /></CardTitle>
        </CardHeader>
        <CardContent>
          {tables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4"><T text="Table Number" /></th>
                    <th className="text-left py-3 px-4"><T text="Capacity" /></th>
                    <th className="text-left py-3 px-4"><T text="Location" /></th>
                    <th className="text-left py-3 px-4"><T text="Status" /></th>
                    <th className="text-right py-3 px-4"><T text="Actions" /></th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{t("Table")} {table.table_number}</td>
                      <td className="py-3 px-4">{table.capacity} {t("seats")}</td>
                      <td className="py-3 px-4">{table.location || "-"}</td>
                      <td className="py-3 px-4">{getStatusBadge(table.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTable(table)}>
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setSelectedTable(table);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                <T text="No Tables Found" />
              </h3>
              <p className="text-muted-foreground">
                <T text="Add your first table to get started." />
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <T text="Add Table" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateTable}>
            <DialogHeader>
              <DialogTitle><T text="Add New Table" /></DialogTitle>
              <DialogDescription>
                <T text="Create a new table for your restaurant." />
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-number" className="text-right">
                  <T text="Table Number" />
                </Label>
                <Input
                  id="table-number"
                  type="number"
                  min={1}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  <T text="Capacity" />
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  <T text="Location" />
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createTableMutation.isPending}>
                {createTableMutation.isPending ? (
                  <T text="Creating..." />
                ) : (
                  <T text="Create Table" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateTable}>
            <DialogHeader>
              <DialogTitle><T text="Edit Table" /></DialogTitle>
              <DialogDescription>
                <T text="Update table information." />
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-table-number" className="text-right">
                  <T text="Table Number" />
                </Label>
                <Input
                  id="edit-table-number"
                  type="number"
                  min={1}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-capacity" className="text-right">
                  <T text="Capacity" />
                </Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  <T text="Location" />
                </Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateTableMutation.isPending}>
                {updateTableMutation.isPending ? (
                  <T text="Updating..." />
                ) : (
                  <T text="Update Table" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Table Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><T text="Delete Table" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this table? This action cannot be undone." />
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTable && (
              <div className="p-4 border rounded-md bg-muted/50">
                <p><strong><T text="Table" />:</strong> {selectedTable.table_number}</p>
                <p><strong><T text="Capacity" />:</strong> {selectedTable.capacity} <T text="seats" /></p>
                <p><strong><T text="Location" />:</strong> {selectedTable.location || "-"}</p>
                <p><strong><T text="Status" />:</strong> {selectedTable.status}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <T text="Cancel" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTable}
              disabled={deleteTableMutation.isPending}
            >
              {deleteTableMutation.isPending ? (
                <T text="Deleting..." />
              ) : (
                <T text="Delete Table" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TableManagement;
