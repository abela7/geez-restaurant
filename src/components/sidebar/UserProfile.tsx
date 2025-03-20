
import React from "react";
import { User, LogOut } from "lucide-react";

export const UserProfile: React.FC = () => {
  return (
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
  );
};
