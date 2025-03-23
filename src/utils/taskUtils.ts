
import { StaffMember } from "@/hooks/useStaffMembers";
import { StaffTask } from "@/hooks/useStaffTasks";
import { getCategoryName } from "@/constants/taskCategories";

// Generate staff names map for easier lookup
export const getStaffNamesMap = (staffMembers?: StaffMember[]) => {
  if (!staffMembers) return {};
  
  return staffMembers.reduce(
    (acc, staff) => {
      acc[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
      return acc;
    }, 
    {} as Record<string, string>
  );
};

// Generate staff initials map for avatar fallbacks
export const getStaffInitialsMap = (staffMembers?: StaffMember[]) => {
  if (!staffMembers) return {};
  
  return staffMembers.reduce(
    (acc, staff) => {
      const firstName = staff.first_name || '';
      const lastName = staff.last_name || '';
      
      // Get first letter of first name and first letter of last name
      const firstInitial = firstName.charAt(0);
      const lastInitial = lastName.charAt(0);
      
      acc[staff.id] = (firstInitial + lastInitial).toUpperCase();
      return acc;
    }, 
    {} as Record<string, string>
  );
};

// Generate staff images map for avatars
export const getStaffImagesMap = (staffMembers?: StaffMember[]) => {
  if (!staffMembers) return {};
  
  return staffMembers.reduce(
    (acc, staff) => {
      if (staff.image_url) {
        acc[staff.id] = staff.image_url;
      }
      return acc;
    }, 
    {} as Record<string, string>
  );
};

// Helper function to format date for display
export const formatTaskDate = (dateString: string | null, timeString: string | null) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    let formattedDate = date.toLocaleDateString('en-GB', options);
    
    if (timeString) {
      formattedDate += ` ${timeString}`;
    }
    
    return formattedDate;
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateString; // Return the original string if parsing fails
  }
};

// Create and download a CSV file from tasks data
export const createCSVExport = (tasks: StaffTask[], staffNames: Record<string, string>) => {
  // Define CSV headers
  const headers = [
    'Task ID',
    'Title',
    'Description',
    'Assigned To',
    'Priority',
    'Status',
    'Category',
    'Due Date',
    'Completed At'
  ];
  
  // Map tasks to CSV rows
  const rows = tasks.map(task => {
    return [
      task.id,
      task.title,
      task.description || '',
      staffNames[task.staff_id] || task.staff_id,
      task.priority,
      task.status,
      getCategoryName(task.category),
      formatTaskDate(task.due_date, task.due_time),
      task.completed_at ? new Date(task.completed_at).toLocaleString() : ''
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  
  // Trigger download and clean up
  link.click();
  document.body.removeChild(link);
};
