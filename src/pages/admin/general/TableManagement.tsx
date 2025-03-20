
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TableProperties, Plus, Filter, Search, CircleUser, Users, 
  CheckCircle2, XCircle, ChevronsUpDown, Edit, Trash2 
} from 'lucide-react';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
type TableArea = 'main' | 'outdoor' | 'private' | 'bar';

interface TableCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
}

interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  category: string;
  area: TableArea;
  room?: string;
  lastUpdated: string;
}

const sampleCategories: TableCategory[] = [
  { id: '1', name: 'Standard', description: 'Regular tables for everyday dining', color: '#6366f1' },
  { id: '2', name: 'Premium', description: 'Better located tables with more space', color: '#ec4899' },
  { id: '3', name: 'Family', description: 'Larger tables suitable for families with children', color: '#f97316' },
  { id: '4', name: 'Booth', description: 'Private booth seating for intimate dining', color: '#14b8a6' },
  { id: '5', name: 'Bar', description: 'High seating at the bar counter', color: '#a855f7' },
];

const sampleRooms: Room[] = [
  { id: '1', name: 'Main Dining', description: 'Main dining area of the restaurant', capacity: 40 },
  { id: '2', name: 'Outdoor Patio', description: 'Open-air seating with garden views', capacity: 24 },
  { id: '3', name: 'Private Room 1', description: 'Small private dining room for intimate events', capacity: 12 },
  { id: '4', name: 'Bar Area', description: 'Seating around the main bar', capacity: 15 },
  { id: '5', name: 'VIP Section', description: 'Exclusive area for VIP guests', capacity: 8 },
];

const sampleTables: RestaurantTable[] = [
  { 
    id: '1', 
    number: 'T-01', 
    capacity: 4, 
    status: 'available', 
    category: 'Standard', 
    area: 'main',
    room: 'Main Dining',
    lastUpdated: '2023-09-14T10:30:00Z'
  },
  { 
    id: '2', 
    number: 'T-02', 
    capacity: 2, 
    status: 'occupied', 
    category: 'Premium', 
    area: 'main',
    room: 'Main Dining',
    lastUpdated: '2023-09-14T11:15:00Z'
  },
  { 
    id: '3', 
    number: 'T-03', 
    capacity: 6, 
    status: 'reserved', 
    category: 'Family', 
    area: 'main',
    room: 'Main Dining',
    lastUpdated: '2023-09-14T09:45:00Z'
  },
  { 
    id: '4', 
    number: 'B-01', 
    capacity: 4, 
    status: 'available', 
    category: 'Booth', 
    area: 'main',
    room: 'Main Dining',
    lastUpdated: '2023-09-14T08:30:00Z'
  },
  { 
    id: '5', 
    number: 'O-01', 
    capacity: 4, 
    status: 'available', 
    category: 'Standard', 
    area: 'outdoor',
    room: 'Outdoor Patio',
    lastUpdated: '2023-09-14T10:00:00Z'
  },
  { 
    id: '6', 
    number: 'P-01', 
    capacity: 8, 
    status: 'reserved', 
    category: 'Premium', 
    area: 'private',
    room: 'Private Room 1',
    lastUpdated: '2023-09-14T12:00:00Z'
  },
  { 
    id: '7', 
    number: 'BAR-01', 
    capacity: 2, 
    status: 'occupied', 
    category: 'Bar', 
    area: 'bar',
    room: 'Bar Area',
    lastUpdated: '2023-09-14T13:20:00Z'
  },
  { 
    id: '8', 
    number: 'BAR-02', 
    capacity: 2, 
    status: 'maintenance', 
    category: 'Bar', 
    area: 'bar',
    room: 'Bar Area',
    lastUpdated: '2023-09-14T09:10:00Z'
  },
  { 
    id: '9', 
    number: 'VIP-01', 
    capacity: 4, 
    status: 'available', 
    category: 'Premium', 
    area: 'private',
    room: 'VIP Section',
    lastUpdated: '2023-09-14T11:45:00Z'
  },
];

const getStatusColor = (status: TableStatus): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'occupied':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'reserved':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getStatusIcon = (status: TableStatus): React.ReactNode => {
  switch (status) {
    case 'available':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'occupied':
      return <Users className="h-4 w-4" />;
    case 'reserved':
      return <CircleUser className="h-4 w-4" />;
    case 'maintenance':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const TableManagement: React.FC = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<RestaurantTable[]>(sampleTables);
  const [categories, setCategories] = useState<TableCategory[]>(sampleCategories);
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false);
  
  const [newTable, setNewTable] = useState<Partial<RestaurantTable>>({
    number: '',
    capacity: 4,
    status: 'available',
    category: 'Standard',
    area: 'main'
  });
  
  const [newCategory, setNewCategory] = useState<Partial<TableCategory>>({
    name: '',
    description: '',
    color: '#6366f1'
  });
  
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    description: '',
    capacity: 10
  });

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (table.room && table.room.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    const matchesArea = areaFilter === 'all' || table.area === areaFilter;
    const matchesCategory = categoryFilter === 'all' || table.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesArea && matchesCategory;
  });

  const handleCreateTable = () => {
    if (!newTable.number || !newTable.category || !newTable.area) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const createdTable: RestaurantTable = {
      id: (tables.length + 1).toString(),
      number: newTable.number || '',
      capacity: newTable.capacity || 4,
      status: newTable.status as TableStatus || 'available',
      category: newTable.category || 'Standard',
      area: newTable.area as TableArea || 'main',
      room: newTable.room,
      lastUpdated: new Date().toISOString()
    };

    setTables([createdTable, ...tables]);
    setIsNewTableDialogOpen(false);
    setNewTable({
      number: '',
      capacity: 4,
      status: 'available',
      category: 'Standard',
      area: 'main'
    });

    toast({
      title: "Table Created",
      description: `Table "${createdTable.number}" has been created successfully`
    });
  };

  const handleCreateCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a category name",
        variant: "destructive"
      });
      return;
    }

    const createdCategory: TableCategory = {
      id: (categories.length + 1).toString(),
      name: newCategory.name || '',
      description: newCategory.description || '',
      color: newCategory.color || '#6366f1'
    };

    setCategories([...categories, createdCategory]);
    setIsNewCategoryDialogOpen(false);
    setNewCategory({
      name: '',
      description: '',
      color: '#6366f1'
    });

    toast({
      title: "Category Created",
      description: `Category "${createdCategory.name}" has been created`
    });
  };

  const handleCreateRoom = () => {
    if (!newRoom.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a room name",
        variant: "destructive"
      });
      return;
    }

    const createdRoom: Room = {
      id: (rooms.length + 1).toString(),
      name: newRoom.name || '',
      description: newRoom.description || '',
      capacity: newRoom.capacity || 10
    };

    setRooms([...rooms, createdRoom]);
    setIsNewRoomDialogOpen(false);
    setNewRoom({
      name: '',
      description: '',
      capacity: 10
    });

    toast({
      title: "Room Created",
      description: `Room "${createdRoom.name}" has been created`
    });
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
    toast({
      title: "Table Deleted",
      description: "The table has been removed"
    });
  };

  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus, lastUpdated: new Date().toISOString() } : table
    ));
    
    toast({
      title: "Table Status Updated",
      description: `Table status changed to ${newStatus}`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Table Management" 
          subtitle="Manage restaurant tables, categories, and room layout"
          icon={<TableProperties size={24} />}
        />

        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="rooms">Rooms & Areas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="main">Main</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tableNumber">Table Number</Label>
                      <Input 
                        id="tableNumber" 
                        placeholder="e.g., T-01, BAR-01"
                        value={newTable.number}
                        onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input 
                          id="capacity" 
                          type="number"
                          min="1"
                          value={newTable.capacity}
                          onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newTable.status} 
                          onValueChange={(value: string) => setNewTable({...newTable, status: value as TableStatus})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Set status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={newTable.category} 
                          onValueChange={(value: string) => setNewTable({...newTable, category: value})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="area">Area</Label>
                        <Select 
                          value={newTable.area} 
                          onValueChange={(value: string) => setNewTable({...newTable, area: value as TableArea})}
                        >
                          <SelectTrigger id="area">
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="outdoor">Outdoor</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="room">Room</Label>
                      <Select 
                        value={newTable.room} 
                        onValueChange={(value: string) => setNewTable({...newTable, room: value})}
                      >
                        <SelectTrigger id="room">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map(room => (
                            <SelectItem key={room.id} value={room.name}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsNewTableDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTable}>
                        Add Table
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTables.length > 0 ? (
                filteredTables.map((table) => (
                  <Card key={table.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`h-1 ${getStatusColor(table.status).replace('hover:bg-', 'bg-').split(' ')[0]}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{table.number}</CardTitle>
                        <Badge className={getStatusColor(table.status)}>
                          {getStatusIcon(table.status)}
                          <span className="ml-1 capitalize">{table.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Capacity:</span>
                          <span className="font-medium">{table.capacity} people</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span>
                            {table.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Area:</span>
                          <span className="capitalize">{table.area}</span>
                        </div>
                        
                        {table.room && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Room:</span>
                            <span>{table.room}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Last Updated:</span>
                          <span className="text-xs">
                            {new Date(table.lastUpdated).toLocaleString()}
                          </span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex items-center justify-between pt-2">
                          <Select 
                            value={table.status} 
                            onValueChange={(value) => handleStatusChange(table.id, value as TableStatus)}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteTable(table.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <TableProperties className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tables found</h3>
                  <p className="text-muted-foreground mt-1">
                    Adjust your filters or add a new table.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Table Categories</h3>
              
              <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Table Category</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input 
                        id="categoryName" 
                        placeholder="e.g., VIP, Family, Standard"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        placeholder="Brief description of this category"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="color">Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="color" 
                          type="color"
                          className="w-12 h-10 p-1"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        />
                        <Input 
                          type="text"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCategory}>
                        Add Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-1" style={{ backgroundColor: category.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant="outline">
                        {tables.filter(table => table.category === category.name).length} tables
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rooms">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Rooms & Areas</h3>
              
              <Dialog open={isNewRoomDialogOpen} onOpenChange={setIsNewRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Room or Area</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="roomName">Room Name</Label>
                      <Input 
                        id="roomName" 
                        placeholder="e.g., Main Dining, Private Room"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="roomDescription">Description</Label>
                      <Input 
                        id="roomDescription" 
                        placeholder="Brief description of this room"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="roomCapacity">Capacity (total number of guests)</Label>
                      <Input 
                        id="roomCapacity" 
                        type="number"
                        min="1"
                        value={newRoom.capacity}
                        onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsNewRoomDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRoom}>
                        Add Room
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{room.capacity} people</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tables:</span>
                        <span className="font-medium">
                          {tables.filter(table => table.room === room.name).length} tables
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Available:</span>
                        <span className="font-medium">
                          {tables.filter(table => 
                            table.room === room.name && table.status === 'available'
                          ).length} tables
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TableManagement;
