
import { format } from "date-fns";
import { StaffTask } from "@/hooks/useStaffTasks";
import { StaffMember } from "@/hooks/useStaffMembers";
import { getCategoryName } from "@/constants/taskCategories";

export const getStaffName = (staffMembers: StaffMember[], id: string): string => {
  const staff = staffMembers.find(staff => staff.id === id);
  return staff ? `${staff.first_name || ''} ${staff.last_name || ''}`.trim() : "Unassigned";
};

export const getStaffInitials = (staffMembers: StaffMember[], id: string): string => {
  const staff = staffMembers.find(staff => staff.id === id);
  if (!staff) return "NA";
  
  const firstName = staff.first_name || '';
  const lastName = staff.last_name || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getStaffImageUrl = (staffMembers: StaffMember[], id: string): string | undefined => {
  const staff = staffMembers.find(staff => staff.id === id);
  return staff?.image_url;
};

export const getStaffNamesMap = (staffMembers: StaffMember[]): Record<string, string> => {
  const namesMap: Record<string, string> = {};
  staffMembers.forEach(staff => {
    namesMap[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
  });
  return namesMap;
};

export const getStaffInitialsMap = (staffMembers: StaffMember[]): Record<string, string> => {
  const initialsMap: Record<string, string> = {};
  staffMembers.forEach(staff => {
    const firstName = staff.first_name || '';
    const lastName = staff.last_name || '';
    initialsMap[staff.id] = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  });
  return initialsMap;
};

export const getStaffImagesMap = (staffMembers: StaffMember[]): Record<string, string | undefined> => {
  const imagesMap: Record<string, string | undefined> = {};
  staffMembers.forEach(staff => {
    imagesMap[staff.id] = staff.image_url;
  });
  return imagesMap;
};

export const createCSVExport = (tasks: StaffTask[], staffNamesMap: Record<string, string>): void => {
  if (!tasks.length) return;

  const headers = ['Title', 'Description', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Due Time', 'Category'];
  const csvRows = [
    headers.join(','),
    ...tasks.map(task => [
      `"${task.title}"`,
      `"${task.description || ''}"`,
      `"${staffNamesMap[task.staff_id] || task.staff_id}"`,
      `"${task.priority}"`,
      `"${task.status}"`,
      task.due_date ? `"${format(new Date(task.due_date), 'MMM dd, yyyy')}"` : '""',
      task.due_time ? `"${task.due_time}"` : '""',
      `"${getCategoryName(task.category)}"` 
    ].join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Tasks_Export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
