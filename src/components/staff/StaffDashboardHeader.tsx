
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface StaffDashboardHeaderProps {
  staffId: string;
  staffName: string;
  role: string;
  avatarUrl?: string;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({
  staffId,
  staffName,
  role,
  avatarUrl,
}) => {
  const { t } = useLanguage();
  const initials = staffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-14 w-14 mr-4 border">
            <AvatarImage src={avatarUrl} alt={staffName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{staffName}</h1>
              <Badge variant="outline" className="capitalize">
                {t(role)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              <T text="Welcome back! Ready to provide excellent service?" />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffDashboardHeader;
