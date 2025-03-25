
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.username;

  return (
    <div className="border-t border-gray-200 p-4">
      {!collapsed ? (
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center p-0"
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {t(user.role || "guest")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center p-0"
            onClick={() => logout()}
            title="Log out"
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
