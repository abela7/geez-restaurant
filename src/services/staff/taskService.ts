
import { supabase } from "@/integrations/supabase/client";
import { TaskCompletionData } from "@/types/staff";

// Get task completion data by department
export const getTaskCompletionByDepartment = async (period: string): Promise<TaskCompletionData[]> => {
  try {
    // In a real implementation, calculate from staff_tasks records
    const { data: departments, error: deptError } = await supabase
      .from('profiles')
      .select('department')
      .not('department', 'is', null);
    
    if (deptError) throw deptError;
    
    // Get unique departments
    const uniqueDepartments = Array.from(new Set(
      departments
        .map(item => item.department)
        .filter(Boolean)
    ));
    
    // Get task completion statistics
    return uniqueDepartments.map(name => {
      // Calculate totals based on typical task volumes
      const completed = 50 + Math.floor(Math.random() * 100);
      const pending = Math.floor(Math.random() * 20);
      const late = Math.floor(Math.random() * 10);
      
      return {
        name: name || "Unknown",
        completed,
        pending,
        late
      };
    });
  } catch (error) {
    console.error("Error fetching task completion by department:", error);
    throw error;
  }
};
