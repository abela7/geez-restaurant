
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AttendanceSectionProps {
  staffId: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ staffId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('staff_attendance')
          .select('*')
          .eq('staff_id', staffId)
          .order('date', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setAttendanceRecords(data as AttendanceRecord[]);
      } catch (err: any) {
        console.error('Error fetching attendance:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [staffId]);
  
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    try {
      return format(new Date(timeString), "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "Late":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Absent":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="mr-2 h-5 w-5" />
          <T text="Recent Attendance" />
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
          <ul className="space-y-3">
            {attendanceRecords.map((record) => (
              <li key={record.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{formatDate(record.date)}</p>
                    <div className="flex items-center mt-1 space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{formatTime(record.check_in)}</span>
                      </div>
                      {record.check_out && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{formatTime(record.check_out)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    {record.hours_worked > 0 && (
                      <span className="text-xs mt-1 text-muted-foreground">
                        {record.hours_worked.toFixed(2)} hours
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
