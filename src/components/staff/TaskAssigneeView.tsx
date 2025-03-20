
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, PlusCircle, X } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { StaffTask } from "@/hooks/useStaffTasks";
import { StaffMember } from "@/hooks/useStaffMembers";
import { getCategoryName, getCategoryColor } from "@/constants/taskCategories";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

type StaffWithTasks = StaffMember & {
  tasks: StaffTask[];
};

type TaskAssigneeViewProps = {
  filteredTasks: StaffTask[];
  staffMembers: StaffMember[];
  isLoading: boolean;
  staffLoading: boolean;
  handleUpdateTaskStatus: (taskId: string, status: string) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  openNewTaskDialog: (staffId?: string) => void;
};

const TaskAssigneeView: React.FC<TaskAssigneeViewProps> = ({
  filteredTasks,
  staffMembers,
  isLoading,
  staffLoading,
  handleUpdateTaskStatus,
  handleDeleteTask,
  openNewTaskDialog
}) => {
  const { t } = useLanguage();

  const groupTasksByAssignee = (): StaffWithTasks[] => {
    if (staffLoading) return [];
    
    return staffMembers.map(staff => ({
      ...staff,
      tasks: filteredTasks.filter(task => task.staff_id === staff.id)
    })).filter(staff => staff.tasks.length > 0);
  };

  if (isLoading || staffLoading) {
    return (
      <div className="flex items-center justify-center py-8 col-span-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groupTasksByAssignee().map((staff) => (
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
              onClick={() => openNewTaskDialog(staff.id)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <T text="Add Task" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskAssigneeView;
