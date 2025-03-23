
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type StaffAttendance = {
  id: string;
  staff_id: string;
  date: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number;
  notes: string | null;
};

export const useStaffAttendance = (staffId?: string) => {
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build the query based on whether we have a specific staff ID
      let query = supabase
        .from('staff_attendance')
        .select('*')
        .order('date', { ascending: false });
      
      // If a staff ID is provided, filter by that staff member
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setAttendanceRecords(data as StaffAttendance[] || []);
    } catch (err: any) {
      console.error('Error fetching attendance records:', err);
      setError(err.message || 'Failed to load attendance data');
      toast({
        title: "Error",
        description: `Failed to load attendance data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAttendanceRecord = async (newRecord: Omit<StaffAttendance, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('staff_attendance')
        .insert([newRecord])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setAttendanceRecords(prev => [data as StaffAttendance, ...prev]);
      toast({
        title: "Success",
        description: "Attendance record added successfully"
      });
      
      return data;
    } catch (err: any) {
      console.error('Error adding attendance record:', err);
      toast({
        title: "Error",
        description: `Failed to add attendance record: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateAttendanceRecord = async (id: string, updates: Partial<StaffAttendance>) => {
    try {
      const { data, error } = await supabase
        .from('staff_attendance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setAttendanceRecords(prev => 
        prev.map(record => record.id === id ? (data as StaffAttendance) : record)
      );
      
      toast({
        title: "Success",
        description: "Attendance record updated successfully"
      });
      
      return data;
    } catch (err: any) {
      console.error('Error updating attendance record:', err);
      toast({
        title: "Error",
        description: `Failed to update attendance record: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [staffId]);

  return {
    attendanceRecords,
    isLoading,
    error,
    fetchAttendanceData,
    addAttendanceRecord,
    updateAttendanceRecord
  };
};

export default useStaffAttendance;
