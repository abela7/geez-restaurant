
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type StaffTask = {
  id: string;
  staff_id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  due_time: string | null;
  completed_at: string | null;
  category: string | null;
  created_at?: string;
  updated_at?: string;
};

export const useStaffTasks = (staffId: string) => {
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching tasks for staff ID: ${staffId}`);
      let query = supabase
        .from('staff_tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      // If staffId is provided, filter by staff_id
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} tasks${staffId ? ` for staff ID: ${staffId}` : ''}`);
      // Ensure the data is properly typed as StaffTask[]
      setTasks((data || []) as StaffTask[]);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
      toast({
        title: "Error",
        description: `Failed to load tasks: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (newTask: Omit<StaffTask, 'id' | 'completed_at'>) => {
    try {
      console.log("Adding new task:", newTask);
      // Ensure category is a string, not a number
      const taskToAdd = {
        ...newTask,
        category: newTask.category ? newTask.category.toString() : null
      };
      
      const { data, error } = await supabase
        .from('staff_tasks')
        .insert([taskToAdd])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      console.log("Task added successfully:", data);
      // Sort tasks by due date after adding a new one
      setTasks(prev => {
        const updatedTasks = [...prev, data as StaffTask];
        return updatedTasks.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      });
      
      toast({
        title: "Success",
        description: "Task added successfully"
      });
      
      return data as StaffTask;
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast({
        title: "Error",
        description: `Failed to add task: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<StaffTask>) => {
    try {
      console.log(`Updating task ${id} with:`, updates);
      const { data, error } = await supabase
        .from('staff_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      console.log("Task updated successfully:", data);
      // Sort tasks by due date after updating
      setTasks(prev => {
        const updatedTasks = prev.map(task => task.id === id ? (data as StaffTask) : task);
        return updatedTasks.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      });
      
      toast({
        title: "Success",
        description: `Task ${updates.status === 'Completed' ? 'marked as completed' : 'updated'} successfully`
      });
      
      return data as StaffTask;
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        title: "Error",
        description: `Failed to update task: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      console.log(`Deleting task ${id}`);
      const { error } = await supabase
        .from('staff_tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      console.log(`Task ${id} deleted successfully`);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast({
        title: "Error",
        description: `Failed to delete task: ${err.message}`,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [staffId]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
};

export default useStaffTasks;
