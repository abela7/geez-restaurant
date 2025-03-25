
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash, Loader2 } from "lucide-react";
import { Table as TableType, Room, TableGroup } from "@/services/table/types";
import { useTableManagement } from "@/hooks/useTableManagement";
import NoData from "@/components/ui/no-data";
import { getTables } from "@/services/table/tableService";
import { getRooms } from "@/services/table/roomService";
import { getTableGroups } from "@/services/table/tableGroupService";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import TableSideModal from "./TableSideModal";

const TablesView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<TableType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [selectedTable, setSelectedTable] = useState<Partial<TableType> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { isUpdating, error, createTable, updateTable, deleteTable } = useTableManagement();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use Promise.all to fetch data in parallel
      const [tablesData, roomsData, groupsData] = await Promise.all([
        getTables(),
        getRooms(),
        getTableGroups()
      ]);
      
      setTables(tablesData);
      setRooms(roomsData);
      setTableGroups(groupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load data. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized options for rooms and table groups
  const roomOptions = useMemo(() => 
    rooms.map(room => ({
      value: room.id,
      label: room.name
    })),
    [rooms]
  );

  const groupOptions = useMemo(() => 
    tableGroups.map(group => ({
      value: group.id,
      label: group.name
    })),
    [tableGroups]
  );

  const handleOpenCreateForm = () => {
    setSelectedTable({});
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (table: TableType) => {
    setSelectedTable(table);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (table: TableType) => {
    setSelectedTable(table);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    if (!isUpdating) {
      setIsFormOpen(false);
      setSelectedTable(null);
      setFormError(null);
    }
  };

  const handleSubmit = async (tableData: TableType) => {
    setFormError(null);
    try {
      if (tableData.id) {
        await updateTable(tableData.id, tableData);
        setTables(prev => prev.map(t => t.id === tableData.id ? tableData : t));
      } else {
        const newTable = await createTable(tableData);
        setTables(prev => [...prev, newTable]);
      }
      setIsFormOpen(false);
      setSelectedTable(null);
      toast({
        title: t("Success"),
        description: tableData.id
          ? t("Table updated successfully")
          : t("Table created successfully"),
      });
    } catch (err: any) {
      console.error("Error saving table:", err);
      setFormError(err.message || t("An error occurred while saving the table"));
    }
  };

  const handleDelete = async () => {
    if (!selectedTable || !selectedTable.id) return;
    
    try {
      await deleteTable(selectedTable.id);
      setTables(prev => prev.filter(t => t.id !== selectedTable.id));
      setIsDeleteDialogOpen(false);
      setSelectedTable(null);
      toast({
        title: t("Success"),
        description: t("Table deleted successfully"),
      });
    } catch (err: any) {
      console.error("Error deleting table:", err);
      toast({
        title: t("Error"),
        description: err.message || t("Failed to delete table"),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      available: "success",
      occupied: "warning",
      reserved: "info",
      cleaning: "default",
      inactive: "secondary"
    };
    
    return (
      <Badge variant={statusMap[status] as any || "default"}>
        {t(status.charAt(0).toUpperCase() + status.slice(1))}
      </Badge>
    );
  };

  const getRoomName = (roomId: string | null) => {
    if (!roomId) return t("No Room");
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : t("Unknown Room");
  };

  const getGroupName = (groupId: string | null) => {
    if (!groupId) return t("No Group");
    const group = tableGroups.find(g => g.id === groupId);
    return group ? group.name : t("Unknown Group");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Tables" /></CardTitle>
        <Button 
          onClick={handleOpenCreateForm}
          disabled={isUpdating || isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Table" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tables.length === 0 ? (
          <NoData message={t("No tables found. Add a table to get started.")} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Number" /></TableHead>
                  <TableHead><T text="Capacity" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Room" /></TableHead>
                  <TableHead><T text="Table Group" /></TableHead>
                  <TableHead><T text="Shape" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.table_number}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>{getStatusBadge(table.status)}</TableCell>
                    <TableCell>{getRoomName(table.room_id)}</TableCell>
                    <TableCell>{getGroupName(table.group_id)}</TableCell>
                    <TableCell className="capitalize">{t(table.shape || 'rectangle')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenEditForm(table)}
                        disabled={isUpdating}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <T text="Edit" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDeleteDialog(table)}
                        disabled={isUpdating}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <T text="Delete" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Table Form Modal */}
      <TableSideModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        table={selectedTable || {}}
        onSubmit={handleSubmit}
        roomOptions={roomOptions}
        groupOptions={groupOptions}
        isSubmitting={isUpdating}
        error={formError}
        isEdit={!!selectedTable?.id}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !isUpdating && setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t("Delete Table")}
        description={t("Are you sure you want to delete table #") + (selectedTable?.table_number || '') + "? " + t("This action cannot be undone.")}
        isLoading={isUpdating}
      />
    </Card>
  );
};

export default TablesView;
