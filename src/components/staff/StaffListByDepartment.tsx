
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "@/contexts/LanguageContext";

type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  department: string | null;
  attendance: string | null;
  performance: number | null;
  hourly_rate: number | null;
  image_url: string | null;
};

type StaffListByDepartmentProps = {
  staffMembers: StaffMember[];
  department: string;
};

const StaffListByDepartment: React.FC<StaffListByDepartmentProps> = ({ staffMembers, department }) => {
  const navigate = useNavigate();
  
  const filteredStaff = department === "all" 
    ? staffMembers 
    : staffMembers.filter(staff => staff.department === department);

  const getFullName = (staff: StaffMember) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

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

  if (filteredStaff.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground"><T text="No staff members found" /></p>
      </div>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Staff Member" /></TableHead>
            <TableHead><T text="Role" /></TableHead>
            {department === "all" && <TableHead><T text="Department" /></TableHead>}
            <TableHead><T text="Status" /></TableHead>
            <TableHead><T text="Performance" /></TableHead>
            <TableHead><T text="Rate" /></TableHead>
            <TableHead className="text-right"><T text="Actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <img
                      src={staff.image_url || "/placeholder.svg"}
                      alt={getFullName(staff)}
                      className="aspect-square h-10 w-10 object-cover"
                    />
                  </Avatar>
                  <div>
                    {getFullName(staff)}
                  </div>
                </div>
              </TableCell>
              <TableCell>{staff.role}</TableCell>
              {department === "all" && <TableCell>{staff.department}</TableCell>}
              <TableCell>
                <Badge variant={getAttendanceVariant(staff.attendance)}>
                  {staff.attendance || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{staff.performance || 0}%</span>
                </div>
              </TableCell>
              <TableCell>£{staff.hourly_rate?.toFixed(2) || '0.00'}/hr</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                >
                  <T text="View" />
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default StaffListByDepartment;
