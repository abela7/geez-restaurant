import React, { useState } from "react";
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
import { Search, Plus, CheckCircle2, Clock, AlertCircle, ListChecks, Calendar, Filter } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

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
];

// Sample tasks data
const tasks = [
  {
    id: 1,
    title: "Update weekly menu items",
    description: "Review and update the weekly special menu items based on inventory",
    assignedTo: 1,
    dueDate: "2023-07-15",
    priority: "High",
    status: "Completed",
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
    createdAt: "2023-07-14"
  }
];

const Tasks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium"
  });
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && task.status.toLowerCase() === statusFilter.toLowerCase();
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

  const handleCreateTask = () => {
    // Add logic to create a task here
    setNewTaskDialogOpen(false);
    // Reset form
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium"
    });
  };

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Tasks" />}
        description={<T text="Assign, track, and manage tasks for your restaurant staff" />}
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
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
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

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Task" /></TableHead>
                  <TableHead><T text="Assigned To" /></TableHead>
                  <TableHead><T text="Due Date" /></TableHead>
                  <TableHead><T text="Priority" /></TableHead>
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
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
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
                      <Button variant="ghost" size="sm">
                        <T text="Edit" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle><T text="Tasks Due Today" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                <T text="No tasks due today" />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle><T text="Upcoming Tasks" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                <T text="No upcoming tasks" />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Tasks;
