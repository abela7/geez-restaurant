
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Plus, CheckCircle2, Clock, AlertCircle, ListChecks, Calendar, 
  Calendar as CalendarIcon, Filter, PlusCircle, X, 
  CheckCircle, Users, Download, Printer, Loader2 
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TasksList from "@/components/staff/TasksList";
import { StaffTask } from "@/hooks/useStaffTasks";
import useStaffMembers from "@/hooks/useStaffMembers";
import { format } from "date-fns";

// Task category types and colors
type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

const taskCategories: TaskCategory[] = [
  { id: "1", name: "Kitchen", color: "bg-amber-500" },
  { id: "2", name: "Service", color: "bg-blue-500" },
  { id: "3", name: "Cleaning", color: "bg-green-500" },
  { id: "4", name: "Inventory", color: "bg-purple-500" },
  { id: "5", name: "Administration", color: "bg-slate-500" },
];

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
  const [viewMode, setViewMode] = useState("list");
  const { staffMembers, isLoading: staffLoading } = useStaffMembers();
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    staff_id: "",
    due_date: "",
    due_time: "",
    priority: "Medium",
    category: "1"
  });
  
  // Fetch all tasks
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
      
      setTasks(data as StaffTask[] || []);
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
  
  // Initial data fetch
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

  const getStaffName = (id: string) => {
    const staff = staffMembers.find(staff => staff.id === id);
    return staff ? `${staff.first_name || ''} ${staff.last_name || ''}`.trim() : "Unassigned";
  };

  const getStaffInitials = (id: string) => {
    const staff = staffMembers.find(staff => staff.id === id);
    if (!staff) return "NA";
    
    const firstName = staff.first_name || '';
    const lastName = staff.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStaffImageUrl = (id: string) => {
    const staff = staffMembers.find(staff => staff.id === id);
    return staff?.image_url;
  };

  const getCategoryName = (id?: string | null) => {
    if (!id) return "";
    const category = taskCategories.find(category => category.id === id);
    return category ? category.name : "";
  };

  const getCategoryColor = (id?: string | null) => {
    if (!id) return "bg-gray-500";
    const category = taskCategories.find(category => category.id === id);
    return category ? category.color : "bg-gray-500";
  };

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
      
      // Add the new task to the list
      setTasks(prev => [...prev, data as StaffTask]);
      
      toast({
        title: "Success",
        description: "Task created successfully"
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
      
      // Update the task in the list
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
      
      // Remove the task from the list
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

  const groupTasksByCategory = () => {
    const grouped = taskCategories.map(category => ({
      ...category,
      tasks: filteredTasks.filter(task => task.category === category.id)
    }));
    
    return grouped;
  };

  const groupTasksByAssignee = () => {
    if (staffLoading) return [];
    
    return staffMembers.map(staff => ({
      ...staff,
      tasks: filteredTasks.filter(task => task.staff_id === staff.id)
    })).filter(staff => staff.tasks.length > 0);
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

    const headers = ['Title', 'Description', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Due Time', 'Category'];
    const csvRows = [
      headers.join(','),
      ...filteredTasks.map(task => [
        `"${task.title}"`,
        `"${task.description || ''}"`,
        `"${getStaffName(task.staff_id)}"`,
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
    link.setAttribute('download', `Tasks_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Tasks exported successfully",
    });
  };

  const getStaffNamesMap = () => {
    const namesMap: Record<string, string> = {};
    staffMembers.forEach(staff => {
      namesMap[staff.id] = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    });
    return namesMap;
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Task Management" />}
        description={<T text="Assign and manage tasks for your restaurant staff" />}
        icon={<ListChecks size={28} />}
        actions={
          <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
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
                  <T text="Assign a new task to a staff member" />
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title"><T text="Task Title" /></Label>
                  <Input 
                    id="title" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder={t("Enter task title")}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description"><T text="Description" /></Label>
                  <Textarea 
                    id="description" 
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder={t("Describe the task details")}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignee"><T text="Assign To" /></Label>
                    <Select 
                      value={newTask.staff_id}
                      onValueChange={(value) => setNewTask({...newTask, staff_id: value})}
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder={t("Select staff member")} />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {`${staff.first_name || ''} ${staff.last_name || ''}`.trim()} ({staff.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category"><T text="Category" /></Label>
                    <Select 
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({...newTask, category: value})}
                    >
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate"><T text="Due Date" /></Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueTime"><T text="Due Time" /> (optional)</Label>
                    <Input 
                      id="dueTime" 
                      type="time" 
                      value={newTask.due_time}
                      onChange={(e) => setNewTask({...newTask, due_time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="priority"><T text="Priority" /></Label>
                  <Select 
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({...newTask, priority: value})}
                  >
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
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button onClick={handleCreateTask}>
                  <T text="Create Task" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("Filter by status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="completed"><T text="Completed" /></SelectItem>
              <SelectItem value="in progress"><T text="In Progress" /></SelectItem>
              <SelectItem value="pending"><T text="Pending" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all" onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Categories" /></SelectItem>
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
          
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? <X className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {showCompleted ? <T text="Hide Completed" /> : <T text="Show Completed" />}
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto" onClick={exportToCSV} disabled={filteredTasks.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
        </div>
      </div>
      
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
                staffNames={getStaffNamesMap()}
                maxHeight="600px"
              />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="category">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupTasksByCategory().map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className={`${category.color} bg-opacity-10 pb-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <Badge variant="outline">
                      {category.tasks.length} <T text="tasks" />
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 max-h-[400px] overflow-auto">
                  {category.tasks.length > 0 ? (
                    <div className="space-y-3">
                      {category.tasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                {getStaffImageUrl(task.staff_id) ? (
                                  <AvatarImage src={getStaffImageUrl(task.staff_id)} alt={getStaffName(task.staff_id)} />
                                ) : (
                                  <AvatarFallback>{getStaffInitials(task.staff_id)}</AvatarFallback>
                                )}
                              </Avatar>
                              <span>{getStaffName(task.staff_id)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {task.due_date 
                                  ? format(new Date(task.due_date), 'MMM dd, yyyy') 
                                  : '-'}
                                {task.due_time && ` ${task.due_time}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2 gap-2">
                            {task.status !== 'Completed' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <T text="Complete" />
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <T text="No tasks in this category" />
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3" 
                    onClick={() => {
                      setNewTask({...newTask, category: category.id});
                      setNewTaskDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <T text="Add Task" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assignee">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading || staffLoading ? (
              <div className="flex items-center justify-center py-8 col-span-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              groupTasksByAssignee().map((staff) => (
                <Card key={staff.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {staff.image_url ? (
                            <AvatarImage src={staff.image_url} alt={`${staff.first_name || ''} ${staff.last_name || ''}`.trim()} />
                          ) : (
                            <AvatarFallback>{`${(staff.first_name || '').charAt(0)}${(staff.last_name || '').charAt(0)}`.toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{`${staff.first_name || ''} ${staff.last_name || ''}`.trim()}</CardTitle>
                          <div className="text-sm text-muted-foreground">{staff.role}</div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {staff.tasks.length} <T text="tasks" />
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 max-h-[400px] overflow-auto">
                    <div className="space-y-3">
                      {staff.tasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{task.title}</div>
                            <Badge 
                              variant={
                                task.priority === "High" ? "destructive" : 
                                task.priority === "Medium" ? "default" : 
                                "outline"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getCategoryColor(task.category)}`}></div>
                              <span>{getCategoryName(task.category)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {task.due_date 
                                  ? format(new Date(task.due_date), 'MMM dd, yyyy') 
                                  : '-'}
                                {task.due_time && ` ${task.due_time}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(task.status)}
                              <span>{task.status}</span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2 gap-2">
                            {task.status !== 'Completed' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <T text="Complete" />
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-3" 
                      onClick={() => {
                        setNewTask({...newTask, staff_id: staff.id});
                        setNewTaskDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <T text="Add Task" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle><T text="Task Calendar" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2"><T text="Calendar View Coming Soon" /></h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  <T text="The calendar view for task management is currently under development. Please check back soon." />
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TaskManagement;
