
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, ListChecks, Filter, Calendar as CalendarIcon, Users, Loader2 
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StaffTask } from "@/hooks/useStaffTasks";
import useStaffMembers from "@/hooks/useStaffMembers";

// Import components
import TasksList from "@/components/staff/TasksList";
import TaskFilters from "@/components/staff/TaskFilters";
import TaskCreateDialog, { NewTaskFormData } from "@/components/staff/TaskCreateDialog";
import TaskCategoryView from "@/components/staff/TaskCategoryView";
import TaskAssigneeView from "@/components/staff/TaskAssigneeView";
import TaskCalendarView from "@/components/staff/TaskCalendarView";

// Import utilities
import { 
  getStaffNamesMap, 
  getStaffInitialsMap, 
  getStaffImagesMap, 
  createCSVExport 
} from "@/utils/taskUtils";

// Removed the Layout import

const TaskManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const { data: staffMembers, isLoading: staffLoading } = useStaffMembers();
  
  const [newTask, setNewTask] = useState<NewTaskFormData>({
    title: "",
    description: "",
    staff_id: "",
    due_date: "",
    due_time: "",
    priority: "Medium",
    category: "1"
  });
  
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTasks((data || []) as StaffTask[]);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      toast({
        title: "Error",
        description: `Failed to load tasks: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = 
      statusFilter === "all" || 
      task.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesCategory = 
      categoryFilter === "all" || 
      task.category === categoryFilter;
    
    const isVisible = showCompleted || task.status !== "Completed";
    
    return matchesSearch && matchesStatus && matchesCategory && isVisible;
  });

  const handleCreateTask = async () => {
    try {
      if (!newTask.staff_id || !newTask.title) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      const taskData = {
        staff_id: newTask.staff_id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "Pending",
        due_date: newTask.due_date || null,
        due_time: newTask.due_time || null,
        category: newTask.category
      };
      
      const { data, error } = await supabase
        .from('staff_tasks')
        .insert([taskData])
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => [...prev, data as StaffTask]);
      
      toast({
        title: "Success",
        description: "Task created successfully"
      });
      
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
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      const updates = { 
        status,
        completed_at: status === 'Completed' ? new Date().toISOString() : null
      };
      
      const { data, error } = await supabase
        .from('staff_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === taskId ? (data as StaffTask) : task));
      
      toast({
        title: "Success",
        description: `Task ${status === 'Completed' ? 'marked as completed' : 'updated'} successfully`
      });
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('staff_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (!filteredTasks.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive"
      });
      return;
    }

    createCSVExport(filteredTasks, getStaffNamesMap(staffMembers));
    
    toast({
      title: "Success",
      description: "Tasks exported successfully",
    });
  };

  const openNewTaskDialog = (prefillData?: { staffId?: string, categoryId?: string }) => {
    setNewTask(prev => ({
      ...prev,
      staff_id: prefillData?.staffId || "",
      category: prefillData?.categoryId || "1"
    }));
    setNewTaskDialogOpen(true);
  };

  const staffNamesMap = getStaffNamesMap(staffMembers);
  const staffInitialsMap = getStaffInitialsMap(staffMembers);
  const staffImagesMap = getStaffImagesMap(staffMembers);

  return (
    <>
      <PageHeader 
        heading={<T text="Task Management" />}
        description={<T text="Assign and manage tasks for your restaurant staff" />}
        icon={<ListChecks size={28} />}
        actions={
          <Button onClick={() => openNewTaskDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Task" />
          </Button>
        }
      />

      <TaskFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        exportToCSV={exportToCSV}
        hasFilteredTasks={filteredTasks.length > 0}
      />
      
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">
            <ListChecks className="mr-2 h-4 w-4" />
            <T text="List View" />
          </TabsTrigger>
          <TabsTrigger value="category">
            <Filter className="mr-2 h-4 w-4" />
            <T text="Category View" />
          </TabsTrigger>
          <TabsTrigger value="assignee">
            <Users className="mr-2 h-4 w-4" />
            <T text="Assignee View" />
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <T text="Calendar" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <TasksList 
                tasks={filteredTasks}
                isLoading={isLoading}
                onUpdateStatus={handleUpdateTaskStatus}
                onDelete={handleDeleteTask}
                showStaffInfo={true}
                staffNames={staffNamesMap}
                maxHeight="600px"
              />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="category">
          <TaskCategoryView 
            filteredTasks={filteredTasks}
            staffNamesMap={staffNamesMap}
            staffInitialsMap={staffInitialsMap}
            staffImagesMap={staffImagesMap}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
            handleDeleteTask={handleDeleteTask}
            openNewTaskDialog={(categoryId) => openNewTaskDialog({ categoryId })}
          />
        </TabsContent>
        
        <TabsContent value="assignee">
          <TaskAssigneeView 
            filteredTasks={filteredTasks}
            staffMembers={staffMembers}
            isLoading={isLoading}
            staffLoading={staffLoading}
            handleUpdateTaskStatus={handleUpdateTaskStatus}
            handleDeleteTask={handleDeleteTask}
            openNewTaskDialog={(staffId) => openNewTaskDialog({ staffId })}
          />
        </TabsContent>
        
        <TabsContent value="calendar">
          <TaskCalendarView />
        </TabsContent>
      </Tabs>

      <TaskCreateDialog 
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        staffMembers={staffMembers}
      />
    </>
  );
};

export default TaskManagement;
