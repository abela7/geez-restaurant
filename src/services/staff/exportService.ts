
import { getStaffPerformanceTrends } from './performanceTrendService';
import { getAttendanceByDepartment } from './attendanceService';
import { getTaskCompletionByDepartment } from './taskService';

// Helper function to export data to CSV
export const exportPerformanceData = async (format: string = 'csv') => {
  try {
    // Fetch the data
    const trends = await getStaffPerformanceTrends();
    const attendance = await getAttendanceByDepartment('month');
    const tasks = await getTaskCompletionByDepartment('month');
    
    // Convert to CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Period,Attendance,Tasks,Efficiency\n";
    
    // Add data
    trends.forEach(item => {
      csvContent += `${item.name},${item.attendance},${item.tasks},${item.efficiency}\n`;
    });
    
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error exporting performance data:", error);
    throw error;
  }
};

// Export attendance data is in the attendanceService.ts file
