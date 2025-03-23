
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StaffAttendance } from "@/hooks/useStaffAttendance";
import { cn } from "@/lib/utils";

type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  [key: string]: any;
};

type AttendanceRecordDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  onSubmit: (record: Omit<StaffAttendance, 'id'>) => Promise<any>;
};

const AttendanceRecordDialog: React.FC<AttendanceRecordDialogProps> = ({
  isOpen,
  onClose,
  staffMembers,
  onSubmit
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StaffAttendance>>({
    status: "Present",
    date: format(new Date(), "yyyy-MM-dd"),
    hours_worked: 0,
    notes: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleInputChange = (field: keyof StaffAttendance, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.staff_id) {
      return; // Validate required fields
    }
    
    setIsSubmitting(true);
    try {
      // Prepare check-in and check-out times if provided
      let checkIn = null;
      let checkOut = null;
      
      if (formData.check_in_time) {
        const checkInDate = new Date(selectedDate);
        const [hours, minutes] = formData.check_in_time.split(':');
        checkInDate.setHours(parseInt(hours), parseInt(minutes));
        checkIn = checkInDate.toISOString();
      }
      
      if (formData.check_out_time) {
        const checkOutDate = new Date(selectedDate);
        const [hours, minutes] = formData.check_out_time.split(':');
        checkOutDate.setHours(parseInt(hours), parseInt(minutes));
        checkOut = checkOutDate.toISOString();
      }
      
      // Calculate hours worked if both times are present
      let hoursWorked = formData.hours_worked || 0;
      if (checkIn && checkOut) {
        const checkInTime = new Date(checkIn).getTime();
        const checkOutTime = new Date(checkOut).getTime();
        hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        hoursWorked = parseFloat(hoursWorked.toFixed(2));
      }
      
      const recordData = {
        staff_id: formData.staff_id,
        date: formData.date as string,
        status: formData.status as string,
        check_in: checkIn,
        check_out: checkOut,
        hours_worked: hoursWorked,
        notes: formData.notes || null
      };
      
      await onSubmit(recordData as Omit<StaffAttendance, 'id'>);
      // Reset form and close dialog
      setFormData({
        status: "Present",
        date: format(new Date(), "yyyy-MM-dd"),
        hours_worked: 0,
        notes: ""
      });
      setSelectedDate(new Date());
      onClose();
    } catch (error) {
      console.error("Failed to submit attendance record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle><T text="Record Staff Attendance" /></DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="staff"><T text="Staff Member" /></Label>
            <Select 
              value={formData.staff_id} 
              onValueChange={(value) => handleInputChange('staff_id', value)}
            >
              <SelectTrigger id="staff">
                <SelectValue placeholder={t("Select staff member")} />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {`${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "Staff Member"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date"><T text="Date" /></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>{t("Pick a date")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status"><T text="Status" /></Label>
              <Select 
                value={formData.status} 
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
          </div>
          
          {formData.status !== "Absent" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in"><T text="Check In Time" /></Label>
                <Input 
                  id="check-in" 
                  type="time" 
                  value={formData.check_in_time || ""} 
                  onChange={(e) => handleInputChange('check_in_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check-out"><T text="Check Out Time" /></Label>
                <Input 
                  id="check-out" 
                  type="time" 
                  value={formData.check_out_time || ""} 
                  onChange={(e) => handleInputChange('check_out_time', e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="hours-worked"><T text="Hours Worked" /></Label>
            <Input 
              id="hours-worked" 
              type="number" 
              step="0.01"
              value={formData.hours_worked || ""} 
              onChange={(e) => handleInputChange('hours_worked', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes"><T text="Notes" /></Label>
            <Textarea 
              id="notes" 
              value={formData.notes || ""} 
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t("Optional notes about this attendance record")}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <T text="Cancel" />
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.staff_id}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            <T text="Save Record" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceRecordDialog;
