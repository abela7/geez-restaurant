
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Filter, Grid3X3, LayoutGrid, Users, Coffee, Clock, Edit, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample tables data
const tables = [
  { id: 1, name: "Table 1", capacity: 4, location: "Main Area", status: "Available" },
  { id: 2, name: "Table 2", capacity: 2, location: "Main Area", status: "Occupied" },
  { id: 3, name: "Table 3", capacity: 6, location: "Main Area", status: "Reserved" },
  { id: 4, name: "Table 4", capacity: 4, location: "Window", status: "Available" },
  { id: 5, name: "Table 5", capacity: 8, location: "Window", status: "Cleaning" },
  { id: 6, name: "Table 6", capacity: 4, location: "Outdoor", status: "Available" },
  { id: 7, name: "Table 7", capacity: 2, location: "Outdoor", status: "Occupied" },
  { id: 8, name: "Table 8", capacity: 6, location: "Private Room", status: "Reserved" },
  { id: 9, name: "Table 9", capacity: 4, location: "Bar", status: "Available" },
  { id: 10, name: "Table 10", capacity: 2, location: "Bar", status: "Occupied" },
];

// Sample reservations data
const reservations = [
  { id: 1, customerName: "Abebe Kebede", tableId: 3, date: "2023-07-15", time: "18:00", guests: 5, contact: "+251911234567", status: "Confirmed" },
  { id: 2, customerName: "Sara Mengistu", tableId: 8, date: "2023-07-15", time: "19:30", guests: 4, contact: "+251922345678", status: "Confirmed" },
  { id: 3, customerName: "Dawit Tadesse", tableId: null, date: "2023-07-16", time: "20:00", guests: 6, contact: "+251933456789", status: "Pending" },
];

const TableManagement = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [newTableDialogOpen, setNewTableDialogOpen] = useState(false);
  const [newReservationDialogOpen, setNewReservationDialogOpen] = useState(false);
  
  // Filter tables based on search term, status, and location
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || table.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === "all" || table.location.toLowerCase() === locationFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "success";
      case "occupied":
        return "destructive";
      case "reserved":
        return "warning";
      case "cleaning":
        return "secondary";
      default:
        return "outline";
    }
  };
  
  // New table form state
  const [newTable, setNewTable] = useState({
    name: "",
    capacity: "4",
    location: "Main Area"
  });
  
  // New reservation form state
  const [newReservation, setNewReservation] = useState({
    customerName: "",
    tableId: "",
    date: "",
    time: "",
    guests: "2",
    contact: "",
    notes: ""
  });
  
  const handleCreateTable = () => {
    // Add logic to create a table here
    setNewTableDialogOpen(false);
    // Reset form
    setNewTable({
      name: "",
      capacity: "4",
      location: "Main Area"
    });
  };
  
  const handleCreateReservation = () => {
    // Add logic to create a reservation here
    setNewReservationDialogOpen(false);
    // Reset form
    setNewReservation({
      customerName: "",
      tableId: "",
      date: "",
      time: "",
      guests: "2",
      contact: "",
      notes: ""
    });
  };
  
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
                <DialogHeader>
                  <DialogTitle><T text="Add New Table" /></DialogTitle>
                  <DialogDescription>
                    <T text="Create a new table for your restaurant layout" />
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tableName"><T text="Table Name" /></Label>
                    <Input 
                      id="tableName" 
                      value={newTable.name}
                      onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                      placeholder={t("e.g., Table 11")}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="capacity"><T text="Seating Capacity" /></Label>
                      <Select 
                        value={newTable.capacity}
                        onValueChange={(value) => setNewTable({...newTable, capacity: value})}
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
                      <Label htmlFor="location"><T text="Location" /></Label>
                      <Select 
                        value={newTable.location}
                        onValueChange={(value) => setNewTable({...newTable, location: value})}
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder={t("Select location")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Area"><T text="Main Area" /></SelectItem>
                          <SelectItem value="Window"><T text="Window" /></SelectItem>
                          <SelectItem value="Outdoor"><T text="Outdoor" /></SelectItem>
                          <SelectItem value="Private Room"><T text="Private Room" /></SelectItem>
                          <SelectItem value="Bar"><T text="Bar" /></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewTableDialogOpen(false)}>
                    <T text="Cancel" />
                  </Button>
                  <Button onClick={handleCreateTable}>
                    <T text="Create Table" />
                  </Button>
                </DialogFooter>
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
                      value={newReservation.customerName}
                      onChange={(e) => setNewReservation({...newReservation, customerName: e.target.value})}
                      placeholder={t("Enter customer name")}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date"><T text="Date" /></Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={newReservation.date}
                        onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="time"><T text="Time" /></Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={newReservation.time}
                        onChange={(e) => setNewReservation({...newReservation, time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reservationTable"><T text="Table" /></Label>
                      <Select 
                        value={newReservation.tableId}
                        onValueChange={(value) => setNewReservation({...newReservation, tableId: value})}
                      >
                        <SelectTrigger id="reservationTable">
                          <SelectValue placeholder={t("Select table")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=""><T text="Auto-assign" /></SelectItem>
                          {tables
                            .filter(table => table.status === "Available")
                            .map((table) => (
                              <SelectItem key={table.id} value={String(table.id)}>
                                {table.name} ({table.capacity} <T text="seats" />)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="guests"><T text="Number of Guests" /></Label>
                      <Select 
                        value={newReservation.guests}
                        onValueChange={(value) => setNewReservation({...newReservation, guests: value})}
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact"><T text="Contact Number" /></Label>
                    <Input 
                      id="contact" 
                      value={newReservation.contact}
                      onChange={(e) => setNewReservation({...newReservation, contact: e.target.value})}
                      placeholder={t("Enter contact number")}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewReservationDialogOpen(false)}>
                    <T text="Cancel" />
                  </Button>
                  <Button onClick={handleCreateReservation}>
                    <T text="Create Reservation" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

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
              <SelectValue placeholder={t("Filter by location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Locations" /></SelectItem>
              <SelectItem value="main area"><T text="Main Area" /></SelectItem>
              <SelectItem value="window"><T text="Window" /></SelectItem>
              <SelectItem value="outdoor"><T text="Outdoor" /></SelectItem>
              <SelectItem value="private room"><T text="Private Room" /></SelectItem>
              <SelectItem value="bar"><T text="Bar" /></SelectItem>
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
      
      <Tabs defaultValue="tables">
        <TabsList className="mb-4">
          <TabsTrigger value="tables">
            <LayoutGrid className="mr-2 h-4 w-4" />
            <T text="Tables" />
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Clock className="mr-2 h-4 w-4" />
            <T text="Reservations" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTables.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{table.name}</CardTitle>
                      <Badge 
                        variant={getStatusBadgeVariant(table.status) as any}
                        className="ml-2"
                      >
                        {table.status}
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
                        <span className="text-muted-foreground"><T text="Location" />:</span>
                        <span>{table.location}</span>
                      </div>
                      <div className="flex justify-end mt-2 pt-2 border-t border-border">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Table ID" /></TableHead>
                    <TableHead><T text="Name" /></TableHead>
                    <TableHead><T text="Capacity" /></TableHead>
                    <TableHead><T text="Location" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>{table.id}</TableCell>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>{table.location}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(table.status) as any}>
                          {table.status}
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
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="ID" /></TableHead>
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
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell className="font-medium">{reservation.customerName}</TableCell>
                    <TableCell>
                      {reservation.tableId 
                        ? tables.find(t => t.id === reservation.tableId)?.name 
                        : <Badge variant="outline"><T text="Unassigned" /></Badge>
                      }
                    </TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.guests}</TableCell>
                    <TableCell>{reservation.contact}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={reservation.status === "Confirmed" ? "success" : "warning"}
                      >
                        {reservation.status}
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
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TableManagement;
