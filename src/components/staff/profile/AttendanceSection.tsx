
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, DownloadIcon, Printer, Clock } from "lucide-react";
import AttendanceList from "@/components/staff/AttendanceList";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import { StaffAttendance } from "@/hooks/useStaffAttendance";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

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
  const { toast } = useToast();
  const [newAttendanceDialog, setNewAttendanceDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    status: "Present",
    checkIn: "",
    checkOut: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateHoursWorked = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInDate = new Date(`2000-01-01T${checkIn}`);
    const checkOutDate = new Date(`2000-01-01T${checkOut}`);
    
    // Handle case where checkout is before checkin (next day)
    if (checkOutDate < checkInDate) {
      checkOutDate.setDate(checkOutDate.getDate() + 1);
    }
    
    return (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
  };

  const handleAttendanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!staffId) return;
    
    setIsSubmitting(true);
    
    try {
      const hoursWorked = calculateHoursWorked(formData.checkIn, formData.checkOut);
      
      const newRecord = {
        staff_id: staffId,
        date: formData.date,
        status: formData.status,
        check_in: formData.checkIn ? `${formData.date}T${formData.checkIn}:00` : null,
        check_out: formData.checkOut ? `${formData.date}T${formData.checkOut}:00` : null,
        hours_worked: hoursWorked,
        notes: formData.notes || null
      };
      
      await addAttendanceRecord(newRecord);
      
      // Reset form
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        status: "Present",
        checkIn: "",
        checkOut: "",
        notes: ""
      });
      
      setNewAttendanceDialog(false);
      
      toast({
        title: "Success",
        description: "Attendance record added successfully",
      });
    } catch (error: any) {
      console.error('Failed to add attendance record:', error);
      toast({
        title: "Error",
        description: `Failed to add attendance record: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReport = () => {
    toast({
      title: "Information",
      description: "Print functionality will be implemented in a future update.",
    });
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
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    <T text="Status" />
                  </Label>
                  <Select 
                    name="status" 
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
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
                
                {formData.status !== "Absent" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="checkIn" className="text-right">
                        <T text="Check In" />
                      </Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="checkIn"
                          name="checkIn"
                          type="time"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          className="flex-1"
                          required={formData.status !== "Absent"}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="checkOut" className="text-right">
                        <T text="Check Out" />
                      </Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="checkOut"
                          name="checkOut"
                          type="time"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          className="flex-1"
                          required={formData.status !== "Absent"}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    <T text="Notes" />
                  </Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder={formData.status === "Absent" ? "Reason for absence..." : "Additional notes..."}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <T text="Saving..." /> : <T text="Save Record" />}
                </Button>
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
        <Button 
          variant="outline" 
          onClick={handlePrintReport}
          disabled={attendanceRecords.length === 0}
        >
          <Printer className="mr-2 h-4 w-4" />
          <T text="Print Report" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceSection;
