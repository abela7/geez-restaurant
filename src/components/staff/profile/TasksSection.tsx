
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, DownloadIcon, Printer, Clock, Tag } from "lucide-react";
import TasksList from "@/components/staff/TasksList";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import { StaffTask } from "@/hooks/useStaffTasks";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";

// Task categories for selection
const taskCategories = [
  { id: "1", name: "Kitchen", color: "bg-amber-500" },
  { id: "2", name: "Service", color: "bg-blue-500" },
  { id: "3", name: "Cleaning", color: "bg-green-500" },
  { id: "4", name: "Inventory", color: "bg-purple-500" },
  { id: "5", name: "Administration", color: "bg-slate-500" },
];

type TasksSectionProps = {
  staffId: string;
  fullName: string;
  tasks: StaffTask[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<StaffTask, 'id' | 'completed_at'>) => Promise<any>;
  updateTask: (id: string, updates: Partial<StaffTask>) => Promise<any>;
  deleteTask: (id: string) => Promise<boolean>;
  onExportData: (data: any[], filename: string) => void;
};

const TasksSection: React.FC<TasksSectionProps> = ({
  staffId,
  fullName,
  tasks,
  isLoading,
  error,
  addTask,
  updateTask,
  deleteTask,
  onExportData
}) => {
  const { t } = useLanguage();
  const [newTaskDialog, setNewTaskDialog] = useState(false);

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
      // Combine date and time if both are provided
      let dueDateTime = null;
      if (dueDate) {
        const dateObj = new Date(dueDate);
        
        // If time is also provided, set it
        if (dueTime) {
          const [hours, minutes] = dueTime.split(':');
          dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        } else {
          // Default to end of day if no time specified
          dateObj.setHours(23, 59, 59);
        }
        
        dueDateTime = dateObj.toISOString();
      }
      
      const newTask = {
        staff_id: staffId,
        title,
        description,
        priority,
        status: 'Pending',
        due_date: dueDate || null,
        due_time: dueTime || null,
        category: category || null,
      };
      
      await addTask(newTask);
      setNewTaskDialog(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { 
        status,
        completed_at: status === 'Completed' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle><T text="Tasks" /></CardTitle>
          <CardDescription><T text="Assigned tasks and deadlines" /></CardDescription>
        </div>
        <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              <T text="Add Task" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle><T text="Assign New Task" /></DialogTitle>
              <DialogDescription>
                <T text="Assign a new task to" /> {fullName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTaskSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    <T text="Title" />
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder={t("Task title")}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    <T text="Description" />
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder={t("Task description")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    <T text="Category" />
                  </Label>
                  <Select name="category" defaultValue="1">
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    <T text="Priority" />
                  </Label>
                  <Select name="priority" defaultValue="Medium">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    <T text="Due Date" />
                  </Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueTime" className="text-right">
                    <T text="Due Time" /> (optional)
                  </Label>
                  <Input
                    id="dueTime"
                    name="dueTime"
                    type="time"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewTaskDialog(false)}>
                  <T text="Cancel" />
                </Button>
                <Button type="submit"><T text="Assign Task" /></Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error ? (
          <ErrorDisplay error={error} />
        ) : (
          <TasksList 
            tasks={tasks}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
            maxHeight="350px"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onExportData(tasks, `${fullName}_Tasks`)}
          disabled={tasks.length === 0}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          <T text="Export Data" />
        </Button>
        <Button variant="outline" disabled={tasks.length === 0}>
          <Printer className="mr-2 h-4 w-4" />
          <T text="Print Report" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TasksSection;
