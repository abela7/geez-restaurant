
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
import { StaffTask } from "@/hooks/useStaffTasks";
import { ScrollArea } from "@/components/ui/scroll-area";

type TaskEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: StaffTask;
  setTask: React.Dispatch<React.SetStateAction<StaffTask | null>>;
  handleEditTask: () => Promise<void>;
  staffMembers: StaffMember[];
};

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  onOpenChange,
  task,
  setTask,
  handleEditTask,
  staffMembers
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleEditTask();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SideModal 
      open={open} 
      onOpenChange={onOpenChange}
      title={<T text="Edit Task" />}
      description={<T text="Update task details" />}
      width="md"
    >
      <ScrollArea className="h-[calc(100vh-180px)] pr-4">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title"><T text="Task Title" /></Label>
            <Input 
              id="title" 
              value={task.title}
              onChange={(e) => setTask({...task, title: e.target.value})}
              placeholder={t("Enter task title")}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description"><T text="Description" /></Label>
            <Textarea 
              id="description" 
              value={task.description || ""}
              onChange={(e) => setTask({...task, description: e.target.value})}
              placeholder={t("Describe the task details")}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee"><T text="Assign To" /></Label>
              <Select 
                value={task.staff_id}
                onValueChange={(value) => setTask({...task, staff_id: value})}
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
                value={task.category || "1"}
                onValueChange={(value) => setTask({...task, category: value})}
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
                value={task.due_date || ""}
                onChange={(e) => setTask({...task, due_date: e.target.value})}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueTime"><T text="Due Time" /></Label>
              <Input 
                id="dueTime" 
                type="time" 
                value={task.due_time || ""}
                onChange={(e) => setTask({...task, due_time: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="priority"><T text="Priority" /></Label>
            <Select 
              value={task.priority}
              onValueChange={(value) => setTask({...task, priority: value})}
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

          <div className="grid gap-2">
            <Label htmlFor="status"><T text="Status" /></Label>
            <Select 
              value={task.status}
              onValueChange={(value) => setTask({...task, status: value})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("Select status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending"><T text="Pending" /></SelectItem>
                <SelectItem value="In Progress"><T text="In Progress" /></SelectItem>
                <SelectItem value="Completed"><T text="Completed" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
          <T text="Cancel" />
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <T text="Updating..." />
            </>
          ) : (
            <T text="Update Task" />
          )}
        </Button>
      </div>
    </SideModal>
  );
};

export default TaskEditDialog;
