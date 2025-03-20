
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Edit, Trash2, Utensils, ChevronsRight, Building2, 
  Users, TableProperties, Settings, Search, Filter 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

type Room = {
  id: string;
  name: string;
  description: string | null;
  floor: number;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

type Table = {
  id: string;
  table_number: number;
  room_id: string | null;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning';
  is_guest_table: boolean;
  x_position: number | null;
  y_position: number | null;
  is_active: boolean;
  created_at: string;
}

const TableManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all-tables');
  
  // Room dialog state
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    id: '',
    name: '',
    description: '',
    floor: 1,
    capacity: 0,
    is_active: true
  });
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  
  // Table dialog state
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableFormData, setTableFormData] = useState({
    id: '',
    table_number: 0,
    room_id: '',
    name: '',
    capacity: 4,
    status: 'available' as const,
    is_guest_table: false,
    x_position: 0,
    y_position: 0,
    is_active: true
  });
  const [isEditingTable, setIsEditingTable] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roomFilter, setRoomFilter] = useState<string>('');
  
  // Fetch rooms and tables
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .order('floor', { ascending: true })
          .order('name', { ascending: true });
          
        if (roomsError) throw roomsError;
        
        // Fetch tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .order('table_number', { ascending: true });
          
        if (tablesError) throw tablesError;
        
        setRooms(roomsData || []);
        setTables(tablesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: t("Error"),
          description: t("Failed to load data. Please try again."),
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast, t]);
  
  // Room operations
  const handleAddRoom = async () => {
    setIsEditingRoom(false);
    setRoomFormData({
      id: '',
      name: '',
      description: '',
      floor: 1,
      capacity: 0,
      is_active: true
    });
    setIsRoomDialogOpen(true);
  };
  
  const handleEditRoom = (room: Room) => {
    setIsEditingRoom(true);
    setRoomFormData({
      id: room.id,
      name: room.name,
      description: room.description || '',
      floor: room.floor,
      capacity: room.capacity,
      is_active: room.is_active
    });
    setIsRoomDialogOpen(true);
  };
  
  const handleSaveRoom = async () => {
    try {
      if (isEditingRoom) {
        const { data, error } = await supabase
          .from('rooms')
          .update({
            name: roomFormData.name,
            description: roomFormData.description,
            floor: roomFormData.floor,
            capacity: roomFormData.capacity,
            is_active: roomFormData.is_active
          })
          .eq('id', roomFormData.id)
          .select();
          
        if (error) throw error;
        
        setRooms(rooms.map(room => room.id === roomFormData.id ? data[0] : room));
        toast({
          title: t("Success"),
          description: t("Room updated successfully"),
        });
      } else {
        const { data, error } = await supabase
          .from('rooms')
          .insert({
            name: roomFormData.name,
            description: roomFormData.description,
            floor: roomFormData.floor,
            capacity: roomFormData.capacity,
            is_active: roomFormData.is_active
          })
          .select();
          
        if (error) throw error;
        
        setRooms([...rooms, data[0]]);
        toast({
          title: t("Success"),
          description: t("Room added successfully"),
        });
      }
      
      setIsRoomDialogOpen(false);
    } catch (error) {
      console.error('Error saving room:', error);
      toast({
        title: t("Error"),
        description: t("Failed to save room. Please try again."),
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm(t("Are you sure you want to delete this room? This will also delete all tables in this room."))) {
      try {
        const { error } = await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
          
        if (error) throw error;
        
        setRooms(rooms.filter(room => room.id !== roomId));
        setTables(tables.filter(table => table.room_id !== roomId));
        
        toast({
          title: t("Success"),
          description: t("Room deleted successfully"),
        });
      } catch (error) {
        console.error('Error deleting room:', error);
        toast({
          title: t("Error"),
          description: t("Failed to delete room. Please try again."),
          variant: "destructive"
        });
      }
    }
  };
  
  // Table operations
  const handleAddTable = () => {
    setIsEditingTable(false);
    const highestTableNumber = tables.length > 0 
      ? Math.max(...tables.map(t => t.table_number)) 
      : 0;
    
    setTableFormData({
      id: '',
      table_number: highestTableNumber + 1,
      room_id: '',
      name: '',
      capacity: 4,
      status: 'available',
      is_guest_table: false,
      x_position: 0,
      y_position: 0,
      is_active: true
    });
    setIsTableDialogOpen(true);
  };
  
  const handleAddGuestTable = () => {
    setIsEditingTable(false);
    const highestTableNumber = tables.length > 0 
      ? Math.max(...tables.map(t => t.table_number)) 
      : 0;
    
    setTableFormData({
      id: '',
      table_number: highestTableNumber + 1,
      room_id: null,
      name: 'Guest Table',
      capacity: 4,
      status: 'available',
      is_guest_table: true,
      x_position: 0,
      y_position: 0,
      is_active: true
    });
    setIsTableDialogOpen(true);
  };
  
  const handleEditTable = (table: Table) => {
    setIsEditingTable(true);
    setTableFormData({
      id: table.id,
      table_number: table.table_number,
      room_id: table.room_id || '',
      name: table.name,
      capacity: table.capacity,
      status: table.status,
      is_guest_table: table.is_guest_table,
      x_position: table.x_position || 0,
      y_position: table.y_position || 0,
      is_active: table.is_active
    });
    setIsTableDialogOpen(true);
  };
  
  const handleSaveTable = async () => {
    try {
      if (isEditingTable) {
        const { data, error } = await supabase
          .from('tables')
          .update({
            table_number: tableFormData.table_number,
            room_id: tableFormData.room_id || null,
            name: tableFormData.name,
            capacity: tableFormData.capacity,
            status: tableFormData.status,
            is_guest_table: tableFormData.is_guest_table,
            x_position: tableFormData.x_position,
            y_position: tableFormData.y_position,
            is_active: tableFormData.is_active
          })
          .eq('id', tableFormData.id)
          .select();
          
        if (error) throw error;
        
        setTables(tables.map(table => table.id === tableFormData.id ? data[0] : table));
        toast({
          title: t("Success"),
          description: t("Table updated successfully"),
        });
      } else {
        const { data, error } = await supabase
          .from('tables')
          .insert({
            table_number: tableFormData.table_number,
            room_id: tableFormData.room_id || null,
            name: tableFormData.name || `Table ${tableFormData.table_number}`,
            capacity: tableFormData.capacity,
            status: tableFormData.status,
            is_guest_table: tableFormData.is_guest_table,
            x_position: tableFormData.x_position,
            y_position: tableFormData.y_position,
            is_active: tableFormData.is_active
          })
          .select();
          
        if (error) throw error;
        
        setTables([...tables, data[0]]);
        toast({
          title: t("Success"),
          description: t("Table added successfully"),
        });
      }
      
      setIsTableDialogOpen(false);
    } catch (error) {
      console.error('Error saving table:', error);
      toast({
        title: t("Error"),
        description: t("Failed to save table. Please try again."),
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteTable = async (tableId: string) => {
    if (window.confirm(t("Are you sure you want to delete this table?"))) {
      try {
        const { error } = await supabase
          .from('tables')
          .delete()
          .eq('id', tableId);
          
        if (error) throw error;
        
        setTables(tables.filter(table => table.id !== tableId));
        
        toast({
          title: t("Success"),
          description: t("Table deleted successfully"),
        });
      } catch (error) {
        console.error('Error deleting table:', error);
        toast({
          title: t("Error"),
          description: t("Failed to delete table. Please try again."),
          variant: "destructive"
        });
      }
    }
  };
  
  const handleChangeTableStatus = async (tableId: string, newStatus: 'available' | 'occupied' | 'reserved' | 'needs_cleaning') => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .update({ status: newStatus })
        .eq('id', tableId)
        .select();
        
      if (error) throw error;
      
      setTables(tables.map(table => table.id === tableId ? data[0] : table));
      toast({
        title: t("Success"),
        description: t(`Table status updated to ${newStatus}`),
      });
    } catch (error) {
      console.error('Error updating table status:', error);
      toast({
        title: t("Error"),
        description: t("Failed to update table status. Please try again."),
        variant: "destructive"
      });
    }
  };
  
  // Filter and search functions
  const getFilteredTables = () => {
    let filtered = [...tables];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(table => 
        table.name.toLowerCase().includes(query) || 
        table.table_number.toString().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(table => table.status === statusFilter);
    }
    
    // Apply room filter
    if (roomFilter) {
      filtered = filtered.filter(table => table.room_id === roomFilter);
    }
    
    // Filter by active tab
    if (activeTab === 'guest-tables') {
      filtered = filtered.filter(table => table.is_guest_table);
    } else if (activeTab === 'regular-tables') {
      filtered = filtered.filter(table => !table.is_guest_table);
    }
    
    return filtered;
  };
  
  const filteredTables = getFilteredTables();
  
  // Get room name by id
  const getRoomNameById = (roomId: string | null) => {
    if (!roomId) return t('No Room');
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : t('Unknown Room');
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-500">{t("Available")}</Badge>;
      case 'occupied':
        return <Badge className="bg-red-500">{t("Occupied")}</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-500">{t("Reserved")}</Badge>;
      case 'needs_cleaning':
        return <Badge className="bg-yellow-500">{t("Needs Cleaning")}</Badge>;
      default:
        return <Badge>{t(status)}</Badge>;
    }
  };
  
  return (
    <Layout interface="admin">
      <PageHeader
        title={t("Table Management")}
        description={t("Manage restaurant tables and rooms")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/general')}>
              <Settings className="mr-2 h-4 w-4" />
              {t("General Settings")}
            </Button>
            <Button onClick={handleAddRoom}>
              <Building2 className="mr-2 h-4 w-4" />
              {t("Add Room")}
            </Button>
            <Button onClick={handleAddTable}>
              <TableProperties className="mr-2 h-4 w-4" />
              {t("Add Table")}
            </Button>
            <Button variant="outline" onClick={handleAddGuestTable}>
              <Users className="mr-2 h-4 w-4" />
              {t("Add Guest Table")}
            </Button>
          </div>
        }
      />
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Rooms")}</CardTitle>
            <CardDescription>{t("Manage restaurant rooms and areas")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>{t("Loading rooms...")}</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center p-4">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">{t("No rooms found. Create a room to organize your tables.")}</p>
                <Button className="mt-4" onClick={handleAddRoom}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("Add First Room")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {rooms.map(room => (
                  <Card key={room.id} className={`overflow-hidden ${!room.is_active ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {room.name}
                        </CardTitle>
                        <Badge variant={room.is_active ? "default" : "outline"}>
                          {room.is_active ? t("Active") : t("Inactive")}
                        </Badge>
                      </div>
                      <CardDescription>
                        {t("Floor")} {room.floor} · {t("Capacity")}: {room.capacity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        {room.description || t("No description provided")}
                      </p>
                      <p className="text-sm font-medium mt-2">
                        {t("Tables")}: {tables.filter(table => table.room_id === room.id).length}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRoom(room)}>
                        <Edit className="mr-1 h-4 w-4" />
                        {t("Edit")}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        {t("Delete")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>{t("Tables")}</CardTitle>
                <CardDescription>{t("Manage restaurant tables")}</CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search tables...")}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("Filter by status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("All Statuses")}</SelectItem>
                    <SelectItem value="available">{t("Available")}</SelectItem>
                    <SelectItem value="occupied">{t("Occupied")}</SelectItem>
                    <SelectItem value="reserved">{t("Reserved")}</SelectItem>
                    <SelectItem value="needs_cleaning">{t("Needs Cleaning")}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("Filter by room")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("All Rooms")}</SelectItem>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))}
                    <SelectItem value="null">{t("No Room")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <Tabs defaultValue="all-tables" className="w-full" onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all-tables">{t("All Tables")}</TabsTrigger>
                <TabsTrigger value="regular-tables">{t("Regular Tables")}</TabsTrigger>
                <TabsTrigger value="guest-tables">{t("Guest Tables")}</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <p>{t("Loading tables...")}</p>
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="text-center p-4">
                  <TableProperties className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t("No tables found with the current filters.")}</p>
                  <Button className="mt-4" onClick={handleAddTable}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("Add Table")}
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Table #")}</TableHead>
                        <TableHead>{t("Name")}</TableHead>
                        <TableHead>{t("Room")}</TableHead>
                        <TableHead>{t("Capacity")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead>{t("Type")}</TableHead>
                        <TableHead>{t("Active")}</TableHead>
                        <TableHead className="text-right">{t("Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTables.map(table => (
                        <TableRow key={table.id} className={!table.is_active ? 'opacity-60' : ''}>
                          <TableCell className="font-medium">{table.table_number}</TableCell>
                          <TableCell>{table.name}</TableCell>
                          <TableCell>{getRoomNameById(table.room_id)}</TableCell>
                          <TableCell>{table.capacity}</TableCell>
                          <TableCell>{getStatusBadge(table.status)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {table.is_guest_table ? t("Guest") : t("Regular")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={table.is_active} 
                              onCheckedChange={async (checked) => {
                                try {
                                  const { error } = await supabase
                                    .from('tables')
                                    .update({ is_active: checked })
                                    .eq('id', table.id);
                                    
                                  if (error) throw error;
                                  
                                  setTables(tables.map(t => 
                                    t.id === table.id ? {...t, is_active: checked} : t
                                  ));
                                } catch (error) {
                                  console.error('Error updating table status:', error);
                                  toast({
                                    title: t("Error"),
                                    description: t("Failed to update table status"),
                                    variant: "destructive"
                                  });
                                }
                              }}
                              aria-label={t("Toggle active status")}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditTable(table)}
                              title={t("Edit Table")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTable(table.id)}
                              title={t("Delete Table")}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            
                            <Select 
                              onValueChange={(value) => handleChangeTableStatus(
                                table.id, 
                                value as 'available' | 'occupied' | 'reserved' | 'needs_cleaning'
                              )}
                              defaultValue={table.status}
                            >
                              <SelectTrigger className="h-8 w-[130px] inline-flex ml-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">{t("Available")}</SelectItem>
                                <SelectItem value="occupied">{t("Occupied")}</SelectItem>
                                <SelectItem value="reserved">{t("Reserved")}</SelectItem>
                                <SelectItem value="needs_cleaning">{t("Needs Cleaning")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingRoom ? t("Edit Room") : t("Add New Room")}
            </DialogTitle>
            <DialogDescription>
              {t("Fill in the details to create or update a room.")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("Name")}
              </Label>
              <Input
                id="name"
                value={roomFormData.name}
                onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
                className="col-span-3"
                placeholder={t("Enter room name")}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("Description")}
              </Label>
              <Input
                id="description"
                value={roomFormData.description}
                onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                className="col-span-3"
                placeholder={t("Optional description")}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                {t("Floor")}
              </Label>
              <Input
                id="floor"
                type="number"
                min={0}
                value={roomFormData.floor}
                onChange={(e) => setRoomFormData({...roomFormData, floor: parseInt(e.target.value)})}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                {t("Capacity")}
              </Label>
              <Input
                id="capacity"
                type="number"
                min={0}
                value={roomFormData.capacity}
                onChange={(e) => setRoomFormData({...roomFormData, capacity: parseInt(e.target.value)})}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-active" className="text-right">
                {t("Active")}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={roomFormData.is_active}
                  onCheckedChange={(checked) => setRoomFormData({...roomFormData, is_active: checked})}
                />
                <Label htmlFor="is-active">
                  {roomFormData.is_active ? t("Active") : t("Inactive")}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button type="button" onClick={handleSaveRoom}>
              {isEditingRoom ? t("Update Room") : t("Add Room")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Table Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingTable ? t("Edit Table") : t("Add New Table")}
            </DialogTitle>
            <DialogDescription>
              {t("Fill in the details to create or update a table.")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="table-number" className="text-right">
                {t("Table #")}
              </Label>
              <Input
                id="table-number"
                type="number"
                min={1}
                value={tableFormData.table_number}
                onChange={(e) => setTableFormData({...tableFormData, table_number: parseInt(e.target.value)})}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("Name")}
              </Label>
              <Input
                id="name"
                value={tableFormData.name}
                onChange={(e) => setTableFormData({...tableFormData, name: e.target.value})}
                className="col-span-3"
                placeholder={t("Enter table name (optional)")}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                {t("Room")}
              </Label>
              <Select 
                value={tableFormData.room_id} 
                onValueChange={(value) => setTableFormData({...tableFormData, room_id: value})}
                disabled={tableFormData.is_guest_table}
              >
                <SelectTrigger className="col-span-3" id="room">
                  <SelectValue placeholder={t("Select a room")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("No Room")}</SelectItem>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                {t("Capacity")}
              </Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={tableFormData.capacity}
                onChange={(e) => setTableFormData({...tableFormData, capacity: parseInt(e.target.value)})}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t("Status")}
              </Label>
              <Select 
                value={tableFormData.status} 
                onValueChange={(value: 'available' | 'occupied' | 'reserved' | 'needs_cleaning') => 
                  setTableFormData({...tableFormData, status: value})
                }
              >
                <SelectTrigger className="col-span-3" id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t("Available")}</SelectItem>
                  <SelectItem value="occupied">{t("Occupied")}</SelectItem>
                  <SelectItem value="reserved">{t("Reserved")}</SelectItem>
                  <SelectItem value="needs_cleaning">{t("Needs Cleaning")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-guest-table" className="text-right">
                {t("Guest Table")}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is-guest-table"
                  checked={tableFormData.is_guest_table}
                  onCheckedChange={(checked) => {
                    setTableFormData({
                      ...tableFormData, 
                      is_guest_table: checked,
                      room_id: checked ? '' : tableFormData.room_id
                    });
                  }}
                />
                <Label htmlFor="is-guest-table">
                  {tableFormData.is_guest_table 
                    ? t("Temporary guest table") 
                    : t("Regular permanent table")}
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-active" className="text-right">
                {t("Active")}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={tableFormData.is_active}
                  onCheckedChange={(checked) => setTableFormData({...tableFormData, is_active: checked})}
                />
                <Label htmlFor="is-active">
                  {tableFormData.is_active ? t("Active") : t("Inactive")}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsTableDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button type="button" onClick={handleSaveTable}>
              {isEditingTable ? t("Update Table") : t("Add Table")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TableManagement;
