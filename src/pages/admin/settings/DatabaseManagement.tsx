
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash, Edit, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface TableInfo {
  name: string;
  schema: string;
}

interface ColumnInfo {
  name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

// Define a type for RPC response
interface RpcResponse<T> {
  data: T | null;
  error: Error | null;
}

const DatabaseManagement: React.FC = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedSchema, setSelectedSchema] = useState<string>('public');
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewRowDialogOpen, setIsNewRowDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  
  // Get all tables using the RPC function
  const fetchTables = async () => {
    setIsLoading(true);
    try {
      // Type assertion for RPC call
      const { data, error } = await supabase.rpc('get_tables') as {
        data: TableInfo[] | null;
        error: Error | null;
      };
      
      if (error) throw error;
      
      if (data) {
        setTables(data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch database tables',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get columns for a table using the RPC function
  const fetchColumns = async (tableName: string, schema: string = 'public') => {
    setIsLoading(true);
    try {
      // Type assertion for RPC call with parameters
      const { data, error } = await supabase.rpc('get_table_columns', {
        tablename: tableName,
        schema: schema
      }) as {
        data: ColumnInfo[] | null;
        error: Error | null;
      };
      
      if (error) throw error;
      
      if (data) {
        setColumns(data);
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch columns for table: ${tableName}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch table data - using type assertion to handle dynamic table names
  const fetchTableData = async (tableName: string) => {
    if (!tableName) return;
    
    setIsLoading(true);
    try {
      // Use type assertion to treat tableName as a known table
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(100);
      
      if (error) throw error;
      
      if (data) {
        setTableData(data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch data for table: ${tableName}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Insert new row - using type assertion for dynamic table
  const insertRow = async (rowData: any) => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(selectedTable as any)
        .insert(rowData)
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Record added successfully',
      });
      
      fetchTableData(selectedTable);
      setIsNewRowDialogOpen(false);
    } catch (error) {
      console.error('Error inserting row:', error);
      toast({
        title: 'Error',
        description: `Failed to insert row: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update row - using type assertion for dynamic table
  const updateRow = async (id: string, rowData: any) => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from(selectedTable as any)
        .update(rowData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Record updated successfully',
      });
      
      fetchTableData(selectedTable);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating row:', error);
      toast({
        title: 'Error',
        description: `Failed to update row: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete row - using type assertion for dynamic table
  const deleteRow = async (id: string) => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from(selectedTable as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
      });
      
      fetchTableData(selectedTable);
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        title: 'Error',
        description: `Failed to delete row: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tables on initial render
  useEffect(() => {
    fetchTables();
  }, []);

  // Handle table selection
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    fetchColumns(tableName, selectedSchema);
    fetchTableData(tableName);
  };

  // Edit form
  const EditForm = ({ row }: { row: any }) => {
    const form = useForm({
      defaultValues: { ...row }
    });
    
    const onSubmit = (data: any) => {
      updateRow(row.id, data);
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {columns.map((column) => (
            <FormField
              key={column.name}
              control={form.control}
              name={column.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{column.name}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={column.name === 'id'}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>Save Changes</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  // New Row form
  const NewRowForm = () => {
    const initialValues: any = {};
    columns.forEach(column => {
      initialValues[column.name] = '';
    });
    
    const form = useForm({
      defaultValues: initialValues
    });
    
    const onSubmit = (data: any) => {
      // Remove id if it's blank (for auto-generated IDs)
      if (data.id === '') {
        delete data.id;
      }
      
      // Remove any blank fields that should be null
      Object.keys(data).forEach(key => {
        if (data[key] === '') {
          data[key] = null;
        }
      });
      
      insertRow(data);
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {columns.map((column) => (
            <FormField
              key={column.name}
              control={form.control}
              name={column.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{column.name}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder={column.name === 'id' ? 'Auto-generated' : ''}
                      disabled={column.name === 'id' && column.column_default?.includes('uuid_generate')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>Create Record</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <PageHeader
          heading="Database Management"
          description="View and manage database records"
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Select a table to manage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchTables}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {tables.map((table) => (
                    <Button
                      key={`${table.schema}.${table.name}`}
                      variant={selectedTable === table.name ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => handleTableSelect(table.name)}
                    >
                      {table.name}
                    </Button>
                  ))}
                  {tables.length === 0 && !isLoading && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      No tables found
                    </div>
                  )}
                  {isLoading && tables.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      Loading tables...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedTable || 'Select a table'}</CardTitle>
                <CardDescription>
                  {selectedTable 
                    ? `Manage records in ${selectedTable}` 
                    : 'Select a table from the list'}
                </CardDescription>
              </div>
              {selectedTable && (
                <Dialog open={isNewRowDialogOpen} onOpenChange={setIsNewRowDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ml-auto">
                      <Plus className="mr-2 h-4 w-4" /> Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Record to {selectedTable}</DialogTitle>
                    </DialogHeader>
                    <NewRowForm />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <ScrollArea className="h-[600px]">
                  {tableData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Actions</TableHead>
                          {columns.map((column) => (
                            <TableHead key={column.name}>{column.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentRow(row);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteRow(row.id)}
                                        className="bg-destructive text-destructive-foreground"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                            {Object.keys(row).map((key) => (
                              <TableCell key={key}>
                                {typeof row[key] === 'object' 
                                  ? row[key] === null 
                                    ? 'null' 
                                    : JSON.stringify(row[key])
                                  : String(row[key] !== null ? row[key] : '')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <p className="text-muted-foreground">
                        {isLoading ? 'Loading data...' : 'No records found in this table'}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <p className="text-lg font-medium">No table selected</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select a table from the list to manage its records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          {currentRow && <EditForm row={currentRow} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DatabaseManagement;
