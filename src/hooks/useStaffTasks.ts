
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
  completed_at: string | null;
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
      const { data, error } = await supabase
        .from('staff_tasks')
        .select('*')
        .eq('staff_id', staffId)
        .order('due_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching staff tasks:', err);
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

  const addTask = async (newTask: Omit<StaffTask, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('staff_tasks')
        .insert([newTask])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setTasks(prev => [data, ...prev].sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }));
      
      toast({
        title: "Success",
        description: "Task added successfully"
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('staff_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setTasks(prev => 
        prev.map(task => task.id === id ? data : task)
          .sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          })
      );
      
      toast({
        title: "Success",
        description: "Task updated successfully"
      });
      
      return data;
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
      const { error } = await supabase
        .from('staff_tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
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
    if (staffId) {
      fetchTasks();
    }
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
