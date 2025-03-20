
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
    
    // Convert the JSON permissions to Record<string, boolean>
    const formattedData: UserRole[] = data?.map(role => ({
      ...role,
      permissions: role.permissions ? (typeof role.permissions === 'string' ? 
        JSON.parse(role.permissions) : role.permissions) as Record<string, boolean>
    })) || [];
    
    return formattedData;
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
    
    return data ? {
      ...data,
      permissions: data.permissions ? (typeof data.permissions === 'string' ? 
        JSON.parse(data.permissions) : data.permissions) as Record<string, boolean>
    } : null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    toast.error('Failed to load user role');
    return null;
  }
};

export const createUserRole = async (role: Pick<UserRole, 'name' | 'description' | 'permissions'>): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{
        name: role.name,
        description: role.description || null,
        permissions: role.permissions || {}
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('Role created successfully');
    
    return data ? {
      ...data,
      permissions: data.permissions ? (typeof data.permissions === 'string' ? 
        JSON.parse(data.permissions) : data.permissions) as Record<string, boolean>
    } : null;
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
      .update({
        name: role.name,
        description: role.description,
        permissions: role.permissions
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    toast.success('Role updated successfully');
    
    return data ? {
      ...data,
      permissions: data.permissions ? (typeof data.permissions === 'string' ? 
        JSON.parse(data.permissions) : data.permissions) as Record<string, boolean>
    } : null;
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
          permissions,
          created_at,
          updated_at
        )
      `)
      .order('name');
    
    if (error) throw error;
    
    // Convert permissions in roles
    const processedData: UserAccount[] = data?.map(user => ({
      ...user,
      role: user.role ? {
        ...user.role,
        permissions: user.role.permissions ? (typeof user.role.permissions === 'string' ? 
          JSON.parse(user.role.permissions) : user.role.permissions) as Record<string, boolean>
      } : undefined
    })) || [];
    
    return processedData;
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
          permissions,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Process permissions
    return data ? {
      ...data,
      role: data.role ? {
        ...data.role,
        permissions: data.role.permissions ? (typeof data.role.permissions === 'string' ? 
          JSON.parse(data.role.permissions) : data.role.permissions) as Record<string, boolean>
      } : undefined
    } : null;
  } catch (error) {
    console.error('Error fetching user account:', error);
    toast.error('Failed to load user account');
    return null;
  }
};

export const createUserAccount = async (user: Pick<UserAccount, 'name' | 'email' | 'role_id' | 'status'>): Promise<UserAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .insert([{
        name: user.name,
        email: user.email,
        role_id: user.role_id || null,
        status: user.status || 'active',
        last_login: null
      }])
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
          email,
          role_id,
          status,
          last_login,
          created_at,
          updated_at
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
