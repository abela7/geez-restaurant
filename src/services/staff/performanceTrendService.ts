
import { supabase } from "@/integrations/supabase/client";
import { StaffPerformanceData, DepartmentPerformance, TopPerformers } from "@/types/staff";
import { getDateRangeFromPeriod } from "./performanceUtils";

// Get staff performance trend data
export const getStaffPerformanceTrends = async (
  period: string = "month",
  department: string = "all"
): Promise<StaffPerformanceData[]> => {
  try {
    // This would typically query a dedicated table or perform calculations on related tables
    // For now, simulating with profiles data and some calculated metrics

    // Get the date range based on period
    const { startDate, endDate } = getDateRangeFromPeriod(period);
    
    // Query from the profiles and staff_attendance tables to get attendance data
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq(department !== 'all' ? 'department' : 'id', department !== 'all' ? department : 'id');
    
    if (profilesError) throw profilesError;
    
    // For now, we're generating trend data based on actual staff profiles
    // In a production environment, you would calculate this from actual data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    return months.map((name, index) => {
      // Use some real data properties but apply randomization for demonstration
      const efficiency = 80 + Math.floor(Math.random() * 15);
      const attendance = 90 + Math.floor(Math.random() * 10);
      const tasks = 85 + Math.floor(Math.random() * 15);
      
      return {
        name,
        attendance,
        tasks,
        efficiency
      };
    });
  } catch (error) {
    console.error("Error fetching staff performance trends:", error);
    throw error;
  }
};

// Get department performance metrics
export const getDepartmentPerformance = async (): Promise<DepartmentPerformance[]> => {
  try {
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
    
    const categories = ["Food Preparation", "Cleaning Tasks", "Inventory Management", "Customer Service"];
    
    // Create a record for each department with performance metrics
    return categories.map(category => {
      return {
        category,
        completion: 80 + Math.floor(Math.random() * 18)
      };
    });
  } catch (error) {
    console.error("Error fetching department performance:", error);
    throw error;
  }
};

// Get top performing staff
export const getTopPerformers = async (): Promise<{
  topPerformer: { name: string, department: string, efficiency: number };
  mostImproved: { name: string, department: string, improvement: number };
  needsAttention: { name: string, department: string, issue: string };
}> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, department, efficiency_rating')
      .order('efficiency_rating', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    // Find actual top performer
    const topPerformer = profiles[0] ? {
      name: `${profiles[0].first_name} ${profiles[0].last_name}`,
      department: profiles[0].department || "Unknown",
      efficiency: profiles[0].efficiency_rating || 90
    } : {
      name: "Aida Mekonnen",
      department: "Kitchen",
      efficiency: 97
    };
    
    // For most improved and needs attention, we'd need historical data
    // Using placeholders for now
    return {
      topPerformer,
      mostImproved: {
        name: "Dawit Hagos",
        department: "Waiters",
        improvement: 12
      },
      needsAttention: {
        name: "Selam Tesfaye",
        department: "Server",
        issue: "3 Late Arrivals"
      }
    };
  } catch (error) {
    console.error("Error fetching top performers:", error);
    throw { 
      topPerformer: { name: "Aida Mekonnen", department: "Kitchen", efficiency: 97 },
      mostImproved: { name: "Dawit Hagos", department: "Waiters", improvement: 12 },
      needsAttention: { name: "Selam Tesfaye", department: "Server", issue: "3 Late Arrivals" }
    };
  }
};

// Get performance metrics by category
export const getPerformanceMetricsByCategory = async (): Promise<{ category: string, completion: number }[]> => {
  try {
    const categories = ["Food Preparation", "Cleaning Tasks", "Inventory Management", "Customer Service"];
    
    return categories.map(category => ({
      category,
      completion: 80 + Math.floor(Math.random() * 18)
    }));
  } catch (error) {
    console.error("Error fetching performance metrics by category:", error);
    throw error;
  }
};
