
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, CheckCircle2, Clock, AlertCircle, ListChecks, Calendar, Filter, Pencil, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/hooks/useStaffMembers";
import TaskCreateDialog from "@/components/staff/TaskCreateDialog";
import { useToast } from "@/hooks/use-toast";
import useStaffTasks, { StaffTask } from "@/hooks/useStaffTasks";
import { format, isToday, isFuture, parseISO } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TaskEditDialog from "@/components/staff/TaskEditDialog";

const Tasks = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [staffNames, setStaffNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);
  const { toast } = useToast();
  
  // Initialize empty task state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    staff_id: "",
    due_date: "",
    due_time: "",
    priority: "Medium",
    category: "1"
  });
  
  // Using the useStaffTasks hook for all staff members
  const { tasks, isLoading: tasksLoading, addTask, updateTask, deleteTask } = useStaffTasks("");
  
  // Fetch staff members from profiles table
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('first_name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        // Create a mapping of staff IDs to full names
        const namesMap = data.reduce((acc, staff) => {
          acc[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
          return acc;
        }, {} as Record<string, string>);
        
        // Set staffMembers with the full data - this ensures all StaffMember properties are available
        setStaffMembers(data as StaffMember[]);
        setStaffNames(namesMap);
      } catch (err: any) {
        console.error('Error fetching staff members:', err);
        setError(err.message);
        toast({
          title: "Error",
          description: `Failed to load staff members: ${err.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaffMembers();
  }, []);
  
  // Filter tasks based on search, status filter and tab
  const getFilteredTasks = (tab: string) => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        task.status.toLowerCase() === statusFilter.toLowerCase();
      
      // Tab filtering
      let matchesTab = true;
      if (tab === "today") {
        matchesTab = task.due_date ? isToday(parseISO(task.due_date)) : false;
      } else if (tab === "upcoming") {
        matchesTab = task.due_date ? isFuture(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) : false;
      }
      
      return matchesSearch && matchesStatus && matchesTab;
    });
  };
  
  const handleCreateTask = async () => {
    try {
      // Format date for Supabase
      if (!newTask.title || !newTask.staff_id || !newTask.due_date) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      await addTask({
        title: newTask.title,
        description: newTask.description,
        staff_id: newTask.staff_id,
        due_date: newTask.due_date,
        due_time: newTask.due_time,
        priority: newTask.priority,
        status: "Pending",
        category: newTask.category
      });
      
      // Reset form and close dialog
      setNewTask({
        title: "",
        description: "",
        staff_id: "",
        due_date: "",
        due_time: "",
        priority: "Medium",
        category: "1"
      });
      setNewTaskDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Task created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;
    
    try {
      await updateTask(selectedTask.id, selectedTask);
      setEditTaskDialogOpen(false);
      setSelectedTask(null);
      
      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      await deleteTask(selectedTask.id);
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive"
      });
    }
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
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        status: "Completed",
        completed_at: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Task marked as completed"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (task: StaffTask) => {
    setSelectedTask(task);
    setEditTaskDialogOpen(true);
  };

  const openDeleteDialog = (task: StaffTask) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
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
    <>
      <PageHeader 
        heading={<T text="Staff Tasks" />}
        description={<T text="Assign, track, and manage tasks for your restaurant staff" />}
        actions={
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Task" />
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search tasks...")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="border rounded p-2 bg-background h-9"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t("All Status")}</option>
            <option value="completed">{t("Completed")}</option>
            <option value="in progress">{t("In Progress")}</option>
            <option value="pending">{t("Pending")}</option>
          </select>
        </div>
      </div>
      
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
      
      {/* Task Creation Dialog */}
      <TaskCreateDialog
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        staffMembers={staffMembers}
      />

      {/* Task Edit Dialog */}
      {selectedTask && (
        <TaskEditDialog
          open={editTaskDialogOpen}
          onOpenChange={setEditTaskDialogOpen}
          task={selectedTask}
          setTask={setSelectedTask}
          handleEditTask={handleEditTask}
          staffMembers={staffMembers}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T text="Delete Task" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T text="Are you sure you want to delete this task? This action cannot be undone." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T text="Cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <T text="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Tasks;
