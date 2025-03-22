import React from 'react';
import { 
  LayoutDashboard, DollarSign, Users, Package, BarChart, 
  User, Settings, ClipboardList, Languages, LogOut, 
  Menu as MenuIcon, Settings2, MapPin, Utensils, Receipt,
  CupSoda, Clock
} from 'lucide-react';

export interface NavSection {
  label: string;
  icon: React.ReactNode;
  path: string;
  to?: string;
  submenu?: { to: string; label: string }[];
}

export const getNavSections = (interfaceType: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system'): NavSection[] => {
  const adminSections: NavSection[] = [
    { 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      path: "/"
    },
    { 
      label: "Sales & Finance", 
      icon: <DollarSign size={20} />, 
      path: "/admin/finance",
      submenu: [
        { to: "daily-sales", label: "Daily Sales" },
        { to: "financial-reports", label: "Financial Reports" },
        { to: "payment-management", label: "Payment Management" },
        { to: "expenses", label: "Expenses" },
        { to: "budgeting", label: "Budgeting" }
      ]
    },
    { 
      label: "Staff Management", 
      icon: <Users size={20} />, 
      path: "/admin/staff",
      submenu: [
        { to: "directory", label: "Staff Directory" },
        { to: "performance", label: "Performance" },
        { to: "attendance", label: "Attendance" },
        { to: "tasks", label: "Tasks" },
        { to: "payroll", label: "Payroll" }
      ]
    },
    { 
      label: "Menu Management", 
      icon: <MenuIcon size={20} />, 
      path: "/admin/menu",
      submenu: [
        { to: "food", label: "Food Items" },
        { to: "categories", label: "Categories" },
        { to: "recipes", label: "Recipes" },
        { to: "modifiers", label: "Modifiers" },
        { to: "pricing", label: "Pricing" },
        { to: "design", label: "Menu Design" }
      ]
    },
    { 
      label: "Inventory", 
      icon: <Package size={20} />, 
      path: "/admin/inventory",
      submenu: [
        { to: "stock", label: "Stock Levels" },
        { to: "ingredients", label: "Ingredients" },
        { to: "recipes", label: "Recipes" },
        { to: "suppliers", label: "Suppliers" },
        { to: "purchase-orders", label: "Purchase Orders" }
      ]
    },
    { 
      label: "Food Hygiene", 
      icon: <Utensils size={20} />, 
      path: "/admin/food-safety",
      submenu: [
        { to: "checklists", label: "Safety Checklists" },
        { to: "temperature", label: "Temperature Logs" },
        { to: "inspections", label: "Inspections" },
        { to: "training", label: "Staff Training" }
      ]
    },
    { 
      label: "Reports", 
      icon: <BarChart size={20} />, 
      path: "/admin/reports",
      submenu: [
        { to: "sales", label: "Sales Analytics" },
        { to: "staff", label: "Staff Reports" },
        { to: "inventory", label: "Inventory Reports" },
        { to: "customers", label: "Customer Insights" },
        { to: "custom", label: "Custom Reports" }
      ]
    },
    { 
      label: "Customers", 
      icon: <User size={20} />, 
      path: "/admin/customers",
      submenu: [
        { to: "database", label: "Customer Database" },
        { to: "feedback", label: "Feedback" },
        { to: "promotions", label: "Promotions" },
        { to: "loyalty", label: "Loyalty Program" }
      ]
    },
    {
      label: "General", 
      icon: <Settings2 size={20} />, 
      path: "/admin/general",
      submenu: [
        { to: "table-management", label: "Table Management" }
      ]
    },
    { 
      label: "Settings", 
      icon: <Settings size={20} />, 
      path: "/admin/settings",
      submenu: [
        { to: "profile", label: "Restaurant Profile" },
        { to: "users", label: "User Access" },
        { to: "devices", label: "Printers & Devices" },
        { to: "logs", label: "System Logs" },
        { to: "integrations", label: "Integrations" }
      ]
    },
    { 
      label: "Activity Log", 
      icon: <ClipboardList size={20} />, 
      path: "/admin/activity"
    },
    { 
      label: "Language Management", 
      icon: <Languages size={20} />, 
      path: "/admin/language"
    },
    { 
      label: "Logout", 
      icon: <LogOut size={20} />, 
      path: "/login"
    }
  ];

  const waiterLinks: NavSection[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/waiter" },
    { label: "Table Management", icon: <MapPin size={20} />, path: "/waiter/tables" },
    { label: "Order Management", icon: <ClipboardList size={20} />, path: "/waiter/orders" },
    { label: "Payment Processing", icon: <DollarSign size={20} />, path: "/waiter/payments" },
    { label: "Tasks", icon: <ClipboardList size={20} />, path: "/waiter/tasks" },
    { label: "Logout", icon: <LogOut size={20} />, path: "/login" },
  ];

  const kitchenLinks: NavSection[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/kitchen" },
    { label: "Order Processing", icon: <Receipt size={20} />, path: "/kitchen/orders" },
    { label: "Inventory Check", icon: <Package size={20} />, path: "/kitchen/inventory" },
    { label: "Menu Availability", icon: <MenuIcon size={20} />, path: "/kitchen/menu-availability" },
    { label: "Tasks", icon: <ClipboardList size={20} />, path: "/kitchen/tasks" },
    { label: "Food Safety", icon: <Utensils size={20} />, path: "/kitchen/food-safety" },
    { label: "Logout", icon: <LogOut size={20} />, path: "/login" },
  ];

  const customerLinks: NavSection[] = [
    { label: "Menu", icon: <MenuIcon size={20} />, path: "/menu" },
    { label: "Feedback", icon: <ClipboardList size={20} />, path: "/feedback" },
    { label: "Promotions", icon: <DollarSign size={20} />, path: "/promotions" },
    { label: "Logout", icon: <LogOut size={20} />, path: "/login" },
  ];

  const systemLinks: NavSection[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/system" },
    { label: "Error Logs", icon: <ClipboardList size={20} />, path: "/system/errors" },
    { label: "User Management", icon: <Users size={20} />, path: "/system/users" },
    { label: "Documentation", icon: <ClipboardList size={20} />, path: "/system/docs" },
    { label: "Logout", icon: <LogOut size={20} />, path: "/login" },
  ];

  switch (interfaceType) {
    case 'waiter':
      return waiterLinks;
    case 'kitchen':
      return kitchenLinks;
    case 'customer':
      return customerLinks;
    case 'system':
      return systemLinks;
    default:
      return adminSections;
  }
};

export const getInterfaceTitle = (interfaceType: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system'): string => {
  switch (interfaceType) {
    case 'waiter':
      return "Waiter Interface";
    case 'kitchen':
      return "Kitchen Staff Interface";
    case 'customer':
      return "Menu & Feedback";
    case 'system':
      return "System Administration";
    default:
      return "Administrative Portal";
  }
};
