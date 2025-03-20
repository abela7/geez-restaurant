
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
  MenuModifier,
} from './database';

// Generate a unique ID for each entity
const generateId = () => Math.random().toString(36).substring(2, 12);

// Date helpers
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setDate(lastMonth.getDate() - 30);

// Sample users
export const users: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@habesharestaurant.com',
    role: 'admin',
    lastLogin: today.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: today.toISOString(),
    phoneNumber: '+1234567890',
  },
  {
    id: 'user-002',
    name: 'Manager One',
    email: 'manager1@habesharestaurant.com',
    role: 'manager',
    lastLogin: yesterday.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: yesterday.toISOString(),
    phoneNumber: '+1234567891',
  },
  {
    id: 'user-003',
    name: 'Waiter One',
    email: 'waiter1@habesharestaurant.com',
    role: 'waiter',
    lastLogin: today.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: today.toISOString(),
    phoneNumber: '+1234567892',
  },
  {
    id: 'user-004',
    name: 'Kitchen One',
    email: 'kitchen1@habesharestaurant.com',
    role: 'kitchen',
    lastLogin: today.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: today.toISOString(),
    phoneNumber: '+1234567893',
  },
  {
    id: 'user-005',
    name: 'System Admin',
    email: 'sysadmin@habesharestaurant.com',
    role: 'system',
    lastLogin: lastWeek.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
    phoneNumber: '+1234567894',
  },
];

// Sample staff members (extends users)
export const staffMembers: StaffMember[] = [
  {
    ...users[0],
    position: 'Restaurant Owner',
    hireDate: new Date('2020-01-01').toISOString(),
    salary: 80000,
    schedule: [],
    performance: [],
  },
  {
    ...users[1],
    position: 'General Manager',
    hireDate: new Date('2020-02-15').toISOString(),
    salary: 65000,
    schedule: [],
    performance: [],
  },
  {
    ...users[2],
    position: 'Senior Waiter',
    hireDate: new Date('2021-03-10').toISOString(),
    salary: 45000,
    schedule: [],
    performance: [],
  },
  {
    ...users[3],
    position: 'Head Chef',
    hireDate: new Date('2020-06-20').toISOString(),
    salary: 62000,
    schedule: [],
    performance: [],
  },
];

// Sample menu categories
export const menuCategories: MenuCategory[] = [
  {
    id: 'cat-001',
    name: 'Main Dishes',
    description: 'Traditional Ethiopian main courses',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-002',
    name: 'Vegetarian',
    description: 'Vegetarian and vegan Ethiopian dishes',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-003',
    name: 'Appetizers',
    description: 'Small plates and starters',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-004',
    name: 'Beverages',
    description: 'Traditional and modern drinks',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-005',
    name: 'Desserts',
    description: 'Sweet treats to finish your meal',
    displayOrder: 5,
    isActive: true,
  },
];

// Sample menu modifiers
export const menuModifiers: MenuModifier[] = [
  {
    id: 'mod-001',
    name: 'Spice Level',
    options: [
      { id: 'opt-001', name: 'Mild', price: 0, isDefault: true },
      { id: 'opt-002', name: 'Medium', price: 0, isDefault: false },
      { id: 'opt-003', name: 'Hot', price: 0, isDefault: false },
      { id: 'opt-004', name: 'Extra Hot', price: 0, isDefault: false },
    ],
    isRequired: true,
    multipleChoice: false,
  },
  {
    id: 'mod-002',
    name: 'Protein',
    options: [
      { id: 'opt-005', name: 'Chicken', price: 0, isDefault: true },
      { id: 'opt-006', name: 'Beef', price: 2, isDefault: false },
      { id: 'opt-007', name: 'Lamb', price: 3, isDefault: false },
    ],
    isRequired: true,
    multipleChoice: false,
  },
  {
    id: 'mod-003',
    name: 'Add-ons',
    options: [
      { id: 'opt-008', name: 'Extra Injera', price: 1.5, isDefault: false },
      { id: 'opt-009', name: 'Side Salad', price: 2.5, isDefault: false },
      { id: 'opt-010', name: 'Extra Sauce', price: 1, isDefault: false },
    ],
    isRequired: false,
    multipleChoice: true,
  },
];

// Sample suppliers
export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'Fresh Produce Inc.',
    contactPerson: 'John Smith',
    email: 'john@freshproduce.com',
    phone: '+1234567001',
    address: '123 Farmer Lane, Agricity',
    items: ['ing-003', 'ing-004', 'ing-006'],
    paymentTerms: 'Net 30',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
  },
  {
    id: 'sup-002',
    name: 'Ethiopian Spices Ltd.',
    contactPerson: 'Abebe Kebede',
    email: 'abebe@ethspices.com',
    phone: '+1234567002',
    address: '45 Spice Market, Addis',
    items: ['ing-002', 'ing-008'],
    paymentTerms: 'Net 15',
    createdAt: lastMonth.toISOString(),
    updatedAt: yesterday.toISOString(),
  },
  {
    id: 'sup-003',
    name: 'Premium Meats',
    contactPerson: 'Sara Johnson',
    email: 'sara@premiummeats.com',
    phone: '+1234567003',
    address: '78 Butcher St, Meatville',
    items: ['ing-001', 'ing-007'],
    paymentTerms: 'Net 7',
    createdAt: lastMonth.toISOString(),
    updatedAt: yesterday.toISOString(),
  },
];

// Sample ingredients
export const ingredients: Ingredient[] = [
  {
    id: 'ing-001',
    name: 'Chicken',
    category: 'Meat',
    unit: 'kg',
    unitCost: 5.99,
    currentStock: 25,
    minimumStock: 10,
    supplierId: 'sup-003',
    lastRestocked: lastWeek.toISOString(),
  },
  {
    id: 'ing-002',
    name: 'Berbere Spice',
    category: 'Spices',
    unit: 'kg',
    unitCost: 12.99,
    currentStock: 5,
    minimumStock: 2,
    supplierId: 'sup-002',
    lastRestocked: lastWeek.toISOString(),
  },
  {
    id: 'ing-003',
    name: 'Onions',
    category: 'Vegetables',
    unit: 'kg',
    unitCost: 1.99,
    currentStock: 15,
    minimumStock: 5,
    supplierId: 'sup-001',
    lastRestocked: yesterday.toISOString(),
  },
  {
    id: 'ing-004',
    name: 'Garlic',
    category: 'Vegetables',
    unit: 'kg',
    unitCost: 8.99,
    currentStock: 3,
    minimumStock: 1,
    supplierId: 'sup-001',
    lastRestocked: yesterday.toISOString(),
  },
  {
    id: 'ing-005',
    name: 'Niter Kibbeh',
    category: 'Dairy',
    unit: 'kg',
    unitCost: 9.99,
    currentStock: 8,
    minimumStock: 3,
    supplierId: 'sup-002',
    lastRestocked: lastWeek.toISOString(),
  },
  {
    id: 'ing-006',
    name: 'Red Lentils',
    category: 'Legumes',
    unit: 'kg',
    unitCost: 4.99,
    currentStock: 20,
    minimumStock: 8,
    supplierId: 'sup-001',
    lastRestocked: lastWeek.toISOString(),
  },
  {
    id: 'ing-007',
    name: 'Beef',
    category: 'Meat',
    unit: 'kg',
    unitCost: 9.99,
    currentStock: 15,
    minimumStock: 7,
    supplierId: 'sup-003',
    lastRestocked: yesterday.toISOString(),
  },
  {
    id: 'ing-008',
    name: 'Mitmita',
    category: 'Spices',
    unit: 'kg',
    unitCost: 15.99,
    currentStock: 4,
    minimumStock: 1,
    supplierId: 'sup-002',
    lastRestocked: lastWeek.toISOString(),
  },
];

// Sample menu items
export const menuItems: MenuItem[] = [
  {
    id: 'item-001',
    name: 'Doro Wat',
    description: 'Spicy chicken stew with berbere sauce and hard-boiled eggs',
    price: 18.99,
    cost: 7.45,
    categoryId: 'cat-001',
    image: '/placeholder.svg',
    ingredients: ['ing-001', 'ing-002', 'ing-003', 'ing-005'],
    recipe: 'recipe-001',
    isAvailable: true,
    isPopular: true,
    tags: ['spicy', 'signature', 'traditional'],
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
  },
  {
    id: 'item-002',
    name: 'Kitfo',
    description: 'Minced raw beef seasoned with mitmita and niter kibbeh',
    price: 19.99,
    cost: 8.75,
    categoryId: 'cat-001',
    image: '/placeholder.svg',
    ingredients: ['ing-007', 'ing-008', 'ing-005'],
    recipe: 'recipe-002',
    isAvailable: true,
    isPopular: true,
    tags: ['raw', 'traditional', 'signature'],
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
  },
  {
    id: 'item-003',
    name: 'Misir Wat',
    description: 'Spiced red lentil stew',
    price: 13.99,
    cost: 3.75,
    categoryId: 'cat-002',
    image: '/placeholder.svg',
    ingredients: ['ing-006', 'ing-002', 'ing-003', 'ing-004'],
    recipe: 'recipe-003',
    isAvailable: true,
    isPopular: false,
    tags: ['vegan', 'vegetarian', 'traditional'],
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
  },
];

// Sample recipes
export const recipes: Recipe[] = [
  {
    id: 'recipe-001',
    name: 'Doro Wat Recipe',
    menuItemId: 'item-001',
    ingredients: [
      { ingredientId: 'ing-001', quantity: 0.5 },
      { ingredientId: 'ing-002', quantity: 0.03 },
      { ingredientId: 'ing-003', quantity: 0.2 },
      { ingredientId: 'ing-005', quantity: 0.05 },
    ],
    instructions: `
      1. Heat niter kibbeh in a large pot.
      2. Add chopped onions and cook until soft.
      3. Add berbere spice and minced garlic.
      4. Add chicken pieces and stir to coat.
      5. Add water and simmer for 45 minutes.
      6. Add hard-boiled eggs in the last 10 minutes.
    `,
    servingSize: 2,
    preparationTime: 60,
    costPerServing: 3.73,
  },
  {
    id: 'recipe-002',
    name: 'Kitfo Recipe',
    menuItemId: 'item-002',
    ingredients: [
      { ingredientId: 'ing-007', quantity: 0.3 },
      { ingredientId: 'ing-008', quantity: 0.02 },
      { ingredientId: 'ing-005', quantity: 0.05 },
    ],
    instructions: `
      1. Finely mince the lean beef.
      2. Warm the niter kibbeh slightly.
      3. Mix mitmita spice with the warm niter kibbeh.
      4. Combine with the minced beef.
      5. Serve immediately or warmed as per preference.
    `,
    servingSize: 2,
    preparationTime: 20,
    costPerServing: 4.38,
  },
  {
    id: 'recipe-003',
    name: 'Misir Wat Recipe',
    menuItemId: 'item-003',
    ingredients: [
      { ingredientId: 'ing-006', quantity: 0.2 },
      { ingredientId: 'ing-002', quantity: 0.02 },
      { ingredientId: 'ing-003', quantity: 0.15 },
      { ingredientId: 'ing-004', quantity: 0.02 },
    ],
    instructions: `
      1. Heat oil in a pot and add chopped onions.
      2. Cook until onions are translucent.
      3. Add minced garlic and cook for 1 minute.
      4. Add berbere spice and stir for 2 minutes.
      5. Add red lentils and water, bring to a boil.
      6. Reduce heat and simmer for 30 minutes, stirring occasionally.
      7. Adjust seasoning and serve.
    `,
    servingSize: 4,
    preparationTime: 40,
    costPerServing: 0.94,
  },
];

// Sample tables
export const tables: Table[] = [
  {
    id: 'table-001',
    number: 1,
    capacity: 2,
    status: 'available',
    positionX: 10,
    positionY: 10,
    shape: 'circle',
  },
  {
    id: 'table-002',
    number: 2,
    capacity: 4,
    status: 'occupied',
    positionX: 10,
    positionY: 50,
    shape: 'rectangle',
    currentOrderId: 'order-001',
  },
  {
    id: 'table-003',
    number: 3,
    capacity: 6,
    status: 'reserved',
    positionX: 50,
    positionY: 10,
    shape: 'rectangle',
  },
  {
    id: 'table-004',
    number: 4,
    capacity: 4,
    status: 'available',
    positionX: 50,
    positionY: 50,
    shape: 'square',
  },
  {
    id: 'table-005',
    number: 5,
    capacity: 8,
    status: 'available',
    positionX: 90,
    positionY: 30,
    shape: 'rectangle',
  },
];

// Sample customers
export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'customer',
    lastLogin: yesterday.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: yesterday.toISOString(),
    phoneNumber: '+1234567895',
    loyaltyPoints: 250,
    totalVisits: 8,
    lastVisit: yesterday.toISOString(),
    totalSpent: 342.85,
    preferences: ['spicy', 'vegetarian'],
    allergies: [],
    feedback: [],
  },
  {
    id: 'cust-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'customer',
    lastLogin: lastWeek.toISOString(),
    status: 'active',
    createdAt: lastMonth.toISOString(),
    updatedAt: lastWeek.toISOString(),
    phoneNumber: '+1234567896',
    loyaltyPoints: 120,
    totalVisits: 4,
    lastVisit: lastWeek.toISOString(),
    totalSpent: 187.50,
    preferences: ['mild'],
    allergies: ['dairy'],
    feedback: [],
  },
];

// Sample orders
export const orders: Order[] = [
  {
    id: 'order-001',
    tableId: 'table-002',
    customerId: 'cust-001',
    waiterId: 'user-003',
    orderDate: today.toISOString(),
    status: 'preparing',
    items: [
      {
        id: 'orderitem-001',
        orderId: 'order-001',
        menuItemId: 'item-001',
        quantity: 1,
        modifiers: [
          {
            modifierId: 'mod-001',
            optionIds: ['opt-002'],
          },
        ],
        specialInstructions: 'Extra spicy please',
        status: 'preparing',
        subtotal: 18.99,
      },
      {
        id: 'orderitem-002',
        orderId: 'order-001',
        menuItemId: 'item-003',
        quantity: 1,
        modifiers: [],
        status: 'preparing',
        subtotal: 13.99,
      },
    ],
    subtotal: 32.98,
    tax: 2.80,
    discount: 0,
    total: 35.78,
    paymentMethod: 'card',
    paymentStatus: 'unpaid',
    notes: 'Customer celebrating birthday',
  },
  {
    id: 'order-002',
    tableId: 'table-005',
    customerId: 'cust-002',
    waiterId: 'user-003',
    orderDate: yesterday.toISOString(),
    status: 'completed',
    items: [
      {
        id: 'orderitem-003',
        orderId: 'order-002',
        menuItemId: 'item-002',
        quantity: 1,
        modifiers: [
          {
            modifierId: 'mod-001',
            optionIds: ['opt-003'],
          },
        ],
        status: 'served',
        subtotal: 19.99,
      },
    ],
    subtotal: 19.99,
    tax: 1.70,
    discount: 0,
    total: 21.69,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
  },
];

// Sample promotions
export const promotions: Promotion[] = [
  {
    id: 'promo-001',
    name: 'Happy Hour',
    description: '20% off all beverages between 4-6pm',
    startDate: lastWeek.toISOString(),
    endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    discountType: 'percentage',
    discountValue: 20,
    applicableItems: ['cat-004'],
    isActive: true,
    usageCount: 45,
  },
  {
    id: 'promo-002',
    name: 'Lunch Special',
    description: '$5 off orders over $30 during lunch hours',
    startDate: lastWeek.toISOString(),
    endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    discountType: 'fixed',
    discountValue: 5,
    minimumOrder: 30,
    applicableItems: ['all'],
    isActive: true,
    usageCount: 23,
  },
];

// Restaurant profile
export const restaurantProfile: RestaurantProfile = {
  id: 'restaurant-001',
  name: 'Habesha Ethiopian Restaurant',
  address: '123 Main Street, Anytown, USA',
  phone: '+1234567890',
  email: 'info@habesharestaurant.com',
  website: 'www.habesharestaurant.com',
  logo: '/placeholder.svg',
  openingHours: [
    { day: 'Monday', open: '11:00', close: '22:00' },
    { day: 'Tuesday', open: '11:00', close: '22:00' },
    { day: 'Wednesday', open: '11:00', close: '22:00' },
    { day: 'Thursday', open: '11:00', close: '22:00' },
    { day: 'Friday', open: '11:00', close: '23:00' },
    { day: 'Saturday', open: '11:00', close: '23:00' },
    { day: 'Sunday', open: '12:00', close: '21:00' },
  ],
  taxRate: 8.5,
  currency: 'USD',
  timezone: 'America/New_York',
};

// Sample activity logs
export const activityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    userId: 'user-001',
    action: 'login',
    entityType: 'user',
    entityId: 'user-001',
    timestamp: today.toISOString(),
    ipAddress: '192.168.1.1',
  },
  {
    id: 'log-002',
    userId: 'user-001',
    action: 'create',
    entityType: 'menuItem',
    entityId: 'item-003',
    timestamp: lastWeek.toISOString(),
    details: { name: 'Misir Wat', price: 13.99 },
    ipAddress: '192.168.1.1',
  },
  {
    id: 'log-003',
    userId: 'user-003',
    action: 'create',
    entityType: 'order',
    entityId: 'order-001',
    timestamp: today.toISOString(),
    details: { tableId: 'table-002', total: 35.78 },
    ipAddress: '192.168.1.3',
  },
];

// Export all sample data as a single object for easy access
export const sampleData = {
  users,
  staffMembers,
  menuCategories,
  menuItems,
  menuModifiers,
  ingredients,
  recipes,
  suppliers,
  tables,
  customers,
  orders,
  promotions,
  restaurantProfile,
  activityLogs,
};

export default sampleData;
