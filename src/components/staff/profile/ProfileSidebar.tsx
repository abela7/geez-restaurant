
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, Mail, Calendar, DollarSign } from "lucide-react";
import { StaffMember } from "@/hooks/useStaffMembers";
import { format } from "date-fns";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ProfileSidebarProps = {
  staffMember: StaffMember;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ staffMember }) => {
  const { t } = useLanguage();
  
  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

  // Get first letter of first and last name for avatar fallback
  const getInitials = () => {
    const firstName = staffMember.first_name || "";
    const lastName = staffMember.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              {staffMember.image_url ? (
                <AvatarImage
                  src={staffMember.image_url}
                  alt={getFullName()}
                />
              ) : (
                <AvatarFallback>{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-xl font-bold">{getFullName()}</h2>
            <div className="mt-1 flex items-center">
              <Badge>{staffMember.role}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{staffMember.bio || "No bio available"}</p>
            
            <div className="mt-6 w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{staffMember.phone || "No phone"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{staffMember.email || "No email"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <T text="Started on" /> {staffMember.start_date ? format(new Date(staffMember.start_date), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">£{staffMember.hourly_rate?.toFixed(2) || '0.00'}/hr</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSidebar;
