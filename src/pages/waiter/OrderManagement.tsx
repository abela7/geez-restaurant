import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Filter,
  ShoppingBag,
  Package,
  UtensilsCrossed,
  Grid3X3,
  Building,
  Users,
  Minus
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getActiveRooms, getTableGroups, getTablesByRoomId, getTablesByGroupId, createTable, updateTableStatus, deleteTable } from "@/services/table";
import { Room, TableGroup, Table as TableType } from "@/services/table/types";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { QuickOrderCard } from "@/components/waiter/QuickOrderCard";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  category?: {
    name: string;
  };
  image_url?: string | null;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
}

const orders = [
  { id: 1, table: "Table 5", items: 4, total: "$86.50", status: "Pending", time: "5 mins ago", special: false },
  { id: 2, table: "Table 8", items: 3, total: "$52.75", status: "Preparing", time: "12 mins ago", special: true },
  { id: 3, table: "Table 2", items: 6, total: "$124.90", status: "Ready", time: "18 mins ago", special: false },
  { id: 4, table: "Table 10", items: 2, total: "$35.25", status: "Delivered", time: "25 mins ago", special: false },
  { id: 5, table: "Takeout #45", items: 1, total: "$18.50", status: "Ready", time: "8 mins ago", special: false },
  { id: 6, table: "Table 7", items: 5, total: "$96.25", status: "Preparing", time: "15 mins ago", special: true },
];

interface OrderManagementProps {
  newOrder?: boolean;
  search?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder = false, search = false }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [orderType, setOrderType] = useState<string>("dine-in");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<string>("");
  
  // Guest tab states
  const [guestTabActive, setGuestTabActive] = useState<boolean>(false);
  const [tempTableName, setTempTableName] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("1");
  const [guestRoom, setGuestRoom] = useState<string>("");

  // Menu states
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>("");

  // Order states
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    if (typeParam) {
      setOrderType(typeParam);
    }
    
    const fetchInitialData = async () => {
      try {
        const roomsData = await getActiveRooms();
        setRooms(roomsData);
        
        if (roomsData.length > 0) {
          // Set default room
          setSelectedRoom(roomsData[0].id);
          setGuestRoom(roomsData[0].id);
          
          // Fetch tables for default room
          const tablesData = await getTablesByRoomId(roomsData[0].id);
          setTables(tablesData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error(t("Failed to fetch rooms and tables"));
      }
    };
    
    fetchInitialData();
  }, [location, t]);
  
  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedRoom) return;
      
      try {
        const tablesData = await getTablesByRoomId(selectedRoom);
        setTables(tablesData);
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast.error(t("Failed to fetch tables"));
      }
    };
    
    fetchTables();
  }, [selectedRoom, t]);

  // Fetch menu data when menu becomes visible
  useEffect(() => {
    if (isMenuVisible) {
      fetchMenuData();
    }
  }, [isMenuVisible]);

  // Filter menu items based on search and category
  useEffect(() => {
    if (foodItems.length === 0) return;

    let filtered = [...foodItems];
    
    // Filter by search query
    if (menuSearchQuery) {
      const searchLower = menuSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) || 
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [menuSearchQuery, selectedCategory, foodItems]);

  // Calculate total when order items change
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(newTotal);
  }, [orderItems]);

  const fetchMenuData = async () => {
    try {
      // Fetch menu categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true);
      
      if (categoriesError) throw categoriesError;
      
      setMenuCategories(categoriesData as MenuCategory[]);
      
      // Fetch food items with category information
      const { data: itemsData, error: itemsError } = await supabase
        .from('food_items')
        .select('*, category:menu_categories(name)')
        .eq('available', true);
      
      if (itemsError) throw itemsError;
      
      setFoodItems(itemsData as FoodItem[]);
      setFilteredItems(itemsData as FoodItem[]);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error(t("Failed to load menu"));
    }
  };
  
  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
    setIsMenuVisible(true);
  };
  
  const handleRoomChange = async (roomId: string) => {
    setSelectedRoom(roomId);
  };
  
  const handleCreateTempTable = async () => {
    if (!tempTableName || !guestRoom) {
      toast.error(t("Please fill in all required fields"));
      return;
    }
    
    try {
      // Create a temporary table
      const newTable: Omit<TableType, 'id' | 'created_at' | 'updated_at'> = {
        table_number: parseInt(tempTableName),
        capacity: parseInt(guestCount),
        status: 'available',
        room_id: guestRoom,
        // Mark as temporary with a special location
        location: 'temporary'
      };
      
      const createdTable = await createTable(newTable);
      toast.success(t("Temporary table created successfully"));
      
      // Select the new table and go to menu
      setSelectedTable(createdTable.id);
      setIsMenuVisible(true);
    } catch (error) {
      console.error("Error creating temporary table:", error);
      toast.error(t("Failed to create temporary table"));
    }
  };

  const handleAddToOrder = (item: FoodItem) => {
    // Check if item is already in the order
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      // Increment quantity if already in order
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 } 
          : orderItem
      ));
    } else {
      // Add new item to order
      setOrderItems([...orderItems, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
    
    toast.success(`${item.name} added to order`);
  };

  const handleIncrementItem = (itemId: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrementItem = (itemId: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => !(item.id === itemId && item.quantity === 1)));
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handlePlaceOrder = () => {
    // This would be connected to the backend in a real implementation
    if (orderItems.length === 0) {
      toast.error(t("Please add items to your order"));
      return;
    }
    
    toast.success(t("Order placed successfully"));
    console.log("Order placed:", {
      orderType,
      tableId: selectedTable,
      items: orderItems,
      totalAmount
    });

    // Reset order
    setOrderItems([]);
    setIsMenuVisible(false);
    setSelectedTable("");
  };
  
  if (newOrder) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={t("New Order")} 
          description={
            orderType === "takeout" ? t("Create a new takeout order") : 
            t("Create a new table order")
          }
        />
        
        <Card className="mb-6">
          <div className="p-4 border-b">
            <Tabs value={orderType} onValueChange={(value) => {
              setOrderType(value);
              setIsMenuVisible(false);
              setGuestTabActive(false);
              setOrderItems([]);
            }}>
              <TabsList>
                <TabsTrigger value="dine-in">
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  <T text="Dine-in" />
                </TabsTrigger>
                <TabsTrigger value="takeout">
                  <Package className="h-4 w-4 mr-2" />
                  <T text="Takeout" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {orderType === "dine-in" && !isMenuVisible && (
            <div className="p-4">
              <Tabs value={guestTabActive ? "guest" : "table-list"} onValueChange={(value) => setGuestTabActive(value === "guest")}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="table-list" className="flex-1">
                    <Building className="h-4 w-4 mr-2" />
                    <T text="Table List" />
                  </TabsTrigger>
                  <TabsTrigger value="guest" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    <T text="Guest" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="table-list">
                  <div className="mb-4">
                    <h3 className="font-medium mb-3"><T text="Select a Room" /></h3>
                    <Select value={selectedRoom} onValueChange={handleRoomChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a room")} />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <h3 className="font-medium mb-4"><T text="Select a Table" /></h3>
                  {!selectedRoom ? (
                    <div className="text-center p-4 text-muted-foreground">
                      <T text="Please select a room first" />
                    </div>
                  ) : tables.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      <T text="No tables found" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {tables.map((table) => (
                        <Card 
                          key={table.id} 
                          className={`p-3 cursor-pointer hover:bg-primary/5 ${
                            table.status === 'occupied' ? 'bg-amber-100/50 border-amber-500' : 
                            table.status === 'reserved' ? 'bg-blue-100/50 border-blue-500' : 
                            table.status === 'cleaning' ? 'bg-gray-100/50 border-gray-500' : ''
                          }`}
                          onClick={() => table.status === 'available' ? handleTableClick(table.id) : null}
                        >
                          <div className="text-center">
                            <p className="font-medium">Table {table.table_number}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <T text={table.status === 'available' ? 'Available' : 
                                       table.status === 'occupied' ? 'Occupied' : 
                                       table.status === 'reserved' ? 'Reserved' : 'Cleaning'} />
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="guest">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block"><T text="Table Name" /></label>
                      <Input 
                        type="text" 
                        placeholder={t("Enter table name or number")} 
                        value={tempTableName}
                        onChange={(e) => setTempTableName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block"><T text="Number of Guests" /></label>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder={t("Enter number of guests")} 
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block"><T text="Room" /></label>
                      <Select value={guestRoom} onValueChange={setGuestRoom}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select a room")} />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={handleCreateTempTable}
                    >
                      <T text="Create Temporary Table" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {orderType === "takeout" && !isMenuVisible && (
            <div className="p-4">
              <h3 className="font-medium mb-4"><T text="Takeout Information" /></h3>
              <div className="space-y-4">
                <div>
                   <label className="text-sm font-medium mb-2 block"><T text="Phone Number" /></label>
                   <Input placeholder={t("Enter phone number")} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block"><T text="Pickup Time" /></label>
                  <Input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                </div>
                <Button 
                  className="mt-2" 
                  onClick={() => setIsMenuVisible(true)}
                >
                  <T text="Continue to Menu" />
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        {isMenuVisible && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Menu Section */}
            <Card className="flex-1">
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="font-medium text-lg">
                    {orderType === "dine-in" ? 
                      <T text={`Menu Items - Table ${tables.find(t => t.id === selectedTable)?.table_number || ""}`} /> : 
                      <T text="Menu Items - Takeout" />
                    }
                  </h3>
                  <div className="w-full md:w-64">
                    <div className="relative">
                      <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder={t("Search menu...")} 
                        className="pl-9 w-full"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="mb-2 flex flex-wrap">
                    <TabsTrigger value="all"><T text="All Categories" /></TabsTrigger>
                    {menuCategories.map(category => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {t(category.name)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <T text="No menu items found" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  {filteredItems.map(item => (
                    <QuickOrderCard
                      key={item.id}
                      name={item.name}
                      description={item.description || ""}
                      price={item.price}
                      category={item.category?.name || ""}
                      imageUrl={item.image_url || null}
                      onOrder={() => handleAddToOrder(item)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card className="md:w-96">
              <div className="p-4 border-b">
                <h3 className="font-medium text-lg"><T text="Order Summary" /></h3>
              </div>
              
              {orderItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <T text="No items added to the order yet" />
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-3">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} × {item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="flex items-center">
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleDecrementItem(item.id)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleIncrementItem(item.id)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium"><T text="Total" /></div>
                      <div className="font-bold text-lg">${totalAmount.toFixed(2)}</div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handlePlaceOrder}
                    >
                      <T text="Place Order" />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    );
  }
  
  if (search) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={t("Search Orders")} 
          description={t("Find and manage existing orders")}
        />
        
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("Search by order #, table, or customer...")}
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <T text="Filter" />
                </Button>
                <Button size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  <T text="Search" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          {searchQuery ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Order #" /></TableHead>
                  <TableHead><T text="Table" /></TableHead>
                  <TableHead><T text="Items" /></TableHead>
                  <TableHead><T text="Total" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Time" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter(order => order.table.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{t(order.table)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "Pending" ? "secondary" : 
                            order.status === "Preparing" ? "outline" : 
                            order.status === "Ready" ? "default" : 
                            "default"
                          }
                        >
                          {t(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{order.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <T text="Details" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <T text="Enter search terms to find orders" />
            </div>
          )}
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Order Management")} 
        description={t("Track and manage customer orders")}
        actions={
          <Button onClick={() => window.location.href = '/waiter/orders/new'}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="New Order" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search orders...")}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            <T text="Filter" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Orders" /></TabsTrigger>
          <TabsTrigger value="pending"><T text="Pending" /></TabsTrigger>
          <TabsTrigger value="preparing"><T text="Preparing" /></TabsTrigger>
          <TabsTrigger value="ready"><T text="Ready" /></TabsTrigger>
          <TabsTrigger value="delivered"><T text="Delivered" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Order #" /></TableHead>
                  <TableHead><T text="Table" /></TableHead>
                  <TableHead><T text="Items" /></TableHead>
                  <TableHead><T text="Total" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Time" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {t(order.table)}
                        {order.special && (
                          <div className="flex items-center" title={t("Special requests")}>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="sr-only">{t("Special requests")}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === "Pending" ? "secondary" : 
                          order.status === "Preparing" ? "outline" : 
                          order.status === "Ready" ? "default" : 
                          "default"
                        }
                      >
                        {t(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{order.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <T text="Details" />
                        </Button>
                        {order.status === "Ready" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <T text="Deliver" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of pending orders would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preparing">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of orders being prepared would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ready">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of ready orders would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="delivered">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of delivered orders would appear here" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
