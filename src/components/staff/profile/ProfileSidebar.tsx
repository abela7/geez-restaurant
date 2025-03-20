
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, Mail, Calendar, DollarSign } from "lucide-react";
import { StaffMember } from "@/hooks/useStaffMembers";
import { format } from "date-fns";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ProfileSidebarProps = {
  staffMember: StaffMember;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ staffMember }) => {
  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <img
                src={staffMember.image_url || "/placeholder.svg"}
                alt={getFullName()}
                className="aspect-square h-full w-full object-cover"
              />
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
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Skills & Expertise" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {staffMember.skills && staffMember.skills.length > 0 ? (
              staffMember.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSidebar;
