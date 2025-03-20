
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { SideModal } from '@/components/ui/side-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, FormControl, FormDescription, 
  FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CheckCircle2, Users, Clock, RefreshCw, PlusCircle, Edit, Trash2,
  Table, MoveVertical, Grid3X3, Layout, LayoutGrid, Layers,
  LayoutDashboard, CheckSquare, CircleDot, Square, Move, RotateCw,
  Minus, Plus, FolderPlus, Loader2
} from 'lucide-react';

import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  getTableStats,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getTableGroups,
  createTableGroup,
  updateTableGroup,
  deleteTableGroup,
  getTablesByRoomId
} from "@/services/table/tableService";
import type { Table as TableType, Room, TableGroup } from "@/services/table/types";

// Schemas
const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
  active: z.boolean().default(true)
});

const tableGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  room_id: z.string().optional()
});

const tableSchema = z.object({
  table_number: z.coerce.number().min(1, "Table number must be at least 1"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  location: z.string().optional(),
  room_id: z.string().optional(),
  group_id: z.string().optional(),
  shape: z.enum(["rectangle", "circle", "square", "oval"]).default("rectangle"),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  position_x: z.coerce.number().optional(),
  position_y: z.coerce.number().optional(),
  rotation: z.coerce.number().optional()
});

// Table Management Page
const TableManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tables");
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<TableGroup | null>(null);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isEditTableOpen, setIsEditTableOpen] = useState(false);
  const [isDeleteTableOpen, setIsDeleteTableOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | "all">("all");
  const [filteredTables, setFilteredTables] = useState<TableType[]>([]);

  // Form initialization
  const tableForm = useForm<z.infer<typeof tableSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      table_number: 1,
      capacity: 4,
      location: "",
      shape: "rectangle",
      width: 80,
      height: 80
    }
  });

  const roomForm = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true
    }
  });

  const groupForm = useForm<z.infer<typeof tableGroupSchema>>({
    resolver: zodResolver(tableGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      room_id: undefined
    }
  });

  // Fetch tables
  const { 
    data: tables = [],
    isLoading: isLoadingTables,
    isError: isTablesError,
    refetch: refetchTables
  } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables
  });

  // Fetch rooms
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  });

  // Fetch table groups
  const {
    data: tableGroups = [],
    isLoading: isLoadingGroups,
    isError: isGroupsError,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['tableGroups'],
    queryFn: getTableGroups
  });

  // Filter tables based on selected room
  useEffect(() => {
    if (selectedRoomId === "all") {
      setFilteredTables(tables);
    } else {
      setFilteredTables(tables.filter(table => table.room_id === selectedRoomId));
    }
  }, [selectedRoomId, tables]);

  // Fetch table statistics
  const {
    data: tableStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['tableStats'],
    queryFn: getTableStats
  });

  // Room mutations
  const createRoomMutation = useMutation({
    mutationFn: (newRoom: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => 
      createRoom(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: t("Room Created"),
        description: t("Room has been created successfully")
      });
      roomForm.reset();
      setIsRoomModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create room: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Room> }) => 
      updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: t("Room Updated"),
        description: t("Room has been updated successfully")
      });
      roomForm.reset();
      setIsRoomModalOpen(false);
      setSelectedRoom(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update room: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: t("Room Deleted"),
        description: t("Room has been deleted successfully")
      });
      setSelectedRoom(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete room: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Group mutations
  const createGroupMutation = useMutation({
    mutationFn: (newGroup: Omit<TableGroup, 'id' | 'created_at' | 'updated_at'>) => 
      createTableGroup(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableGroups'] });
      toast({
        title: t("Group Created"),
        description: t("Table group has been created successfully")
      });
      groupForm.reset();
      setIsGroupModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create table group: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TableGroup> }) => 
      updateTableGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableGroups'] });
      toast({
        title: t("Group Updated"),
        description: t("Table group has been updated successfully")
      });
      groupForm.reset();
      setIsGroupModalOpen(false);
      setSelectedGroup(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table group: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => deleteTableGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableGroups'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: t("Group Deleted"),
        description: t("Table group has been deleted successfully")
      });
      setSelectedGroup(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete table group: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Table mutations
  const createTableMutation = useMutation({
    mutationFn: (newTable: Omit<TableType, 'id' | 'created_at' | 'updated_at'>) => 
      createTable(newTable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Created"),
        description: t("Table has been created successfully")
      });
      setIsAddTableOpen(false);
      tableForm.reset();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TableType> }) => 
      updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Updated"),
        description: t("Table has been updated successfully")
      });
      setIsEditTableOpen(false);
      setSelectedTable(null);
      tableForm.reset();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Deleted"),
        description: t("Table has been deleted successfully")
      });
      setIsDeleteTableOpen(false);
      setSelectedTable(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Handle edit table
  const handleEditTable = (table: TableType) => {
    setSelectedTable(table);
    
    tableForm.reset({
      table_number: table.table_number,
      capacity: table.capacity,
      location: table.location || "",
      room_id: table.room_id,
      group_id: table.group_id,
      shape: table.shape as "rectangle" | "circle" | "square" | "oval",
      width: table.width,
      height: table.height,
      position_x: table.position_x,
      position_y: table.position_y,
      rotation: table.rotation
    });
    
    setIsEditTableOpen(true);
  };

  // Handle edit room
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    
    roomForm.reset({
      name: room.name,
      description: room.description || "",
      active: room.active
    });
    
    setIsRoomModalOpen(true);
  };

  // Handle edit group
  const handleEditGroup = (group: TableGroup) => {
    setSelectedGroup(group);
    
    groupForm.reset({
      name: group.name,
      description: group.description || "",
      room_id: group.room_id
    });
    
    setIsGroupModalOpen(true);
  };

  // Handle table create
  const onTableSubmit = (values: z.infer<typeof tableSchema>) => {
    const newTable = {
      ...values,
      status: 'available' as const,
    };
    
    createTableMutation.mutate(newTable);
  };

  // Handle table update
  const onTableUpdate = (values: z.infer<typeof tableSchema>) => {
    if (selectedTable) {
      updateTableMutation.mutate({
        id: selectedTable.id,
        data: values
      });
    }
  };

  // Handle room create/update
  const onRoomSubmit = (values: z.infer<typeof roomSchema>) => {
    if (selectedRoom) {
      updateRoomMutation.mutate({
        id: selectedRoom.id,
        data: values
      });
    } else {
      createRoomMutation.mutate(values);
    }
  };

  // Handle group create/update
  const onGroupSubmit = (values: z.infer<typeof tableGroupSchema>) => {
    if (selectedGroup) {
      updateGroupMutation.mutate({
        id: selectedGroup.id,
        data: values
      });
    } else {
      createGroupMutation.mutate(values);
    }
  };

  // Handle table delete
  const handleDeleteTable = () => {
    if (selectedTable) {
      deleteTableMutation.mutate(selectedTable.id);
    }
  };

  // Handle room delete
  const handleDeleteRoom = (id: string) => {
    // Check if there are tables in this room
    const tablesInRoom = tables.filter(table => table.room_id === id);
    
    if (tablesInRoom.length > 0) {
      toast({
        title: t("Cannot Delete Room"),
        description: t("This room contains tables. Please remove or reassign all tables first."),
        variant: "destructive"
      });
      return;
    }
    
    deleteRoomMutation.mutate(id);
  };

  // Handle group delete
  const handleDeleteGroup = (id: string) => {
    // Check if there are tables in this group
    const tablesInGroup = tables.filter(table => table.group_id === id);
    
    if (tablesInGroup.length > 0) {
      toast({
        title: t("Cannot Delete Group"),
        description: t("This group contains tables. Please remove or reassign all tables first."),
        variant: "destructive"
      });
      return;
    }
    
    deleteGroupMutation.mutate(id);
  };

  // Loading state
  const isLoading = isLoadingTables || isLoadingStats || isLoadingRooms || isLoadingGroups;
  const isError = isTablesError || isRoomsError || isGroupsError;
  
  if (isLoading) {
    return (
      <Layout interface="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground"><T text="Loading..." /></p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout interface="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-destructive text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2"><T text="Error Loading Data" /></h2>
            <p className="text-muted-foreground"><T text="There was an error loading the table management data." /></p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                refetchTables();
                refetchRooms();
                refetchGroups();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <T text="Try Again" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get status badge
  const getStatusBadge = (status: TableType['status']) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-600">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-600">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-600">Reserved</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-600">Cleaning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        title={t("Table Management")}
        description={t("Manage restaurant tables, rooms, and layouts")}
      />
      
      {/* Table Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
              <T text="Available" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.available || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-red-600" />
              <T text="Occupied" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.occupied || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <T text="Reserved" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.reserved || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 text-yellow-600" />
              <T text="Cleaning" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tableStats?.cleaning || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="tables" className="flex items-center">
              <Table className="mr-2 h-4 w-4" />
              <T text="Tables" />
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4" />
              <T text="Rooms" />
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              <T text="Table Groups" />
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {activeTab === "tables" && (
              <Button onClick={() => {
                tableForm.reset({
                  table_number: 1,
                  capacity: 4,
                  location: "",
                  shape: "rectangle",
                  width: 80,
                  height: 80
                });
                setIsAddTableOpen(true);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <T text="Add Table" />
              </Button>
            )}
            
            {activeTab === "rooms" && (
              <Button onClick={() => {
                roomForm.reset({
                  name: "",
                  description: "",
                  active: true
                });
                setSelectedRoom(null);
                setIsRoomModalOpen(true);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <T text="Add Room" />
              </Button>
            )}
            
            {activeTab === "groups" && (
              <Button onClick={() => {
                groupForm.reset({
                  name: "",
                  description: "",
                  room_id: undefined
                });
                setSelectedGroup(null);
                setIsGroupModalOpen(true);
              }}>
                <FolderPlus className="mr-2 h-4 w-4" />
                <T text="Add Group" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle><T text="Restaurant Tables" /></CardTitle>
                <Select value={selectedRoomId} onValueChange={(value) => setSelectedRoomId(value)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filter by room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all"><T text="All Rooms" /></SelectItem>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTables.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4"><T text="Table Number" /></th>
                        <th className="text-left py-3 px-4"><T text="Capacity" /></th>
                        <th className="text-left py-3 px-4"><T text="Location" /></th>
                        <th className="text-left py-3 px-4"><T text="Room" /></th>
                        <th className="text-left py-3 px-4"><T text="Group" /></th>
                        <th className="text-left py-3 px-4"><T text="Status" /></th>
                        <th className="text-right py-3 px-4"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.map((table) => (
                        <tr key={table.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{t("Table")} {table.table_number}</td>
                          <td className="py-3 px-4">{table.capacity} {t("seats")}</td>
                          <td className="py-3 px-4">{table.location || "-"}</td>
                          <td className="py-3 px-4">{table.room?.name || "-"}</td>
                          <td className="py-3 px-4">{table.group?.name || "-"}</td>
                          <td className="py-3 px-4">{getStatusBadge(table.status)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditTable(table)}>
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                setSelectedTable(table);
                                setIsDeleteTableOpen(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                    <Table size={48} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {selectedRoomId !== "all" 
                      ? <T text="No Tables in This Room" />
                      : <T text="No Tables Found" />
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedRoomId !== "all" 
                      ? <T text="Add your first table to this room to get started." />
                      : <T text="Add your first table to get started." />
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => {
                      tableForm.reset({
                        table_number: 1,
                        capacity: 4,
                        location: "",
                        room_id: selectedRoomId !== "all" ? selectedRoomId : undefined,
                        shape: "rectangle",
                        width: 80,
                        height: 80
                      });
                      setIsAddTableOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <T text="Add Table" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle><T text="Restaurant Rooms" /></CardTitle>
              <CardDescription><T text="Organize your tables by rooms or areas" /></CardDescription>
            </CardHeader>
            <CardContent>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="relative overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="absolute top-3 right-3">
                          {room.active ? (
                            <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600">
                              <T text="Active" />
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              <T text="Inactive" />
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        {room.description && (
                          <CardDescription className="mt-1">{room.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex items-center justify-between pb-3">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{tables.filter(t => t.room_id === room.id).length}</span> {t("tables")}
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit size={16} className="mr-1" />
                            <T text="Edit" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            <T text="Delete" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                    <LayoutGrid size={48} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Rooms Found" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="Add your first room to organize your tables." />
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => {
                      setSelectedRoom(null);
                      roomForm.reset({
                        name: "",
                        description: "",
                        active: true
                      });
                      setIsRoomModalOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <T text="Add Room" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle><T text="Table Groups" /></CardTitle>
              <CardDescription><T text="Organize tables into functional groups" /></CardDescription>
            </CardHeader>
            <CardContent>
              {tableGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tableGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.description && (
                          <CardDescription className="mt-1">{group.description}</CardDescription>
                        )}
                        {group.room && (
                          <Badge variant="outline" className="mt-2">
                            {group.room.name}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="flex items-center justify-between pb-3">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{tables.filter(t => t.group_id === group.id).length}</span> {t("tables")}
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditGroup(group)}
                          >
                            <Edit size={16} className="mr-1" />
                            <T text="Edit" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            <T text="Delete" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                    <Layers size={48} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Table Groups Found" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="Add your first table group to better organize tables." />
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => {
                      setSelectedGroup(null);
                      groupForm.reset({
                        name: "",
                        description: "",
                        room_id: undefined
                      });
                      setIsGroupModalOpen(true);
                    }}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <T text="Add Group" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Table Dialog */}
      <Dialog open={isAddTableOpen} onOpenChange={setIsAddTableOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle><T text="Add New Table" /></DialogTitle>
            <DialogDescription>
              <T text="Create a new table for your restaurant." />
            </DialogDescription>
          </DialogHeader>
          
          <Form {...tableForm}>
            <form onSubmit={tableForm.handleSubmit(onTableSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={tableForm.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Table Number" /></FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tableForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Capacity" /></FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={tableForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Location" /></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      <T text="Optional location description within the room" />
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={tableForm.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Room" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select room")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=""><T text="No Room" /></SelectItem>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tableForm.control}
                  name="group_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Group" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select group")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=""><T text="No Group" /></SelectItem>
                          {tableGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={tableForm.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Table Shape" /></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="rectangle" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              <T text="Rectangle" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="circle" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <CircleDot className="h-4 w-4 mr-1" />
                              <T text="Circle" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="square" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <CheckSquare className="h-4 w-4 mr-1" />
                              <T text="Square" />
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddTableOpen(false)}
                >
                  <T text="Cancel" />
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTableMutation.isPending}
                >
                  {createTableMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <T text="Creating..." />
                    </>
                  ) : (
                    <T text="Create Table" />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Table Dialog */}
      <Dialog open={isEditTableOpen} onOpenChange={setIsEditTableOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle><T text="Edit Table" /></DialogTitle>
            <DialogDescription>
              <T text="Update table information." />
            </DialogDescription>
          </DialogHeader>
          
          <Form {...tableForm}>
            <form onSubmit={tableForm.handleSubmit(onTableUpdate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={tableForm.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Table Number" /></FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tableForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Capacity" /></FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={tableForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Location" /></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      <T text="Optional location description within the room" />
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={tableForm.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Room" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select room")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=""><T text="No Room" /></SelectItem>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tableForm.control}
                  name="group_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Group" /></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select group")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=""><T text="No Group" /></SelectItem>
                          {tableGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={tableForm.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Table Shape" /></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="rectangle" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              <T text="Rectangle" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="circle" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <CircleDot className="h-4 w-4 mr-1" />
                              <T text="Circle" />
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="square" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="flex items-center">
                              <CheckSquare className="h-4 w-4 mr-1" />
                              <T text="Square" />
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditTableOpen(false)}
                >
                  <T text="Cancel" />
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateTableMutation.isPending}
                >
                  {updateTableMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <T text="Updating..." />
                    </>
                  ) : (
                    <T text="Update Table" />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Table Dialog */}
      <Dialog open={isDeleteTableOpen} onOpenChange={setIsDeleteTableOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><T text="Delete Table" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this table? This action cannot be undone." />
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTable && (
              <div className="p-4 border rounded-md bg-muted/50">
                <p><strong><T text="Table" />:</strong> {selectedTable.table_number}</p>
                <p><strong><T text="Capacity" />:</strong> {selectedTable.capacity} <T text="seats" /></p>
                <p><strong><T text="Room" />:</strong> {selectedTable.room?.name || "-"}</p>
                <p><strong><T text="Group" />:</strong> {selectedTable.group?.name || "-"}</p>
                <p><strong><T text="Status" />:</strong> {selectedTable.status}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteTableOpen(false)}
            >
              <T text="Cancel" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTable}
              disabled={deleteTableMutation.isPending}
            >
              {deleteTableMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T text="Deleting..." />
                </>
              ) : (
                <T text="Delete Table" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Room Modal */}
      <SideModal
        open={isRoomModalOpen}
        onOpenChange={setIsRoomModalOpen}
        title={selectedRoom ? t("Edit Room") : t("Add New Room")}
        description={selectedRoom 
          ? t("Update room information") 
          : t("Create a new room to organize tables")}
      >
        <Form {...roomForm}>
          <form onSubmit={roomForm.handleSubmit(onRoomSubmit)} className="space-y-6">
            <FormField
              control={roomForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Room Name" /></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={roomForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Description" /></FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    <T text="Optional description for this room" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={roomForm.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel><T text="Active" /></FormLabel>
                    <FormDescription>
                      <T text="Activate or deactivate this room" />
                    </FormDescription>
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
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRoomModalOpen(false)}
              >
                <T text="Cancel" />
              </Button>
              
              <div className="flex space-x-2">
                {selectedRoom && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteRoom(selectedRoom.id)}
                    disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <T text="Delete" />
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
                >
                  {(createRoomMutation.isPending || updateRoomMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedRoom ? <T text="Updating..." /> : <T text="Creating..." />}
                    </>
                  ) : (
                    selectedRoom ? <T text="Update Room" /> : <T text="Create Room" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SideModal>
      
      {/* Group Modal */}
      <SideModal
        open={isGroupModalOpen}
        onOpenChange={setIsGroupModalOpen}
        title={selectedGroup ? t("Edit Group") : t("Add New Group")}
        description={selectedGroup 
          ? t("Update table group information") 
          : t("Create a new table group")}
      >
        <Form {...groupForm}>
          <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-6">
            <FormField
              control={groupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Group Name" /></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={groupForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Description" /></FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    <T text="Optional description for this group" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={groupForm.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Room (Optional)" /></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select room")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value=""><T text="No Room" /></SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <T text="Optionally assign this group to a specific room" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupModalOpen(false)}
              >
                <T text="Cancel" />
              </Button>
              
              <div className="flex space-x-2">
                {selectedGroup && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteGroup(selectedGroup.id)}
                    disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <T text="Delete" />
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                >
                  {(createGroupMutation.isPending || updateGroupMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedGroup ? <T text="Updating..." /> : <T text="Creating..." />}
                    </>
                  ) : (
                    selectedGroup ? <T text="Update Group" /> : <T text="Create Group" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SideModal>
    </Layout>
  );
};

export default TableManagement;
