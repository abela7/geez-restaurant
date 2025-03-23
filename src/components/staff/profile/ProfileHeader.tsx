
import React from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { type StaffMember } from "@/hooks/useStaffMembers";

interface ProfileHeaderProps {
  staff: StaffMember;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ staff }) => {
  const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.trim();
  
  const getAttendanceVariant = (attendance: string | null) => {
    switch (attendance) {
      case "Present":
        return "default";
      case "Late":
        return "secondary";
      case "Absent":
        return "destructive";
      default:
        return "outline";
    }
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
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Role" /></h3>
            <p className="mt-1 flex items-center">
              <span className="font-medium">{staff.role}</span>
              {staff.department && (
                <Badge variant="outline" className="ml-2">
                  {staff.department}
                </Badge>
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Status" /></h3>
            <p className="mt-1">
              {staff.attendance ? (
                <Badge variant={getAttendanceVariant(staff.attendance)}>
                  {staff.attendance}
                </Badge>
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Start Date" /></h3>
            <p className="mt-1 font-medium">
              {formatDate(staff.start_date || staff.hiring_date)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Email" /></h3>
            <p className="mt-1 font-medium">
              {staff.email || <span className="text-muted-foreground">Not provided</span>}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Phone" /></h3>
            <p className="mt-1 font-medium">
              {staff.phone || <span className="text-muted-foreground">Not provided</span>}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground"><T text="Hourly Rate" /></h3>
            <p className="mt-1 font-medium">
              {staff.hourly_rate ? `£${staff.hourly_rate.toFixed(2)}` : <span className="text-muted-foreground">Not set</span>}
            </p>
          </div>
        </div>
        
        {staff.bio && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2"><T text="Bio" /></h3>
            <p className="text-sm">{staff.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
