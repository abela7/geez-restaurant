import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Timer, Utensils, ClipboardList, ClipboardCopy, Ban,
  Trash2, SquarePen, QrCode, Plus, RefreshCw, FileEdit, 
  CheckCircle2, LayoutGrid, Grid3X3, Coffee, Home
} from 'lucide-react';

import {
  getTables,
  updateTableStatus,
  getTableStats
} from "@/services/table/tableService";
import type { Table, TableWithDetails } from "@/services/table/types";

// Mock data for areas/locations since we no longer have rooms
const mockLocations = [
  { id: 'main', name: 'Main Area' },
  { id: 'bar', name: 'Bar Area' },
  { id: 'patio', name: 'Patio' },
  { id: 'private', name: 'Private Room' }
];

interface TableActionProps {
  table: TableWithDetails;
  onSeatGuests: (tableId: string, guestCount: number, server: string) => void;
  onReserveTable: (tableId: string, name: string, time: string) => void;
  onUpdateStatus: (tableId: string, status: Table['status']) => void;
}

// Component for the dialog to seat guests at a table
const SeatGuestsDialog: React.FC<{
  table: TableWithDetails;
  onConfirm: (guestCount: number, server: string) => void;
}> = ({ table, onConfirm }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [server, setServer] = useState<string>("Tigist");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(guestCount, server);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          <T text="Seat Guests" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle><T text="Seat Guests at Table" /> {table.table_number}</DialogTitle>
            <DialogDescription>
              <T text="Enter guest information to seat at this table." />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guest-count" className="text-right">
                <T text="Guests" />
              </Label>
              <Input
                id="guest-count"
                type="number"
                min={1}
                max={table.capacity}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="server" className="text-right">
                <T text="Server" />
              </Label>
              <Select 
                defaultValue={server}
                onValueChange={setServer}
              >
                <SelectTrigger className="col-span-3" id="server">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tigist">Tigist</SelectItem>
                  <SelectItem value="Abebe">Abebe</SelectItem>
                  <SelectItem value="Solomon">Solomon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <T text="Confirm Seating" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component for the dialog to reserve a table
const ReserveTableDialog: React.FC<{
  table: TableWithDetails;
  onConfirm: (name: string, time: string) => void;
}> = ({ table, onConfirm }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [time, setTime] = useState<string>("18:00");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && time) {
      onConfirm(name, time);
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Timer className="mr-2 h-4 w-4" />
          <T text="Reserve Table" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle><T text="Reserve Table" /> {table.table_number}</DialogTitle>
            <DialogDescription>
              <T text="Create a new reservation for this table." />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reserve-name" className="text-right">
                <T text="Name" />
              </Label>
              <Input
                id="reserve-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Guest or group name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reserve-time" className="text-right">
                <T text="Time" />
              </Label>
              <Input
                id="reserve-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <T text="Confirm Reservation" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Table Card Component
const TableCard: React.FC<{ 
  table: TableWithDetails; 
  onClick: () => void;
}> = ({ table, onClick }) => {
  const { t } = useLanguage();
  
  // Status color classes
  const getStatusClasses = (status: Table['status']) => {
    switch(status) {
      case 'available':
        return 'border-green-600 bg-green-50 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'occupied':
        return 'border-red-600 bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'reserved':
        return 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      case 'cleaning':
        return 'border-yellow-600 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      default:
        return 'border-muted-foreground';
    }
  };

  return (
    <div 
      className={`relative border-2 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:opacity-90 transition-opacity ${getStatusClasses(table.status)}`}
      onClick={onClick}
    >
      <div className="text-2xl font-bold mb-1">{t("Table")} {table.table_number}</div>
      <div className="text-sm opacity-80 mb-2">
        <T text="Capacity" />: {table.capacity}
      </div>
      
      {table.status === 'occupied' && table.currentGuests && (
        <div className="text-xs opacity-70">
          {table.occupiedSince && `${table.occupiedSince} · `}{table.currentGuests} <T text="guests" />
        </div>
      )}
      
      {table.status === 'reserved' && (
        <div className="text-xs opacity-70">
          <T text="Reserved" />: {table.reservationTime}
        </div>
      )}

      {/* Location label in top-right corner */}
      {table.location && (
        <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-background/80">
          {table.location}
        </div>
      )}
    </div>
  );
};

// Table Row Component
const TableRow: React.FC<{ 
  table: TableWithDetails; 
  onClick: () => void;
}> = ({ table, onClick }) => {
  const { t } = useLanguage();

  // Status badge component
  const getStatusBadge = (status: Table['status']) => {
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
    <tr className="border-b cursor-pointer hover:bg-muted/50" onClick={onClick}>
      <td className="py-3 pl-4 font-medium">{t("Table")} {table.table_number}</td>
      <td className="py-3">{table.capacity} <T text="guests" /></td>
      <td className="py-3">{table.location || "-"}</td>
      <td className="py-3">{getStatusBadge(table.status)}</td>
      <td className="py-3">
        {table.status === 'occupied' && table.currentGuests && (
          <div className="text-sm">
            {table.currentGuests} <T text="guests" /> · <T text="Since" /> {table.occupiedSince}
          </div>
        )}
        
        {table.status === 'reserved' && (
          <div className="text-sm">
            {table.reservedFor} · {table.reservationTime}
          </div>
        )}
        
        {(table.status === 'available' || table.status === 'cleaning') && (
          <div className="text-sm text-muted-foreground">
            {table.status === 'available' ? <T text="Ready to seat guests" /> : <T text="Being cleaned" />}
          </div>
        )}
      </td>
      <td className="py-3 text-right pr-4">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          <FileEdit size={16} />
        </Button>
      </td>
    </tr>
  );
};

// Main Table Management Component
const TableManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tableView, setTableView] = useState<'grid' | 'list'>('grid');
  const [selectedTable, setSelectedTable] = useState<TableWithDetails | null>(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState<string>("all-tables");

  // Fetch tables
  const { 
    data: tables = [],
    isLoading: isLoadingTables
  } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables
  });

  // Fetch table statistics
  const {
    data: tableStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['tableStats'],
    queryFn: getTableStats
  });

  // Mutation for updating table status
  const updateTableStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Table['status'] }) => updateTableStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['tableStats'] });
      toast({
        title: t("Status Updated"),
        description: t("Table status has been updated successfully")
      });
      setSelectedTable(null);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update table status: ") + error.message,
        variant: "destructive"
      });
    }
  });

  // Enhance tables with additional properties for UI
  const enhancedTables: TableWithDetails[] = tables.map(table => {
    const tableWithDetails: TableWithDetails = { ...table };
    
    // Add more details based on status
    if (table.status === 'occupied') {
      tableWithDetails.currentGuests = Math.floor(Math.random() * table.capacity) + 1;
      tableWithDetails.occupiedSince = new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      tableWithDetails.server = ['Tigist', 'Abebe', 'Solomon'][Math.floor(Math.random() * 3)];
    }
    
    if (table.status === 'reserved') {
      const names = ['Makeda Family', 'Daniel Group', 'Sara Party', 'Abebe & Friends'];
      tableWithDetails.reservedFor = names[Math.floor(Math.random() * names.length)];
      
      // Generate a random time in the next few hours
      const hours = new Date().getHours() + 1 + Math.floor(Math.random() * 4);
      const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      tableWithDetails.reservationTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return tableWithDetails;
  });

  // Filter tables based on the current tab and location filter
  const filteredTables = enhancedTables.filter(table => {
    // Filter by status tab
    if (currentTab !== 'all-tables' && table.status !== currentTab) {
      return false;
    }
    
    // Filter by location
    if (selectedLocationFilter !== 'all' && table.location !== selectedLocationFilter) {
      return false;
    }
    
    return true;
  });

  // Handle seating guests
  const handleSeatGuests = (tableId: string, guestCount: number, server: string) => {
    // Update table status to 'occupied'
    updateTableStatusMutation.mutate({ id: tableId, status: 'occupied' });
    
    // Show toast notification
    toast({
      title: t("Guests Seated"),
      description: t("Guests have been seated at the table")
    });
  };

  // Handle reserving a table
  const handleReserveTable = (tableId: string, name: string, time: string) => {
    // Update table status to 'reserved'
    updateTableStatusMutation.mutate({ id: tableId, status: 'reserved' });
    
    // Show toast notification
    toast({
      title: t("Table Reserved"),
      description: t("Table has been reserved successfully")
    });
  };

  // Loading state
  const isLoading = isLoadingTables || isLoadingStats;
  
  if (isLoading) {
    return (
      <Layout interface="waiter">
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
    <Layout interface="waiter">
      <PageHeader 
        title={t("Table Management")}
        description={t("Manage restaurant seating and reservations")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTableView(tableView === 'grid' ? 'list' : 'grid')}>
              {tableView === 'grid' ? (
                <>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <T text="List View" />
                </>
              ) : (
                <>
                  <Utensils className="mr-2 h-4 w-4" />
                  <T text="Grid View" />
                </>
              )}
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="New Reservation" />
            </Button>
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

      {/* Location filter */}
      <div className="mb-4">
        <Select value={selectedLocationFilter} onValueChange={setSelectedLocationFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("Filter by location")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                <T text="All Areas" />
              </div>
            </SelectItem>
            {mockLocations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center">
                  {location.name === 'Main Area' && <LayoutGrid className="mr-2 h-4 w-4" />}
                  {location.name === 'Bar Area' && <Utensils className="mr-2 h-4 w-4" />}
                  {location.name === 'Patio' && <Coffee className="mr-2 h-4 w-4" />}
                  {location.name === 'Private Room' && <Grid3X3 className="mr-2 h-4 w-4" />}
                  {location.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all-tables">
            <T text="All Tables" />
          </TabsTrigger>
          <TabsTrigger value="available">
            <T text="Available" />
          </TabsTrigger>
          <TabsTrigger value="occupied">
            <T text="Occupied" />
          </TabsTrigger>
          <TabsTrigger value="reserved">
            <T text="Reserved" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-tables">
          <Card>
            <CardHeader>
              <CardTitle><T text="Restaurant Floor Plan" /></CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {tableView === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredTables.map(table => (
                    <TableCard 
                      key={table.id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm">
                        <th className="pb-3 pl-4"><T text="Table" /></th>
                        <th className="pb-3"><T text="Capacity" /></th>
                        <th className="pb-3"><T text="Area" /></th>
                        <th className="pb-3"><T text="Status" /></th>
                        <th className="pb-3"><T text="Details" /></th>
                        <th className="pb-3 text-right pr-4"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.map(table => (
                        <TableRow 
                          key={table.id}
                          table={table}
                          onClick={() => setSelectedTable(table)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredTables.length === 0 && (
                <div className="text-center py-12">
                  <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Tables Found" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="No tables match your current filters." />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle><T text="Available Tables" /></CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {tableView === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredTables.map(table => (
                    <TableCard 
                      key={table.id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm">
                        <th className="pb-3 pl-4"><T text="Table" /></th>
                        <th className="pb-3"><T text="Capacity" /></th>
                        <th className="pb-3"><T text="Area" /></th>
                        <th className="pb-3"><T text="Status" /></th>
                        <th className="pb-3"><T text="Details" /></th>
                        <th className="pb-3 text-right pr-4"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.map(table => (
                        <TableRow 
                          key={table.id}
                          table={table}
                          onClick={() => setSelectedTable(table)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {filteredTables.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Available Tables" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="All tables are currently occupied, reserved, or being cleaned." />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupied">
          <Card>
            <CardHeader>
              <CardTitle><T text="Occupied Tables" /></CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {tableView === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredTables.map(table => (
                    <TableCard 
                      key={table.id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm">
                        <th className="pb-3 pl-4"><T text="Table" /></th>
                        <th className="pb-3"><T text="Capacity" /></th>
                        <th className="pb-3"><T text="Area" /></th>
                        <th className="pb-3"><T text="Status" /></th>
                        <th className="pb-3"><T text="Details" /></th>
                        <th className="pb-3 text-right pr-4"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.map(table => (
                        <TableRow 
                          key={table.id}
                          table={table}
                          onClick={() => setSelectedTable(table)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {filteredTables.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Occupied Tables" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="There are currently no guests seated at any tables." />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reserved">
          <Card>
            <CardHeader>
              <CardTitle><T text="Reserved Tables" /></CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {tableView === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredTables.map(table => (
                    <TableCard 
                      key={table.id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm">
                        <th className="pb-3 pl-4"><T text="Table" /></th>
                        <th className="pb-3"><T text="Capacity" /></th>
                        <th className="pb-3"><T text="Area" /></th>
                        <th className="pb-3"><T text="Status" /></th>
                        <th className="pb-3"><T text="Details" /></th>
                        <th className="pb-3 text-right pr-4"><T text="Actions" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTables.map(table => (
                        <TableRow 
                          key={table.id}
                          table={table}
                          onClick={() => setSelectedTable(table)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {filteredTables.length === 0 && (
                <div className="text-center py-12">
                  <Timer className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <T text="No Reserved Tables" />
                  </h3>
                  <p className="text-muted-foreground">
                    <T text="There are currently no upcoming reservations." />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Table Detail Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTable && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span><T text="Table" /> {selectedTable.table_number}</span>
                  <Badge 
                    variant={
                      selectedTable.status === 'available' ? 'default' : 
                      selectedTable.status === 'occupied' ? 'destructive' : 
                      selectedTable.status === 'reserved' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  <T text="Capacity" />: {selectedTable.capacity} <T text="guests" /> | {selectedTable.location || t("No location assigned")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {selectedTable.status === 'occupied' && selectedTable.currentGuests && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label><T text="Guests" /></Label>
                        <div className="font-medium mt-1">{selectedTable.currentGuests}</div>
                      </div>
                      <div>
                        <Label><T text="Server" /></Label>
                        <div className="font-medium mt-1">{selectedTable.server}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label><T text="Seated at" /></Label>
                        <div className="font-medium mt-1">{selectedTable.occupiedSince}</div>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedTable.status === 'reserved' && (
                  <>
                    <div>
                      <Label><T text="Reserved for" /></Label>
                      <div className="font-medium mt-1">{selectedTable.reservedFor}</div>
                    </div>
                    <div>
                      <Label><T text="Reservation time" /></Label>
                      <div className="font-medium mt-1">{selectedTable.reservationTime}</div>
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedTable.status === 'available' && (
                  <>
                    <SeatGuestsDialog 
                      table={selectedTable}
                      onConfirm={(guestCount, server) => {
                        handleSeatGuests(selectedTable.id, guestCount, server);
                      }}
                    />
                    <ReserveTableDialog 
                      table={selectedTable}
                      onConfirm={(name, time) => {
                        handleReserveTable(selectedTable.id, name, time);
                      }}
                    />
                    <Button 
                      variant="outline"
                      onClick={() => {
                        updateTableStatusMutation.mutate({ id: selectedTable.id, status: 'cleaning' });
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <T text="Mark for Cleaning" />
                    </Button>
                  </>
                )}
                
                {selectedTable.status === 'occupied' && (
                  <>
                    <Button
                      onClick={() => {
                        updateTableStatusMutation.mutate({ id: selectedTable.id, status: 'cleaning' });
                      }}
                    >
                      <T text="Mark as Vacant" />
                    </Button>
                    <Button variant="outline">
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      <T text="Print Check" />
                    </Button>
                    <Button variant="outline">
                      <QrCode className="mr-2 h-4 w-4" />
                      <T text="Show QR Code" />
                    </Button>
                  </>
                )}
                
                {selectedTable.status === 'reserved' && (
                  <>
                    <SeatGuestsDialog 
                      table={selectedTable}
                      onConfirm={(guestCount, server) => {
                        handleSeatGuests(selectedTable.id, guestCount, server);
                      }}
                    />
                    <Button 
                      variant="outline"
                      onClick={() => {
                        updateTableStatusMutation.mutate({ id: selectedTable.id, status: 'available' });
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      <T text="Cancel Reservation" />
                    </Button>
                  </>
                )}
                
                {selectedTable.status === 'cleaning' && (
                  <Button
                    onClick={() => {
                      updateTableStatusMutation.mutate({ id: selectedTable.id, status: 'available' });
                    }}
                  >
                    <T text="Mark as Available" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TableManagement;
