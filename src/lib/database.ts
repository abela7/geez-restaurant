
/**
 * Database Schema Types for Restaurant Management System
 * This file defines the types and relationships for the entire database schema.
 */

// User related types
export type UserRole = 'admin' | 'manager' | 'waiter' | 'kitchen' | 'customer' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Would be hashed in a real system
  lastLogin: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
}

// Staff specific data
export interface StaffMember extends User {
  position: string;
  hireDate: string;
  salary: number;
  schedule: StaffSchedule[];
  performance: StaffPerformance[];
}

export interface StaffSchedule {
  id: string;
  staffId: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'working' | 'completed' | 'absent';
}

export interface StaffPerformance {
  id: string;
  staffId: string;
  date: string;
  rating: number;
  feedback: string;
  metrics: Record<string, number>; // For different metrics like speed, accuracy, etc.
}

// Menu related types
export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  categoryId: string;
  image?: string;
  ingredients: string[]; // References to ingredient IDs
  recipe?: string; // Reference to recipe ID
  isAvailable: boolean;
  isPopular: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nutritionalInfo?: Record<string, any>;
}

export interface MenuModifier {
  id: string;
  name: string;
  options: ModifierOption[];
  isRequired: boolean;
  multipleChoice: boolean;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

// Inventory related types
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
  supplierId: string;
  lastRestocked: string;
}

export interface Recipe {
  id: string;
  name: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  servingSize: number;
  preparationTime: number;
  costPerServing: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  items: string[]; // Ingredients supplied
  paymentTerms: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'delivered' | 'partial' | 'cancelled';
  items: PurchaseOrderItem[];
  totalCost: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes?: string;
}

export interface PurchaseOrderItem {
  ingredientId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

// Table and Order Management
export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning';
  positionX: number;
  positionY: number;
  shape: 'circle' | 'square' | 'rectangle';
  currentOrderId?: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  specialRequests?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  tableId: string;
  customerId?: string;
  waiterId: string;
  orderDate: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'split';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  prepTime?: number;
  serveTime?: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  modifiers: OrderItemModifier[];
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  subtotal: number;
}

export interface OrderItemModifier {
  modifierId: string;
  optionIds: string[];
}

// Customer related types
export interface Customer extends User {
  loyaltyPoints: number;
  totalVisits: number;
  lastVisit: string;
  totalSpent: number;
  preferences: string[];
  allergies: string[];
  feedback: CustomerFeedback[];
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  date: string;
  orderId?: string;
  ratings: {
    food: number;
    service: number;
    ambience: number;
    value: number;
    overall: number;
  };
  comments?: string;
  response?: string;
  isPublic: boolean;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  applicableItems: string[]; // Menu item IDs or 'all'
  minimumOrder?: number;
  code?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

// Financial data
export interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase' | 'expense' | 'refund';
  amount: number;
  paymentMethod: string;
  relatedId?: string; // Order ID, Purchase Order ID, etc.
  category: string;
  description?: string;
  taxAmount: number;
}

export interface Budget {
  id: string;
  year: number;
  month: number;
  category: string;
  subcategory?: string;
  budgetAmount: number;
  actualAmount: number;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  receiptImage?: string;
  approvedBy?: string;
  paymentMethod: string;
}

// System logs and settings
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  timestamp: string;
  details?: any;
  ipAddress?: string;
}

export interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  taxRate: number;
  currency: string;
  timezone: string;
}

export interface PrinterDevice {
  id: string;
  name: string;
  type: 'receipt' | 'kitchen' | 'bar' | 'label';
  ipAddress?: string;
  port?: number;
  connectionType: 'network' | 'bluetooth' | 'usb';
  status: 'online' | 'offline' | 'error';
  defaultPrinter: boolean;
}
