import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ListChecks, Calendar, Clock, AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { StaffTask } from "@/hooks/useStaffTasks";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { format, isToday, isFuture, parseISO } from "date-fns";

interface TaskViewTabsProps {
  tasksLoading: boolean;
  error: string | null;
  statusFilter: string;
  searchTerm: string;
  tasks: StaffTask[];
  staffNames: Record<string, string>;
  handleCompleteTask: (taskId: string) => Promise<void>;
  openEditDialog: (task: StaffTask) => void;
  openDeleteDialog: (task: StaffTask) => void;
}

const TaskViewTabs: React.FC<TaskViewTabsProps> = ({
  tasksLoading,
  error,
  statusFilter,
  searchTerm,
  tasks,
  staffNames,
  handleCompleteTask,
  openEditDialog,
  openDeleteDialog
}) => {
  const { t } = useLanguage();

  const getFilteredTasks = (tab: string) => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === "all" || 
        task.status.toLowerCase() === statusFilter.toLowerCase();
      
      let matchesTab = true;
      if (tab === "today") {
        matchesTab = task.due_date ? isToday(parseISO(task.due_date)) : false;
      } else if (tab === "upcoming") {
        matchesTab = task.due_date ? isFuture(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) : false;
      }
      
      return matchesSearch && matchesStatus && matchesTab;
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  const renderTasksTable = (filteredTasks: StaffTask[]) => {
    if (tasksLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center text-red-500 p-6">
          <p>{error}</p>
        </div>
      );
    }
    
    if (filteredTasks.length === 0) {
      return (
        <div className="text-center p-6 text-muted-foreground">
          <p>No tasks found. Create a new task to get started.</p>
        </div>
      );
    }

    return (
      <div className="overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead><T text="Task" /></TableHead>
              <TableHead className="hidden md:table-cell"><T text="Assigned To" /></TableHead>
              <TableHead className="hidden lg:table-cell"><T text="Due Date" /></TableHead>
              <TableHead className="hidden sm:table-cell"><T text="Priority" /></TableHead>
              <TableHead><T text="Status" /></TableHead>
              <TableHead className="text-right"><T text="Actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">{task.description}</div>
                    <div className="text-xs text-muted-foreground md:hidden mt-1">
                      {staffNames[task.staff_id] || "Unknown"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {staffNames[task.staff_id] ? 
                          staffNames[task.staff_id].charAt(0).toUpperCase() : "?"}
                      </div>
                    </Avatar>
                    <span>{staffNames[task.staff_id] || "Unknown"}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(task.due_date)}</span>
                      {task.due_time && <span> {task.due_time}</span>}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={
                    task.priority === "High" ? "destructive" : 
                    task.priority === "Medium" ? "default" : 
                    "outline"
                  }>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span>{task.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {task.status !== "Completed" && (
                      <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task.id)} title="Mark as completed">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(task)} title="Edit task">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(task)} title="Delete task">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <Tabs defaultValue="all">
        <TabsList className="p-4 border-b w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">
            <ListChecks className="mr-2 h-4 w-4" />
            <T text="All Tasks" />
          </TabsTrigger>
          <TabsTrigger value="today">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Due Today" />
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Clock className="mr-2 h-4 w-4" />
            <T text="Upcoming" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="p-0">
          {renderTasksTable(getFilteredTasks("all"))}
        </TabsContent>
        
        <TabsContent value="today" className="p-0">
          {renderTasksTable(getFilteredTasks("today"))}
        </TabsContent>
        
        <TabsContent value="upcoming" className="p-0">
          {renderTasksTable(getFilteredTasks("upcoming"))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TaskViewTabs;
