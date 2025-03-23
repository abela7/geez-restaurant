
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export type ClockOperation = "in" | "out";

export const useClockInOut = (staffId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clockInOut = async (operation: ClockOperation, notes?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      
      // First check if there's already an attendance record for today
      const { data: existingRecord, error: fetchError } = await supabase
        .from('staff_attendance')
        .select('*')
        .eq('staff_id', staffId)
        .eq('date', today)
        .maybeSingle();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (operation === "in") {
        // Clock in
        if (existingRecord) {
          // If already clocked in today, update only if check_out exists (allowing re-clock in after out)
          if (!existingRecord.check_out) {
            throw new Error("You're already clocked in for today");
          }
          
          // Re-clock in after previous clock out
          const { data, error: updateError } = await supabase
            .from('staff_attendance')
            .update({
              check_in: now.toISOString(),
              check_out: null,
              notes: notes || existingRecord.notes
            })
            .eq('id', existingRecord.id)
            .select()
            .single();
            
          if (updateError) {
            throw updateError;
          }
          
          toast({
            title: "Success",
            description: "You have clocked in successfully"
          });
          
          return data;
        } else {
          // First clock in for the day
          const { data, error: insertError } = await supabase
            .from('staff_attendance')
            .insert({
              staff_id: staffId,
              date: today,
              status: 'Present',
              check_in: now.toISOString(),
              notes: notes || null,
              hours_worked: 0
            })
            .select()
            .single();
            
          if (insertError) {
            throw insertError;
          }
          
          // Update profile attendance status
          await supabase
            .from('profiles')
            .update({ attendance: 'Present' })
            .eq('id', staffId);
          
          toast({
            title: "Success",
            description: "You have clocked in successfully"
          });
          
          return data;
        }
      } else {
        // Clock out
        if (!existingRecord || !existingRecord.check_in) {
          throw new Error("You need to clock in first before clocking out");
        }
        
        const checkInTime = new Date(existingRecord.check_in);
        const hoursWorked = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        
        // Update existing record with check out time and hours worked
        const totalHours = existingRecord.hours_worked + hoursWorked;
        
        const { data, error: updateError } = await supabase
          .from('staff_attendance')
          .update({
            check_out: now.toISOString(),
            hours_worked: parseFloat(totalHours.toFixed(2)),
            notes: notes ? (existingRecord.notes ? existingRecord.notes + "; " + notes : notes) : existingRecord.notes
          })
          .eq('id', existingRecord.id)
          .select()
          .single();
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Success",
          description: `You have clocked out successfully. Hours worked today: ${totalHours.toFixed(2)}`
        });
        
        return data;
      }
    } catch (err: any) {
      console.error(`Error during clock ${operation}:`, err);
      setError(err.message || `Failed to clock ${operation}`);
      toast({
        title: "Error",
        description: err.message || `Failed to clock ${operation}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentAttendance = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('staff_attendance')
        .select('*')
        .eq('staff_id', staffId)
        .eq('date', today)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching current attendance:', err);
      return null;
    }
  };

  return {
    clockInOut,
    getCurrentAttendance,
    isLoading,
    error
  };
};

export default useClockInOut;
