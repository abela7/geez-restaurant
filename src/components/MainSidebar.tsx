
import React from "react";
import { SidebarNav } from "./sidebar/SidebarNav";
import { UserProfile } from "./sidebar/UserProfile";

export const MainSidebar: React.FC<{
  open: boolean;
  onToggle: () => void;
  interface: "admin" | "waiter" | "kitchen" | "customer" | "system";
}> = ({ open, onToggle, interface: interfaceType }) => {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r">
      <div className="flex h-screen flex-col">
        <div className="px-3 py-2 flex h-14 items-center border-b">
          <h2 className="text-lg font-semibold">Restaurant Manager</h2>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <SidebarNav interface={interfaceType} />
        </div>
        
        <div className="border-t p-3">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};
