import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, X, Clock, Tag } from "lucide-react";
import { StaffTask } from "@/hooks/useStaffTasks";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

// Task categories and colors mapping
const taskCategories = [
  { id: "1", name: "Kitchen", color: "bg-amber-500" },
  { id: "2", name: "Service", color: "bg-blue-500" },
  { id: "3", name: "Cleaning", color: "bg-green-500" },
  { id: "4", name: "Inventory", color: "bg-purple-500" },
  { id: "5", name: "Administration", color: "bg-slate-500" },
];

type TasksListProps = {
  tasks: StaffTask[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  showStaffInfo?: boolean;
  staffNames?: Record<string, string>;
  className?: string;
  maxHeight?: string;
};

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  isLoading,
  onUpdateStatus,
  onDelete,
  showStaffInfo = false,
  staffNames = {},
  className = "",
  maxHeight = "420px"
}) => {
  const { t } = useLanguage();

  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return "";
    const category = taskCategories.find(cat => cat.id === categoryId.toString());
    return category ? category.name : "";
  };

  const getCategoryColor = (categoryId?: string | null) => {
    if (!categoryId) return "bg-gray-500";
    const category = taskCategories.find(cat => cat.id === categoryId.toString());
    return category ? category.color : "bg-gray-500";
  };

  const formatDateTime = (dateString: string | null, timeString: string | null) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      const formattedDate = format(date, 'MMM dd, yyyy');
      
      if (timeString) {
        return `${formattedDate} ${timeString}`;
      } else if (date.getHours() !== 0 || date.getMinutes() !== 0) {
        return `${formattedDate} ${format(date, 'HH:mm')}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground"><T text="No tasks found" /></p>
      </div>
    );
  }

  return (
    <div className={`overflow-auto ${maxHeight ? `max-h-[${maxHeight}]` : "max-h-[420px]"} ${className}`}>
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {showStaffInfo && <TableHead><T text="Staff Member" /></TableHead>}
            <TableHead><T text="Title" /></TableHead>
            <TableHead><T text="Description" /></TableHead>
            <TableHead><T text="Category" /></TableHead>
            <TableHead><T text="Priority" /></TableHead>
            <TableHead><T text="Status" /></TableHead>
            <TableHead><T text="Due Date" /></TableHead>
            {(onUpdateStatus || onDelete) && <TableHead className="text-right"><T text="Actions" /></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              {showStaffInfo && <TableCell>{staffNames[task.staff_id] || task.staff_id}</TableCell>}
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">{task.description || '-'}</TableCell>
              <TableCell>
                {task.category ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)}`}></div>
                    <span>{getCategoryName(task.category)}</span>
                  </div>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {onUpdateStatus ? (
                  <Select 
                    value={task.status} 
                    onValueChange={(value) => onUpdateStatus(task.id, value)}
                  >
                    <SelectTrigger className="w-[120px] h-7">
                      <SelectValue>
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getStatusVariant(task.status)}>
                    {task.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {formatDateTime(task.due_date, task.due_time)}
                </div>
              </TableCell>
              {(onUpdateStatus || onDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onUpdateStatus && task.status !== 'Completed' && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onUpdateStatus(task.id, 'Completed')}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => onDelete(task.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksList;
