
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash, Edit, Database, Table as TableIcon, Columns, LayoutList, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DbTable {
  name: string;
  schema: string;
}

interface DbColumn {
  name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

const DatabaseManagement: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [tables, setTables] = useState<DbTable[]>([]);
  const [columns, setColumns] = useState<DbColumn[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedSchema, setSelectedSchema] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataRows, setDataRows] = useState<any[]>([]);

  // New table form state
  const [newTableName, setNewTableName] = useState('');
  const [newTableSchema, setNewTableSchema] = useState('public');
  const [newTableColumns, setNewTableColumns] = useState<{name: string, type: string, nullable: boolean, default: string}[]>(
    [{ name: 'id', type: 'uuid', nullable: false, default: 'uuid_generate_v4()' }]
  );
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);

  // New column form state
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');
  const [newColumnNullable, setNewColumnNullable] = useState(true);
  const [newColumnDefault, setNewColumnDefault] = useState('');
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false);

  // Get all tables
  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_tables');
      
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

  // Get columns for a table
  const fetchColumns = async (tableName: string, schema: string) => {
    if (!tableName) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_table_columns', {
        tableName: tableName,
        schema: schema
      });
      
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

  // Fetch table data
  const fetchTableData = async (tableName: string, schema: string) => {
    if (!tableName) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
      
      if (error) throw error;
      
      if (data) {
        setDataRows(data);
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

  // Create new table
  const handleCreateTable = async () => {
    if (!newTableName) {
      toast({
        title: 'Error',
        description: 'Table name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Build the CREATE TABLE SQL query
      let columnsSQL = newTableColumns.map(col => {
        let colDef = `"${col.name}" ${col.type}`;
        if (!col.nullable) colDef += ' NOT NULL';
        if (col.default) colDef += ` DEFAULT ${col.default}`;
        return colDef;
      }).join(', ');

      const createTableSQL = `CREATE TABLE IF NOT EXISTS "${newTableSchema}"."${newTableName}" (${columnsSQL})`;
      
      // Execute the SQL via the run_sql RPC function
      const { data, error } = await supabase.rpc('run_sql', {
        query: createTableSQL
      });
      
      if (error) throw error;
      
      if (data && data.success) {
        toast({
          title: 'Success',
          description: `Table "${newTableName}" created successfully`,
        });
        
        // Reset form and refresh tables
        setNewTableName('');
        setNewTableColumns([{ name: 'id', type: 'uuid', nullable: false, default: 'uuid_generate_v4()' }]);
        setIsNewTableDialogOpen(false);
        fetchTables();
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating table:', error);
      toast({
        title: 'Error',
        description: `Failed to create table: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add column to new table form
  const addNewTableColumn = () => {
    setNewTableColumns([...newTableColumns, { name: '', type: 'text', nullable: true, default: '' }]);
  };

  // Update new table column definition
  const updateNewTableColumn = (index: number, field: string, value: string | boolean) => {
    const updatedColumns = [...newTableColumns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    setNewTableColumns(updatedColumns);
  };

  // Remove column from new table form
  const removeNewTableColumn = (index: number) => {
    const updatedColumns = [...newTableColumns];
    updatedColumns.splice(index, 1);
    setNewTableColumns(updatedColumns);
  };

  // Add new column to existing table
  const handleAddColumn = async () => {
    if (!selectedTable || !newColumnName || !newColumnType) {
      toast({
        title: 'Error',
        description: 'Table, column name, and type are required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Build the ALTER TABLE SQL query
      let columnDef = `"${newColumnName}" ${newColumnType}`;
      if (!newColumnNullable) columnDef += ' NOT NULL';
      if (newColumnDefault) columnDef += ` DEFAULT ${newColumnDefault}`;

      const alterTableSQL = `ALTER TABLE "${selectedSchema}"."${selectedTable}" ADD COLUMN ${columnDef}`;
      
      // Execute the SQL via the run_sql RPC function
      const { data, error } = await supabase.rpc('run_sql', {
        query: alterTableSQL
      });
      
      if (error) throw error;
      
      if (data && data.success) {
        toast({
          title: 'Success',
          description: `Column "${newColumnName}" added to table "${selectedTable}"`,
        });
        
        // Reset form and refresh columns
        setNewColumnName('');
        setNewColumnType('text');
        setNewColumnNullable(true);
        setNewColumnDefault('');
        setIsNewColumnDialogOpen(false);
        fetchColumns(selectedTable, selectedSchema);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding column:', error);
      toast({
        title: 'Error',
        description: `Failed to add column: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Drop table
  const handleDropTable = async () => {
    if (!selectedTable) {
      toast({
        title: 'Error',
        description: 'No table selected',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const dropTableSQL = `DROP TABLE "${selectedSchema}"."${selectedTable}"`;
      
      const { data, error } = await supabase.rpc('run_sql', {
        query: dropTableSQL
      });
      
      if (error) throw error;
      
      if (data && data.success) {
        toast({
          title: 'Success',
          description: `Table "${selectedTable}" dropped successfully`,
        });
        
        // Reset selection and refresh tables
        setSelectedTable('');
        setColumns([]);
        setDataRows([]);
        fetchTables();
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error dropping table:', error);
      toast({
        title: 'Error',
        description: `Failed to drop table: ${(error as Error).message}`,
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
  const handleTableSelect = (tableName: string, schema: string) => {
    setSelectedTable(tableName);
    setSelectedSchema(schema);
    fetchColumns(tableName, schema);
    fetchTableData(tableName, schema);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <PageHeader
          heading="Database Management"
          subheading="Manage database tables, columns, and data"
          action={
            <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto">
                  <Plus className="mr-2 h-4 w-4" /> Create Table
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Table</DialogTitle>
                  <DialogDescription>
                    Define the structure of your new database table
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tableName" className="text-right">
                      Table Name
                    </Label>
                    <Input
                      id="tableName"
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tableSchema" className="text-right">
                      Schema
                    </Label>
                    <Input
                      id="tableSchema"
                      value={newTableSchema}
                      onChange={(e) => setNewTableSchema(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  <div className="mb-2">
                    <h4 className="text-sm font-medium">Columns</h4>
                  </div>
                  
                  <ScrollArea className="h-[200px]">
                    {newTableColumns.map((column, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                        <Input
                          value={column.name}
                          onChange={(e) => updateNewTableColumn(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="col-span-3"
                        />
                        <Select
                          value={column.type}
                          onValueChange={(value) => updateNewTableColumn(index, 'type', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="integer">Integer</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="uuid">UUID</SelectItem>
                            <SelectItem value="timestamp with time zone">Timestamp</SelectItem>
                            <SelectItem value="jsonb">JSONB</SelectItem>
                            <SelectItem value="numeric">Numeric</SelectItem>
                            <SelectItem value="varchar(255)">Varchar(255)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={column.nullable ? "true" : "false"}
                          onValueChange={(value) => updateNewTableColumn(index, 'nullable', value === "true")}
                        >
                          <SelectTrigger className="col-span-2">
                            <SelectValue placeholder="Nullable" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Nullable</SelectItem>
                            <SelectItem value="false">Not Null</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={column.default || ''}
                          onChange={(e) => updateNewTableColumn(index, 'default', e.target.value)}
                          placeholder="Default"
                          className="col-span-3"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNewTableColumn(index)}
                          disabled={index === 0 && newTableColumns.length === 1}
                          className="h-10 w-10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <Button variant="outline" onClick={addNewTableColumn} type="button">
                    <Plus className="mr-2 h-4 w-4" /> Add Column
                  </Button>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline" 
                    onClick={() => setIsNewTableDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTable}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Table'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Tables
              </CardTitle>
              <CardDescription>
                Database tables in the system
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
                      onClick={() => handleTableSelect(table.name, table.schema)}
                    >
                      <TableIcon className="h-4 w-4 mr-2" />
                      {table.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({table.schema})
                      </span>
                    </Button>
                  ))}
                  {tables.length === 0 && !isLoading && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      No tables found
                    </div>
                  )}
                  {isLoading && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      Loading tables...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {selectedTable ? (
                    <>
                      <TableIcon className="h-5 w-5 mr-2" />
                      {selectedTable}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({selectedSchema})
                      </span>
                    </>
                  ) : (
                    <>
                      <TableIcon className="h-5 w-5 mr-2" />
                      Select a table
                    </>
                  )}
                </CardTitle>
                {selectedTable && (
                  <div className="flex space-x-2">
                    <Dialog open={isNewColumnDialogOpen} onOpenChange={setIsNewColumnDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" /> Add Column
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Column to {selectedTable}</DialogTitle>
                          <DialogDescription>
                            Define a new column for this table
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="columnName" className="text-right">
                              Column Name
                            </Label>
                            <Input
                              id="columnName"
                              value={newColumnName}
                              onChange={(e) => setNewColumnName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="columnType" className="text-right">
                              Type
                            </Label>
                            <Select
                              value={newColumnType}
                              onValueChange={setNewColumnType}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="integer">Integer</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="uuid">UUID</SelectItem>
                                <SelectItem value="timestamp with time zone">Timestamp</SelectItem>
                                <SelectItem value="jsonb">JSONB</SelectItem>
                                <SelectItem value="numeric">Numeric</SelectItem>
                                <SelectItem value="varchar(255)">Varchar(255)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="columnNullable" className="text-right">
                              Nullable
                            </Label>
                            <Select
                              value={newColumnNullable ? "true" : "false"}
                              onValueChange={(value) => setNewColumnNullable(value === "true")}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Nullable" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Nullable</SelectItem>
                                <SelectItem value="false">Not Null</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="columnDefault" className="text-right">
                              Default Value
                            </Label>
                            <Input
                              id="columnDefault"
                              value={newColumnDefault}
                              onChange={(e) => setNewColumnDefault(e.target.value)}
                              className="col-span-3"
                              placeholder="Leave empty for no default"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsNewColumnDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddColumn} disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Column'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash className="h-4 w-4 mr-2" /> Drop Table
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the table
                            "{selectedTable}" and all its data from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDropTable}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Drop Table
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <CardDescription>
                {selectedTable 
                  ? "View and manage table structure and data" 
                  : "Select a table from the list to view and manage it"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <Tabs defaultValue="structure">
                  <TabsList className="mb-4">
                    <TabsTrigger value="structure">
                      <Columns className="h-4 w-4 mr-2" />
                      Structure
                    </TabsTrigger>
                    <TabsTrigger value="data">
                      <LayoutList className="h-4 w-4 mr-2" />
                      Data
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="structure">
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Default</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell className="font-medium">{column.name}</TableCell>
                              <TableCell>{column.data_type}</TableCell>
                              <TableCell>{column.is_nullable ? 'Yes' : 'No'}</TableCell>
                              <TableCell>{column.column_default || '-'}</TableCell>
                            </TableRow>
                          ))}
                          {columns.length === 0 && !isLoading && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No columns found
                              </TableCell>
                            </TableRow>
                          )}
                          {isLoading && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                Loading columns...
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="data">
                    <ScrollArea className="h-[400px]">
                      {dataRows.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(dataRows[0]).map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dataRows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {Object.keys(row).map((key) => (
                                  <TableCell key={key}>
                                    {typeof row[key] === 'object' 
                                      ? JSON.stringify(row[key]) 
                                      : String(row[key] !== null ? row[key] : '')}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4">
                          {isLoading ? 'Loading data...' : 'No data found'}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Database className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Table Selected</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select a table from the list or create a new one to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DatabaseManagement;
