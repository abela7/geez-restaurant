
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/staff';

export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['waiter', 'chef', 'dishwasher', 'manager'])
        .order('first_name');

      if (error) throw error;

      // Cast the roles to make TypeScript happy
      const typedData = data?.map(item => ({
        ...item,
        role: item.role as StaffMember['role']
      })) || [];
      
      setStaff(typedData);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load staff data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStaffMember = async (staffData: Omit<StaffMember, 'id'>) => {
    try {
      setIsLoading(true);
      
      // In a real application, we would create an auth user first
      // Then the profiles record would be created by the database trigger
      // For demo purposes, we'd just insert directly if allowed
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          // Generate a UUID on the client side since we can't insert without an ID
          id: crypto.randomUUID(),
          ...staffData
        }])
        .select();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      });
      
      return data?.[0];
    } catch (err) {
      console.error('Error adding staff member:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add staff member',
      });
      return null;
    } finally {
      setIsLoading(false);
      fetchStaff();
    }
  };

  const updateStaffMember = async (id: string, staffData: Partial<StaffMember>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(staffData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating staff member:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update staff member',
      });
      return false;
    } finally {
      setIsLoading(false);
      fetchStaff();
    }
  };

  const deleteStaffMember = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting staff member:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete staff member',
      });
      return false;
    } finally {
      setIsLoading(false);
      fetchStaff();
    }
  };

  const getStaffMember = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Cast the role to make TypeScript happy
      return {
        ...data,
        role: data.role as StaffMember['role']
      } as StaffMember;
    } catch (err) {
      console.error('Error fetching staff member:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load staff member data',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    getStaffMember
  };
}
