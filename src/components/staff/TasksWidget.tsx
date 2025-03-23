
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Calendar, CheckCircle, AlertCircle, Plus, Clock } from "lucide-react";
import { format, isToday, isPast } from "date-fns";
import { useStaffTasks, StaffTask } from "@/hooks/useStaffTasks";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { T } from "@/contexts/LanguageContext";

interface TasksWidgetProps {
  staffId: string;
  staffName: string;
  limit?: number;
}

const TasksWidget: React.FC<TasksWidgetProps> = ({ staffId, staffName, limit = 5 }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: format(new Date(), "yyyy-MM-dd")
  });
  
  const { tasks, isLoading, error, addTask, updateTask, fetchTasks } = useStaffTasks(staffId);
  const { toast } = useToast();
  
  const pendingTasks = tasks
    .filter(task => task.status !== "Completed")
    .sort((a, b) => {
      // Sort by date (null dates at the end)
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      
      // First sort by date
      const dateComparison = dateA.getTime() - dateB.getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are the same, sort by priority
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
             priorityOrder[b.priority as keyof typeof priorityOrder];
    })
    .slice(0, limit);
  
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addTask({
        staff_id: staffId,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "Pending",
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
        due_time: null,
        category: null
      });
      
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        due_date: format(new Date(), "yyyy-MM-dd")
      });
      
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };
  
  const handleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      await updateTask(taskId, {
        status: isCompleted ? "Completed" : "Pending",
        completed_at: isCompleted ? new Date().toISOString() : null
      });
      
      // Refresh tasks after updating
      fetchTasks();
      
      toast({
        title: isCompleted ? "Task Completed" : "Task Reopened",
        description: isCompleted ? "Great job!" : "Task has been reopened"
      });
    } catch (err) {
      console.error("Failed to update task:", err);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-300";
      case "Medium":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Low":
        return "text-green-500 bg-green-100 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300";
    }
  };
  
  const getDateStatus = (dueDate: string | null) => {
    if (!dueDate) return "none";
    
    const date = new Date(dueDate);
    if (isToday(date)) return "today";
    if (isPast(date)) return "overdue";
    return "upcoming";
  };
  
  return (
    <>
      <Card className="shadow-md h-full">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20 flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-md font-medium">
            <Calendar className="mr-2 h-5 w-5 inline" />
            <T text="Your Tasks" />
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <span className="sr-only">Add task</span>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p><T text="Failed to load tasks" /></p>
            </div>
          ) : pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p><T text="No pending tasks. Great job!" /></p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
                  <Checkbox 
                    id={`task-${task.id}`} 
                    className="mt-1"
                    onCheckedChange={(checked) => handleTaskCompletion(task.id, checked as boolean)}
                  />
                  <div className="grid gap-1 w-full">
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className="font-medium cursor-pointer"
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      
                      {task.due_date && (
                        <Badge 
                          variant="outline" 
                          className={
                            getDateStatus(task.due_date) === "overdue"
                              ? "text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-300"
                              : getDateStatus(task.due_date) === "today"
                              ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300"
                              : "text-green-500 bg-green-100 dark:bg-green-900/20 dark:text-green-300"
                          }
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(task.due_date), "MMM d, yyyy")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        {pendingTasks.length > 0 && (
          <CardFooter className="pt-0">
            <Button 
              variant="link" 
              className="pl-0 hover:no-underline"
              // We'll implement the view all tasks page in a future step
              onClick={() => toast({
                title: "Feature coming soon",
                description: "The full task management page will be implemented soon"
              })}
            >
              <T text="View all tasks" />
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle><T text="Add New Task" /></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title"><T text="Task Title" /> *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description"><T text="Description" /></Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add more details about the task"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority"><T text="Priority" /></Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High"><T text="High" /></SelectItem>
                    <SelectItem value="Medium"><T text="Medium" /></SelectItem>
                    <SelectItem value="Low"><T text="Low" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="due_date"><T text="Due Date" /></Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddTask}>
              <T text="Add Task" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksWidget;
