
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useStaffAttendance } from "@/hooks/useStaffAttendance";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AttendanceSectionProps {
  staffId: string;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ staffId }) => {
  const { attendanceRecords, isLoading, error } = useStaffAttendance(staffId);
  const navigate = useNavigate();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    try {
      return format(parseISO(timeString), "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Late":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="mr-2 h-5 w-5" />
          <T text="Attendance Records" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p><T text="No attendance records found" /></p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className="font-medium ml-2">{formatDate(record.date)}</span>
                    </div>
                    <div className="flex items-center mt-1 space-x-4 text-sm text-muted-foreground">
                      {record.check_in && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>In: {formatTime(record.check_in)}</span>
                        </div>
                      )}
                      {record.check_out && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Out: {formatTime(record.check_out)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {record.hours_worked ? `${record.hours_worked} hours` : ''}
                  </div>
                </div>
                {record.notes && (
                  <div className="mt-2 text-sm text-muted-foreground italic">
                    {record.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/admin/staff/attendance?staffId=${staffId}`)}
        >
          <T text="View All Attendance Records" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceSection;
