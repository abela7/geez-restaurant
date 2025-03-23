
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { taskCategories } from "@/constants/taskCategories";
import { StaffMember } from "@/hooks/useStaffMembers";
import { SideModal } from "@/components/ui/side-modal";
import { Loader2 } from "lucide-react";

export type NewTaskFormData = {
  title: string;
  description: string;
  staff_id: string;
  due_date: string;
  due_time: string;
  priority: string;
  category: string;
};

type TaskCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: NewTaskFormData;
  setNewTask: React.Dispatch<React.SetStateAction<NewTaskFormData>>;
  handleCreateTask: () => Promise<void>;
  staffMembers: StaffMember[];
};

const TaskCreateDialog: React.FC<TaskCreateDialogProps> = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  handleCreateTask,
  staffMembers
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleCreateTask();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SideModal 
      open={open} 
      onOpenChange={onOpenChange}
      title={<T text="Create New Task" />}
      description={<T text="Assign a new task to a staff member" />}
      width="md"
    >
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
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dueTime"><T text="Due Time" /></Label>
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
      
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            <T text="Cancel" />
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <T text="Creating..." />
              </>
            ) : (
              <T text="Create Task" />
            )}
          </Button>
        </div>
      </div>
    </SideModal>
  );
};

export default TaskCreateDialog;
