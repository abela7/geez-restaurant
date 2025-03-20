
import React, { createContext, useContext, useState, useEffect } from 'react';
import dataService from '@/lib/dataService';
import {
  User,
  StaffMember,
  MenuCategory,
  MenuItem,
  Ingredient,
  Recipe,
  Supplier,
  Table,
  Order,
  Customer,
  Promotion,
  RestaurantProfile,
  ActivityLog,
} from '@/lib/database';
import { useToast } from '@/components/ui/use-toast';

// Define the context type
interface DatabaseContextType {
  // Users
  users: User[];
  getUser: (id: string) => User | undefined;
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => User | undefined;
  updateUser: (id: string, updates: Partial<User>) => User | undefined;
  deleteUser: (id: string) => boolean;
  
  // Staff
  staff: StaffMember[];
  getStaffMember: (id: string) => StaffMember | undefined;
  
  // Menu
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  getMenuItemsByCategory: (categoryId: string) => MenuItem[];
  
  // Inventory
  ingredients: Ingredient[];
  recipes: Recipe[];
  suppliers: Supplier[];
  
  // Tables and Orders
  tables: Table[];
  orders: Order[];
  getActiveOrders: () => Order[];
  createOrder: (order: Omit<Order, 'id'>) => Order | undefined;
  updateOrder: (id: string, updates: Partial<Order>) => Order | undefined;
  
  // Customers
  customers: Customer[];
  
  // Promotions
  promotions: Promotion[];
  activePromotions: Promotion[];
  
  // Restaurant
  restaurantProfile: RestaurantProfile | null;
  updateRestaurantProfile: (updates: Partial<RestaurantProfile>) => RestaurantProfile | undefined;
  
  // Activity Logs
  activityLogs: ActivityLog[];
  
  // Utilities
  refresh: () => void;
  resetData: () => void;
  actorId: string;
  setActorId: (id: string) => void;
  loading: boolean;
}

// Create the context
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Create a provider component
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actorId, setActorId] = useState<string>('user-001'); // Default as admin user
  
  // State for each entity type
  const [users, setUsers] = useState<User[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // Load data from the service
  const loadData = () => {
    setLoading(true);
    try {
      setUsers(dataService.user.getAll());
      setStaff(dataService.staff.getAll());
      setMenuCategories(dataService.menu.getCategories());
      setMenuItems(dataService.menu.getItems());
      setIngredients(dataService.inventory.getIngredients());
      setRecipes(dataService.inventory.getRecipes());
      setSuppliers(dataService.inventory.getSuppliers());
      setTables(dataService.table.getAll());
      setOrders(dataService.order.getAll());
      setCustomers(dataService.customer.getAll());
      setPromotions(dataService.promotion.getAll());
      setActivePromotions(dataService.promotion.getActive());
      setRestaurantProfile(dataService.restaurant.getProfile());
      setActivityLogs(dataService.log.getLogs());
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Data Loading Error',
        description: 'There was a problem loading the application data.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  
  // Initialize data on first load
  useEffect(() => {
    loadData();
  }, []);
  
  // User functions
  const getUser = (id: string) => dataService.user.getById(id);
  
  const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newUser = dataService.user.create(user, actorId);
      loadData(); // Refresh data
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user.',
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  const updateUser = (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = dataService.user.update(id, updates, actorId);
      loadData(); // Refresh data
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  const deleteUser = (id: string) => {
    try {
      const result = dataService.user.delete(id, actorId);
      loadData(); // Refresh data
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Staff functions
  const getStaffMember = (id: string) => dataService.staff.getById(id);
  
  // Menu functions
  const getMenuItemsByCategory = (categoryId: string) => dataService.menu.getItemsByCategory(categoryId);
  
  // Order functions
  const getActiveOrders = () => dataService.order.getActiveOrders();
  
  const createOrder = (order: Omit<Order, 'id'>) => {
    try {
      const newOrder = dataService.order.create(order, actorId);
      loadData(); // Refresh data
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create order.',
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  const updateOrder = (id: string, updates: Partial<Order>) => {
    try {
      const updatedOrder = dataService.order.update(id, updates, actorId);
      loadData(); // Refresh data
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order.',
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  // Restaurant profile functions
  const updateRestaurantProfile = (updates: Partial<RestaurantProfile>) => {
    try {
      const updated = dataService.restaurant.update(updates, actorId);
      setRestaurantProfile(updated);
      return updated;
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update restaurant profile.',
        variant: 'destructive',
      });
      return undefined;
    }
  };
  
  // Reset data
  const resetData = () => {
    try {
      dataService.resetToSampleData();
      loadData();
      toast({
        title: 'Data Reset',
        description: 'All data has been reset to sample values.',
      });
    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset data.',
        variant: 'destructive',
      });
    }
  };
  
  const value = {
    // Users
    users,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    
    // Staff
    staff,
    getStaffMember,
    
    // Menu
    menuCategories,
    menuItems,
    getMenuItemsByCategory,
    
    // Inventory
    ingredients,
    recipes,
    suppliers,
    
    // Tables and Orders
    tables,
    orders,
    getActiveOrders,
    createOrder,
    updateOrder,
    
    // Customers
    customers,
    
    // Promotions
    promotions,
    activePromotions,
    
    // Restaurant
    restaurantProfile,
    updateRestaurantProfile,
    
    // Activity Logs
    activityLogs,
    
    // Utilities
    refresh: loadData,
    resetData,
    actorId,
    setActorId,
    loading,
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Create a hook to use the context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
