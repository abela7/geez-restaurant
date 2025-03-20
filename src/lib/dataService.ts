
/**
 * Data Service for Restaurant Management System
 * This service provides methods to interact with the database
 */

import sampleData from './sampleData';
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
  Budget,
  Expense,
  Transaction,
  MenuModifier,
} from './database';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'rms_users',
  STAFF: 'rms_staff',
  MENU_CATEGORIES: 'rms_menu_categories',
  MENU_ITEMS: 'rms_menu_items',
  MENU_MODIFIERS: 'rms_menu_modifiers',
  INGREDIENTS: 'rms_ingredients',
  RECIPES: 'rms_recipes',
  SUPPLIERS: 'rms_suppliers',
  TABLES: 'rms_tables',
  CUSTOMERS: 'rms_customers',
  ORDERS: 'rms_orders',
  PROMOTIONS: 'rms_promotions',
  RESTAURANT: 'rms_restaurant',
  LOGS: 'rms_logs',
  BUDGETS: 'rms_budgets',
  EXPENSES: 'rms_expenses',
  TRANSACTIONS: 'rms_transactions',
};

// Helper to initialize data in localStorage
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleData.users));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(sampleData.staffMembers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MENU_CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.MENU_CATEGORIES, JSON.stringify(sampleData.menuCategories));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(sampleData.menuItems));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MENU_MODIFIERS)) {
    localStorage.setItem(STORAGE_KEYS.MENU_MODIFIERS, JSON.stringify(sampleData.menuModifiers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.INGREDIENTS)) {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(sampleData.ingredients));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(sampleData.recipes));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(sampleData.suppliers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(sampleData.tables));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sampleData.customers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleData.orders));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PROMOTIONS)) {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(sampleData.promotions));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.RESTAURANT)) {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(sampleData.restaurantProfile));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sampleData.activityLogs));
  }
};

// Initialize data when the service is imported
initializeData();

// Helper to generate a unique ID
const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};

// Helper to log an activity
const logActivity = (userId: string, action: string, entityType: string, entityId?: string, details?: any) => {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  
  const newLog: ActivityLog = {
    id: generateId('log'),
    userId,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    details,
    ipAddress: '127.0.0.1', // Mock IP address
  };
  
  logs.push(newLog);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  
  return newLog;
};

// Data service functions for each entity type
export const userService = {
  getAll: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  
  getById: (id: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find((user: User) => user.id === id);
  },
  
  getByEmail: (email: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find((user: User) => user.email === email);
  },
  
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, actorId: string): User => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const newUser: User = {
      ...user,
      id: generateId('user'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Log activity
    logActivity(actorId, 'create', 'user', newUser.id, { name: newUser.name, email: newUser.email });
    
    return newUser;
  },
  
  update: (id: string, updates: Partial<User>, actorId: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((user: User) => user.id === id);
    
    if (index === -1) return undefined;
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Log activity
    logActivity(actorId, 'update', 'user', id, updates);
    
    return users[index];
  },
  
  delete: (id: string, actorId: string): boolean => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const filteredUsers = users.filter((user: User) => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
    
    // Log activity
    logActivity(actorId, 'delete', 'user', id);
    
    return true;
  },
};

export const staffService = {
  getAll: (): StaffMember[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
  },
  
  getById: (id: string): StaffMember | undefined => {
    const staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    return staff.find((member: StaffMember) => member.id === id);
  },
  
  getByRole: (role: string): StaffMember[] => {
    const staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    return staff.filter((member: StaffMember) => member.role === role);
  },
  
  create: (staffMember: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>, actorId: string): StaffMember => {
    const staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    
    const newStaff: StaffMember = {
      ...staffMember,
      id: generateId('staff'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    staff.push(newStaff);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    
    // Log activity
    logActivity(actorId, 'create', 'staff', newStaff.id, { name: newStaff.name, position: newStaff.position });
    
    return newStaff;
  },
  
  update: (id: string, updates: Partial<StaffMember>, actorId: string): StaffMember | undefined => {
    const staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    const index = staff.findIndex((member: StaffMember) => member.id === id);
    
    if (index === -1) return undefined;
    
    staff[index] = {
      ...staff[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    
    // Log activity
    logActivity(actorId, 'update', 'staff', id, updates);
    
    return staff[index];
  },
  
  delete: (id: string, actorId: string): boolean => {
    const staff = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    const filteredStaff = staff.filter((member: StaffMember) => member.id !== id);
    
    if (filteredStaff.length === staff.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(filteredStaff));
    
    // Log activity
    logActivity(actorId, 'delete', 'staff', id);
    
    return true;
  },
};

// Similar implementations for other entity services would follow the same pattern
export const menuService = {
  getCategories: (): MenuCategory[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_CATEGORIES) || '[]');
  },
  
  getItems: (): MenuItem[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]');
  },
  
  getItemsByCategory: (categoryId: string): MenuItem[] => {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]');
    return items.filter((item: MenuItem) => item.categoryId === categoryId);
  },
  
  getModifiers: (): MenuModifier[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_MODIFIERS) || '[]');
  },
  
  // Additional menu-related methods would follow...
};

export const inventoryService = {
  getIngredients: (): Ingredient[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || '[]');
  },
  
  getRecipes: (): Recipe[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
  },
  
  getSuppliers: (): Supplier[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');
  },
  
  // Additional inventory-related methods would follow...
};

export const orderService = {
  getAll: (): Order[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },
  
  getById: (id: string): Order | undefined => {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.find((order: Order) => order.id === id);
  },
  
  getActiveOrders: (): Order[] => {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.filter((order: Order) => 
      ['pending', 'preparing', 'ready', 'served'].includes(order.status)
    );
  },
  
  create: (order: Omit<Order, 'id'>, actorId: string): Order => {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    const newOrder: Order = {
      ...order,
      id: generateId('order'),
    };
    
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Log activity
    logActivity(actorId, 'create', 'order', newOrder.id, { 
      tableId: newOrder.tableId, 
      total: newOrder.total 
    });
    
    return newOrder;
  },
  
  update: (id: string, updates: Partial<Order>, actorId: string): Order | undefined => {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const index = orders.findIndex((order: Order) => order.id === id);
    
    if (index === -1) return undefined;
    
    orders[index] = {
      ...orders[index],
      ...updates,
    };
    
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Log activity
    logActivity(actorId, 'update', 'order', id, updates);
    
    return orders[index];
  },
};

export const tableService = {
  getAll: (): Table[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || '[]');
  },
  
  getById: (id: string): Table | undefined => {
    const tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || '[]');
    return tables.find((table: Table) => table.id === id);
  },
  
  getAvailableTables: (): Table[] => {
    const tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || '[]');
    return tables.filter((table: Table) => table.status === 'available');
  },
  
  updateStatus: (id: string, status: Table['status'], actorId: string): Table | undefined => {
    const tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES) || '[]');
    const index = tables.findIndex((table: Table) => table.id === id);
    
    if (index === -1) return undefined;
    
    tables[index] = {
      ...tables[index],
      status,
    };
    
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    
    // Log activity
    logActivity(actorId, 'update', 'table', id, { status });
    
    return tables[index];
  },
};

export const customerService = {
  getAll: (): Customer[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
  },
  
  getById: (id: string): Customer | undefined => {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
    return customers.find((customer: Customer) => customer.id === id);
  },
  
  create: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>, actorId: string): Customer => {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
    
    const newCustomer: Customer = {
      ...customer,
      id: generateId('cust'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    
    // Log activity
    logActivity(actorId, 'create', 'customer', newCustomer.id, { 
      name: newCustomer.name, 
      email: newCustomer.email 
    });
    
    return newCustomer;
  },
  
  // Additional customer-related methods would follow...
};

export const promotionService = {
  getAll: (): Promotion[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMOTIONS) || '[]');
  },
  
  getActive: (): Promotion[] => {
    const promotions = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMOTIONS) || '[]');
    const now = new Date().toISOString();
    
    return promotions.filter((promo: Promotion) => 
      promo.isActive && 
      promo.startDate <= now && 
      promo.endDate >= now
    );
  },
  
  // Additional promotion-related methods would follow...
};

export const restaurantService = {
  getProfile: (): RestaurantProfile => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANT) || '{}');
  },
  
  update: (updates: Partial<RestaurantProfile>, actorId: string): RestaurantProfile => {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANT) || '{}');
    
    const updatedProfile = {
      ...profile,
      ...updates,
    };
    
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(updatedProfile));
    
    // Log activity
    logActivity(actorId, 'update', 'restaurant', profile.id, updates);
    
    return updatedProfile;
  },
};

export const activityLogService = {
  getLogs: (limit: number = 50): ActivityLog[] => {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    return logs.sort((a: ActivityLog, b: ActivityLog) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);
  },
  
  getLogsByUser: (userId: string, limit: number = 50): ActivityLog[] => {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    return logs
      .filter((log: ActivityLog) => log.userId === userId)
      .sort((a: ActivityLog, b: ActivityLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, limit);
  },
  
  // Additional log-related methods would follow...
};

// Export a combined data service object
const dataService = {
  user: userService,
  staff: staffService,
  menu: menuService,
  inventory: inventoryService,
  order: orderService,
  table: tableService,
  customer: customerService,
  promotion: promotionService,
  restaurant: restaurantService,
  log: activityLogService,
  
  // Helper method to reset all data to initial sample data
  resetToSampleData: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleData.users));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(sampleData.staffMembers));
    localStorage.setItem(STORAGE_KEYS.MENU_CATEGORIES, JSON.stringify(sampleData.menuCategories));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(sampleData.menuItems));
    localStorage.setItem(STORAGE_KEYS.MENU_MODIFIERS, JSON.stringify(sampleData.menuModifiers));
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(sampleData.ingredients));
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(sampleData.recipes));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(sampleData.suppliers));
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(sampleData.tables));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sampleData.customers));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleData.orders));
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(sampleData.promotions));
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(sampleData.restaurantProfile));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sampleData.activityLogs));
  },
};

export default dataService;
