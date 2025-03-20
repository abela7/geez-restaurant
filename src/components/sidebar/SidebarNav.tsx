
import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavItem } from "./NavItem";
import { 
  getAdminNav, 
  getWaiterNav, 
  getKitchenNav, 
  getCustomerNav, 
  getSystemNav 
} from "@/utils/navigationHelpers";

interface SidebarNavProps {
  interface: "admin" | "waiter" | "kitchen" | "customer" | "system";
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ interface: interfaceType }) => {
  const location = useLocation();
  const { t } = useLanguage();

  // Get the appropriate nav sections based on the interface type
  const getNavSections = () => {
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

  const navSections = getNavSections();

  return (
    <nav className="space-y-1 px-2">
      {navSections.map((section, index) => (
        <NavItem key={index} section={section} />
      ))}
    </nav>
  );
};
