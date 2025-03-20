
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClipboardCheck, Plus, Calendar, Filter, Search, Clock, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToAvatar?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Clean kitchen equipment',
    description: 'Deep clean all kitchen equipment at the end of the day',
    assignedTo: 'Abebe Kebede',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-09-15',
    createdAt: '2023-09-10',
  },
  {
    id: '2',
    title: 'Restock bar supplies',
    description: 'Check and restock all bar supplies before weekend rush',
    assignedTo: 'Tigist Haile',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-09-14',
    createdAt: '2023-09-11',
  },
  {
    id: '3',
    title: 'Train new waitstaff',
    description: 'Conduct orientation for new waitstaff on menu items and service protocol',
    assignedTo: 'Dawit Tesfaye',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-09-12',
    createdAt: '2023-09-08',
  },
  {
    id: '4',
    title: 'Repair refrigerator',
    description: 'Call technician to check the kitchen refrigerator issues',
    assignedTo: 'Meron Alemu',
    status: 'cancelled',
    priority: 'urgent',
    dueDate: '2023-09-11',
    createdAt: '2023-09-10',
  },
  {
    id: '5',
    title: 'Update wine menu',
    description: 'Add new wine selections and update prices on the menu',
    assignedTo: 'Solomon Bekele',
    status: 'pending',
    priority: 'low',
    dueDate: '2023-09-20',
    createdAt: '2023-09-12',
  },
];

const staff = [
  { id: '1', name: 'Abebe Kebede', role: 'Chef' },
  { id: '2', name: 'Tigist Haile', role: 'Bartender' },
  { id: '3', name: 'Dawit Tesfaye', role: 'Manager' },
  { id: '4', name: 'Meron Alemu', role: 'Maintenance' },
  { id: '5', name: 'Solomon Bekele', role: 'Sommelier' },
];

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'in-progress':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'completed':
      return 'bg-green-500 hover:bg-green-600';
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getStatusIcon = (status: TaskStatus): React.ReactNode => {
  switch (status) {
    case 'pending':
      return <HelpCircle className="h-4 w-4" />;
    case 'in-progress':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'text-gray-600 bg-gray-100';
    case 'medium':
      return 'text-blue-600 bg-blue-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'urgent':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const TaskManagement: React.FC = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString().slice(0, 10)
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const createdTask: Task = {
      id: (tasks.length + 1).toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      assignedTo: newTask.assignedTo || '',
      status: newTask.status as TaskStatus || 'pending',
      priority: newTask.priority as TaskPriority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setTasks([createdTask, ...tasks]);
    setIsNewTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date().toISOString().slice(0, 10)
    });

    toast({
      title: "Task Created",
      description: `Task "${createdTask.title}" has been created successfully`
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Task Management" 
          subtitle="Create, assign, and track tasks for your staff"
          icon={<ClipboardCheck size={24} />}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8 w-full sm:w-[280px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select 
                    value={newTask.assignedTo} 
                    onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((person) => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name} ({person.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value: string) => setNewTask({...newTask, priority: value as TaskPriority})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <div className={`h-1 ${getStatusColor(task.status)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge className="bg-transparent border border-slate-200 text-slate-800">
                          {getStatusIcon(task.status)}
                          <span className="ml-1">
                            {task.status.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{task.description}</p>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.assignedToAvatar} alt={task.assignedTo} />
                          <AvatarFallback>{task.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{task.assignedTo}</p>
                          <p className="text-xs text-muted-foreground">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-end sm:self-auto">
                        {task.status !== 'completed' && task.status !== 'cancelled' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStatusChange(task.id, 'completed')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                        
                        <Select 
                          value={task.status} 
                          onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                        >
                          <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {filteredTasks.filter(task => task.status === 'pending').length > 0 ? (
              filteredTasks
                .filter(task => task.status === 'pending')
                .map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div className={`h-1 ${getStatusColor(task.status)}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{task.description}</p>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignedToAvatar} alt={task.assignedTo} />
                            <AvatarFallback>{task.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{task.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <Select 
                          value={task.status} 
                          onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                        >
                          <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No pending tasks</h3>
                <p className="text-muted-foreground mt-1">
                  All tasks are currently in progress or completed.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4">
            {filteredTasks.filter(task => task.status === 'in-progress').length > 0 ? (
              filteredTasks
                .filter(task => task.status === 'in-progress')
                .map((task) => (
                  // Similar card component as above
                  <Card key={task.id} className="overflow-hidden">
                    <div className={`h-1 ${getStatusColor(task.status)}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{task.description}</p>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignedToAvatar} alt={task.assignedTo} />
                            <AvatarFallback>{task.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{task.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                          
                          <Select 
                            value={task.status} 
                            onValueChange={(value) => handleStatusChange(task.id, value as TaskStatus)}
                          >
                            <SelectTrigger className="h-9 w-[140px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No tasks in progress</h3>
                <p className="text-muted-foreground mt-1">
                  Start working on some pending tasks to see them here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {filteredTasks.filter(task => task.status === 'completed').length > 0 ? (
              filteredTasks
                .filter(task => task.status === 'completed')
                .map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div className={`h-1 ${getStatusColor(task.status)}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{task.description}</p>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignedToAvatar} alt={task.assignedTo} />
                            <AvatarFallback>{task.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{task.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No completed tasks</h3>
                <p className="text-muted-foreground mt-1">
                  Tasks marked as complete will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TaskManagement;
