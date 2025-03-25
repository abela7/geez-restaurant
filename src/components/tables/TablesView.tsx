
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, EyeOff } from "lucide-react";

import { Table as TableType, Room, TableGroup } from "@/services/table/types";
import { getTables } from "@/services/table/tableService";
import { getRooms } from "@/services/table/roomService";
import { getTableGroups } from "@/services/table/tableGroupService";
import { useTableManagement } from "@/hooks/useTableManagement";

import NoData from "@/components/ui/no-data";
import TableForm from "./TableForm";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TablesView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [tables, setTables] = useState<TableType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isDeactivateConfirmationOpen, setIsDeactivateConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Use our custom hook for table operations
  const { 
    isUpdating, 
    createTable, 
    updateTable, 
    updateTableStatus, 
    deleteTable 
  } = useTableManagement();

  // Fetch data with debouncing
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Fetch data in parallel for better performance
      const [tablesData, roomsData, tableGroupsData] = await Promise.all([
        getTables(),
        getRooms(),
        getTableGroups()
      ]);
      
      setTables(tablesData);
      setRooms(roomsData);
      setTableGroups(tableGroupsData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load data. Please try again."),
        variant: "destructive",
      });
      setErrorMessage(error.message || t("Failed to load data. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTable = () => {
    setIsEditMode(false);
    setSelectedTable(null);
    setIsTableDialogOpen(true);
  };

  const handleEditTable = (table: TableType) => {
    setIsEditMode(true);
    setSelectedTable(table);
    setIsTableDialogOpen(true);
  };

  const handleDeleteTable = (table: TableType) => {
    setSelectedTable(table);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeactivateTable = (table: TableType) => {
    setSelectedTable(table);
    setIsDeactivateConfirmationOpen(true);
  };

  const confirmDeleteTable = async () => {
    if (!selectedTable) return;
    
    try {
      await deleteTable(selectedTable.id);
      // Update local state by filtering out the deleted table
      setTables(tables.filter((table) => table.id !== selectedTable.id));
    } catch (error: any) {
      // If it's an error related to associated orders, offer to deactivate instead
      if (error.message?.includes("associated orders")) {
        // Automatically open the deactivate confirmation
        setIsDeleteConfirmationOpen(false);
        handleDeactivateTable(selectedTable);
      }
    } finally {
      setIsDeleteConfirmationOpen(false);
      setSelectedTable(null);
    }
  };

  const confirmDeactivateTable = async () => {
    if (!selectedTable) return;
    
    try {
      const updatedTable = await updateTableStatus(selectedTable.id, 'inactive');
      
      // Update the local state with the updated table
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === selectedTable.id ? updatedTable : table
        )
      );
    } finally {
      setIsDeactivateConfirmationOpen(false);
      setSelectedTable(null);
    }
  };

  const handleTableFormSubmit = async (data: TableType) => {
    try {
      setErrorMessage(null);
      
      if (isEditMode && selectedTable) {
        // Update existing table
        const updatedTable = await updateTable(selectedTable.id, data);
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === selectedTable.id ? updatedTable : table
          )
        );
      } else {
        // Create new table
        const newTable = await createTable(data);
        setTables(prevTables => [...prevTables, newTable]);
      }
      
      // Close dialog after successful operation
      setIsTableDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving table:", error);
      setErrorMessage(error.message || t("Failed to save table. Please try again."));
      // Don't close the dialog on error
    }
  };

  const roomOptions = React.useMemo(() => 
    rooms.map((room) => ({
      value: room.id,
      label: room.name,
    })), [rooms]);

  const groupOptions = React.useMemo(() => 
    tableGroups.map((group) => ({
      value: group.id,
      label: group.name,
    })), [tableGroups]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Tables" /></CardTitle>
        <Button onClick={handleCreateTable} disabled={isUpdating}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Table" />
        </Button>
      </CardHeader>
      <CardContent>        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : tables.length === 0 ? (
          <NoData message={t("No tables found. Add a table to get started.")} />
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Number" /></TableHead>
                  <TableHead><T text="Capacity" /></TableHead>
                  <TableHead><T text="Room" /></TableHead>
                  <TableHead><T text="Group" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => {
                  const room = rooms.find(r => r.id === table.room_id);
                  const group = tableGroups.find(g => g.id === table.group_id);

                  return (
                    <TableRow 
                      key={table.id}
                      className={table.status === 'inactive' ? 'opacity-50' : ''}
                    >
                      <TableCell>{table.table_number}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>{room ? room.name : '-'}</TableCell>
                      <TableCell>{group ? group.name : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${table.status === 'available' ? 'bg-green-100 text-green-800' : 
                            table.status === 'occupied' ? 'bg-red-100 text-red-800' : 
                            table.status === 'reserved' ? 'bg-blue-100 text-blue-800' : 
                            table.status === 'cleaning' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {t(table.status.charAt(0).toUpperCase() + table.status.slice(1))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isUpdating}>
                              <T text="Actions" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTable(table)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <T text="Edit" />
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleDeleteTable(table)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <T text="Delete" />
                            </DropdownMenuItem>
                            
                            {table.status !== 'inactive' && (
                              <DropdownMenuItem onClick={() => handleDeactivateTable(table)}>
                                <EyeOff className="mr-2 h-4 w-4" />
                                <T text="Set Inactive" />
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Table Form Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={(open) => {
        // Don't close the dialog while operations are in progress
        if (isUpdating) return;
        setIsTableDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? <T text="Edit Table" /> : <T text="Create Table" />}
            </DialogTitle>
          </DialogHeader>
          <TableForm
            initialData={selectedTable || {}}
            onSubmit={handleTableFormSubmit}
            onCancel={() => setIsTableDialogOpen(false)}
            roomOptions={roomOptions}
            groupOptions={groupOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => !isUpdating && setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteTable}
        title={t("Delete Table")}
        description={t("Are you sure you want to delete this table? This action cannot be undone.")}
        isLoading={isUpdating}
      />

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeactivateConfirmationOpen}
        onClose={() => !isUpdating && setIsDeactivateConfirmationOpen(false)}
        onConfirm={confirmDeactivateTable}
        title={t("Set Table Inactive")}
        description={t("This table has associated orders and cannot be deleted. Would you like to set it as inactive instead?")}
        confirmLabel={t("Set Inactive")}
        isLoading={isUpdating}
      />
    </Card>
  );
};

export default TablesView;
