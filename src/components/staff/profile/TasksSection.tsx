
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertTriangle, Plus, Loader2 } from "lucide-react";
import { T } from "@/contexts/LanguageContext";
import { useStaffTasks } from "@/hooks/useStaffTasks";
import { format, isPast, isToday } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TasksSectionProps {
  staffId: string;
}

const TasksSection: React.FC<TasksSectionProps> = ({ staffId }) => {
  const { tasks, isLoading, error, addTask, updateTask } = useStaffTasks(staffId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    category: 'General'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddTask = async () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await addTask({
        staff_id: staffId,
        title: newTask.title,
        description: newTask.description || null,
        priority: newTask.priority,
        status: 'Pending',
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
        due_time: null,
        category: newTask.category
      });
      
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        due_date: '',
        category: 'General'
      });
      setIsAddingTask(false);
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, {
        status: 'Completed',
        completed_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'Medium':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'Low':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string, dueDate: string | null) => {
    if (status === 'Completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (!dueDate) return <Clock className="h-4 w-4 text-gray-500" />;
    
    const dueDateObj = new Date(dueDate);
    if (isPast(dueDateObj) && !isToday(dueDateObj)) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    
    if (isToday(dueDateObj)) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            <T text="Tasks" />
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            <T text="Add Task" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground"><T text="Loading tasks..." /></p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p><T text="No tasks assigned yet" /></p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-md border ${task.status === 'Completed' ? 'bg-muted/40' : 'bg-card'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {getStatusIcon(task.status, task.due_date)}
                        <h4 className={`ml-2 font-medium ${task.status === 'Completed' ? 'text-muted-foreground line-through' : ''}`}>
                          {task.title}
                        </h4>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.due_date && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-muted">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(task.due_date)}
                          </span>
                        )}
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.category && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-muted">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.status !== 'Completed' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate(`/admin/staff/tasks?staffId=${staffId}`)}
          >
            <T text="View All Tasks" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add New Task" /></DialogTitle>
            <DialogDescription>
              <T text="Create a new task for this staff member" />
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title"><T text="Title" /></Label>
              <Input 
                id="title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description"><T text="Description" /></Label>
              <Textarea 
                id="description" 
                value={newTask.description} 
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task description (optional)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority"><T text="Priority" /></Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category"><T text="Category" /></Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value) => setNewTask({...newTask, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date"><T text="Due Date" /></Label>
              <Input 
                id="due_date" 
                type="date" 
                value={newTask.due_date} 
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddingTask(false)}
              disabled={submitting}
            >
              <T text="Cancel" />
            </Button>
            <Button 
              onClick={handleAddTask}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T text="Saving..." />
                </>
              ) : (
                <T text="Add Task" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksSection;
