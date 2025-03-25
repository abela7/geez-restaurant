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
import RoomForm from "./RoomForm";

const RoomsView = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setIsEditMode(true);
    setSelectedRoom(room);
    setErrorMessage(null);
    setIsRoomDialogOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (!selectedRoom) return;
    
    setIsUpdating(true);
    try {
      await deleteRoom(selectedRoom.id);
      setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
      toast({
        title: t("Success"),
        description: t("Room deleted successfully."),
      });
      setIsDeleteConfirmationOpen(false);
      setSelectedRoom(null);
    } catch (error: any) {
      console.error("Error deleting room:", error);
      toast({
        title: t("Error"),
        description: error.message || t("Failed to delete room. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoomFormSubmit = async (data: Room) => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      if (isEditMode && selectedRoom) {
        // Update existing room
        const updatedRoom = await updateRoom(selectedRoom.id, data);
        setRooms(prevRooms => prevRooms.map(room => 
          room.id === selectedRoom.id ? updatedRoom : room
        ));
        toast({
          title: t("Success"),
          description: t("Room updated successfully."),
        });
        setIsRoomDialogOpen(false);
      } else {
        // Create new room
        const newRoom = await createRoom(data);
        setRooms(prevRooms => [...prevRooms, newRoom]);
        toast({
          title: t("Success"),
          description: t("Room created successfully."),
        });
        setIsRoomDialogOpen(false);
      }
    } catch (error: any) {
      console.error("Error saving room:", error);
      setErrorMessage(error.message || t("Failed to save room. Please try again."));
      toast({
        title: t("Error"),
        description: error.message || t("Failed to save room. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><T text="Rooms" /></CardTitle>
        <Button onClick={handleCreateRoom} disabled={isUpdating}>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Room" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditRoom(room)}
                      disabled={isUpdating}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <T text="Edit" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteRoom(room)}
                      disabled={isUpdating}
                    >
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
      <Dialog open={isRoomDialogOpen} onOpenChange={(open) => {
        if (isUpdating) return;
        setIsRoomDialogOpen(open);
        if (!open) setErrorMessage(null);
      }}>
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
            isSubmitting={isUpdating}
            error={errorMessage}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => !isUpdating && setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDeleteRoom}
        title={t("Delete Room")}
        description={t("Are you sure you want to delete this room? This action cannot be undone.")}
        isLoading={isUpdating}
      />
    </Card>
  );
};

export default RoomsView;
