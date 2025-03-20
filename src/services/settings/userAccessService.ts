
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserAccount, UserActivityLog } from "./types";
import { toast } from "sonner";

// User Roles Functions
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    toast.error('Failed to load user roles');
    return [];
  }
};

export const getUserRoleById = async (id: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user role:', error);
    toast.error('Failed to load user role');
    return null;
  }
};

export const createUserRole = async (role: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([role])
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('Role created successfully');
    return data;
  } catch (error) {
    console.error('Error creating user role:', error);
    toast.error('Failed to create user role');
    return null;
  }
};

export const updateUserRole = async (id: string, role: Partial<UserRole>): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update(role)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('Role updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    toast.error('Failed to update user role');
    return null;
  }
};

export const deleteUserRole = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Role deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user role:', error);
    toast.error('Failed to delete user role');
    return false;
  }
};

// User Accounts Functions
export const getUserAccounts = async (): Promise<UserAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select(`
        *,
        role:role_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    toast.error('Failed to load user accounts');
    return [];
  }
};

export const getUserAccountById = async (id: string): Promise<UserAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select(`
        *,
        role:role_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user account:', error);
    toast.error('Failed to load user account');
    return null;
  }
};

export const createUserAccount = async (user: Omit<UserAccount, 'id' | 'created_at' | 'updated_at'>): Promise<UserAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .insert([user])
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('User created successfully');
    return data;
  } catch (error) {
    console.error('Error creating user account:', error);
    toast.error('Failed to create user account');
    return null;
  }
};

export const updateUserAccount = async (id: string, user: Partial<UserAccount>): Promise<UserAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .update(user)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('User updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating user account:', error);
    toast.error('Failed to update user account');
    return null;
  }
};

export const deleteUserAccount = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    toast.error('Failed to delete user account');
    return false;
  }
};

// User Activity Logs Functions
export const getUserActivityLogs = async (): Promise<UserActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    toast.error('Failed to load user activity logs');
    return [];
  }
};

export const createUserActivityLog = async (log: Omit<UserActivityLog, 'id' | 'timestamp'>): Promise<UserActivityLog | null> => {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert([log])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user activity log:', error);
    return null;
  }
};
