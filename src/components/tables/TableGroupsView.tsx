
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { TableGroup, Room } from "@/services/table/types";
import { getTableGroups, createTableGroup, updateTableGroup, deleteTableGroup } from "@/services/table/tableGroupService";
import { getRooms } from "@/services/table/roomService";

import NoData from "@/components/ui/no-data";
import TableGroupForm from "./TableGroupForm";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TableGroupsView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TableGroup | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [groupsData, roomsData] = await Promise.all([
          getTableGroups(),
          getRooms()
        ]);
        setTableGroups(groupsData);
        setRooms(roomsData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load data. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, t]);

  const handleCreateGroup = () => {
    setIsEditMode(false);
    setSelectedGroup(null);
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: TableGroup) => {
    setIsEditMode(true);
    setSelectedGroup(group);
    setIsGroupDialogOpen(true);
  };

  const handleDeleteGroup = (group: TableGroup) => {
    setSelectedGroup(group);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (selectedGroup) {
      try {
        await deleteTableGroup(selectedGroup.id);
        setTableGroups(tableGroups.filter((group) => group.id !== selectedGroup.id));
        toast({
          title: t("Success"),
          description: t("Table group deleted successfully."),
        });
      } catch (error: any) {
        console.error("Error deleting table group:", error);
        toast({
          title: t("Error"),
          description: t("Failed to delete table group. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsDeleteConfirmationOpen(false);
        setSelectedGroup(null);
      }
    }
  };

  const handleGroupFormSubmit = async (data: TableGroup) => {
    try {
      if (isEditMode && selectedGroup) {
        // Update existing group
        const updatedGroup = await updateTableGroup(selectedGroup.id, data);
        setTableGroups(
          tableGroups.map((group) => (group.id === selectedGroup.id ? updatedGroup : group))
        );
        toast({
          title: t("Success"),
          description: t("Table group updated successfully."),
        });
      } else {
        // Create new group
        const newGroup = await createTableGroup(data);
        setTableGroups([...tableGroups, newGroup]);
        toast({
          title: t("Success"),
          description: t("Table group created successfully."),
        });
      }
    } catch (error: any) {
      console.error("Error saving table group:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save table group. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsGroupDialogOpen(false);
    }
  };

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle><T text="Table Groups" /></CardTitle>
        <Button onClick={handleCreateGroup}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Table Group" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p><T text="Loading table groups..." /></p>
        ) : tableGroups.length === 0 ? (
          <NoData message={t("No table groups found. Add a table group to get started.")} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Name" /></TableHead>
                <TableHead><T text="Description" /></TableHead>
                <TableHead><T text="Room" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableGroups.map((group) => {
                const room = rooms.find(r => r.id === group.room_id);
                
                return (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.description || '-'}</TableCell>
                    <TableCell>{room ? room.name : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <T text="Edit" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteGroup(group)}>
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

      {/* Table Group Form Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? <T text="Edit Table Group" /> : <T text="Create Table Group" />}
            </DialogTitle>
          </DialogHeader>
          <TableGroupForm
            initialData={selectedGroup || {}}
            onSubmit={handleGroupFormSubmit}
            onCancel={() => setIsGroupDialogOpen(false)}
            roomOptions={roomOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteGroup}
        title={t("Delete Table Group")}
        description={t("Are you sure you want to delete this table group? This action cannot be undone.")}
      />
    </Card>
  );
};

export default TableGroupsView;
