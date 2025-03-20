import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, DollarSign, Users, Package, BarChart, 
  User, Settings, ClipboardList, ChevronDown, ChevronRight, Languages,
  BookUser, ListChecks, BadgeDollarSign, Menu as MenuIcon, LogOut, 
  ChevronLeft, Utensils, LayoutGrid, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isOpen, 
  hasDropdown = false, 
  isExpanded = false, 
  onClick 
}) => {
  return (
    <div className="relative">
      <Link
        to={to}
        className={cn(
          "flex items-center px-3 py-2.5 my-1 rounded-md transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground font-medium" 
            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onClick={hasDropdown ? onClick : undefined}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        {isOpen && (
          <>
            <span className="ml-2 text-sm"><T text={label} /></span>
            {hasDropdown && (
              <div className="ml-auto">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </>
        )}
      </Link>
    </div>
  );
};

interface DropdownMenuProps {
  items: { to: string; label: string }[];
  isOpen: boolean;
  isExpanded: boolean;
  parentPath: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isOpen, isExpanded, parentPath }) => {
  const location = useLocation();
  
  if (!isOpen || !isExpanded) return null;
  
  return (
    <div className="ml-8 pl-2 border-l border-sidebar-border">
      {items.map((item) => (
        <Link
          key={item.to}
          to={`${parentPath}/${item.to}`}
          className={cn(
            "block px-3 py-1.5 my-1 rounded-md text-sm transition-colors",
            location.pathname === `${parentPath}/${item.to}` 
              ? "bg-primary/80 text-primary-foreground"
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <T text={item.label} />
        </Link>
      ))}
    </div>
  );
};

interface NavSection {
  label: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { to: string; label: string }[];
}

interface MainSidebarProps {
  open: boolean;
  onToggle: () => void;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

const staffManagementQuickLinks = [
  { to: "/admin/staff", label: "Overview", icon: <Users size={20} /> },
  { to: "/admin/staff/directory", label: "Directory", icon: <BookUser size={20} /> },
  { to: "/admin/staff/tasks", label: "Tasks", icon: <ListChecks size={20} /> },
  { to: "/admin/staff/payroll", label: "Payroll", icon: <BadgeDollarSign size={20} /> },
];

export const MainSidebar: React.FC<MainSidebarProps> = ({ 
  open, 
  onToggle,
  interface: userInterface = 'admin'
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { t } = useLanguage();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section) 
        : [...prev, section]
    );
  };

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
        { to: "budgeting", label: "Budgeting" }
      ]
    },
    { 
      label: "Staff Management", 
      icon: <Users size={20} />, 
      path: "/admin/staff",
      submenu: [
        { to: "directory", label: "Staff Directory" },
        { to: "performance", label: "Performance Tracking" },
        { to: "attendance", label: "Time & Attendance" },
        { to: "tasks", label: "Task Management" },
        { to: "payroll", label: "Payroll" }
      ]
    },
    { 
      label: "Menu Management", 
      icon: <MenuIcon size={20} />, 
      path: "/admin/menu",
      submenu: [
        { to: "food", label: "Food Management" },
        { to: "recipes", label: "Recipe Management" },
        { to: "categories", label: "Categories" },
        { to: "modifiers", label: "Modifiers & Options" },
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
        { to: "feedback", label: "Feedback" },
        { to: "database", label: "Customer Database" },
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

  const waiterLinks = [
    { to: "/waiter", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/waiter/tables", label: "Table Management", icon: <MenuIcon size={20} /> },
    { to: "/waiter/orders", label: "Order Management", icon: <ClipboardList size={20} /> },
    { to: "/waiter/payments", label: "Payment Processing", icon: <DollarSign size={20} /> },
    { to: "/waiter/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
    { to: "/login", label: "Logout", icon: <LogOut size={20} /> },
  ];

  const kitchenLinks = [
    { to: "/kitchen", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/kitchen/recipes", label: "Recipe Viewer", icon: <MenuIcon size={20} /> },
    { to: "/kitchen/inventory", label: "Inventory Check", icon: <Package size={20} /> },
    { to: "/kitchen/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
    { to: "/login", label: "Logout", icon: <LogOut size={20} /> },
  ];

  const customerLinks = [
    { to: "/menu", label: "Menu", icon: <MenuIcon size={20} /> },
    { to: "/feedback", label: "Feedback", icon: <ClipboardList size={20} /> },
    { to: "/promotions", label: "Promotions", icon: <DollarSign size={20} /> },
    { to: "/login", label: "Logout", icon: <LogOut size={20} /> },
  ];

  const systemLinks = [
    { to: "/system", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/system/errors", label: "Error Logs", icon: <ClipboardList size={20} /> },
    { to: "/system/users", label: "User Management", icon: <Users size={20} /> },
    { to: "/system/docs", label: "Documentation", icon: <ClipboardList size={20} /> },
    { to: "/login", label: "Logout", icon: <LogOut size={20} /> },
  ];

  let links;
  let interfaceTitle;
  let quickLinks = null;
  
  switch (userInterface) {
    case 'waiter':
      links = waiterLinks;
      interfaceTitle = "Waiter Interface";
      break;
    case 'kitchen':
      links = kitchenLinks;
      interfaceTitle = "Kitchen Staff Interface";
      break;
    case 'customer':
      links = customerLinks;
      interfaceTitle = "Menu & Feedback";
      break;
    case 'system':
      links = systemLinks;
      interfaceTitle = "System Administration";
      break;
    default:
      interfaceTitle = "Administrative Portal";
      
      if (location.pathname.includes('/admin/staff')) {
        quickLinks = staffManagementQuickLinks;
      }
  }

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-4 flex justify-between items-center h-16 border-b border-sidebar-border">
        <div className="text-xl font-bold text-primary">
          Habesha
        </div>
        
        <Button
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="w-10 h-10 bg-amber-400 hover:bg-amber-500 border-amber-500 text-amber-800"
          aria-label={t("Toggle sidebar")}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>
      
      <div className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="mb-4 px-3 py-1">
          <h2 className="text-xs uppercase font-semibold text-sidebar-foreground/70">
            <T text={userInterface === 'admin' ? 'Administrative Portal' : 
                   userInterface === 'waiter' ? 'Waiter Interface' :
                   userInterface === 'kitchen' ? 'Kitchen Staff Interface' :
                   userInterface === 'customer' ? 'Customer Interface' :
                   'System Administration'} />
          </h2>
        </div>
        
        <nav className="space-y-0.5">
          {userInterface === 'admin' ? (
            adminSections.map((section) => (
              <React.Fragment key={section.path}>
                <SidebarLink
                  to={section.submenu ? '#' : section.path}
                  icon={section.icon}
                  label={section.label}
                  isActive={
                    section.submenu 
                      ? location.pathname.startsWith(section.path) 
                      : location.pathname === section.path
                  }
                  isOpen={open}
                  hasDropdown={!!section.submenu}
                  isExpanded={expandedSections.includes(section.path)}
                  onClick={
                    section.submenu 
                      ? () => toggleSection(section.path) 
                      : undefined
                  }
                />
                {section.submenu && (
                  <DropdownMenu 
                    items={section.submenu} 
                    isOpen={open} 
                    isExpanded={expandedSections.includes(section.path)}
                    parentPath={section.path}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            links.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
                isOpen={open}
              />
            ))
          )}
        </nav>
      </div>
    </div>
  );
};
