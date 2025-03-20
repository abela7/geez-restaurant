
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useLanguage, T } from '@/contexts/LanguageContext';

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "p-4 border-t border-border flex items-center",
      collapsed ? "justify-center" : "justify-start"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg" alt="User" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      
      {!collapsed && (
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium truncate">Abebe Bekele</p>
          <p className="text-xs text-muted-foreground truncate">
            <T text="Manager" />
          </p>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
