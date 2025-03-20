
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, DownloadIcon, Printer } from "lucide-react";
import AttendanceList from "@/components/staff/AttendanceList";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import { StaffAttendance } from "@/hooks/useStaffAttendance";
import { useLanguage, T } from "@/contexts/LanguageContext";

type AttendanceSectionProps = {
  staffId: string;
  fullName: string;
  attendanceRecords: StaffAttendance[];
  isLoading: boolean;
  error: string | null;
  addAttendanceRecord: (record: Omit<StaffAttendance, 'id'>) => Promise<any>;
  onExportData: (data: any[], filename: string) => void;
};

const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  staffId,
  fullName,
  attendanceRecords,
  isLoading,
  error,
  addAttendanceRecord,
  onExportData
}) => {
  const { t } = useLanguage();
  const [newAttendanceDialog, setNewAttendanceDialog] = useState(false);

  const handleAttendanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!staffId) return;
    
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const status = formData.get('status') as string;
    const checkIn = formData.get('checkIn') as string;
    const checkOut = formData.get('checkOut') as string;
    const notes = formData.get('notes') as string;
    
    let hoursWorked = 0;
    
    if (checkIn && checkOut) {
      const checkInDate = new Date(`2000-01-01T${checkIn}`);
      const checkOutDate = new Date(`2000-01-01T${checkOut}`);
      hoursWorked = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
    }
    
    try {
      const newRecord = {
        staff_id: staffId,
        date,
        status,
        check_in: checkIn ? `${date}T${checkIn}:00` : null,
        check_out: checkOut ? `${date}T${checkOut}:00` : null,
        hours_worked: hoursWorked,
        notes
      };
      
      await addAttendanceRecord(newRecord);
      setNewAttendanceDialog(false);
    } catch (error) {
      console.error('Failed to add attendance record:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle><T text="Attendance Records" /></CardTitle>
          <CardDescription><T text="Staff check-in and check-out times" /></CardDescription>
        </div>
        <Dialog open={newAttendanceDialog} onOpenChange={setNewAttendanceDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              <T text="Add Record" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle><T text="Add Attendance Record" /></DialogTitle>
              <DialogDescription>
                <T text="Add a new attendance record for" /> {fullName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAttendanceSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    <T text="Date" />
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    <T text="Status" />
                  </Label>
                  <Select name="status" defaultValue="Present">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkIn" className="text-right">
                    <T text="Check In" />
                  </Label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="time"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkOut" className="text-right">
                    <T text="Check Out" />
                  </Label>
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="time"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    <T text="Notes" />
                  </Label>
                  <Input
                    id="notes"
                    name="notes"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit"><T text="Save Record" /></Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error ? (
          <ErrorDisplay error={error} />
        ) : (
          <AttendanceList 
            attendanceRecords={attendanceRecords}
            isLoading={isLoading}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onExportData(attendanceRecords, `${fullName}_Attendance`)}
          disabled={attendanceRecords.length === 0}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          <T text="Export Data" />
        </Button>
        <Button variant="outline" disabled={attendanceRecords.length === 0}>
          <Printer className="mr-2 h-4 w-4" />
          <T text="Print Report" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceSection;
