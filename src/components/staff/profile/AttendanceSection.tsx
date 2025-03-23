
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, CheckCircle2, Clock, Filter, ArrowUpDown, 
  ChevronRight, ChevronLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  notes: string | null;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ staffId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: "date",
    direction: "desc"
  });
  const pageSize = 5;
  
  useEffect(() => {
    fetchAttendance();
  }, [staffId, statusFilter, page, sorting]);
  
  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_attendance')
        .select('*')
        .eq('staff_id', staffId)
        .order(sorting.field, { ascending: sorting.direction === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setAttendanceRecords(data as AttendanceRecord[]);
    } catch (err: any) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSort = () => {
    setSorting(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
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
      return format(new Date(dateString), "EEE, MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="mr-2 h-5 w-5" />
          <T text="Attendance Records" />
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="Present"><T text="Present" /></SelectItem>
              <SelectItem value="Late"><T text="Late" /></SelectItem>
              <SelectItem value="Absent"><T text="Absent" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSort}
            className="h-8 px-2"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>
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
          <>
            <ul className="space-y-3">
              {attendanceRecords.map((record) => (
                <li key={record.id} className="border p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-base">{formatDate(record.date)}</span>
                        <Badge className={`ml-2 ${getStatusColor(record.status)}`}>
                          {record.status}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span><T text="In" />: {formatTime(record.check_in)}</span>
                        </div>
                        {record.check_out && (
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span><T text="Out" />: {formatTime(record.check_out)}</span>
                          </div>
                        )}
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-sm italic">"{record.notes}"</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {record.hours_worked > 0 && (
                        <div className="text-sm font-medium">
                          {record.hours_worked.toFixed(2)} <T text="hours" />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <T text="Previous" />
              </Button>
              <span className="text-sm text-muted-foreground">
                <T text="Page" /> {page}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p + 1)}
                disabled={attendanceRecords.length < pageSize}
              >
                <T text="Next" />
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceSection;
