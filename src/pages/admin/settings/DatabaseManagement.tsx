
import React, { useState, useEffect } from 'react';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Database as DatabaseIcon, PlusCircle, Trash2, Edit, Table as TableIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DatabaseTable = {
  name: string;
  schema: string;
}

type TableColumn = {
  name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

const DATA_TYPES = [
  'text',
  'varchar',
  'integer',
  'bigint',
  'numeric',
  'boolean',
  'date',
  'time',
  'timestamp',
  'timestamptz',
  'uuid',
  'jsonb'
];

const DatabaseManagement: React.FC = () => {
  const { t } = useLanguage();
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false);
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false);
  
  // Form data
  const [newTableName, setNewTableName] = useState('');
  const [newColumnData, setNewColumnData] = useState<{
    name: string;
    data_type: string;
    is_nullable: boolean;
    default_value: string;
  }>({
    name: '',
    data_type: 'text',
    is_nullable: true,
    default_value: ''
  });
  
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  
  // Fetch tables when component mounts
  useEffect(() => {
    fetchTables();
  }, []);
  
  // Fetch columns and data when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchTableColumns(selectedTable);
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);
  
  const fetchTables = async () => {
    setIsLoading(true);
    try {
      // Fetch tables from public schema
      const { data, error } = await supabase
        .rpc('get_tables')
        .eq('table_schema', 'public');
        
      if (error) throw error;
      
      if (data) {
        setTables(data);
        // If we have tables and none selected, select the first one
        if (data.length > 0 && !selectedTable) {
          setSelectedTable(data[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error(t("Failed to fetch database tables"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTableColumns = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_table_columns')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');
        
      if (error) throw error;
      
      if (data) {
        setColumns(data);
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
      toast.error(t("Failed to fetch table columns"));
    }
  };
  
  const fetchTableData = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);
        
      if (error) throw error;
      
      if (data) {
        setTableData(data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast.error(t("Failed to fetch table data"));
    }
  };
  
  const handleCreateTable = async () => {
    if (!newTableName.trim()) {
      toast.error(t("Table name cannot be empty"));
      return;
    }
    
    try {
      const sql = `
        CREATE TABLE public.${newTableName} (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        ALTER TABLE public.${newTableName} ENABLE ROW LEVEL SECURITY;
      `;
      
      const { error } = await supabase.rpc('run_sql', { query: sql });
      
      if (error) throw error;
      
      toast.success(t("Table created successfully"));
      setIsNewTableDialogOpen(false);
      setNewTableName('');
      await fetchTables();
      setSelectedTable(newTableName);
    } catch (error) {
      console.error('Error creating table:', error);
      toast.error(t("Failed to create table"));
    }
  };
  
  const handleAddColumn = async () => {
    if (!selectedTable || !newColumnData.name.trim()) {
      toast.error(t("Column name cannot be empty"));
      return;
    }
    
    try {
      let defaultClause = '';
      if (newColumnData.default_value.trim()) {
        defaultClause = ` DEFAULT ${newColumnData.default_value}`;
      }
      
      const nullableClause = newColumnData.is_nullable ? '' : ' NOT NULL';
      
      const sql = `
        ALTER TABLE public.${selectedTable} 
        ADD COLUMN ${newColumnData.name} ${newColumnData.data_type}${nullableClause}${defaultClause};
      `;
      
      const { error } = await supabase.rpc('run_sql', { query: sql });
      
      if (error) throw error;
      
      toast.success(t("Column added successfully"));
      setIsNewColumnDialogOpen(false);
      setNewColumnData({
        name: '',
        data_type: 'text',
        is_nullable: true,
        default_value: ''
      });
      await fetchTableColumns(selectedTable);
    } catch (error) {
      console.error('Error adding column:', error);
      toast.error(t("Failed to add column"));
    }
  };
  
  const handleAddRow = async () => {
    if (!selectedTable) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .insert(newRowData)
        .select();
        
      if (error) throw error;
      
      toast.success(t("Row added successfully"));
      setIsAddRowDialogOpen(false);
      setNewRowData({});
      await fetchTableData(selectedTable);
    } catch (error) {
      console.error('Error adding row:', error);
      toast.error(t("Failed to add row"));
    }
  };
  
  const handleDeleteTable = async (tableName: string) => {
    if (!confirm(t(`Are you sure you want to delete the table '${tableName}'? This action cannot be undone.`))) {
      return;
    }
    
    try {
      const sql = `DROP TABLE public.${tableName};`;
      
      const { error } = await supabase.rpc('run_sql', { query: sql });
      
      if (error) throw error;
      
      toast.success(t("Table deleted successfully"));
      await fetchTables();
      setSelectedTable(null);
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error(t("Failed to delete table"));
    }
  };
  
  const prepareNewRowForm = () => {
    const initialData: Record<string, any> = {};
    columns.forEach(column => {
      // Skip id and created_at columns as they have defaults
      if (column.name !== 'id' && column.name !== 'created_at') {
        initialData[column.name] = '';
      }
    });
    setNewRowData(initialData);
    setIsAddRowDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title={<T text="Database Management" />}
        description={<T text="Manage your database tables, columns, and data" />}
        icon={<DatabaseIcon className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tables List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle><T text="Tables" /></CardTitle>
            <CardDescription><T text="Manage database tables" /></CardDescription>
            <Button 
              size="sm" 
              onClick={() => setIsNewTableDialogOpen(true)} 
              className="mt-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <T text="New Table" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                <T text="Loading tables..." />
              </div>
            ) : tables.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                <T text="No tables found" />
              </div>
            ) : (
              <ul className="space-y-1">
                {tables.map((table) => (
                  <li key={table.name} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTable(table.name)}
                      className={`flex items-center py-2 px-2 rounded-md w-full text-left ${
                        selectedTable === table.name 
                          ? 'bg-primary/10 font-medium' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <TableIcon className="mr-2 h-4 w-4" />
                      {table.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTable(table.name)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        {/* Table Details */}
        {selectedTable ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTable}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => setIsNewColumnDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <T text="Add Column" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={prepareNewRowForm}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <T text="Add Row" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                <T text="Manage table structure and data" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="structure">
                <TabsList className="mb-4">
                  <TabsTrigger value="structure"><T text="Structure" /></TabsTrigger>
                  <TabsTrigger value="data"><T text="Data" /></TabsTrigger>
                </TabsList>
                
                <TabsContent value="structure">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><T text="Column Name" /></TableHead>
                          <TableHead><T text="Data Type" /></TableHead>
                          <TableHead><T text="Nullable" /></TableHead>
                          <TableHead><T text="Default Value" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {columns.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              <T text="No columns found" />
                            </TableCell>
                          </TableRow>
                        ) : (
                          columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell>{column.name}</TableCell>
                              <TableCell>{column.data_type}</TableCell>
                              <TableCell>{column.is_nullable ? 'Yes' : 'No'}</TableCell>
                              <TableCell>{column.column_default || '-'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="data">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {columns.map((column) => (
                            <TableHead key={column.name}>{column.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-4">
                              <T text="No data found" />
                            </TableCell>
                          </TableRow>
                        ) : (
                          tableData.map((row, index) => (
                            <TableRow key={index}>
                              {columns.map((column) => (
                                <TableCell key={column.name}>
                                  {row[column.name] !== null 
                                    ? typeof row[column.name] === 'object' 
                                      ? JSON.stringify(row[column.name]) 
                                      : String(row[column.name])
                                    : '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-3">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <DatabaseIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No Table Selected" />
                </h3>
                <p>
                  <T text="Select a table from the list or create a new one" />
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsNewTableDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <T text="Create Table" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Create Table Dialog */}
      <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Create New Table" /></DialogTitle>
            <DialogDescription>
              <T text="Enter the details for the new table" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tableName"><T text="Table Name" /></Label>
              <Input
                id="tableName"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder={t("Enter table name")}
              />
              <p className="text-xs text-muted-foreground">
                <T text="The table will be created with id (UUID) and created_at (timestamp) columns" />
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTableDialogOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleCreateTable}>
              <T text="Create Table" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Column Dialog */}
      <Dialog open={isNewColumnDialogOpen} onOpenChange={setIsNewColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add New Column" /></DialogTitle>
            <DialogDescription>
              <T text="Enter the details for the new column" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnName"><T text="Column Name" /></Label>
              <Input
                id="columnName"
                value={newColumnData.name}
                onChange={(e) => setNewColumnData({...newColumnData, name: e.target.value})}
                placeholder={t("Enter column name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataType"><T text="Data Type" /></Label>
              <Select 
                value={newColumnData.data_type} 
                onValueChange={(value) => setNewColumnData({...newColumnData, data_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select data type")} />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nullable"
                checked={newColumnData.is_nullable}
                onChange={(e) => setNewColumnData({...newColumnData, is_nullable: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="nullable"><T text="Nullable" /></Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultValue"><T text="Default Value" /></Label>
              <Input
                id="defaultValue"
                value={newColumnData.default_value}
                onChange={(e) => setNewColumnData({...newColumnData, default_value: e.target.value})}
                placeholder={t("Enter default value (optional)")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewColumnDialogOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddColumn}>
              <T text="Add Column" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Row Dialog */}
      <Dialog open={isAddRowDialogOpen} onOpenChange={setIsAddRowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add New Row" /></DialogTitle>
            <DialogDescription>
              <T text="Enter the data for the new row" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {columns
              .filter(col => col.name !== 'id' && col.name !== 'created_at')
              .map((column) => (
                <div key={column.name} className="space-y-2">
                  <Label htmlFor={column.name}>{column.name}</Label>
                  <Input
                    id={column.name}
                    value={newRowData[column.name] || ''}
                    onChange={(e) => setNewRowData({...newRowData, [column.name]: e.target.value})}
                    placeholder={t("Enter value")}
                  />
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRowDialogOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddRow}>
              <T text="Add Row" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseManagement;
