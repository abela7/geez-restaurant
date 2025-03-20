
import React from 'react';
import { User, LogOut } from 'lucide-react';

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  return (
    <div className="border-t border-gray-200 p-4">
      {!collapsed ? (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@restaurant.com</p>
          </div>
          <LogOut className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
