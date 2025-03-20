
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PayrollRecord = {
  id: string;
  staff_id: string;
  pay_period: string;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  total_pay: number;
  payment_status: string;
  payment_date: string | null;
};

export const useStaffPayroll = (staffId?: string) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPayrollData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('staff_payroll')
        .select('*')
        .order('pay_period', { ascending: false });
        
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setPayrollRecords(data || []);
    } catch (err: any) {
      console.error('Error fetching payroll records:', err);
      setError(err.message || 'Failed to load payroll data');
      toast({
        title: "Error",
        description: `Failed to load payroll data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPayrollRecord = async (newRecord: Omit<PayrollRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('staff_payroll')
        .insert([newRecord])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setPayrollRecords(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Payroll record added successfully"
      });
      
      return data;
    } catch (err: any) {
      console.error('Error adding payroll record:', err);
      toast({
        title: "Error",
        description: `Failed to add payroll record: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updatePayrollRecord = async (id: string, updates: Partial<PayrollRecord>) => {
    try {
      const { data, error } = await supabase
        .from('staff_payroll')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setPayrollRecords(prev => 
        prev.map(record => record.id === id ? data : record)
      );
      
      toast({
        title: "Success",
        description: "Payroll record updated successfully"
      });
      
      return data;
    } catch (err: any) {
      console.error('Error updating payroll record:', err);
      toast({
        title: "Error",
        description: `Failed to update payroll record: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [staffId]);

  return {
    payrollRecords,
    isLoading,
    error,
    fetchPayrollData,
    addPayrollRecord,
    updatePayrollRecord
  };
};

export default useStaffPayroll;
