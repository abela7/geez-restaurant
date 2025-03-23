
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/hooks/useStaffMembers";
import TaskCreateDialog from "@/components/staff/TaskCreateDialog";
import { useToast } from "@/hooks/use-toast";
import useStaffTasks, { StaffTask } from "@/hooks/useStaffTasks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TaskEditDialog from "@/components/staff/TaskEditDialog";
import TaskSearchBar from "@/components/staff/TaskSearchBar";
import TaskViewTabs from "@/components/staff/TaskViewTabs";

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

      <TaskSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <TaskViewTabs 
        tasksLoading={tasksLoading}
        error={error}
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        tasks={tasks}
        staffNames={staffNames}
        handleCompleteTask={handleCompleteTask}
        openEditDialog={openEditDialog}
        openDeleteDialog={openDeleteDialog}
      />
      
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
