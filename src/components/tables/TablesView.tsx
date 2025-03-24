
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

import { Table as TableType, Room, TableGroup } from "@/services/table/types";
import { getTables, createTable, updateTable, deleteTable } from "@/services/table/tableService";
import { getRooms } from "@/services/table/roomService";
import { getTableGroups } from "@/services/table/tableGroupService";

import NoData from "@/components/ui/no-data";
import TableForm from "./TableForm";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const tablesData = await getTables();
        setTables(tablesData);

        const roomsData = await getRooms();
        setRooms(roomsData);

        const tableGroupsData = await getTableGroups();
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
    };

    fetchData();
  }, [toast, t]);

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

  const confirmDeleteTable = async () => {
    if (selectedTable) {
      try {
        await deleteTable(selectedTable.id);
        setTables(tables.filter((table) => table.id !== selectedTable.id));
        toast({
          title: t("Success"),
          description: t("Table deleted successfully."),
        });
        setErrorMessage(null);
      } catch (error: any) {
        console.error("Error deleting table:", error);
        
        // Check if it's our custom error about orders
        const errorMessage = error.message?.includes("associated orders") 
          ? error.message 
          : t("Failed to delete table. It may be referenced by orders or reservations.");
        
        toast({
          title: t("Error"),
          description: errorMessage,
          variant: "destructive",
        });
        
        setErrorMessage(errorMessage);
      } finally {
        setIsDeleteConfirmationOpen(false);
        setSelectedTable(null);
      }
    }
  };

  const handleTableFormSubmit = async (data: TableType) => {
    try {
      console.log("Form data received:", data);
      setErrorMessage(null);
      
      // Process form values to ensure proper types
      const tableData = {
        ...data,
        // Convert string "null" to actual null
        room_id: data.room_id === "null" ? null : data.room_id,
        group_id: data.group_id === "null" ? null : data.group_id
      };
      
      if (isEditMode && selectedTable) {
        // Update existing table
        const updatedTable = await updateTable(selectedTable.id, tableData);
        setTables(
          tables.map((table) => (table.id === selectedTable.id ? updatedTable : table))
        );
        toast({
          title: t("Success"),
          description: t("Table updated successfully."),
        });
      } else {
        // Create new table
        const newTable = await createTable(tableData);
        setTables([...tables, newTable]);
        toast({
          title: t("Success"),
          description: t("Table created successfully."),
        });
      }
      setIsTableDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving table:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save table. Please try again."),
        variant: "destructive",
      });
      setErrorMessage(error.message || t("Failed to save table. Please try again."));
    }
  };

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  const groupOptions = tableGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Tables" /></CardTitle>
        <Button onClick={handleCreateTable}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Table" />
        </Button>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle><T text="Error" /></AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <p><T text="Loading tables..." /></p>
        ) : tables.length === 0 ? (
          <NoData message={t("No tables found. Add a table to get started.")} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Number" /></TableHead>
                <TableHead><T text="Capacity" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead><T text="Room" /></TableHead>
                <TableHead><T text="Group" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => {
                const room = rooms.find(r => r.id === table.room_id);
                const group = tableGroups.find(g => g.id === table.group_id);

                return (
                  <TableRow key={table.id}>
                    <TableCell>{table.table_number}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={
                        table.status === 'available' ? 'default' :
                        table.status === 'occupied' ? 'destructive' :
                        table.status === 'reserved' ? 'secondary' :
                        'outline'
                      }>
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{room ? room.name : '-'}</TableCell>
                    <TableCell>{group ? group.name : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTable(table)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <T text="Edit" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTable(table)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <T text="Delete" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Table Form Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
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
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteTable}
        title={t("Delete Table")}
        description={t("Are you sure you want to delete this table? This action cannot be undone.")}
      />
    </Card>
  );
};

export default TablesView;
