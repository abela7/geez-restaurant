
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, DollarSign, Users, Menu as MenuIcon, Package, BarChart, 
  User, Settings, ClipboardList, ChevronDown, ChevronRight, Languages
} from 'lucide-react';

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
  const { t } = useLanguage();
  
  return (
    <div className="relative">
      <Link
        to={to}
        className={cn(
          "flex items-center px-3 py-2 my-1 rounded-md transition-colors",
          isActive ? "bg-turmeric text-eggplant" : "hover:bg-accent"
        )}
        onClick={hasDropdown ? onClick : undefined}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        {isOpen && (
          <>
            <span className="ml-2"><T text={label} /></span>
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
    <div className="ml-8 pl-2 border-l border-sand">
      {items.map((item) => (
        <Link
          key={item.to}
          to={`${parentPath}/${item.to}`}
          className={cn(
            "block px-3 py-1.5 my-1 rounded-md text-sm transition-colors",
            location.pathname === `${parentPath}/${item.to}` 
              ? "bg-turmeric text-eggplant"
              : "hover:bg-accent"
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

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  interface?: 'admin' | 'waiter' | 'kitchen' | 'customer' | 'system';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onToggle,
  interface: userInterface = 'admin'
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section) 
        : [...prev, section]
    );
  };

  // Admin navigation structure
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
        { to: "tasks", label: "Task Assignment" },
        { to: "payroll", label: "Payroll" }
      ]
    },
    { 
      label: "Menu Management", 
      icon: <MenuIcon size={20} />, 
      path: "/admin/menu",
      submenu: [
        { to: "items", label: "Menu Items" },
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
    }
  ];

  // Waiter links
  const waiterLinks = [
    { to: "/waiter", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/waiter/tables", label: "Table Management", icon: <MenuIcon size={20} /> },
    { to: "/waiter/orders", label: "Order Management", icon: <ClipboardList size={20} /> },
    { to: "/waiter/payments", label: "Payment Processing", icon: <DollarSign size={20} /> },
    { to: "/waiter/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
  ];

  // Kitchen links
  const kitchenLinks = [
    { to: "/kitchen", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/kitchen/recipes", label: "Recipe Viewer", icon: <MenuIcon size={20} /> },
    { to: "/kitchen/inventory", label: "Inventory Check", icon: <Package size={20} /> },
    { to: "/kitchen/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
  ];

  // Customer links
  const customerLinks = [
    { to: "/menu", label: "Menu", icon: <MenuIcon size={20} /> },
    { to: "/feedback", label: "Feedback", icon: <ClipboardList size={20} /> },
    { to: "/promotions", label: "Promotions", icon: <DollarSign size={20} /> },
  ];

  // System links
  const systemLinks = [
    { to: "/system", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/system/errors", label: "Error Logs", icon: <ClipboardList size={20} /> },
    { to: "/system/users", label: "User Management", icon: <Users size={20} /> },
    { to: "/system/docs", label: "Documentation", icon: <ClipboardList size={20} /> },
  ];

  // Determine which links to show based on interface
  let links;
  let interfaceTitle;
  
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
      // For admin, we'll handle the links differently
      interfaceTitle = "Administrative Portal";
  }

  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "h-screen bg-cream fixed left-0 top-0 z-10 flex flex-col border-r border-sand transition-all duration-300 ease-in-out md:translate-x-0",
        open ? "w-64" : "w-16",
        !open && "md:w-16 w-0 -translate-x-full md:translate-x-0" // Mobile handling
      )}
    >
      <div className="p-4 flex justify-center items-center h-16 border-b border-sand">
        {open ? (
          <h1 className="text-xl font-bold text-plum"><T text="Habesha" /></h1>
        ) : (
          <div className="w-8 h-8 bg-turmeric rounded-full flex items-center justify-center">
            <span className="text-eggplant font-bold text-sm">H</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 py-4 px-2 overflow-y-auto">
        {open && (
          <div className="mb-4 px-3 py-1">
            <h2 className="text-xs uppercase font-semibold text-plum opacity-70">
              <T text={interfaceTitle} />
            </h2>
          </div>
        )}
        
        <nav className="space-y-1">
          {userInterface === 'admin' ? (
            // Admin navigation with dropdown support
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
            // Standard navigation for other interfaces
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
      
      <div className="p-4 border-t border-sand">
        <SidebarLink
          to="/login"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
          label="Logout"
          isActive={false}
          isOpen={open}
        />
      </div>
    </div>
  );
};
