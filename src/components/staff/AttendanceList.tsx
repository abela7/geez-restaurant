
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil } from "lucide-react";
import { StaffAttendance } from "@/hooks/useStaffAttendance";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type AttendanceListProps = {
  attendanceRecords: StaffAttendance[];
  isLoading: boolean;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
  onUpdateAttendance?: (id: string, data: Partial<StaffAttendance>) => Promise<any>;
};

const AttendanceList: React.FC<AttendanceListProps> = ({ 
  attendanceRecords, 
  isLoading,
  showStaffInfo = false,
  staffNames = {},
  onUpdateAttendance
}) => {
  const { t } = useLanguage();
  const [editRecord, setEditRecord] = useState<StaffAttendance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedData, setEditedData] = useState<Partial<StaffAttendance>>({});

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

  const handleEdit = (record: StaffAttendance) => {
    setEditRecord(record);
    setEditedData({
      status: record.status,
      check_in: record.check_in,
      check_out: record.check_out,
      hours_worked: record.hours_worked,
      notes: record.notes
    });
  };

  const handleCloseEdit = () => {
    setEditRecord(null);
    setEditedData({});
  };

  const handleInputChange = (field: keyof StaffAttendance, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!editRecord || !onUpdateAttendance) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateAttendance(editRecord.id, editedData);
      handleCloseEdit();
    } catch (error) {
      console.error("Failed to update attendance:", error);
    } finally {
      setIsSubmitting(false);
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
    <>
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
            {onUpdateAttendance && <TableHead className="text-right"><T text="Actions" /></TableHead>}
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
              {onUpdateAttendance && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editRecord} onOpenChange={(open) => !open && handleCloseEdit()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><T text="Edit Attendance Record" /></DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status"><T text="Status" /></Label>
                <Select 
                  value={editedData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present"><T text="Present" /></SelectItem>
                    <SelectItem value="Late"><T text="Late" /></SelectItem>
                    <SelectItem value="Absent"><T text="Absent" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours"><T text="Hours Worked" /></Label>
                <Input 
                  id="hours" 
                  type="number" 
                  step="0.01"
                  value={editedData.hours_worked || 0} 
                  onChange={(e) => handleInputChange('hours_worked', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in"><T text="Check In Time" /></Label>
                <Input 
                  id="check-in" 
                  type="time"
                  value={editedData.check_in ? format(new Date(editedData.check_in), 'HH:mm') : ''} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = editedData.check_in ? new Date(editedData.check_in) : new Date();
                      date.setHours(parseInt(hours), parseInt(minutes));
                      handleInputChange('check_in', date.toISOString());
                    } else {
                      handleInputChange('check_in', null);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check-out"><T text="Check Out Time" /></Label>
                <Input 
                  id="check-out" 
                  type="time"
                  value={editedData.check_out ? format(new Date(editedData.check_out), 'HH:mm') : ''} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = editedData.check_out ? new Date(editedData.check_out) : new Date();
                      date.setHours(parseInt(hours), parseInt(minutes));
                      handleInputChange('check_out', date.toISOString());
                    } else {
                      handleInputChange('check_out', null);
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes"><T text="Notes" /></Label>
              <Textarea 
                id="notes" 
                value={editedData.notes || ''} 
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEdit}><T text="Cancel" /></Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              <T text="Save Changes" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceList;
