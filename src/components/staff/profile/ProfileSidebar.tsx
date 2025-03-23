
import React from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, MapPin, Briefcase, Award } from "lucide-react";
import { format } from "date-fns";
import { StaffMember } from "@/hooks/useStaffMembers";

interface ProfileSidebarProps {
  staff: StaffMember;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ staff }) => {
  const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 mb-4">
            <AvatarImage src={staff.image_url || ""} alt={fullName} />
            <AvatarFallback className="text-2xl">{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold text-center">{fullName}</h2>
          
          <div className="mt-2 flex items-center justify-center space-x-2">
            <Badge variant="secondary">{staff.role}</Badge>
            {staff.department && (
              <Badge variant="outline">{staff.department}</Badge>
            )}
          </div>
          
          {staff.performance !== null && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {staff.performance}% <T text="Performance" />
                </span>
              </div>
            </div>
          )}
          
          <div className="w-full border-t my-4"></div>
          
          <div className="w-full space-y-3">
            {staff.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{staff.email}</span>
              </div>
            )}
            
            {staff.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{staff.phone}</span>
              </div>
            )}
            
            {staff.address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-sm">{staff.address}</span>
              </div>
            )}
            
            {staff.role && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{staff.role}</span>
              </div>
            )}
            
            {staff.start_date && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <T text="Started" />: {formatDate(staff.start_date)}
                </span>
              </div>
            )}
          </div>
          
          {staff.hourly_rate && (
            <div className="w-full border-t my-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground"><T text="Hourly Rate" /></span>
                <span className="font-medium">£{staff.hourly_rate.toFixed(2)}</span>
              </div>
              {staff.total_pay !== undefined && staff.total_pay > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground"><T text="Total Payments" /></span>
                  <span className="font-medium">£{staff.total_pay.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
          
          {staff.skills && staff.skills.length > 0 && (
            <div className="w-full border-t my-4 pt-4">
              <h3 className="text-sm font-medium mb-2"><T text="Skills" /></h3>
              <div className="flex flex-wrap gap-1.5">
                {staff.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
