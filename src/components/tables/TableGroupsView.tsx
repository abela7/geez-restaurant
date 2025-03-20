
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
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Table Group form schema
const tableGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  room_id: z.string().nullable(),
});

type TableGroupFormValues = z.infer<typeof tableGroupSchema>;

interface TableGroupFormProps {
  initialData?: Partial<TableGroup>;
  onSubmit: (data: TableGroup) => Promise<void>;
  onCancel: () => void;
  roomOptions: { label: string; value: string; }[];
}

// Table Group Form Component
const TableGroupForm: React.FC<TableGroupFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  roomOptions 
}) => {
  const { t } = useLanguage();
  
  const form = useForm<TableGroupFormValues>({
    resolver: zodResolver(tableGroupSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      room_id: initialData.room_id === undefined ? null : initialData.room_id,
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as TableGroup))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Group Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter group name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Description" /></FormLabel>
              <FormControl>
                <Textarea placeholder={t("Enter description")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Room" /></FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value || null)}
                value={field.value || "null"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a room")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null"><T text="None" /></SelectItem>
                  {roomOptions.map((room) => (
                    <SelectItem key={room.value} value={room.value}>
                      {room.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <T text="Cancel" />
          </Button>
          <Button type="submit">
            <T text="Save" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Main TableGroupsView component
const TableGroupsView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TableGroup | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tableGroupsData, roomsData] = await Promise.all([
          getTableGroups(),
          getRooms()
        ]);
        
        setTableGroups(tableGroupsData);
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
          description: t("Group deleted successfully."),
        });
      } catch (error: any) {
        console.error("Error deleting group:", error);
        toast({
          title: t("Error"),
          description: t("Failed to delete group. Please try again."),
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
      // Convert room_id from "null" string to actual null if needed
      const formattedData = {
        ...data,
        room_id: data.room_id === "null" ? null : data.room_id
      };
      
      if (isEditMode && selectedGroup) {
        // Update existing group
        const updatedGroup = await updateTableGroup(selectedGroup.id, formattedData);
        setTableGroups(tableGroups.map((group) => 
          group.id === selectedGroup.id ? updatedGroup : group
        ));
        toast({
          title: t("Success"),
          description: t("Group updated successfully."),
        });
      } else {
        // Create new group
        const newGroup = await createTableGroup(formattedData);
        setTableGroups([...tableGroups, newGroup]);
        toast({
          title: t("Success"),
          description: t("Group created successfully."),
        });
      }
      setIsGroupDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving group:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save group. Please try again."),
        variant: "destructive",
      });
    }
  };

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Table Groups" /></CardTitle>
        <Button onClick={handleCreateGroup}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Group" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p><T text="Loading table groups..." /></p>
        ) : tableGroups.length === 0 ? (
          <NoData message={t("No table groups found. Add a group to get started.")} />
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
                    <TableCell className="font-medium">{group.name}</TableCell>
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

      {/* Group Form Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? <T text="Edit Group" /> : <T text="Create Group" />}
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
        title={t("Delete Group")}
        description={t("Are you sure you want to delete this group? This action cannot be undone.")}
      />
    </Card>
  );
};

export default TableGroupsView;
