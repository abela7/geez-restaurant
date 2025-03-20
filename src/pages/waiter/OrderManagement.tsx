import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuickOrdersSection } from "@/components/waiter/QuickOrdersSection";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, Minus, Trash2, Check, ChevronsUp, ChevronsDown, UserRound, Loader2 } from "lucide-react";

interface OrderManagementProps {
  newOrder?: boolean;
  search?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  categoryName?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
}

interface OrderItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  special_instructions?: string;
}

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  location?: string;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ newOrder, search }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tables, setTables] = useState<Table[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [customerCount, setCustomerCount] = useState<string>("1");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadMenuItems(),
        loadCategories(),
        loadTables()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load menu data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        *,
        menu_categories(id, name)
      `)
      .eq('available', true);
    
    if (error) {
      throw error;
    }
    
    const formattedItems = data.map(item => ({
      ...item,
      categoryName: item.menu_categories ? item.menu_categories.name : "Uncategorized"
    }));
    
    setMenuItems(formattedItems);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('active', true);
    
    if (error) {
      throw error;
    }
    
    setCategories(data);
  };

  const loadTables = async () => {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .in('status', ['available', 'occupied']);
    
    if (error) {
      throw error;
    }
    
    setTables(data);
  };

  const handleAddToOrder = (foodItem: FoodItem) => {
    const existingItem = orderItems.find(item => item.foodItem.id === foodItem.id);
    
    if (existingItem) {
      setOrderItems(prevItems => 
        prevItems.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setOrderItems(prevItems => [
        ...prevItems, 
        { 
          id: crypto.randomUUID(), 
          foodItem, 
          quantity: 1 
        }
      ]);
    }
    
    toast.success(`${foodItem.name} added to order`);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return;
    }

    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || item.categoryName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.foodItem.price * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to the order");
      return;
    }

    if (orderType === "dine-in" && !selectedTable) {
      toast.error("Please select a table");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderTotal = calculateTotal();
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_id: orderType === "dine-in" ? selectedTable : null,
          customer_name: customerName || null,
          order_type: orderType,
          status: 'pending',
          total_amount: orderTotal,
          notes: specialInstructions || null
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const orderItemsToInsert = orderItems.map(item => ({
        order_id: order.id,
        food_item_id: item.foodItem.id,
        quantity: item.quantity,
        unit_price: item.foodItem.price,
        total_price: item.foodItem.price * item.quantity,
        special_instructions: item.special_instructions || null
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);
      
      if (itemsError) throw itemsError;
      
      if (orderType === "dine-in" && selectedTable) {
        const { error: tableError } = await supabase
          .from('restaurant_tables')
          .update({ status: 'occupied' })
          .eq('id', selectedTable);
        
        if (tableError) throw tableError;
        
        const { error: guestsError } = await supabase
          .from('table_guests')
          .insert({
            table_id: selectedTable,
            guest_count: parseInt(customerCount),
            notes: specialInstructions || null
          });
        
        if (guestsError) throw guestsError;
      }
      
      toast.success("Order created successfully!");
      navigate("/waiter/orders");
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemsByCategory = React.useMemo(() => {
    const filteredItems = getFilteredMenuItems();
    return filteredItems.reduce((acc, item) => {
      const category = item.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, FoodItem[]>);
  }, [menuItems, searchQuery, selectedCategory]);

  return (
    <Layout interface="waiter">
      <div className="container mx-auto p-4 pb-24">
        <PageHeader
          title={<T text={newOrder ? "New Order" : search ? "Search Orders" : "Order Management"} />}
          description={<T text={newOrder ? "Create a new customer order" : search ? "Search for existing orders" : "Manage customer orders"} />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("Search menu...")}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-4">
                  <Button 
                    key="all" 
                    variant={selectedCategory === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    <T text="All Categories" />
                  </Button>
                  {categories.map((category) => (
                    <Button 
                      key={category.id} 
                      variant={selectedCategory === category.name ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Tabs defaultValue="menu" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="menu"><T text="Menu Items" /></TabsTrigger>
                      <TabsTrigger value="quick"><T text="Quick Orders" /></TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="menu">
                      {Object.keys(itemsByCategory).length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <T text="No menu items found matching your criteria" />
                        </div>
                      ) : (
                        <ScrollArea className="h-[400px]">
                          {Object.entries(itemsByCategory).map(([category, items]) => (
                            <div key={category} className="mb-6">
                              <h3 className="font-medium text-lg mb-3">{category}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {items.map((item) => (
                                  <div key={item.id} className="border rounded-md p-3 hover:bg-accent/5 transition-colors">
                                    <div className="flex justify-between">
                                      <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        {item.description && (
                                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {item.is_vegetarian && <Badge variant="outline" className="bg-green-50 text-green-800">Vegetarian</Badge>}
                                          {item.is_vegan && <Badge variant="outline" className="bg-green-100 text-green-800">Vegan</Badge>}
                                          {item.is_gluten_free && <Badge variant="outline" className="bg-blue-50 text-blue-800">GF</Badge>}
                                          {item.is_spicy && <Badge variant="outline" className="bg-red-50 text-red-800">Spicy</Badge>}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="font-bold mb-2">${item.price.toFixed(2)}</span>
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleAddToOrder(item)}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          <T text="Add" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="quick">
                      <QuickOrdersSection />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-3"><T text="Order Summary" /></h3>
                
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium mb-1 block">
                        <T text="Order Type" />
                      </label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select order type")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dine-in"><T text="Dine In" /></SelectItem>
                          <SelectItem value="takeout"><T text="Takeout" /></SelectItem>
                          <SelectItem value="delivery"><T text="Delivery" /></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {orderType === "dine-in" && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-sm font-medium mb-1 block">
                          <T text="Table" />
                        </label>
                        <Select value={selectedTable} onValueChange={setSelectedTable}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select table")} />
                          </SelectTrigger>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                Table {table.table_number} ({table.capacity} seats)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium mb-1 block">
                        <T text="Customer Name" /> <span className="text-muted-foreground">(<T text="optional" />)</span>
                      </label>
                      <div className="relative">
                        <UserRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={t("Enter customer name")} 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    {orderType === "dine-in" && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-sm font-medium mb-1 block">
                          <T text="Number of Guests" />
                        </label>
                        <Select value={customerCount} onValueChange={setCustomerCount}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select guest count")} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      <T text="Special Instructions" /> <span className="text-muted-foreground">(<T text="optional" />)</span>
                    </label>
                    <Textarea 
                      placeholder={t("Enter any special instructions or requests")}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-3 mb-3">
                  <h4 className="font-medium mb-2"><T text="Items" /> ({orderItems.length})</h4>
                  
                  {orderItems.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground border border-dashed rounded-md">
                      <T text="No items added yet" />
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b pb-3">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{item.foodItem.name}</span>
                              <span className="font-bold">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto text-destructive"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span><T text="Total" /></span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={orderItems.length === 0 || isSubmitting}
                    onClick={handleSubmitOrder}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    <T text="Place Order" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderManagement;
