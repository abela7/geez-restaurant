
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, CheckCircle2, Clock, AlertCircle, ListChecks, Calendar, Calendar as CalendarIcon, Filter, MoreHorizontal, PlusCircle, X, CheckCircle, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample staff data
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    image: "/placeholder.svg"
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    image: "/placeholder.svg"
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    image: "/placeholder.svg"
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    image: "/placeholder.svg"
  },
  { 
    id: 5, 
    name: "Yonas Gebre", 
    role: "Waiter", 
    image: "/placeholder.svg"
  },
  { 
    id: 6, 
    name: "Hanna Tesfaye", 
    role: "Inventory Manager", 
    image: "/placeholder.svg"
  },
];

// Sample task categories
const taskCategories = [
  { id: 1, name: "Kitchen", color: "bg-amber-500" },
  { id: 2, name: "Service", color: "bg-blue-500" },
  { id: 3, name: "Cleaning", color: "bg-green-500" },
  { id: 4, name: "Inventory", color: "bg-purple-500" },
  { id: 5, name: "Administration", color: "bg-slate-500" },
];

// Sample tasks data
const initialTasks = [
  {
    id: 1,
    title: "Update weekly menu items",
    description: "Review and update the weekly special menu items based on inventory",
    assignedTo: 1,
    dueDate: "2023-07-15",
    priority: "High",
    status: "Completed",
    category: 1,
    createdAt: "2023-07-10"
  },
  {
    id: 2,
    title: "Train new kitchen assistant",
    description: "Orient the new kitchen assistant on food preparation procedures",
    assignedTo: 1,
    dueDate: "2023-07-18",
    priority: "Medium",
    status: "In Progress",
    category: 1,
    createdAt: "2023-07-12"
  },
  {
    id: 3,
    title: "Deep clean refrigeration units",
    description: "Perform deep cleaning of all kitchen refrigeration units",
    assignedTo: 2,
    dueDate: "2023-07-20",
    priority: "Medium",
    status: "Pending",
    category: 3,
    createdAt: "2023-07-13"
  },
  {
    id: 4,
    title: "Customer service training",
    description: "Conduct refresher training on customer service best practices",
    assignedTo: 3,
    dueDate: "2023-07-16",
    priority: "High",
    status: "In Progress",
    category: 2,
    createdAt: "2023-07-11"
  },
  {
    id: 5,
    title: "Update staff schedule for next month",
    description: "Create and publish the staff schedule for the upcoming month",
    assignedTo: 4,
    dueDate: "2023-07-25",
    priority: "High",
    status: "Pending",
    category: 5,
    createdAt: "2023-07-14"
  },
  {
    id: 6,
    title: "Inventory count of spices",
    description: "Perform a complete inventory of all spices and update the inventory system",
    assignedTo: 6,
    dueDate: "2023-07-17",
    priority: "Medium",
    status: "Pending",
    category: 4,
    createdAt: "2023-07-13"
  },
  {
    id: 7,
    title: "Clean and organize wine storage",
    description: "Clean the wine storage area and ensure proper organization",
    assignedTo: 5,
    dueDate: "2023-07-19",
    priority: "Low",
    status: "Pending",
    category: 3,
    createdAt: "2023-07-15"
  }
];

const TaskManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tasks, setTasks] = useState(initialTasks);
  const [showCompleted, setShowCompleted] = useState(true);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [showEditTask, setShowEditTask] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("list");
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    category: ""
  });
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      task.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesCategory = 
      categoryFilter === "all" || 
      task.category.toString() === categoryFilter;
    
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

  const getStaffName = (id: number) => {
    const staff = staffMembers.find(staff => staff.id === id);
    return staff ? staff.name : "Unassigned";
  };

  const getCategoryName = (id: number) => {
    const category = taskCategories.find(category => category.id === id);
    return category ? category.name : "";
  };

  const getCategoryColor = (id: number) => {
    const category = taskCategories.find(category => category.id === id);
    return category ? category.color : "bg-gray-500";
  };

  const handleCreateTask = () => {
    const newId = Math.max(...tasks.map(task => task.id)) + 1;
    
    const createdTask = {
      id: newId,
      title: newTask.title,
      description: newTask.description,
      assignedTo: parseInt(newTask.assignedTo),
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: "Pending",
      category: parseInt(newTask.category),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, createdTask]);
    setNewTaskDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      category: ""
    });
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "Completed" } 
        : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const groupTasksByCategory = () => {
    const grouped = taskCategories.map(category => ({
      ...category,
      tasks: filteredTasks.filter(task => task.category === category.id)
    }));
    
    return grouped;
  };

  const groupTasksByAssignee = () => {
    const grouped = staffMembers.map(staff => ({
      ...staff,
      tasks: filteredTasks.filter(task => task.assignedTo === staff.id)
    }));
    
    return grouped;
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
                      value={newTask.assignedTo}
                      onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder={t("Select staff member")} />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={String(staff.id)}>
                            {staff.name} ({staff.role})
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
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
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
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
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
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? <X className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {showCompleted ? <T text="Hide Completed" /> : <T text="Show Completed" />}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Task" /></TableHead>
                  <TableHead><T text="Assigned To" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead><T text="Due Date" /></TableHead>
                  <TableHead><T text="Priority" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="min-w-[200px]">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <img
                            src={staffMembers.find(s => s.id === task.assignedTo)?.image}
                            alt={getStaffName(task.assignedTo)}
                            className="aspect-square h-full w-full object-cover"
                          />
                        </Avatar>
                        <span>{getStaffName(task.assignedTo)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(task.category)}`}></div>
                        <span>{getCategoryName(task.category)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{task.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          task.priority === "High" ? "destructive" : 
                          task.priority === "Medium" ? "default" : 
                          "outline"
                        }
                      >
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
                      <div className="flex justify-end">
                        {task.status !== "Completed" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <T text="Complete" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowEditTask(task.id)}>
                              <T text="Edit" />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                              <T text="Delete" />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <CardContent className="pt-4">
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
                                <img
                                  src={staffMembers.find(s => s.id === task.assignedTo)?.image}
                                  alt={getStaffName(task.assignedTo)}
                                  className="aspect-square h-full w-full object-cover"
                                />
                              </Avatar>
                              <span>{getStaffName(task.assignedTo)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{task.dueDate}</span>
                            </div>
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
                      setNewTask({...newTask, category: String(category.id)});
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
            {groupTasksByAssignee().filter(staff => staff.tasks.length > 0).map((staff) => (
              <Card key={staff.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img
                          src={staff.image}
                          alt={staff.name}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">{staff.role}</div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {staff.tasks.length} <T text="tasks" />
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
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
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{task.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            <span>{task.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3" 
                    onClick={() => {
                      setNewTask({...newTask, assignedTo: String(staff.id)});
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
