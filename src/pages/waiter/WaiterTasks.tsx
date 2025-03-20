
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, Clock, Plus, Calendar, Calendar as CalendarIcon, X, Loader2, Download } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import TasksList from "@/components/staff/TasksList";
import { StaffTask } from "@/hooks/useStaffTasks";

// Task categories and colors
const taskCategories = [
  { id: "1", name: "Kitchen", color: "bg-amber-500" },
  { id: "2", name: "Service", color: "bg-blue-500" },
  { id: "3", name: "Cleaning", color: "bg-green-500" },
  { id: "4", name: "Inventory", color: "bg-purple-500" },
  { id: "5", name: "Administration", color: "bg-slate-500" },
];

const WaiterTasks = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<StaffTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [staffId, setStaffId] = useState("");

  // Mock staff ID for demo purpose - in a real app, this would come from authentication
  useEffect(() => {
    // This is a placeholder - in production, you'd get the actual user ID
    setStaffId("00000000-0000-0000-0000-000000000000");
  }, []);

  const fetchTasks = async () => {
    if (!staffId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff_tasks')
        .select('*')
        .eq('staff_id', staffId)
        .order('due_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTasks(data as StaffTask[] || []);
      setFilteredTasks(data as StaffTask[] || []);
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

  // Handle search and filtering
  useEffect(() => {
    if (!tasks.length) return;
    
    const filtered = tasks.filter(task => {
      // Search filter
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      // Tab filter
      const matchesTab = 
        currentTab === "all" ||
        (currentTab === "pending" && task.status === "Pending") ||
        (currentTab === "in-progress" && task.status === "In Progress") ||
        (currentTab === "completed" && task.status === "Completed") ||
        (currentTab === "overdue" && isTaskOverdue(task));
      
      return matchesSearch && matchesTab;
    });
    
    setFilteredTasks(filtered);
  }, [searchTerm, currentTab, tasks]);

  // Initial data fetch
  useEffect(() => {
    if (staffId) {
      fetchTasks();
    }
  }, [staffId]);

  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!staffId) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const dueDate = formData.get('dueDate') as string;
    const dueTime = formData.get('dueTime') as string;
    const category = formData.get('category') as string;
    
    try {
      const newTask = {
        staff_id: staffId,
        title,
        description,
        priority,
        status: 'Pending',
        due_date: dueDate || null,
        due_time: dueTime || null,
        category: category || "2", // Default to Service category
      };
      
      const { data, error } = await supabase
        .from('staff_tasks')
        .insert([newTask])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setTasks(prev => [...prev, data as StaffTask]);
      setNewTaskDialog(false);
      
      toast({
        title: "Success",
        description: "Task created successfully"
      });
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast({
        title: "Error",
        description: `Failed to add task: ${err.message}`,
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
      
      if (error) {
        throw error;
      }
      
      setTasks(prev => prev.map(task => task.id === taskId ? (data as StaffTask) : task));
      
      toast({
        title: "Success",
        description: `Task ${status === 'Completed' ? 'marked as completed' : 'updated'} successfully`
      });
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        title: "Error",
        description: `Failed to update task: ${err.message}`,
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
      
      if (error) {
        throw error;
      }
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast({
        title: "Error",
        description: `Failed to delete task: ${err.message}`,
        variant: "destructive"
      });
    }
  };

  const isTaskOverdue = (task: StaffTask) => {
    if (!task.due_date) return false;
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    
    // Reset hours to compare just the dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today && task.status !== 'Completed';
  };
  
  // Function to export tasks to CSV
  const exportToCSV = () => {
    if (!filteredTasks.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive"
      });
      return;
    }

    const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Due Time', 'Category'];
    const csvRows = [
      headers.join(','),
      ...filteredTasks.map(task => [
        `"${task.title}"`,
        `"${task.description || ''}"`,
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
    
    // Create a link to download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `My_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Tasks exported successfully",
    });
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return "";
    const category = taskCategories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        heading="My Tasks" 
        description="Manage your assigned tasks and track completion"
        actions={
          <div className="flex gap-2">
            <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Create Task" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle><T text="Create New Task" /></DialogTitle>
                  <DialogDescription>
                    <T text="Create a new task for yourself" />
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTaskSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title"><T text="Task Title" /></Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder={t("Enter task title")}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description"><T text="Description" /></Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder={t("Describe the task details")}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category"><T text="Category" /></Label>
                        <Select name="category" defaultValue="2">
                          <SelectTrigger id="category">
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {taskCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="priority"><T text="Priority" /></Label>
                        <Select name="priority" defaultValue="Medium">
                          <SelectTrigger id="priority">
                            <SelectValue placeholder={t("Select priority")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High"><T text="High" /></SelectItem>
                            <SelectItem value="Medium"><T text="Medium" /></SelectItem>
                            <SelectItem value="Low"><T text="Low" /></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate"><T text="Due Date" /></Label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="dueTime"><T text="Due Time" /> (optional)</Label>
                        <Input
                          id="dueTime"
                          name="dueTime"
                          type="time"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setNewTaskDialog(false)}>
                      <T text="Cancel" />
                    </Button>
                    <Button type="submit"><T text="Create Task" /></Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={exportToCSV} disabled={filteredTasks.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search tasks...")}
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Calendar View" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Tasks" /></TabsTrigger>
          <TabsTrigger value="pending"><T text="Pending" /></TabsTrigger>
          <TabsTrigger value="in-progress"><T text="In Progress" /></TabsTrigger>
          <TabsTrigger value="completed"><T text="Completed" /></TabsTrigger>
          <TabsTrigger value="overdue"><T text="Overdue" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
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
                maxHeight="500px"
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="pending">
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
                maxHeight="500px"
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
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
                maxHeight="500px"
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="completed">
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
                maxHeight="500px"
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
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
                maxHeight="500px"
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle><T text="Task Calendar" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2"><T text="Calendar View Coming Soon" /></h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                <T text="A calendar view showing all tasks will be available in an upcoming update." />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaiterTasks;
