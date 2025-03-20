
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DownloadIcon, Printer } from "lucide-react";
import { StaffMember } from "@/hooks/useStaffMembers";
import { useLanguage, T } from "@/contexts/LanguageContext";

type PerformanceSectionProps = {
  staffMember: StaffMember;
  onExportData: (data: any[], filename: string) => void;
};

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ 
  staffMember,
  onExportData
}) => {
  const { t } = useLanguage();
  
  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base"><T text="Overall Performance" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{staffMember.performance || 0}%</span>
                </div>
              </div>
              <Progress value={staffMember.performance || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base"><T text="Current Status" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant={staffMember.attendance === "Present" ? "default" : 
                               staffMember.attendance === "Late" ? "outline" : 
                               "destructive"}>
                  {staffMember.attendance || "Unknown"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Performance Metrics" /></CardTitle>
          <CardDescription><T text="Last 30 days performance" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium"><T text="Customer Service" /></div>
                <div className="text-sm text-muted-foreground">92%</div>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium"><T text="Team Collaboration" /></div>
                <div className="text-sm text-muted-foreground">88%</div>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium"><T text="Speed & Efficiency" /></div>
                <div className="text-sm text-muted-foreground">95%</div>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium"><T text="Quality of Work" /></div>
                <div className="text-sm text-muted-foreground">96%</div>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onExportData([
            { metric: 'Customer Service', value: 92 },
            { metric: 'Team Collaboration', value: 88 },
            { metric: 'Speed & Efficiency', value: 95 },
            { metric: 'Quality of Work', value: 96 }
          ], `${getFullName()}_Performance`)}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            <T text="Export Data" />
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            <T text="Print Report" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PerformanceSection;
