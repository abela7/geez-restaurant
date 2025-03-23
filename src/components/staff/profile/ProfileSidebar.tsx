
import React from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type StaffMember } from "@/hooks/useStaffMembers";

interface ProfileSidebarProps {
  staff: StaffMember;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ staff }) => {
  const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
  
  const getInitials = () => {
    const firstName = staff.first_name || "";
    const lastName = staff.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          {staff.image_url ? (
            <AvatarImage 
              src={staff.image_url} 
              alt={fullName} 
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl font-bold mb-1">{fullName}</h2>
        <p className="text-muted-foreground mb-4">{staff.role}</p>
        
        {staff.skills && staff.skills.length > 0 && (
          <div className="w-full mt-4">
            <h3 className="text-sm font-medium mb-2"><T text="Skills" /></h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {staff.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="w-full mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium"><T text="Performance" /></h3>
            <span className="text-sm font-medium">
              {staff.performance ? `${staff.performance}%` : 'N/A'}
            </span>
          </div>
          
          {staff.performance && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${staff.performance}%` }}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
