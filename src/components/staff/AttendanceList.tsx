
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { StaffAttendance } from "@/hooks/useStaffAttendance";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

type AttendanceListProps = {
  attendanceRecords: StaffAttendance[];
  isLoading: boolean;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
};

const AttendanceList: React.FC<AttendanceListProps> = ({ 
  attendanceRecords, 
  isLoading,
  showStaffInfo = false,
  staffNames = {}
}) => {
  const { t } = useLanguage();

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'default';
      case 'late':
        return 'secondary';
      case 'absent':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    try {
      return format(new Date(timeString), 'HH:mm');
    } catch (e) {
      return timeString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground"><T text="No attendance records found" /></p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showStaffInfo && <TableHead><T text="Staff Member" /></TableHead>}
          <TableHead><T text="Date" /></TableHead>
          <TableHead><T text="Status" /></TableHead>
          <TableHead><T text="Check In" /></TableHead>
          <TableHead><T text="Check Out" /></TableHead>
          <TableHead><T text="Hours" /></TableHead>
          <TableHead><T text="Notes" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceRecords.map((record) => (
          <TableRow key={record.id}>
            {showStaffInfo && <TableCell>{staffNames[record.staff_id] || record.staff_id}</TableCell>}
            <TableCell>
              {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : '-'}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(record.status)}>
                {record.status}
              </Badge>
            </TableCell>
            <TableCell>{formatTime(record.check_in)}</TableCell>
            <TableCell>{formatTime(record.check_out)}</TableCell>
            <TableCell>{record.hours_worked}</TableCell>
            <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceList;
