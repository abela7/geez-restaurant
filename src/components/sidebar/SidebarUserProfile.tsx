
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, T } from "@/contexts/LanguageContext";

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Get user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    if (user?.role === 'waiter') {
      navigate('/waiter/profile');
    } else if (user?.role === 'kitchen') {
      navigate('/kitchen/profile');
    } else {
      navigate('/admin/profile');
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {!collapsed ? (
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center p-0"
            onClick={handleProfileClick}
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {t(user?.role || "guest")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleLogout}
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
            onClick={handleProfileClick}
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
