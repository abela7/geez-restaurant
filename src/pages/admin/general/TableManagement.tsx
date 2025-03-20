
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Filter, Grid3X3, LayoutGrid, Users, Coffee, Clock, Edit, Trash2, Utensils, Timer, RefreshCw, CheckCircle2, LayoutDashboard } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import {
  getRooms,
  getTables,
  getReservations,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
  createReservation,
  updateReservation,
  deleteReservation,
  createRoom,
  updateRoom,
  deleteRoom,
  getTableStats
} from "@/services/table/tableService";
import type { Table as TableType, Room, Reservation } from "@/services/table/types";

const TableManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [newTableDialogOpen, setNewTableDialogOpen] = useState(false);
  const [newReservationDialogOpen, setNewReservationDialogOpen] = useState(false);
  const [newRoomDialogOpen, setNewRoomDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TableType | Room | Reservation | null>(null);
  const [currentTab, setCurrentTab] = useState("tables");
  
  // Form state
  const [newTable, setNewTable] = useState({
    table_number: "",
    capacity: "4",
    room_id: "",
    location: ""
  });
  
  const [newReservation, setNewReservation] = useState({
    customer_name: "",
    contact_number: "",
    table_id: "",
    reservation_date: new Date().toISOString().split('T')[0],
    start_time: "18:00",
    end_time: "20:00",
    party_size: "2",
    special_requests: "",
    status: "confirmed"
  });
  
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    active: true
  });

  // Queries
  const { 
    data: rooms = [],
    isLoading: isLoadingRooms 
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  });

  const { 
    data: tables = [],
    isLoading: isLoadingTables 
  } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables
  });

  const { 
    data: reservations = [],
    isLoading: isLoadingReservations 
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations
  });

  const {
    data: tableStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['tableStats'],
    queryFn: getTableStats
  });

  // Mutations
  const createTableMutation = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Created"),
        description: t("New table has been created successfully.")
      });
      setNewTableDialogOpen(false);
      resetNewTable();
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
    mutationFn: ({ id, data }: { id: string, data: Partial<TableType> }) => updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: t("Table Updated"),
        description: t("Table has been updated successfully.")
      });
      setEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const updateTableStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: TableType['status'] }) => updateTableStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Status Updated"),
        description: t("Table status has been updated successfully.")
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table status: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Table Deleted"),
        description: t("Table has been deleted successfully.")
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete table: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const createReservationMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: t("Reservation Created"),
        description: t("New reservation has been created successfully.")
      });
      setNewReservationDialogOpen(false);
      resetNewReservation();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create reservation: ") + error.message,
        variant: "destructive"
      });
    }
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: t("Room Created"),
        description: t("New room has been created successfully.")
      });
      setNewRoomDialogOpen(false);
      resetNewRoom();
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to create room: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Filter tables
  const filteredTables = tables.filter(table => {
    const matchesSearch = 
      table.table_number.toString().includes(searchTerm) || 
      (table.room?.name && table.room.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (table.location && table.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    const matchesLocation = locationFilter === "all" || 
      (table.room_id && table.room_id === locationFilter) || 
      (table.location && table.location.toLowerCase() === locationFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  // Helper functions
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "reserved":
        return "secondary";
      case "cleaning":
        return "outline";
      default:
        return "outline";
    }
  };
  
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tableNumberInt = parseInt(newTable.table_number);
    if (isNaN(tableNumberInt)) {
      toast({
        title: t("Invalid Input"),
        description: t("Table number must be a valid number."),
        variant: "destructive"
      });
      return;
    }
    
    createTableMutation.mutate({
      table_number: tableNumberInt,
      capacity: parseInt(newTable.capacity),
      status: 'available',
      room_id: newTable.room_id || undefined,
      location: newTable.location || undefined
    });
  };
  
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    createReservationMutation.mutate({
      customer_name: newReservation.customer_name,
      contact_number: newReservation.contact_number,
      table_id: newReservation.table_id || undefined,
      reservation_date: newReservation.reservation_date,
      start_time: newReservation.start_time,
      end_time: newReservation.end_time,
      party_size: parseInt(newReservation.party_size),
      special_requests: newReservation.special_requests || undefined,
      status: newReservation.status as 'confirmed' | 'pending' | 'cancelled' | 'completed'
    });
    
    // If table is selected, mark it as reserved
    if (newReservation.table_id) {
      updateTableStatusMutation.mutate({
        id: newReservation.table_id,
        status: 'reserved'
      });
    }
  };
  
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    createRoomMutation.mutate({
      name: newRoom.name,
      description: newRoom.description,
      active: newRoom.active
    });
  };
  
  const confirmDeleteTable = (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this table?"))) {
      deleteTableMutation.mutate(id);
    }
  };

  const resetNewTable = () => {
    setNewTable({
      table_number: "",
      capacity: "4",
      room_id: "",
      location: ""
    });
  };
  
  const resetNewReservation = () => {
    setNewReservation({
      customer_name: "",
      contact_number: "",
      table_id: "",
      reservation_date: new Date().toISOString().split('T')[0],
      start_time: "18:00",
      end_time: "20:00",
      party_size: "2",
      special_requests: "",
      status: "confirmed"
    });
  };
  
  const resetNewRoom = () => {
    setNewRoom({
      name: "",
      description: "",
      active: true
    });
  };
  
  const handleEditItem = (item: TableType | Room | Reservation) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };
  
  const isLoading = isLoadingRooms || isLoadingTables || isLoadingReservations || isLoadingStats;
  
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

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Table Management" />}
        description={<T text="Manage restaurant tables, seating arrangements, and reservations" />}
        icon={<LayoutGrid size={28} />}
        actions={
          <div className="flex gap-2">
            <Dialog open={newTableDialogOpen} onOpenChange={setNewTableDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Table" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreateTable}>
                  <DialogHeader>
                    <DialogTitle><T text="Add New Table" /></DialogTitle>
                    <DialogDescription>
                      <T text="Create a new table for your restaurant layout" />
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tableNumber"><T text="Table Number" /></Label>
                      <Input 
                        id="tableNumber" 
                        value={newTable.table_number}
                        onChange={(e) => setNewTable({...newTable, table_number: e.target.value})}
                        placeholder={t("e.g., 11")}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="capacity"><T text="Seating Capacity" /></Label>
                        <Select 
                          value={newTable.capacity}
                          onValueChange={(value) => setNewTable({...newTable, capacity: value})}
                          required
                        >
                          <SelectTrigger id="capacity">
                            <SelectValue placeholder={t("Select capacity")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                              <SelectItem key={num} value={String(num)}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="room"><T text="Room" /></Label>
                        <Select 
                          value={newTable.room_id}
                          onValueChange={(value) => setNewTable({...newTable, room_id: value})}
                        >
                          <SelectTrigger id="room">
                            <SelectValue placeholder={t("Select room")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=""><T text="No room selected" /></SelectItem>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="location"><T text="Location (Description)" /></Label>
                      <Input 
                        id="location" 
                        value={newTable.location}
                        onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                        placeholder={t("e.g., Near window")}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setNewTableDialogOpen(false)}>
                      <T text="Cancel" />
                    </Button>
                    <Button type="submit">
                      <T text="Create Table" />
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={newReservationDialogOpen} onOpenChange={setNewReservationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  <T text="Add Reservation" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleCreateReservation}>
                  <DialogHeader>
                    <DialogTitle><T text="Create New Reservation" /></DialogTitle>
                    <DialogDescription>
                      <T text="Book a table for a customer" />
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customerName"><T text="Customer Name" /></Label>
                      <Input 
                        id="customerName" 
                        value={newReservation.customer_name}
                        onChange={(e) => setNewReservation({...newReservation, customer_name: e.target.value})}
                        placeholder={t("Enter customer name")}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="contactNumber"><T text="Contact Number" /></Label>
                      <Input 
                        id="contactNumber" 
                        value={newReservation.contact_number}
                        onChange={(e) => setNewReservation({...newReservation, contact_number: e.target.value})}
                        placeholder={t("Enter contact number")}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date"><T text="Date" /></Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={newReservation.reservation_date}
                          onChange={(e) => setNewReservation({...newReservation, reservation_date: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="guests"><T text="Number of Guests" /></Label>
                        <Select 
                          value={newReservation.party_size}
                          onValueChange={(value) => setNewReservation({...newReservation, party_size: value})}
                          required
                        >
                          <SelectTrigger id="guests">
                            <SelectValue placeholder={t("Select number of guests")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                              <SelectItem key={num} value={String(num)}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startTime"><T text="Start Time" /></Label>
                        <Input 
                          id="startTime" 
                          type="time" 
                          value={newReservation.start_time}
                          onChange={(e) => setNewReservation({...newReservation, start_time: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="endTime"><T text="End Time (Expected)" /></Label>
                        <Input 
                          id="endTime" 
                          type="time" 
                          value={newReservation.end_time}
                          onChange={(e) => setNewReservation({...newReservation, end_time: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="reservationTable"><T text="Table" /></Label>
                      <Select 
                        value={newReservation.table_id}
                        onValueChange={(value) => setNewReservation({...newReservation, table_id: value})}
                      >
                        <SelectTrigger id="reservationTable">
                          <SelectValue placeholder={t("Select table")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=""><T text="Auto-assign" /></SelectItem>
                          {tables
                            .filter(table => table.status === "available")
                            .map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                {t("Table")} {table.table_number} ({table.capacity} <T text="seats" />)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="specialRequests"><T text="Special Requests" /></Label>
                      <Textarea 
                        id="specialRequests" 
                        value={newReservation.special_requests}
                        onChange={(e) => setNewReservation({...newReservation, special_requests: e.target.value})}
                        placeholder={t("Any special requests or notes")}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setNewReservationDialogOpen(false)}>
                      <T text="Cancel" />
                    </Button>
                    <Button type="submit">
                      <T text="Create Reservation" />
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={newRoomDialogOpen} onOpenChange={setNewRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <T text="Add Room" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreateRoom}>
                  <DialogHeader>
                    <DialogTitle><T text="Add New Room" /></DialogTitle>
                    <DialogDescription>
                      <T text="Create a new room for your restaurant layout" />
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="roomName"><T text="Room Name" /></Label>
                      <Input 
                        id="roomName" 
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                        placeholder={t("e.g., VIP Lounge")}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="roomDescription"><T text="Description" /></Label>
                      <Textarea 
                        id="roomDescription" 
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                        placeholder={t("Room description")}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setNewRoomDialogOpen(false)}>
                      <T text="Cancel" />
                    </Button>
                    <Button type="submit">
                      <T text="Create Room" />
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

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
              <Timer className="mr-2 h-5 w-5 text-blue-600" />
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

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search tables...")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("Filter by status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="available"><T text="Available" /></SelectItem>
              <SelectItem value="occupied"><T text="Occupied" /></SelectItem>
              <SelectItem value="reserved"><T text="Reserved" /></SelectItem>
              <SelectItem value="cleaning"><T text="Cleaning" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all" onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("Filter by room")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Rooms" /></SelectItem>
              {rooms.map(room => (
                <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="tables">
            <LayoutGrid className="mr-2 h-4 w-4" />
            <T text="Tables" />
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Clock className="mr-2 h-4 w-4" />
            <T text="Reservations" />
          </TabsTrigger>
          <TabsTrigger value="rooms">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <T text="Rooms" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTables.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{t("Table")} {table.table_number}</CardTitle>
                      <Badge 
                        variant={getStatusBadgeVariant(table.status) as any}
                        className="ml-2"
                      >
                        {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground"><T text="Capacity" />:</span>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{table.capacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground"><T text="Room" />:</span>
                        <span>{table.room?.name || table.location || t("Not assigned")}</span>
                      </div>
                      <div className="flex justify-end mt-2 pt-2 border-t border-border">
                        <div className="space-x-1">
                          {table.status === 'available' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-blue-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'reserved'})}
                            >
                              <Timer className="h-4 w-4 mr-1" />
                              <T text="Reserve" />
                            </Button>
                          )}
                          
                          {table.status === 'available' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-red-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'occupied'})}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              <T text="Occupy" />
                            </Button>
                          )}
                          
                          {(table.status === 'occupied' || table.status === 'reserved') && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-yellow-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'cleaning'})}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              <T text="Clean" />
                            </Button>
                          )}
                          
                          {table.status === 'cleaning' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-green-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'available'})}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <T text="Available" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => handleEditItem(table)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            onClick={() => confirmDeleteTable(table.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTables.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No tables found" />
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    <T text="Try adjusting your search or filters to find what you're looking for, or add a new table." />
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Table #" /></TableHead>
                    <TableHead><T text="Capacity" /></TableHead>
                    <TableHead><T text="Room" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium">{table.table_number}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>{table.room?.name || table.location || t("Not assigned")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(table.status) as any}>
                          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {table.status === 'available' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'reserved'})}
                              title={t("Reserve")}
                            >
                              <Timer className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {table.status === 'available' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'occupied'})}
                              title={t("Occupy")}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(table.status === 'occupied' || table.status === 'reserved') && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-yellow-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'cleaning'})}
                              title={t("Mark for cleaning")}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {table.status === 'cleaning' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-green-600"
                              onClick={() => updateTableStatusMutation.mutate({id: table.id, status: 'available'})}
                              title={t("Mark as available")}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditItem(table)}
                            title={t("Edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => confirmDeleteTable(table.id)}
                            title={t("Delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTables.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No tables found" />
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    <T text="Try adjusting your search or filters to find what you're looking for, or add a new table." />
                  </p>
                </div>
              )}
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Customer" /></TableHead>
                  <TableHead><T text="Table" /></TableHead>
                  <TableHead><T text="Date" /></TableHead>
                  <TableHead><T text="Time" /></TableHead>
                  <TableHead><T text="Guests" /></TableHead>
                  <TableHead><T text="Contact" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.customer_name}</TableCell>
                    <TableCell>
                      {reservation.table_id ? 
                        tables.find(t => t.id === reservation.table_id)?.table_number : 
                        <Badge variant="outline"><T text="Unassigned" /></Badge>
                      }
                    </TableCell>
                    <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
                    <TableCell>{reservation.start_time}</TableCell>
                    <TableCell>{reservation.party_size}</TableCell>
                    <TableCell>{reservation.contact_number}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={reservation.status === "confirmed" ? "default" : "secondary"}
                      >
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {reservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No reservations found" />
                </h3>
                <p className="text-muted-foreground max-w-md">
                  <T text="There are no upcoming reservations. Add a new reservation to get started." />
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="rooms">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Name" /></TableHead>
                  <TableHead><T text="Description" /></TableHead>
                  <TableHead><T text="Tables" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const roomTables = tables.filter(t => t.room_id === room.id);
                  return (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.description}</TableCell>
                      <TableCell>{roomTables.length}</TableCell>
                      <TableCell>
                        <Badge variant={room.active ? "default" : "outline"}>
                          {room.active ? t("Active") : t("Inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {rooms.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No rooms found" />
                </h3>
                <p className="text-muted-foreground max-w-md">
                  <T text="There are no rooms defined yet. Add a room to organize your tables." />
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TableManagement;
