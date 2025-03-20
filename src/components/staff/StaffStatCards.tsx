
import React from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { T } from "@/contexts/LanguageContext";
import { BookUser, CalendarDays, ListChecks, BadgeDollarSign } from "lucide-react";

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

type StaffStatCardsProps = {
  staffMembers: StaffMember[];
};

const StaffStatCards: React.FC<StaffStatCardsProps> = ({ staffMembers }) => {
  const navigate = useNavigate();
  
  // Calculate statistics for dashboard cards
  const presentCount = staffMembers.filter(s => s.attendance === "Present").length;
  const totalHourlyRate = staffMembers.reduce((acc, staff) => acc + (staff.hourly_rate || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/directory")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground"><T text="Staff Directory" /></p>
            <h3 className="text-2xl font-bold">{staffMembers.length}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <BookUser className="h-5 w-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/attendance")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground"><T text="Present Today" /></p>
            <h3 className="text-2xl font-bold">{presentCount}</h3>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
            <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/tasks")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground"><T text="Task Management" /></p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
            <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/staff/payroll")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground"><T text="Total Wage Per Hour" /></p>
            <h3 className="text-2xl font-bold">£{totalHourlyRate.toFixed(2)}</h3>
          </div>
          <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
            <BadgeDollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffStatCards;
