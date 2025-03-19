
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, ChefHat, Users, ClipboardList, 
  ShoppingCart, Calendar, MessageSquare, DollarSign, 
  Languages, Map, FileText, CreditCard, FileCheck,
  BookOpen, BarChart, AlertCircle, UserCog, FileSymlink,
  Menu, Star, Gift
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive, isOpen }) => {
  const { t } = useLanguage();
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 my-1 rounded-md transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      {isOpen && <span className="ml-2"><T text={label} /></span>}
    </Link>
  );
};

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

  // Admin links
  const adminLinks = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/reports", label: "Reports", icon: <BarChart size={20} /> },
    { to: "/admin/staff", label: "Staff Management", icon: <Users size={20} /> },
    { to: "/admin/inventory", label: "Inventory Control", icon: <ShoppingCart size={20} /> },
    { to: "/admin/menu", label: "Menu Management", icon: <Menu size={20} /> },
    { to: "/admin/tasks", label: "Tasks", icon: <Calendar size={20} /> },
    { to: "/admin/communication", label: "Communication", icon: <MessageSquare size={20} /> },
    { to: "/admin/finance", label: "Finance", icon: <DollarSign size={20} /> },
    { to: "/admin/language", label: "Language Management", icon: <Languages size={20} /> },
  ];

  // Waiter links
  const waiterLinks = [
    { to: "/waiter", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/waiter/tables", label: "Table Management", icon: <Map size={20} /> },
    { to: "/waiter/orders", label: "Order Management", icon: <ClipboardList size={20} /> },
    { to: "/waiter/payments", label: "Payment Processing", icon: <CreditCard size={20} /> },
    { to: "/waiter/tasks", label: "Tasks", icon: <Calendar size={20} /> },
  ];

  // Kitchen links
  const kitchenLinks = [
    { to: "/kitchen", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/kitchen/recipes", label: "Recipe Viewer", icon: <BookOpen size={20} /> },
    { to: "/kitchen/inventory", label: "Inventory Check", icon: <ShoppingCart size={20} /> },
    { to: "/kitchen/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
  ];

  // Customer links
  const customerLinks = [
    { to: "/menu", label: "Menu", icon: <Menu size={20} /> },
    { to: "/feedback", label: "Feedback", icon: <Star size={20} /> },
    { to: "/promotions", label: "Promotions", icon: <Gift size={20} /> },
  ];

  // System links
  const systemLinks = [
    { to: "/system", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/system/errors", label: "Error Logs", icon: <AlertCircle size={20} /> },
    { to: "/system/users", label: "User Management", icon: <UserCog size={20} /> },
    { to: "/system/docs", label: "Documentation", icon: <FileSymlink size={20} /> },
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
      links = adminLinks;
      interfaceTitle = "Administrative Portal";
  }

  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-10 flex flex-col border-r transition-all duration-300 ease-in-out md:translate-x-0",
        open ? "w-64" : "w-16",
        !open && "md:w-16 w-0 -translate-x-full md:translate-x-0" // Mobile handling
      )}
    >
      <div className="p-4 flex justify-center items-center h-16 border-b">
        {open ? (
          <h1 className="text-xl font-bold text-sidebar-foreground"><T text="Habesha" /></h1>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 py-4 px-2 overflow-y-auto">
        {open && (
          <div className="mb-4 px-3 py-1">
            <h2 className="text-xs uppercase font-semibold text-sidebar-foreground opacity-70">
              <T text={interfaceTitle} />
            </h2>
          </div>
        )}
        
        <nav className="space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={location.pathname === link.to}
              isOpen={open}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
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
