
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Room } from "@/services/table/types";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/services/table/roomService";

import NoData from "@/components/ui/no-data";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Room form schema
const roomSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  active: z.boolean().default(true)
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  initialData?: Partial<Room>;
  onSubmit: (data: Room) => Promise<void>;
  onCancel: () => void;
}

// Room Form Component
const RoomForm: React.FC<RoomFormProps> = ({ initialData = {}, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      active: initialData.active !== undefined ? initialData.active : true
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as Room))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Room Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter room name")} {...field} />
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
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel><T text="Active" /></FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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

// Main RoomsView component
const RoomsView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const roomsData = await getRooms();
        setRooms(roomsData);
      } catch (error: any) {
        console.error("Error fetching rooms:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load rooms. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, t]);

  const handleCreateRoom = () => {
    setIsEditMode(false);
    setSelectedRoom(null);
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setIsEditMode(true);
    setSelectedRoom(room);
    setIsRoomDialogOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (selectedRoom) {
      try {
        await deleteRoom(selectedRoom.id);
        setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
        toast({
          title: t("Success"),
          description: t("Room deleted successfully."),
        });
      } catch (error: any) {
        console.error("Error deleting room:", error);
        toast({
          title: t("Error"),
          description: t("Failed to delete room. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsDeleteConfirmationOpen(false);
        setSelectedRoom(null);
      }
    }
  };

  const handleRoomFormSubmit = async (data: Room) => {
    try {
      if (isEditMode && selectedRoom) {
        // Update existing room
        const updatedRoom = await updateRoom(selectedRoom.id, data);
        setRooms(rooms.map((room) => (room.id === selectedRoom.id ? updatedRoom : room)));
        toast({
          title: t("Success"),
          description: t("Room updated successfully."),
        });
      } else {
        // Create new room
        const newRoom = await createRoom(data);
        setRooms([...rooms, newRoom]);
        toast({
          title: t("Success"),
          description: t("Room created successfully."),
        });
      }
      setIsRoomDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving room:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save room. Please try again."),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Rooms" /></CardTitle>
        <Button onClick={handleCreateRoom}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Room" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p><T text="Loading rooms..." /></p>
        ) : rooms.length === 0 ? (
          <NoData message={t("No rooms found. Add a room to get started.")} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Name" /></TableHead>
                <TableHead><T text="Description" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={room.active ? 'default' : 'secondary'}>
                      {room.active ? t('Active') : t('Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditRoom(room)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <T text="Edit" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRoom(room)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <T text="Delete" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Room Form Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? <T text="Edit Room" /> : <T text="Create Room" />}
            </DialogTitle>
          </DialogHeader>
          <RoomForm
            initialData={selectedRoom || {}}
            onSubmit={handleRoomFormSubmit}
            onCancel={() => setIsRoomDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteRoom}
        title={t("Delete Room")}
        description={t("Are you sure you want to delete this room? This action cannot be undone.")}
      />
    </Card>
  );
};

export default RoomsView;
