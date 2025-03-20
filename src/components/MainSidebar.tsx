
import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  BarChart4,
  DollarSign,
  Users,
  UtensilsCrossed,
  ClipboardList,
  MessageSquare,
  Settings,
  LayoutGrid,
  Clock,
  ShoppingCart,
  Store,
  Truck,
  User,
  LogOut,
  Bell,
  KeyRound,
  Salad,
  MapPin,
  ReceiptText,
  FileQuestion,
  ClipboardCheck,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// This type represents a section in the sidebar nav
export type NavSectionType = {
  title: string;
  href: string;
  icon: React.ReactNode;
  routes?: { title: string; href: string }[]; // Optional sub-routes
  active?: boolean; // Is this the current section?
};

// Helper to get admin nav sections based on pathname
export const getAdminNav = (pathname: string, t: (s: string) => string): NavSectionType[] => {
  const sections: NavSectionType[] = [
    {
      title: t("Dashboard"),
      href: "/",
      icon: <LayoutGrid className="h-4 w-4" />,
      active: pathname === "/"
    },
    {
      title: t("Reports"),
      href: "/admin/reports",
      icon: <BarChart4 className="h-4 w-4" />,
      routes: [
        { title: t("Sales Analytics"), href: "/admin/reports/sales" },
        { title: t("Staff Reports"), href: "/admin/reports/staff" },
        { title: t("Inventory Reports"), href: "/admin/reports/inventory" },
        { title: t("Customer Insights"), href: "/admin/reports/customers" },
        { title: t("Custom Reports"), href: "/admin/reports/custom" }
      ],
      active: pathname.startsWith("/admin/reports")
    },
    {
      title: t("Staff"),
      href: "/admin/staff",
      icon: <Users className="h-4 w-4" />,
      routes: [
        { title: t("Staff Directory"), href: "/admin/staff/directory" },
        { title: t("Attendance"), href: "/admin/staff/attendance" },
        { title: t("Performance"), href: "/admin/staff/performance" },
        { title: t("Tasks"), href: "/admin/staff/tasks" },
        { title: t("Payroll"), href: "/admin/staff/payroll" }
      ],
      active: pathname.startsWith("/admin/staff")
    },
    {
      title: t("Inventory"),
      href: "/admin/inventory",
      icon: <ShoppingCart className="h-4 w-4" />,
      routes: [
        { title: t("Stock Levels"), href: "/admin/inventory/stock" },
        { title: t("Ingredients"), href: "/admin/inventory/ingredients" },
        { title: t("Recipes"), href: "/admin/inventory/recipes" },
        { title: t("Suppliers"), href: "/admin/inventory/suppliers" },
        { title: t("Purchase Orders"), href: "/admin/inventory/purchase-orders" }
      ],
      active: pathname.startsWith("/admin/inventory")
    },
    {
      title: t("Menu"),
      href: "/admin/menu",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      routes: [
        { title: t("Food Items"), href: "/admin/menu/food" },
        { title: t("Categories"), href: "/admin/menu/categories" },
        { title: t("Recipes"), href: "/admin/menu/recipes" },
        { title: t("Modifiers"), href: "/admin/menu/modifiers" },
        { title: t("Pricing"), href: "/admin/menu/pricing" },
        { title: t("Menu Design"), href: "/admin/menu/design" }
      ],
      active: pathname.startsWith("/admin/menu")
    },
    {
      title: t("Tasks"),
      href: "/admin/tasks",
      icon: <ClipboardList className="h-4 w-4" />,
      active: pathname === "/admin/tasks"
    },
    {
      title: t("Food Safety"),
      href: "/admin/food-safety",
      icon: <ClipboardCheck className="h-4 w-4" />,
      routes: [
        { title: t("Dashboard"), href: "/admin/food-safety" },
        { title: t("Checklists"), href: "/admin/food-safety/checklists" },
        { title: t("Create Checklist"), href: "/admin/food-safety/checklists/new" }
      ],
      active: pathname.startsWith("/admin/food-safety")
    },
    {
      title: t("Finance"),
      href: "/admin/finance",
      icon: <DollarSign className="h-4 w-4" />,
      routes: [
        { title: t("Daily Sales"), href: "/admin/finance/daily-sales" },
        { title: t("Financial Reports"), href: "/admin/finance/financial-reports" },
        { title: t("Payment Management"), href: "/admin/finance/payment-management" },
        { title: t("Budgeting"), href: "/admin/finance/budgeting" }
      ],
      active: pathname.startsWith("/admin/finance")
    },
    {
      title: t("Customers"),
      href: "/admin/customers",
      icon: <User className="h-4 w-4" />,
      routes: [
        { title: t("Customer Database"), href: "/admin/customers/database" },
        { title: t("Feedback"), href: "/admin/customers/feedback" },
        { title: t("Promotions"), href: "/admin/customers/promotions" },
        { title: t("Loyalty Program"), href: "/admin/customers/loyalty" }
      ],
      active: pathname.startsWith("/admin/customers")
    },
    {
      title: t("Communication"),
      href: "/admin/communication",
      icon: <MessageSquare className="h-4 w-4" />,
      active: pathname === "/admin/communication"
    },
    {
      title: t("Settings"),
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
      routes: [
        { title: t("Restaurant Profile"), href: "/admin/settings/profile" },
        { title: t("User Access"), href: "/admin/settings/users" },
        { title: t("Printers & Devices"), href: "/admin/settings/devices" },
        { title: t("System Logs"), href: "/admin/settings/logs" },
        { title: t("Integrations"), href: "/admin/settings/integrations" }
      ],
      active: pathname.startsWith("/admin/settings")
    }
  ];

  return sections;
};

// Helper to get waiter nav sections based on pathname
export const getWaiterNav = (pathname: string, t: (s: string) => string): NavSectionType[] => {
  const sections: NavSectionType[] = [
    {
      title: t("Dashboard"),
      href: "/waiter",
      icon: <LayoutGrid className="h-4 w-4" />,
      active: pathname === "/waiter"
    },
    {
      title: t("Orders"),
      href: "/waiter/orders",
      icon: <ReceiptText className="h-4 w-4" />,
      active: pathname === "/waiter/orders"
    },
    {
      title: t("Tables"),
      href: "/waiter/tables",
      icon: <MapPin className="h-4 w-4" />,
      active: pathname === "/waiter/tables"
    },
    {
      title: t("Payments"),
      href: "/waiter/payments",
      icon: <DollarSign className="h-4 w-4" />,
      active: pathname === "/waiter/payments"
    },
    {
      title: t("Tasks"),
      href: "/waiter/tasks",
      icon: <ClipboardList className="h-4 w-4" />,
      active: pathname === "/waiter/tasks"
    },
    {
      title: t("Food Safety"),
      href: "/waiter/food-safety",
      icon: <ClipboardCheck className="h-4 w-4" />,
      active: pathname === "/waiter/food-safety"
    }
  ];

  return sections;
};

// Helper to get kitchen nav sections based on pathname
export const getKitchenNav = (pathname: string, t: (s: string) => string): NavSectionType[] => {
  const sections: NavSectionType[] = [
    {
      title: t("Dashboard"),
      href: "/kitchen",
      icon: <LayoutGrid className="h-4 w-4" />,
      active: pathname === "/kitchen"
    },
    {
      title: t("Recipes"),
      href: "/kitchen/recipes",
      icon: <Salad className="h-4 w-4" />,
      active: pathname === "/kitchen/recipes"
    },
    {
      title: t("Inventory"),
      href: "/kitchen/inventory",
      icon: <ShoppingCart className="h-4 w-4" />,
      active: pathname === "/kitchen/inventory"
    },
    {
      title: t("Tasks"),
      href: "/kitchen/tasks",
      icon: <ClipboardList className="h-4 w-4" />,
      active: pathname === "/kitchen/tasks"
    },
    {
      title: t("Food Safety"),
      href: "/kitchen/food-safety",
      icon: <ClipboardCheck className="h-4 w-4" />,
      active: pathname === "/kitchen/food-safety"
    }
  ];

  return sections;
};

// Helper to get customer nav sections based on pathname
export const getCustomerNav = (pathname: string, t: (s: string) => string): NavSectionType[] => {
  const sections: NavSectionType[] = [
    {
      title: t("Menu"),
      href: "/customer/menu",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      active: pathname === "/customer/menu"
    },
    {
      title: t("Feedback"),
      href: "/customer/feedback",
      icon: <FileQuestion className="h-4 w-4" />,
      active: pathname === "/customer/feedback"
    },
    {
      title: t("Promotions"),
      href: "/customer/promotions",
      icon: <Bell className="h-4 w-4" />,
      active: pathname === "/customer/promotions"
    }
  ];

  return sections;
};

// Helper to get system nav sections based on pathname
export const getSystemNav = (pathname: string, t: (s: string) => string): NavSectionType[] => {
  const sections: NavSectionType[] = [
    {
      title: t("Dashboard"),
      href: "/system",
      icon: <LayoutGrid className="h-4 w-4" />,
      active: pathname === "/system"
    },
    {
      title: t("User Management"),
      href: "/system/users",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/system/users"
    },
    {
      title: t("Error Logs"),
      href: "/system/logs",
      icon: <KeyRound className="h-4 w-4" />,
      active: pathname === "/system/logs"
    },
    {
      title: t("Documentation"),
      href: "/system/docs",
      icon: <FileQuestion className="h-4 w-4" />,
      active: pathname === "/system/docs"
    }
  ];

  return sections;
};

// Get nav sections based on interface and location
export const getNavSections = (
  interfaceType: "admin" | "waiter" | "kitchen" | "customer" | "system",
  location: Location
): NavSectionType[] => {
  const { t } = useLanguage();
  
  const pathname = location.pathname;

  switch (interfaceType) {
    case "admin":
      return getAdminNav(pathname, t);
    case "waiter":
      return getWaiterNav(pathname, t);
    case "kitchen":
      return getKitchenNav(pathname, t);
    case "customer":
      return getCustomerNav(pathname, t);
    case "system":
      return getSystemNav(pathname, t);
    default:
      return [];
  }
};

export const MainSidebar: React.FC<{
  open: boolean;
  onToggle: () => void;
  interface: "admin" | "waiter" | "kitchen" | "customer" | "system";
}> = ({ open, onToggle, interface: interfaceType }) => {
  const location = useLocation();
  const navSections = getNavSections(interfaceType, location);
  const { t } = useLanguage();
  
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r">
      <div className="flex h-screen flex-col">
        <div className="px-3 py-2 flex h-14 items-center border-b">
          <h2 className="text-lg font-semibold">Restaurant Manager</h2>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {navSections.map((section, index) => (
              <div key={index} className="py-1">
                <Link
                  to={section.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    section.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="mr-3 h-4 w-4">{section.icon}</span>
                  <span>{section.title}</span>
                  {section.routes && (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  )}
                </Link>
                
                {section.routes && section.active && (
                  <div className="mt-1 ml-6 space-y-1">
                    {section.routes.map((route, routeIndex) => (
                      <Link
                        key={routeIndex}
                        to={route.href}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          location.pathname === route.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      >
                        {route.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="border-t p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@restaurant.com</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
