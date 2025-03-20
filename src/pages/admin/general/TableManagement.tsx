import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Table,
  Room,
  TableGroup,
  TableLayout
} from "@/services/table/types";
import {
  getTables,
  getActiveRooms,
  getRooms,
  getTableGroups,
  getTableGroupsByRoomId,
  createTable,
  updateTable,
  deleteTable,
  createRoom,
  updateRoom,
  deleteRoom,
  createTableGroup,
  updateTableGroup,
  deleteTableGroup,
  getLayouts,
  createLayout,
  updateLayout,
  deleteLayout,
  activateLayout
} from "@/services/table";

const TableManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tables");
  const [tables, setTables] = useState<Table[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const [tableGroups, setTableGroups] = useState<TableGroup[]>([]);
  const [layouts, setLayouts] = useState<TableLayout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
  
  // Form states
  const [newTable, setNewTable] = useState<Partial<Table>>({
    table_number: 0,
    capacity: 0,
    status: 'available',
    position_x: 0,
    position_y: 0,
    width: 100,
    height: 100,
    shape: 'rectangle',
    rotation: 0
  });
  
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    description: '',
    active: true
  });
  
  const [newGroup, setNewGroup] = useState<Partial<TableGroup>>({
    name: '',
    description: '',
    room_id: undefined
  });
  
  const [newLayout, setNewLayout] = useState<Partial<TableLayout>>({
    name: '',
    room_id: undefined,
    is_active: false
  });
  
  // Edit states
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tablesData, roomsData, activeRoomsData, groupsData, layoutsData] = await Promise.all([
        getTables(),
        getRooms(),
        getActiveRooms(),
        getTableGroups(),
        getLayouts()
      ]);
      
      setTables(tablesData);
      setRooms(roomsData);
      setActiveRooms(activeRoomsData);
      setTableGroups(groupsData);
      setLayouts(layoutsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Could not load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Room operations
  const handleCreateRoom = async () => {
    try {
      if (!newRoom.name) {
        toast({
          title: "Error",
          description: "Room name is required",
          variant: "destructive"
        });
        return;
      }
      
      if (editMode && editItemId) {
        await updateRoom(editItemId, newRoom);
        toast({
          title: "Success",
          description: "Room updated successfully"
        });
      } else {
        await createRoom({
          name: newRoom.name,
          description: newRoom.description || '',
          active: newRoom.active || true
        });
        toast({
          title: "Success",
          description: "Room created successfully"
        });
      }
      
      // Reset form and refresh data
      setNewRoom({ name: '', description: '', active: true });
      setRoomDialogOpen(false);
      setEditMode(false);
      setEditItemId(null);
      fetchData();
    } catch (error) {
      console.error('Error managing room:', error);
      toast({
        title: "Error",
        description: "Failed to save room",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (confirm("Are you sure you want to delete this room? This will also remove all associated tables.")) {
      try {
        await deleteRoom(id);
        toast({
          title: "Success",
          description: "Room deleted successfully"
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting room:', error);
        toast({
          title: "Error",
          description: "Failed to delete room. It may have associated tables or groups.",
          variant: "destructive"
        });
      }
    }
  };

  const editRoom = (room: Room) => {
    setNewRoom({
      name: room.name,
      description: room.description,
      active: room.active
    });
    setEditMode(true);
    setEditItemId(room.id);
    setRoomDialogOpen(true);
  };

  // Table operations
  const handleCreateTable = async () => {
    try {
      if (!newTable.table_number || !newTable.capacity) {
        toast({
          title: "Error",
          description: "Table number and capacity are required",
          variant: "destructive"
        });
        return;
      }
      
      if (editMode && editItemId) {
        await updateTable(editItemId, newTable);
        toast({
          title: "Success",
          description: "Table updated successfully"
        });
      } else {
        await createTable({
          table_number: newTable.table_number!,
          capacity: newTable.capacity!,
          status: 'available',
          location: newTable.location,
          room_id: newTable.room_id,
          group_id: newTable.group_id,
          position_x: newTable.position_x,
          position_y: newTable.position_y,
          width: newTable.width,
          height: newTable.height,
          shape: newTable.shape,
          rotation: newTable.rotation
        });
        toast({
          title: "Success",
          description: "Table created successfully"
        });
      }
      
      // Reset form and refresh data
      setNewTable({
        table_number: 0,
        capacity: 0,
        status: 'available',
        position_x: 0,
        position_y: 0,
        width: 100,
        height: 100,
        shape: 'rectangle',
        rotation: 0
      });
      setTableDialogOpen(false);
      setEditMode(false);
      setEditItemId(null);
      fetchData();
    } catch (error) {
      console.error('Error managing table:', error);
      toast({
        title: "Error",
        description: "Failed to save table",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      try {
        await deleteTable(id);
        toast({
          title: "Success",
          description: "Table deleted successfully"
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting table:', error);
        toast({
          title: "Error",
          description: "Failed to delete table",
          variant: "destructive"
        });
      }
    }
  };

  const editTable = (table: Table) => {
    setNewTable({
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
      location: table.location,
      room_id: table.room_id,
      group_id: table.group_id,
      position_x: table.position_x,
      position_y: table.position_y,
      width: table.width,
      height: table.height,
      shape: table.shape,
      rotation: table.rotation
    });
    setEditMode(true);
    setEditItemId(table.id);
    setTableDialogOpen(true);
  };

  // Group operations
  const handleCreateGroup = async () => {
    try {
      if (!newGroup.name) {
        toast({
          title: "Error",
          description: "Group name is required",
          variant: "destructive"
        });
        return;
      }
      
      if (editMode && editItemId) {
        await updateTableGroup(editItemId, newGroup);
        toast({
          title: "Success",
          description: "Table group updated successfully"
        });
      } else {
        await createTableGroup({
          name: newGroup.name,
          description: newGroup.description || '',
          room_id: newGroup.room_id
        });
        toast({
          title: "Success",
          description: "Table group created successfully"
        });
      }
      
      // Reset form and refresh data
      setNewGroup({ name: '', description: '', room_id: undefined });
      setGroupDialogOpen(false);
      setEditMode(false);
      setEditItemId(null);
      fetchData();
    } catch (error) {
      console.error('Error managing table group:', error);
      toast({
        title: "Error",
        description: "Failed to save table group",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm("Are you sure you want to delete this table group?")) {
      try {
        await deleteTableGroup(id);
        toast({
          title: "Success",
          description: "Table group deleted successfully"
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting table group:', error);
        toast({
          title: "Error",
          description: "Failed to delete table group. It may have associated tables.",
          variant: "destructive"
        });
      }
    }
  };

  const editGroup = (group: TableGroup) => {
    setNewGroup({
      name: group.name,
      description: group.description,
      room_id: group.room_id
    });
    setEditMode(true);
    setEditItemId(group.id);
    setGroupDialogOpen(true);
  };

  // Layout operations
  const handleCreateLayout = async () => {
    try {
      if (!newLayout.name) {
        toast({
          title: "Error",
          description: "Layout name is required",
          variant: "destructive"
        });
        return;
      }
      
      if (editMode && editItemId) {
        await updateLayout(editItemId, newLayout);
        
        if (newLayout.is_active) {
          await activateLayout(editItemId, newLayout.room_id);
        }
        
        toast({
          title: "Success",
          description: "Layout updated successfully"
        });
      } else {
        const createdLayout = await createLayout({
          name: newLayout.name,
          room_id: newLayout.room_id,
          is_active: newLayout.is_active || false
        });
        
        if (newLayout.is_active) {
          await activateLayout(createdLayout.id, newLayout.room_id);
        }
        
        toast({
          title: "Success",
          description: "Layout created successfully"
        });
      }
      
      // Reset form and refresh data
      setNewLayout({ name: '', room_id: undefined, is_active: false });
      setLayoutDialogOpen(false);
      setEditMode(false);
      setEditItemId(null);
      fetchData();
    } catch (error) {
      console.error('Error managing layout:', error);
      toast({
        title: "Error",
        description: "Failed to save layout",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLayout = async (id: string) => {
    if (confirm("Are you sure you want to delete this layout?")) {
      try {
        await deleteLayout(id);
        toast({
          title: "Success",
          description: "Layout deleted successfully"
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting layout:', error);
        toast({
          title: "Error",
          description: "Failed to delete layout",
          variant: "destructive"
        });
      }
    }
  };

  const editLayout = (layout: TableLayout) => {
    setNewLayout({
      name: layout.name,
      room_id: layout.room_id,
      is_active: layout.is_active
    });
    setEditMode(true);
    setEditItemId(layout.id);
    setLayoutDialogOpen(true);
  };

  const activateExistingLayout = async (id: string, roomId?: string) => {
    try {
      await activateLayout(id, roomId);
      toast({
        title: "Success",
        description: "Layout activated successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error activating layout:', error);
      toast({
        title: "Error",
        description: "Failed to activate layout",
        variant: "destructive"
      });
    }
  };

  const getRoomName = (roomId?: string) => {
    if (!roomId) return "None";
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : "Unknown";
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return "None";
    const group = tableGroups.find(g => g.id === groupId);
    return group ? group.name : "Unknown";
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <Button onClick={fetchData} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="tables" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="groups">Table Groups</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tables</CardTitle>
              <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setNewTable({
                        table_number: 0,
                        capacity: 0,
                        status: 'available',
                        position_x: 0,
                        position_y: 0,
                        width: 100,
                        height: 100,
                        shape: 'rectangle',
                        rotation: 0
                      });
                      setEditMode(false);
                      setEditItemId(null);
                    }}
                  >
                    Add New Table
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editMode ? "Edit Table" : "Add New Table"}</DialogTitle>
                    <DialogDescription>
                      {editMode ? "Update table information" : "Enter table details"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="table_number">Table Number *</Label>
                        <Input
                          id="table_number"
                          type="number"
                          value={newTable.table_number || ''}
                          onChange={(e) => setNewTable({...newTable, table_number: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newTable.capacity || ''}
                          onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newTable.location || ''}
                        onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room">Room</Label>
                      <Select
                        value={newTable.room_id || ''}
                        onValueChange={(value) => setNewTable({...newTable, room_id: value || undefined})}
                      >
                        <SelectTrigger id="room">
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {activeRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group">Group</Label>
                      <Select
                        value={newTable.group_id || ''}
                        onValueChange={(value) => setNewTable({...newTable, group_id: value || undefined})}
                      >
                        <SelectTrigger id="group">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {tableGroups
                            .filter(group => !newTable.room_id || group.room_id === newTable.room_id)
                            .map((group) => (
                              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shape">Shape</Label>
                        <Select
                          value={newTable.shape || 'rectangle'}
                          onValueChange={(value) => setNewTable({...newTable, shape: value as Table['shape']})}
                        >
                          <SelectTrigger id="shape">
                            <SelectValue placeholder="Select shape" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rectangle">Rectangle</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="oval">Oval</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rotation">Rotation (degrees)</Label>
                        <Input
                          id="rotation"
                          type="number"
                          value={newTable.rotation || 0}
                          onChange={(e) => setNewTable({...newTable, rotation: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={newTable.width || 100}
                          onChange={(e) => setNewTable({...newTable, width: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={newTable.height || 100}
                          onChange={(e) => setNewTable({...newTable, height: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTableDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTable}>{editMode ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table #</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Shape</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : tables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No tables found</TableCell>
                    </TableRow>
                  ) : (
                    tables.map((table) => (
                      <TableRow key={table.id}>
                        <TableCell>{table.table_number}</TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            table.status === 'available' ? 'bg-green-100 text-green-800' :
                            table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                            table.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {table.status}
                          </span>
                        </TableCell>
                        <TableCell>{getRoomName(table.room_id)}</TableCell>
                        <TableCell>{getGroupName(table.group_id)}</TableCell>
                        <TableCell>{table.shape || 'rectangle'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => editTable(table)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTable(table.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </UITable>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rooms</CardTitle>
              <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setNewRoom({ name: '', description: '', active: true });
                      setEditMode(false);
                      setEditItemId(null);
                    }}
                  >
                    Add New Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editMode ? "Edit Room" : "Add New Room"}</DialogTitle>
                    <DialogDescription>
                      {editMode ? "Update room information" : "Enter room details"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name *</Label>
                      <Input
                        id="name"
                        value={newRoom.name || ''}
                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newRoom.description || ''}
                        onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newRoom.active === true}
                        onChange={(e) => setNewRoom({...newRoom, active: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRoomDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateRoom}>{editMode ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tables</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No rooms found</TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>{room.description || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            room.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {room.active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {tables.filter(table => table.room_id === room.id).length}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => editRoom(room)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </UITable>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Table Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Table Groups</CardTitle>
              <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setNewGroup({ name: '', description: '', room_id: undefined });
                      setEditMode(false);
                      setEditItemId(null);
                    }}
                  >
                    Add New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editMode ? "Edit Table Group" : "Add New Table Group"}</DialogTitle>
                    <DialogDescription>
                      {editMode ? "Update group information" : "Enter group details"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        value={newGroup.name || ''}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groupDescription">Description</Label>
                      <Input
                        id="groupDescription"
                        value={newGroup.description || ''}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groupRoom">Room</Label>
                      <Select
                        value={newGroup.room_id || ''}
                        onValueChange={(value) => setNewGroup({...newGroup, room_id: value || undefined})}
                      >
                        <SelectTrigger id="groupRoom">
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {activeRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateGroup}>{editMode ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Tables</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : tableGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No table groups found</TableCell>
                    </TableRow>
                  ) : (
                    tableGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.description || '-'}</TableCell>
                        <TableCell>{getRoomName(group.room_id)}</TableCell>
                        <TableCell>
                          {tables.filter(table => table.group_id === group.id).length}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => editGroup(group)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(group.id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </UITable>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layouts Tab */}
        <TabsContent value="layouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Table Layouts</CardTitle>
              <Dialog open={layoutDialogOpen} onOpenChange={setLayoutDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setNewLayout({ name: '', room_id: undefined, is_active: false });
                      setEditMode(false);
                      setEditItemId(null);
                    }}
                  >
                    Add New Layout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editMode ? "Edit Layout" : "Add New Layout"}</DialogTitle>
                    <DialogDescription>
                      {editMode ? "Update layout information" : "Enter layout details"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="layoutName">Layout Name *</Label>
                      <Input
                        id="layoutName"
                        value={newLayout.name || ''}
                        onChange={(e) => setNewLayout({...newLayout, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="layoutRoom">Room</Label>
                      <Select
                        value={newLayout.room_id || ''}
                        onValueChange={(value) => setNewLayout({...newLayout, room_id: value || undefined})}
                      >
                        <SelectTrigger id="layoutRoom">
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {activeRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={newLayout.is_active === true}
                        onChange={(e) => setNewLayout({...newLayout, is_active: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLayoutDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateLayout}>{editMode ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : layouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No layouts found</TableCell>
                    </TableRow>
                  ) : (
                    layouts.map((layout) => (
                      <TableRow key={layout.id}>
                        <TableCell>{layout.name}</TableCell>
                        <TableCell>{getRoomName(layout.room_id)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            layout.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {layout.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => editLayout(layout)}
                            >
                              Edit
                            </Button>
                            {!layout.is_active && (
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => activateExistingLayout(layout.id, layout.room_id)}
                              >
                                Activate
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteLayout(layout.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </UITable>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableManagement;

