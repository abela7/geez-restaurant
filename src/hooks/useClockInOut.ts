
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export type ClockAction = "in" | "out";

interface Attendance {
  id: string;
  staff_id: string;
  check_in: string | null;
  check_out: string | null;
  date: string;
  status: string;
  hours_worked: number;
  notes: string | null;
}

export const useClockInOut = (staffId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentAttendance = async (): Promise<Attendance | null> => {
    try {
      // Get current date in YYYY-MM-DD format
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('staff_attendance')
        .select('*')
        .eq('staff_id', staffId)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      return data as Attendance | null;
    } catch (err: any) {
      console.error("Error checking current attendance:", err);
      return null;
    }
  };

  const clockInOut = async (action: ClockAction, notes?: string): Promise<Attendance | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current date in YYYY-MM-DD format
      const today = format(new Date(), 'yyyy-MM-dd');
      const now = new Date().toISOString();
      
      // Check if there's an existing attendance record for today
      const currentAttendance = await getCurrentAttendance();
      
      if (action === "in") {
        if (currentAttendance && currentAttendance.check_in && !currentAttendance.check_out) {
          // Already clocked in
          toast({
            title: "Already clocked in",
            description: "You are already clocked in for today.",
            variant: "destructive"
          });
          return currentAttendance;
        }
        
        // Clock in - either create new record or update existing one
        let result;
        
        if (!currentAttendance) {
          // Create new attendance record
          const { data, error } = await supabase
            .from('staff_attendance')
            .insert({
              staff_id: staffId,
              date: today,
              check_in: now,
              status: 'present',
              notes: notes || null
            })
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        } else {
          // Update existing record
          const { data, error } = await supabase
            .from('staff_attendance')
            .update({
              check_in: now,
              status: 'present',
              notes: notes || currentAttendance.notes
            })
            .eq('id', currentAttendance.id)
            .select()
            .single();
          
          if (error) throw error;
          result = data;
        }
        
        toast({
          title: "Clocked in successfully",
          description: `You have clocked in at ${format(new Date(now), 'h:mm a')}`,
        });
        
        return result as Attendance;
      } else if (action === "out") {
        if (!currentAttendance || !currentAttendance.check_in) {
          // Not clocked in yet
          toast({
            title: "Not clocked in",
            description: "You need to clock in first before clocking out.",
            variant: "destructive"
          });
          return null;
        }
        
        if (currentAttendance.check_out) {
          // Already clocked out
          toast({
            title: "Already clocked out",
            description: "You have already clocked out for today.",
            variant: "destructive"
          });
          return currentAttendance;
        }
        
        // Calculate hours worked
        const checkInTime = new Date(currentAttendance.check_in).getTime();
        const checkOutTime = new Date(now).getTime();
        const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours
        
        // Clock out - update existing record
        const { data, error } = await supabase
          .from('staff_attendance')
          .update({
            check_out: now,
            hours_worked: parseFloat(hoursWorked.toFixed(2)),
            notes: notes || currentAttendance.notes
          })
          .eq('id', currentAttendance.id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Clocked out successfully",
          description: `You have clocked out at ${format(new Date(now), 'h:mm a')}`,
        });
        
        return data as Attendance;
      }
      
      return null;
    } catch (err: any) {
      console.error("Error with clock in/out:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to ${action === 'in' ? 'clock in' : 'clock out'}: ${err.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clockInOut,
    getCurrentAttendance,
    isLoading,
    error
  };
};
